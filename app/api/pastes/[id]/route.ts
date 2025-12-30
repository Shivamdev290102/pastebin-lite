import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // ✅ Required for Next.js 15/16
  const { id } = await ctx.params;

  const key = `paste:${id}`;

  const paste = await kv.hgetall<Record<string, string>>(key);

  if (!paste || !paste.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = Date.now();

  // Convert values
  const created_at = Number(paste.created_at);
  const expires_at =
    paste.expires_at && paste.expires_at !== ""
      ? Number(paste.expires_at)
      : null;

  const views = Number(paste.views || "0");
  const max_views =
    paste.max_views && paste.max_views !== ""
      ? Number(paste.max_views)
      : null;

  // 🕒 TTL check
  if (expires_at !== null && now >= expires_at) {
    await kv.del(key);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  // 👁 Max views check
  if (max_views !== null && views >= max_views) {
    await kv.del(key);
    return NextResponse.json({ error: "Max views reached" }, { status: 404 });
  }

  // 🔢 Increment views AFTER checks
  const newViews = await kv.hincrby(key, "views", 1);

  return NextResponse.json({
    content: paste.content,
    created_at,
    expires_at,
    views: newViews,
    max_views,
  });
}

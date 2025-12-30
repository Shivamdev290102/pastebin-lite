import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;   // 👈 THIS FIXES IT

  const key = `paste:${id}`;

  const paste = await kv.hgetall<any>(key);

  if (!paste || !paste.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // TTL check
  if (paste.expires_at && Date.now() > Number(paste.expires_at)) {
    await kv.del(key);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  // Max views check
  if (paste.max_views) {
    const views = Number(paste.views || 0);
    const max = Number(paste.max_views);

    if (views >= max) {
      await kv.del(key);
      return NextResponse.json({ error: "Max views reached" }, { status: 404 });
    }

    await kv.hincrby(key, "views", 1);
  }

  return NextResponse.json({
    content: paste.content,
    created_at: paste.created_at,
    expires_at: paste.expires_at || null,
    views: Number(paste.views || 0),
    max_views: paste.max_views ? Number(paste.max_views) : null,
  });
}

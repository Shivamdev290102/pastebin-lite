import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) {
      const v = parseInt(h);
      if (!isNaN(v)) return v;
    }
  }
  return Date.now();
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const key = `paste:${id}`;
  const paste = await kv.hgetall<any>(key);

  if (!paste || !paste.content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const views = Number(paste.views);
  const max_views = paste.max_views === "" ? null : Number(paste.max_views);
  const expires_at = paste.expires_at === "" ? null : Number(paste.expires_at);

  const now = getNow(req);

  if (expires_at !== null && now >= expires_at) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (max_views !== null && views >= max_views) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newViews = await kv.hincrby(key, "views", 1);

  let remaining_views = null;
  if (max_views !== null) {
    remaining_views = max_views - newViews;
    if (remaining_views < 0) remaining_views = 0;
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views,
    expires_at: expires_at ? new Date(expires_at).toISOString() : null,
  });
}

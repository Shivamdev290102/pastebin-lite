import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // Validate content
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    // Validate ttl_seconds
    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
      }
    }

    // Validate max_views
    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
      }
    }

    const id = randomUUID().slice(0, 8);
    const created_at = Date.now();
    const expires_at =
      ttl_seconds !== undefined ? created_at + ttl_seconds * 1000 : null;

    // ⚠️ ALL values must be strings for Upstash
    await kv.hset(`paste:${id}`, {
      content,
      created_at: String(created_at),
      expires_at: expires_at === null ? "" : String(expires_at),
      max_views: max_views === undefined ? "" : String(max_views),
      views: "0",
    });

    console.log("SAVED", `paste:${id}`);

    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const url = `${protocol}://${host}/p/${id}`;

    return NextResponse.json({ id, url });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

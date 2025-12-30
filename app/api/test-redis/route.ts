import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await kv.set("ping", "pong");
    const v = await kv.get("ping");
    return NextResponse.json({ ok: true, v });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

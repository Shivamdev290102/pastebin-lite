import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await kv.set("healthz", "ok");
    const v = await kv.get("healthz");

    if (v !== "ok") throw new Error("KV failed");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getPaste(id: string) {
  const h = await headers();          // ← must await
  const host = h.get("host");         // ← now safe

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;   // ← must be Promise
}) {
  const { id } = await params;       // ← must await

  const data = await getPaste(id);

  if (!data) {
    return <h1 className="text-2xl p-10">Paste not found</h1>;
  }

  return (
    <pre className="p-6 whitespace-pre-wrap break-words">
      {data.content}
    </pre>
  );
}

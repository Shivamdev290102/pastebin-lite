async function getPaste(id: string) {
  const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
    cache: "no-store"
  });

  if (!res.ok) return null;

  return res.json();
}


export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;   // 👈 MUST await

  const data = await getPaste(id);

  if (!data) {
    return <h1 className="text-2xl p-10">Paste not found</h1>;
  }

  return (
    <div className="p-10">
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
        {data.content}
      </pre>
    </div>
  );
}


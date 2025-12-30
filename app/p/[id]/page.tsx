async function getPaste(id: string) {
  const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const data = await getPaste(id);

  if (!data) {
    return <h1 className="text-2xl p-10">Paste not found</h1>;
  }

  return (
    <pre className="p-6 whitespace-pre-wrap break-words bg-gray-100 min-h-screen">
      {data.content}
    </pre>
  );
}

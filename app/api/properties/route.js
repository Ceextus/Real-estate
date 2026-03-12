export async function GET() {
  return Response.json({ properties: [] });
}

export async function POST(request) {
  return Response.json({ message: "Created" }, { status: 201 });
}

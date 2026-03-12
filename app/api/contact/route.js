export async function POST(request) {
  return Response.json({ message: "Message sent" }, { status: 201 });
}

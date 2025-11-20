import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();

  const res = await fetch(process.env.GO_SERVER + "/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return NextResponse.json(data);
}

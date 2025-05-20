import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookie = request.cookies.get("tiktok_session")?.value;
  if (!cookie) {
    return NextResponse.json({ user: null });
  }
  try {
    const { user } = JSON.parse(Buffer.from(cookie, "base64").toString());
    console.log(cookie);
    console.log(user);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

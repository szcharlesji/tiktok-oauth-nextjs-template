import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log("code", code);
  console.log("state", state);

  // 2) Exchange code → access token
  const params = new URLSearchParams();
  params.append("client_key", process.env.TIKTOK_CLIENT_KEY!);
  params.append("client_secret", process.env.TIKTOK_CLIENT_SECRET!);
  params.append("code", code!);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", process.env.TIKTOK_REDIRECT_URI!);

  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const tokenJson = await tokenRes.json();
  if (tokenJson.error) {
    console.error("Error fetching TikTok access token:", tokenJson);
    return NextResponse.json(
      { error: tokenJson.error_description || "Failed to fetch access token" },
      { status: 500 },
    );
  }
  const { access_token, open_id, expires_in } = tokenJson;

  // 3) Fetch user info
  // Construct the URL with query parameters for the new API
  const userInfoUrl = new URL("https://open.tiktokapis.com/v2/user/info/");
  userInfoUrl.searchParams.append(
    "fields",
    "open_id,union_id,avatar_url,display_name",
  );

  const userRes = await fetch(userInfoUrl.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const userJson = await userRes.json();
  // According to the new documentation, user data is nested under data.user
  // and errors have a specific structure
  if (userJson.error && userJson.error.code !== "ok") {
    console.error("Error fetching TikTok user info:", userJson.error);
    return NextResponse.json(
      { error: userJson.error.message || "Failed to fetch user info" },
      { status: 500 },
    );
  }

  // 4) Create a simple session (base64-encoded JSON)
  const session = Buffer.from(
    JSON.stringify({ access_token, open_id, user: userJson.data.user }),
  ).toString("base64");

  // 5) Set cookies + clear state
  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
  );
  res.cookies.set("tiktok_session", session, {
    httpOnly: true,
    path: "/",
    maxAge: expires_in,
  });
  res.cookies.set("tiktok_oauth_state", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

import { auth, signIn, signOut } from "@/auth";
async function handleSignOut() {
  "use server";
  await signOut();
}

async function handleSignIn() {
  "use server";
  await signIn("tiktok");
}

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {session?.user ? (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">
            Welcome,
            {session.user.tiktok?.display_name || session.user.name || "User"}!
            🎉
          </h1>
          {session.user.tiktok?.avatar_url || session.user.image ? (
            <img
              src={session.user.tiktok?.avatar_url || session.user.image!}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
          ) : null}
          <form action={handleSignOut}>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Next.js + TikTok OAuth with Auth.js v5
          </h1>
          <form action={handleSignIn}>
            <button
              type="submit"
              className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Login with TikTok
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

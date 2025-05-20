"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TikTokUser = {
  display_name: string;
  avatar_url: string;
};

export default function Home() {
  const [user, setUser] = useState<TikTokUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {user ? (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">
            Welcome, {user.display_name}! 🎉
          </h1>
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Next.js + TikTok OAuth</h1>
          <Link
            href="/api/auth/tiktok"
            className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Login with TikTok
          </Link>
        </div>
      )}
    </main>
  );
}

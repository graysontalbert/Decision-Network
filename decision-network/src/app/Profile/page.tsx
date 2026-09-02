"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type MyDecision = {
  id: number;
  question: string;
  category: string;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("Student");
  const [email, setEmail] = useState("");
  const [decisions, setDecisions] = useState<MyDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      setName(user.user_metadata?.display_name || "Student");
      setEmail(user.email || "");

      const { data } = await supabase
        .from("decisions")
        .select("id, question, category, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setDecisions(data || []);
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/signup");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6 text-black">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-black">
      <div className="mx-auto max-w-xl px-5 py-8">
        <h1 className="text-2xl font-bold">Profile</h1>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="mt-8 border-y border-gray-200 py-5">
          <p className="text-2xl font-bold">{decisions.length}</p>
          <p className="text-sm text-gray-500">Decisions</p>
        </div>

        <h3 className="mt-8 text-lg font-bold">My Decisions</h3>

        <div className="mt-4 space-y-3">
          {decisions.length === 0 ? (
            <p className="text-gray-500">No decisions yet.</p>
          ) : (
            decisions.map((decision) => (
              <div
                key={decision.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="font-semibold">{decision.question}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {decision.category}
                </p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="mt-10 w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
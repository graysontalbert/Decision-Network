"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DecisionActivity = {
  id: number;
  question: string;
  votes_a: number;
  votes_b: number;
};

export default function ActivityPage() {
  const router = useRouter();

  const [decisions, setDecisions] = useState<DecisionActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("decisions")
        .select("id, question, votes_a, votes_b")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDecisions(data);
      }

      setLoading(false);
    }

    loadActivity();
  }, [router]);

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Activity</h1>

          <Link href="/" className="text-sm font-semibold">
            Home
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {loading && (
            <p className="text-sm text-gray-500">
              Loading activity...
            </p>
          )}

          {!loading && decisions.length === 0 && (
            <p className="text-sm text-gray-500">
              No activity yet.
            </p>
          )}

          {decisions.map((decision) => {
            const totalVotes =
              (decision.votes_a || 0) + (decision.votes_b || 0);

            return (
              <Link
  href={`/decision/${decision.id}`}
  key={decision.id}
  className="block rounded-2xl border border-gray-200 p-4"
>
                <p className="text-sm text-gray-500">
                  Your decision received
                </p>

                <p className="mt-1 text-lg font-bold">
                  {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                </p>

                <p className="mt-2 font-semibold">
                  {decision.question}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
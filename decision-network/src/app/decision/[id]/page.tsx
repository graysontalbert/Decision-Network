"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Decision = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  image_a_url: string | null;
  image_b_url: string | null;
  decision_type: "photo" | "text";
  votes_a: number;
  votes_b: number;
  author_name: string | null;
  category: string;
};

export default function DecisionPage() {
  const params = useParams();
  const id = Number(params.id);

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecision() {
      const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setDecision(data);
      }

      setLoading(false);
    }

    if (id) {
      loadDecision();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6 text-black">
        Loading decision...
      </main>
    );
  }

  if (!decision) {
    return (
      <main className="min-h-screen bg-white p-6 text-black">
        <p>Decision not found.</p>
        <Link href="/" className="mt-4 inline-block font-semibold">
          Back home
        </Link>
      </main>
    );
  }

  const totalVotes = decision.votes_a + decision.votes_b;

  const percentA =
    totalVotes === 0
      ? 0
      : Math.round((decision.votes_a / totalVotes) * 100);

  const percentB =
    totalVotes === 0
      ? 0
      : Math.round((decision.votes_b / totalVotes) * 100);

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold">
            ← Back
          </Link>

          <span className="text-sm text-gray-500">
            {decision.category}
          </span>
        </div>

        <div className="mt-8">
          <p className="font-semibold">
            {decision.author_name || "Student"}
          </p>

          <h1 className="mt-4 text-2xl font-bold">
            {decision.question}
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl border border-gray-300">
              {decision.image_a_url && (
                <img
                  src={decision.image_a_url}
                  alt={decision.option_a}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">
                <span className="text-xs font-bold text-gray-500">A</span>
                <p className="mt-1 font-semibold">
                  {decision.option_a}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-300">
              {decision.image_b_url && (
                <img
                  src={decision.image_b_url}
                  alt={decision.option_b}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">
                <span className="text-xs font-bold text-gray-500">B</span>
                <p className="mt-1 font-semibold">
                  {decision.option_b}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between font-semibold">
              <span>A</span>
              <span>{percentA}%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-black"
                style={{ width: `${percentA}%` }}
              />
            </div>

            <div className="mt-5 flex justify-between font-semibold">
              <span>B</span>
              <span>{percentB}%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-black"
                style={{ width: `${percentB}%` }}
              />
            </div>

            <p className="mt-5 text-sm text-gray-500">
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Decision = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  category: string;
  author_name: string | null;
};

export default function ExplorePage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecisions() {
      const { data, error } = await supabase
        .from("decisions")
        .select("id, question, option_a, option_b, category, author_name")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDecisions(data);
      }

      setLoading(false);
    }

    loadDecisions();
  }, []);

  const filteredDecisions = decisions.filter((decision) => {
    const text = `
      ${decision.question}
      ${decision.option_a}
      ${decision.option_b}
      ${decision.category}
      ${decision.author_name || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explore</h1>

          <Link href="/" className="text-sm font-semibold">
            Home
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search decisions, people, or categories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        <div className="mt-8 space-y-4">
          {loading && (
            <p className="text-sm text-gray-500">Loading decisions...</p>
          )}

          {!loading && filteredDecisions.length === 0 && (
            <p className="text-sm text-gray-500">
              No decisions found.
            </p>
          )}

          {filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className="rounded-2xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {decision.author_name || "Student"}
                </p>

                <span className="text-xs text-gray-500">
                  {decision.category}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold">
                {decision.question}
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-300 p-4">
                  <span className="text-xs font-bold text-gray-500">A</span>
                  <p className="mt-1 font-semibold">{decision.option_a}</p>
                </div>

                <div className="rounded-xl border border-gray-300 p-4">
                  <span className="text-xs font-bold text-gray-500">B</span>
                  <p className="mt-1 font-semibold">{decision.option_b}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
 
export default function CreateDecision() {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [audience, setAudience] = useState("DSU");
  const [category, setCategory] = useState("Fashion");

  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
const [fileA, setFileA] = useState<File | null>(null);
const [fileB, setFileB] = useState<File | null>(null);
const router = useRouter();
const [posting, setPosting] = useState(false);
const [postError, setPostError] = useState("");

async function handlePost() {
  if (!question || !optionA || !optionB) return;

  setPosting(true);
  setPostError("");

  try {
    let imageAUrl: string | null = null;
    let imageBUrl: string | null = null;

    if (fileA) {
      const extensionA = fileA.name.split(".").pop() || "jpg";
      const pathA = `decisions/${crypto.randomUUID()}.${extensionA}`;

      const { error: uploadErrorA } = await supabase.storage
        .from("decision-photos")
        .upload(pathA, fileA);

      if (uploadErrorA) throw uploadErrorA;

      const { data } = supabase.storage
        .from("decision-photos")
        .getPublicUrl(pathA);

      imageAUrl = data.publicUrl;
    }

    if (fileB) {
      const extensionB = fileB.name.split(".").pop() || "jpg";
      const pathB = `decisions/${crypto.randomUUID()}.${extensionB}`;

      const { error: uploadErrorB } = await supabase.storage
        .from("decision-photos")
        .upload(pathB, fileB);

      if (uploadErrorB) throw uploadErrorB;

      const { data } = supabase.storage
        .from("decision-photos")
        .getPublicUrl(pathB);

      imageBUrl = data.publicUrl;
    }

    const { error } = await supabase.from("decisions").insert({
      question,
      option_a: optionA,
      option_b: optionB,
      image_a_url: imageAUrl,
      image_b_url: imageBUrl,
      audience,
      category,
      college: "Delaware State University",
    });

    if (error) throw error;

    router.push("/");
    router.refresh();
  } catch (error) {
    console.error(error);

    setPostError(
      error instanceof Error
        ? error.message
        : "Something went wrong while posting."
    );

    setPosting(false);
  }
} 

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl">
            ←
          </Link>

          <h1 className="font-bold">New Decision</h1>

          <div className="w-6" />
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-6">
        {/* Question */}
        <label className="text-sm font-semibold">
          What are you deciding?
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Which shoes should I wear tonight?"
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-black"
        />

        {/* OPTION A */}
        <h2 className="mt-8 text-sm font-semibold">Option A</h2>

        <label className="mt-2 flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          {imageA ? (
            <img
              src={imageA}
              alt="Option A"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-3xl">+</div>
              <div className="mt-2 text-sm">Add photo</div>
            </div>
          )}

          <input
  type="file"
  accept="image/*"
  capture="environment"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFileA(file);
      setImageA(URL.createObjectURL(file));
    }
  }}
/>
          /
        </label>

        <input
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          placeholder="Name Option A"
          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        {/* OPTION B */}
        <h2 className="mt-8 text-sm font-semibold">Option B</h2>

        <label className="mt-2 flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          {imageB ? (
            <img
              src={imageB}
              alt="Option B"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-3xl">+</div>
              <div className="mt-2 text-sm">Add photo</div>
            </div>
          )}

          <input
  type="file"
  accept="image/*"
  capture="environment"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFileB(file);
      setImageB(URL.createObjectURL(file));
    }
  }}
/> 
        </label>

        <input
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          placeholder="Name Option B"
          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />

        {/* Audience */}
        <div className="mt-8">
          <p className="text-sm font-semibold">Who should answer?</p>

          <div className="mt-3 flex gap-2">
            {["DSU", "Friends", "Everyone"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setAudience(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  audience === item
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mt-8">
          <p className="text-sm font-semibold">Category</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Fashion",
              "Food",
              "School",
              "Tech",
              "Campus",
              "Other",
            ].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  category === item
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

 {/* Post */}
<button
  type="button"
  onClick={handlePost}
  disabled={!question || !optionA || !optionB || posting}
  className="mt-10 w-full rounded-xl bg-black py-4 font-semibold text-white disabled:bg-gray-300"
>
  {posting ? "Posting..." : "Post Decision"}
</button>

{postError && (
  <p className="mt-3 text-center text-sm text-red-600">
    {postError}
  </p>
)}

      </div>
    </main>
  );
}     
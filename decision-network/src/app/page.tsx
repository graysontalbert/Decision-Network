"use client";
import Link from "next/link";
import { useEffect, useState } from "react"; 
import { supabase } from "@/lib/supabase";
import { cursorTo } from "readline";
type Vote = "A" | "B" | null;
type DatabaseDecision = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  image_a_url: string | null;
image_b_url: string | null;  
  audience: string;
  category: string;
  college: string;
  votes_a: number;
  votes_b: number;
  created_at: string;
};
export default function Home() {
  const [tab, setTab] = useState("For You");
  const [vote1, setVote1] = useState<Vote>(null);
  const [vote2, setVote2] = useState<Vote>(null);

const [databaseDecisions, setDatabaseDecisions] =
  useState<DatabaseDecision[]>([]);
const [votedDecisionIds, setVotedDecisionIds] = useState<number[]>([]);

const [votedChoices, setVotedChoices] = useState<
  Record<number, "A" | "B">
>({});
useEffect(() => { 

  async function loadDecisions() {
    const { data, error } = await supabase
      .from("decisions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load decisions:", error);
      return;
    }

    setDatabaseDecisions(data ?? []);
  }

  loadDecisions();
}, []);
useEffect(() => {
  const savedVotes = localStorage.getItem("votedDecisions");

  if (savedVotes) {
    setVotedDecisionIds(JSON.parse(savedVotes));
  }
}, []);
async function handleDatabaseVote(
  decisionId: number,
  choice: "A" | "B"
) {
  if (votedDecisionIds.includes(decisionId)) {
  return;
}
  
  const { error } = await supabase.rpc("vote_on_decision", {
    decision_id: decisionId,
    choice,
  });

  if (error) {
    console.error("Vote failed:", error);
    return;
  }
const updatedVotedIds = [...votedDecisionIds, decisionId];

setVotedDecisionIds(updatedVotedIds);

localStorage.setItem(
  "votedDecisions",
  JSON.stringify(updatedVotedIds)
);
localStorage.setItem(
  "votedDecisions",
  JSON.stringify(updatedVotedIds)
);
const updatedChoices = {
  ...votedChoices,
  [decisionId]: choice,
};

setVotedChoices(updatedChoices);

localStorage.setItem(
  "votedChoices",
  JSON.stringify(updatedChoices)
);
  setDatabaseDecisions((current) =>
    current.map((decision) => {
      if (decision.id !== decisionId) return decision;

      if (choice === "A") {
        return {
          ...decision,
          votes_a: decision.votes_a + 1,
        };
      }

      return {
        ...decision,
        votes_b: decision.votes_b + 1,
      };
    })
  );
}
  return (
    <main className="min-h-screen bg-white text-black">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Decision
          </h1>

          <div className="flex items-center gap-5">
            <SearchIcon />
            <HeartIcon />

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
              G
            </div>
          </div>
        </div>

        {/* Feed tabs */}
        <div className="mx-auto flex max-w-xl">
          {["For You", "Following", "DSU"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`flex-1 border-b-2 py-3 text-sm font-semibold ${
                tab === item
                  ? "border-black text-black"
                  : "border-transparent text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      {/* FEED */}
      <section className="mx-auto max-w-xl pb-24">
        <CampusBar />
{databaseDecisions.map((decision) => (
  <article
    key={decision.id}
    className="border-b border-gray-200 px-4 py-5"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
          G
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Student</p>
            <span className="text-xs font-semibold text-blue-600">
              DSU
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {decision.category}
          </p>
        </div>
      </div>

      <button className="text-gray-500">•••</button>
    </div>

    <h2 className="mt-4 text-[18px] font-semibold">
      {decision.question}
    </h2>
<div className="mt-4 grid grid-cols-2 gap-3">
  <button
    onClick={() => handleDatabaseVote(decision.id, "A")}
    disabled={votedDecisionIds.includes(decision.id)}
    className={`overflow-hidden rounded-xl border text-left disabled:cursor-not-allowed ${
  votedChoices[decision.id] === "A"
    ? "border-black ring-2 ring-black"
    : "border-gray-300"
}`} 
  >
    {decision.image_a_url && (
      <img
        src={decision.image_a_url}
        alt={decision.option_a}
        className="aspect-square w-full object-cover"
      />
    )}

    <div className="p-4">
      <span className="text-xs font-bold text-gray-500">A</span>
      <p className="mt-1 font-semibold">{decision.option_a}</p>
    </div>
  </button>

  <button
    onClick={() => handleDatabaseVote(decision.id, "B")}
    disabled={votedDecisionIds.includes(decision.id)}
    className={`overflow-hidden rounded-xl border text-left disabled:cursor-not-allowed ${
  votedChoices[decision.id] === "B"
    ? "border-black ring-2 ring-black"
    : "border-gray-300"
}`}
  >
    {decision.image_b_url && (
      <img
        src={decision.image_b_url}
        alt={decision.option_b}
        className="aspect-square w-full object-cover"
      />
    )}

    <div className="p-4">
      <span className="text-xs font-bold text-gray-500">B</span>
      <p className="mt-1 font-semibold">{decision.option_b}</p>
    </div>
  </button>
</div>
{votedDecisionIds.includes(decision.id) && (
  <p className="mt-3 text-sm font-semibold text-gray-500">
    ✓ Voted
  </p>
)}
    {(() => {
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
    <div className="mt-4">
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-semibold">A</span>
          <span>{percentA}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{ width: `${percentA}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-semibold">B</span>
          <span>{percentB}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{ width: `${percentB}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </p>
    </div>
  );
})()} 
  </article>
))} 
        
        
        {/* Simple text poll */}
        
          

          
      </section>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-xl items-center justify-around py-3">
          <NavButton icon={<HomeIcon />} label="Home" active />
          <NavButton icon={<SearchIcon />} label="Explore" />
<Link
  href="/create"
  className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white"
>
  <PlusIcon />
</Link>
          

          <NavButton icon={<BellIcon />} label="Activity" />
          <NavButton icon={<UserIcon />} label="Profile" />
        </div>
      </nav>
    </main>
  );
}

function CampusBar() {
  return (
    <div className="border-b border-gray-200 px-4 py-3">
      <button className="flex items-center gap-2 text-sm font-semibold">
        Delaware State University

        <span className="text-xs text-gray-400">
          ▼
        </span>
      </button>
    </div>
  );
}

function DecisionPost({
  name,
  school,
  time,
  question,
  optionA,
  optionB,
  iconA,
  iconB,
  vote,
  setVote,
  percentA,
  percentB,
  totalVotes,
  likes,
  comments,
  aiChoice,
}: {
  name: string;
  school: string;
  time: string;
  question: string;
  optionA: string;
  optionB: string;
  iconA: string;
  iconB: string;
  vote: Vote;
  setVote: (vote: "A" | "B") => void;
  percentA: number;
  percentB: number;
  totalVotes: string;
  likes: string;
  comments: string;
  aiChoice: string;
}) {
  return (
    <article className="border-b border-gray-200 py-4">
      <div className="px-4">
        <UserHeader
          name={name}
          school={school}
          time={time}
        />

        <h2 className="mt-4 text-[18px] font-semibold leading-6">
          {question}
        </h2>
      </div>

      {/* Images/options */}
      <div className="mt-4 grid grid-cols-2 gap-[2px] bg-gray-200">
        <Choice
          label="A"
          title={optionA}
          icon={iconA}
          selected={vote === "A"}
          onClick={() => setVote("A")}
        />

        <Choice
          label="B"
          title={optionB}
          icon={iconB}
          selected={vote === "B"}
          onClick={() => setVote("B")}
        />
      </div>

      <div className="px-4">
        {vote ? (
          <div className="mt-4">
            <ResultLine
              label="A"
              percent={percentA}
            />

            <ResultLine
              label="B"
              percent={percentB}
            />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {totalVotes} students voted
              </p>

              <button className="text-xs font-semibold text-blue-600">
                ✦ AI picks {aiChoice}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            Tap A or B to vote
          </p>
        )}

        <SocialActions
          likes={likes}
          comments={comments}
        />
      </div>
    </article>
  );
}

function UserHeader({
  name,
  school,
  time,
}: {
  name: string;
  school: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
          {name[0]}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              {name}
            </p>

            <span className="text-xs text-blue-600">
              {school}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {time}
          </p>
        </div>
      </div>

      <button className="text-xl text-gray-500">
        •••
      </button>
    </div>
  );
}

function Choice({
  label,
  title,
  icon,
  selected,
  onClick,
}: {
  label: string;
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex aspect-[4/5] flex-col items-center justify-center bg-gray-100 ${
        selected ? "ring-4 ring-inset ring-blue-500" : ""
      }`}
    >
      <div className="text-6xl">{icon}</div>

      <p className="mt-4 px-3 text-center text-sm font-medium">
        {title}
      </p>

      <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold shadow">
        {label}
      </span>
    </button>
  );
}

function ResultLine({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span>{percent}%</span>
      </div>

      <div className="h-[5px] rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function SocialActions({
  likes,
  comments,
}: {
  likes: string;
  comments: string;
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <button className="flex items-center gap-2">
          <HeartIcon />
          <span className="text-sm">{likes}</span>
        </button>

        <button className="flex items-center gap-2">
          <CommentIcon />
          <span className="text-sm">{comments}</span>
        </button>

        <button>
          <SendIcon />
        </button>
      </div>

      <button>
        <BookmarkIcon />
      </button>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 ${
        active ? "text-black" : "text-gray-400"
      }`}
    >
      {icon}

      <span className="text-[10px]">
        {label}
      </span>
    </button>
  );
}

/* ICONS */

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10L12 4L20 10V20H14V14H10V20H4V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20S4 15.5 4 9.5C4 6.9 6 5 8.5 5C10.2 5 11.4 5.9 12 6.8C12.6 5.9 13.8 5 15.5 5C18 5 20 6.9 20 9.5C20 15.5 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 15C20 16.1 19.1 17 18 17H9L5 20V6C5 4.9 5.9 4 7 4H18C19.1 4 20 4.9 20 6V15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 3L10 14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 3L14 21L10 14L3 10L21 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4H18V21L12 17L6 21V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 17H18L16 14V10C16 7.8 14.2 6 12 6C9.8 6 8 7.8 8 10V14L6 17Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M5 20C6.5 16.5 9 15 12 15C15 15 17.5 16.5 19 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 
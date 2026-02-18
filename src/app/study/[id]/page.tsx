import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StudyArena } from "./study-arena";

export const dynamic = "force-dynamic";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [deck] = await db.select().from(decks).where(eq(decks.id, id)).limit(1);
  if (!deck) notFound();

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const allCards = await db.select().from(cards).where(eq(cards.deckId, id));
  const dueToday = allCards.filter(
    (c) => c.nextReview && new Date(c.nextReview) <= now
  );
  const hasDue = dueToday.length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Dashboard
        </Link>
        <h1 className="text-xl font-semibold">{deck.title}</h1>
        <span className="w-20" />
      </div>

      {allCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-16 text-center">
          <p className="text-slate-400">No cards in this deck yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Use Power Paste on the dashboard to add cards.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 text-indigo-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : !hasDue ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">
            You&apos;re All Caught Up!
          </p>
          <p className="mt-2 text-sm text-slate-500">
            No cards due today. Check back later.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <StudyArena
          deckId={id}
          deckTitle={deck.title}
          initialCards={dueToday}
        />
      )}
    </div>
  );
}

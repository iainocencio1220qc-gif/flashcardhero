import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { desc, lte, sql } from "drizzle-orm";
import { DeckGrid } from "@/components/deck-grid";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const allDecks = await db.select().from(decks).orderBy(desc(decks.createdAt));

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const dueCounts = await db
      .select({
        deckId: cards.deckId,
        count: sql<number>`count(*)::int`,
      })
      .from(cards)
      .where(lte(cards.nextReview, now))
      .groupBy(cards.deckId);

    const dueByDeck: Record<string, number> = {};
    for (const r of dueCounts) {
      if (r.deckId) dueByDeck[r.deckId] = r.count;
    }

    return <DeckGrid decks={allDecks} dueByDeck={dueByDeck} />;
  } catch (err) {
    console.error("Dashboard data fetch failed:", err);
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Dashboard Error</h2>
        <p className="text-sm text-slate-400">
          We hit a server-side error while loading your data. Please check the
          server logs for details.
        </p>
      </div>
    );
  }
}

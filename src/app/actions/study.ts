"use server";

import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeNextReview } from "@/lib/srs";
import { revalidatePath } from "next/cache";

export async function rateCard(
  cardId: string,
  score: 1 | 2 | 3 | 4
) {
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);
  if (!card) return { error: "Card not found" };

  const result = computeNextReview(score, {
    interval: card.interval ?? 0,
    repetition: card.repetition ?? 0,
    easeFactor: card.easeFactor ?? 2.5,
  });

  await db
    .update(cards)
    .set({
      interval: result.interval,
      repetition: result.repetition,
      easeFactor: result.easeFactor,
      nextReview: result.nextReview,
    })
    .where(eq(cards.id, cardId));

  revalidatePath("/dashboard");
  revalidatePath(`/study/${card.deckId}`);
  return { success: true };
}

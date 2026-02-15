"use server";

import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { revalidatePath } from "next/cache";
import type { NewDeck, NewCard } from "@/db/schema";

export async function createDeck(formData: FormData) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const themeColor = (formData.get("themeColor") as string) || "#6366f1";
  if (!title?.trim()) return { error: "Title is required" };
  await db.insert(decks).values({
    title: title.trim(),
    description: description?.trim() || null,
    themeColor: themeColor.trim(),
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createDeckWithCards(
  deck: { title: string; description?: string; themeColor?: string },
  cardPairs: { front: string; back: string }[]
) {
  if (!deck.title?.trim()) return { error: "Deck title is required" };
  const [inserted] = await db
    .insert(decks)
    .values({
      title: deck.title.trim(),
      description: deck.description?.trim() || null,
      themeColor: deck.themeColor || "#6366f1",
    })
    .returning({ id: decks.id });
  if (!inserted?.id) return { error: "Failed to create deck" };
  if (cardPairs.length > 0) {
    await db.insert(cards).values(
      cardPairs.map(({ front, back }) => ({
        deckId: inserted.id,
        front: front.trim(),
        back: back.trim(),
      }))
    );
  }
  revalidatePath("/dashboard");
  return { success: true, deckId: inserted.id };
}

export async function bulkAddCards(
  deckId: string,
  cardPairs: { front: string; back: string }[]
) {
  if (!deckId || cardPairs.length === 0)
    return { error: "Deck ID and at least one card required" };
  await db.insert(cards).values(
    cardPairs.map(({ front, back }) => ({
      deckId,
      front: front.trim(),
      back: back.trim(),
    }))
  );
  revalidatePath("/dashboard");
  revalidatePath(`/study/${deckId}`);
  return { success: true };
}

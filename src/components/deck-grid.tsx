"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Zap, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { PowerPasteDialog } from "@/components/power-paste-dialog";
import { Button } from "@/components/ui/button";
import type { Deck } from "@/db/schema";

interface DeckGridProps {
  decks: Deck[];
  dueByDeck: Record<string, number>;
}

export function DeckGrid({ decks, dueByDeck }: DeckGridProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Your decks and due cards</p>
        </div>
        <CreateDeckDialog />
      </motion.div>

      {decks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-16 text-center"
        >
          <BookOpen className="mb-4 h-12 w-12 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-300">No decks yet</h2>
          <p className="mt-2 max-w-sm text-slate-500">
            Create a deck or use Power Paste to bulk-add cards.
          </p>
          <CreateDeckDialog />
        </motion.div>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {},
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {decks.map((deck) => {
            const dueToday = dueByDeck[deck.id] ?? 0;
            return (
              <motion.li
                key={deck.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10"
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: deck.themeColor ?? "#6366f1",
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-1">
                          <Link
                            href={`/study/${deck.id}`}
                            className="hover:underline"
                          >
                            {deck.title}
                          </Link>
                        </CardTitle>
                        {dueToday > 0 && (
                          <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                            Due Today: {dueToday}
                          </span>
                        )}
                      </div>
                      {deck.description && (
                        <CardDescription className="line-clamp-2 text-slate-400">
                          {deck.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-2 pt-0">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/study/${deck.id}`}
                          className="flex items-center gap-1"
                        >
                          Study
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <PowerPasteDialog
                        deckId={deck.id}
                        deckTitle={deck.title}
                        trigger={
                          <Button variant="outline" size="sm" className="gap-1">
                            <Zap className="h-3.5 w-3.5" />
                            Power Paste
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}

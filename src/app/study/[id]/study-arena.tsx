"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rateCard } from "@/app/actions/study";
import type { Card } from "@/db/schema";

const COLORS = {
  1: "bg-red-500 hover:bg-red-600",
  2: "bg-orange-500 hover:bg-orange-600",
  3: "bg-green-500 hover:bg-green-600",
  4: "bg-cyan-500 hover:bg-cyan-600",
};
const LABELS = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" as const };

interface StudyArenaProps {
  deckId: string;
  deckTitle: string;
  initialCards: Card[];
}

export function StudyArena({
  deckId,
  deckTitle,
  initialCards,
}: StudyArenaProps) {
  const [queue, setQueue] = useState<Card[]>([...initialCards]);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const current = queue[0];
  const cardsRemaining = queue.length;

  const handleFlip = useCallback(() => {
    if (isAnimating) return;
    setFlipped((f) => !f);
  }, [isAnimating]);

  const handleRate = useCallback(
    async (score: 1 | 2 | 3 | 4) => {
      if (!current || isAnimating) return;
      setIsAnimating(true);
      await rateCard(current.id, score);
      setQueue((q) => q.slice(1));
      setFlipped(false);
      setIsAnimating(false);

      if (queue.length <= 1) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    },
    [current, isAnimating, queue.length]
  );

  if (!current) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/5 py-16 text-center"
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
          Deck Mastered!
        </h2>
        <p className="mt-2 text-slate-400">You&apos;ve reviewed all due cards.</p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/dashboard" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/study/${deckId}`} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Study Again
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-slate-400">
        {cardsRemaining} card{cardsRemaining !== 1 ? "s" : ""} remaining
      </p>

      <div
        className="perspective-[1000px] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative h-64 w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <div
            className="absolute inset-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-center text-lg text-white">
                {current.front}
              </p>
            </div>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-slate-500">
              Click to flip
            </p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-center text-lg text-white">
                {current.back}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-4 gap-3"
          >
            {([1, 2, 3, 4] as const).map((score) => (
              <motion.div key={score} whileTap={{ scale: 0.9 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(score);
                  }}
                  disabled={isAnimating}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 ${COLORS[score]}`}
                >
                  {LABELS[score]}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

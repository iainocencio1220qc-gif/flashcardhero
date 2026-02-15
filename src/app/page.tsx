"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <Sparkles className="h-16 w-16 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Flashcard Hero
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-slate-300">
          Gamified Spaced Repetition. Create decks, power-paste cards, and
          master them with the SM-2 algorithm.
        </p>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 pt-4"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

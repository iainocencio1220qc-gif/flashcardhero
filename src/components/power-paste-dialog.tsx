"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { parsePowerPaste, type ParsedCard } from "@/lib/power-paste";
import { bulkAddCards } from "@/app/actions/decks";

interface PowerPasteDialogProps {
  deckId: string;
  trigger?: React.ReactNode;
}

export function PowerPasteDialog({
  deckId,
  trigger,
}: PowerPasteDialogProps) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [separator, setSeparator] = useState("");
  const [preview, setPreview] = useState<ParsedCard[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    const parsed = parsePowerPaste(raw, separator || undefined);
    setPreview(parsed);
    setError(parsed.length === 0 ? "No valid cards found. Use lines like 'front : back' or 'front - back'." : null);
  };

  const handleBulkSave = async () => {
    if (preview.length === 0) return;
    setSaving(true);
    setError(null);
    const result = await bulkAddCards(deckId, preview);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    setRaw("");
    setPreview([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Power Paste
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Power Paste into &quot;{deckTitle}&quot;
          </DialogTitle>
          <DialogDescription>
            Paste a block of text. Each line = one card. Split by &quot;:&quot; or &quot;-&quot; (e.g. &quot;Front : Back&quot;).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Custom separator (optional)</label>
            <Input
              placeholder="e.g. : or -"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Question : Answer&#10;Term – Definition&#10;..."
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleParse}
            className="w-full"
          >
            Preview
          </Button>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {preview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-slate-300">
                Preview ({preview.length} cards)
              </p>
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-white/10 bg-white/5 p-2">
                {preview.slice(0, 20).map((c, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs text-slate-300"
                  >
                    <span className="truncate flex-1" title={c.front}>
                      {c.front}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="truncate flex-1" title={c.back}>
                      {c.back}
                    </span>
                  </li>
                ))}
                {preview.length > 20 && (
                  <li className="text-slate-500 text-xs">
                    +{preview.length - 20} more
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkSave}
            disabled={preview.length === 0 || saving}
          >
            {saving ? "Saving…" : `Bulk Save (${preview.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

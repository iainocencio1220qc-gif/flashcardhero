/**
 * SM-2 Spaced Repetition Algorithm
 * Score: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
 */

export interface SRSState {
  interval: number;
  repetition: number;
  easeFactor: number;
}

export interface SRSResult extends SRSState {
  nextReview: Date;
}

const MIN_EASE = 1.3;

export function computeNextReview(
  score: 1 | 2 | 3 | 4,
  state: SRSState
): SRSResult {
  let { interval, repetition, easeFactor } = state;

  // New Ease Factor: easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
  const delta =
    0.1 - (5 - score) * (0.08 + (5 - score) * 0.02);
  easeFactor = Math.max(MIN_EASE, easeFactor + delta);

  if (score === 1) {
    interval = 0;
    repetition = 0;
  } else if (score === 2) {
    interval = 1;
    repetition = 1;
  } else if (score === 3) {
    if (repetition === 0) {
      interval = 1;
      repetition = 1;
    } else if (repetition === 1) {
      interval = 6;
      repetition = 2;
    } else {
      interval = Math.round(interval * easeFactor);
      repetition += 1;
    }
  } else if (score === 4) {
    if (repetition === 0) {
      interval = 1;
      repetition = 1;
    } else if (repetition === 1) {
      interval = 6;
      repetition = 2;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
      repetition += 1;
    }
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(0, 0, 0, 0);

  return { interval, repetition, easeFactor, nextReview };
}

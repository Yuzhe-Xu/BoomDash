const PREFIX = "boomdash";

export type Progress = {
  bestTime: number | null;
  bestScore: number | null;
  muted: boolean;
};

export function loadProgress(levelId: string): Progress {
  const raw = localStorage.getItem(`${PREFIX}.${levelId}`);
  if (!raw) {
    return { bestTime: null, bestScore: null, muted: false };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      bestTime: typeof parsed.bestTime === "number" ? parsed.bestTime : null,
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : null,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { bestTime: null, bestScore: null, muted: false };
  }
}

export function saveProgress(levelId: string, progress: Progress): void {
  localStorage.setItem(`${PREFIX}.${levelId}`, JSON.stringify(progress));
}

export function recordSuccess(levelId: string, time: number, score: number): Progress {
  const current = loadProgress(levelId);
  const bestTime = current.bestTime === null ? time : Math.min(current.bestTime, time);
  const bestScore = current.bestScore === null ? score : Math.max(current.bestScore, score);
  const next = { ...current, bestTime, bestScore };
  saveProgress(levelId, next);
  return next;
}

export function saveMuted(levelId: string, muted: boolean): void {
  const current = loadProgress(levelId);
  saveProgress(levelId, { ...current, muted });
}

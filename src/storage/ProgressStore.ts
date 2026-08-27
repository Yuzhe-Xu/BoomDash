const PREFIX = "boomdash";

export type Progress = {
  bestTime: number | null;
  muted: boolean;
};

export function loadProgress(levelId: string): Progress {
  const raw = localStorage.getItem(`${PREFIX}.${levelId}`);
  if (!raw) {
    return { bestTime: null, muted: false };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      bestTime: typeof parsed.bestTime === "number" ? parsed.bestTime : null,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { bestTime: null, muted: false };
  }
}

export function saveProgress(levelId: string, progress: Progress): void {
  localStorage.setItem(`${PREFIX}.${levelId}`, JSON.stringify(progress));
}

export function recordBestTime(levelId: string, time: number): number {
  const current = loadProgress(levelId);
  const bestTime = current.bestTime === null ? time : Math.min(current.bestTime, time);
  saveProgress(levelId, { ...current, bestTime });
  return bestTime;
}

export function saveMuted(levelId: string, muted: boolean): void {
  const current = loadProgress(levelId);
  saveProgress(levelId, { ...current, muted });
}

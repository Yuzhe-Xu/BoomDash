import { afterEach, describe, expect, it } from "vitest";
import { loadProgress, recordSuccess, saveMuted } from "../src/storage/ProgressStore";

function installMemoryStorage(): void {
  const data = new Map<string, string>();
  const localStorage = {
    getItem(key: string): string | null {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      data.set(key, value);
    },
    removeItem(key: string): void {
      data.delete(key);
    },
    clear(): void {
      data.clear();
    },
    key(index: number): string | null {
      return [...data.keys()][index] ?? null;
    },
    get length(): number {
      return data.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: localStorage, configurable: true });
}

describe("ProgressStore", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "localStorage");
  });

  it("keeps the lowest time and the highest score", () => {
    installMemoryStorage();
    recordSuccess("level-1", 9, 5200);
    const second = recordSuccess("level-1", 11, 6100);
    expect(second.bestTime).toBe(9);
    expect(second.bestScore).toBe(6100);
    expect(loadProgress("level-1")).toEqual({ bestTime: 9, bestScore: 6100, muted: false });
  });

  it("reads missing score from older saves as null", () => {
    installMemoryStorage();
    localStorage.setItem("boomdash.level-1", JSON.stringify({ bestTime: 7.2, muted: true }));
    expect(loadProgress("level-1")).toEqual({ bestTime: 7.2, bestScore: null, muted: true });
  });

  it("preserves score when only mute changes", () => {
    installMemoryStorage();
    recordSuccess("level-4", 8.5, 5800);
    saveMuted("level-4", true);
    expect(loadProgress("level-4")).toEqual({ bestTime: 8.5, bestScore: 5800, muted: true });
  });
});

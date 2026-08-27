import type { FailReason } from "../app/GamePhase";
import type { StarCount } from "../level/StarRating";
import type { RunState } from "../simulation/GameState";
import { fillStarRow } from "./StarRow";

const FAIL_COPY: Record<FailReason, string> = {
  "out-of-bounds": "飞船离开画面",
  overshoot: "越过顶部但未进入终点",
  timeout: "超过时间",
  asteroid: "飞船进入陨石带",
};

export type ResultView = {
  score: number;
  stars: StarCount;
  bestScore: number | null;
  canAdvance: boolean;
};

export class ResultPanel {
  private shownKey = "";

  constructor(
    private readonly root: HTMLElement,
    private readonly kicker: HTMLElement,
    private readonly title: HTMLElement,
    private readonly copy: HTMLElement,
    private readonly stats: HTMLElement,
    private readonly stars: HTMLElement,
    private readonly pauseRoot: HTMLElement,
    private readonly nextButton: HTMLButtonElement,
    private readonly menuButton: HTMLButtonElement,
  ) {}

  bind(handlers: {
    resume: () => void;
    retry: () => void;
    redeploy: () => void;
    next: () => void;
    menu: () => void;
  }): void {
    document.getElementById("btn-resume")?.addEventListener("click", handlers.resume);
    document.getElementById("btn-retry")?.addEventListener("click", handlers.retry);
    document.getElementById("btn-redeploy")?.addEventListener("click", handlers.redeploy);
    document.getElementById("btn-pause-retry")?.addEventListener("click", handlers.retry);
    document.getElementById("btn-pause-redeploy")?.addEventListener("click", handlers.redeploy);
    document.getElementById("btn-pause-menu")?.addEventListener("click", handlers.menu);
    this.nextButton.addEventListener("click", handlers.next);
    this.menuButton.addEventListener("click", handlers.menu);
  }

  render(
    state: RunState,
    result: ResultView = { score: 0, stars: 0, bestScore: null, canAdvance: false },
  ): void {
    const paused = state.phase === "paused";
    const ended = state.phase === "success" || state.phase === "failed";
    const success = state.phase === "success";
    this.pauseRoot.hidden = !paused;
    this.root.hidden = !ended;
    this.nextButton.hidden = !(ended && success && result.canAdvance);
    if (!ended) {
      this.shownKey = "";
      this.stars.hidden = true;
      return;
    }

    const key = [
      state.phase,
      state.elapsed.toFixed(2),
      state.usedBombs,
      result.score,
      result.stars,
      result.bestScore ?? "",
      result.canAdvance,
    ].join(":");
    if (key === this.shownKey) {
      return;
    }
    this.shownKey = key;

    this.root.classList.toggle("success", success);
    this.root.classList.toggle("fail", !success);
    this.kicker.textContent = success ? "LINK STABLE" : "SIGNAL LOST";
    this.title.textContent = success ? "SUCCESS" : "FAILED";
    this.copy.textContent = success
      ? "终点捕获完成。"
      : FAIL_COPY[state.failReason ?? "out-of-bounds"];
    this.stars.hidden = !success;
    if (success) {
      fillStarRow(this.stars, result.stars);
    }
    const rows: Array<[string, string, string?]> = [];
    if (success) {
      rows.push(["SCORE", String(result.score), "stat-score"]);
    }
    rows.push(["TIME", `${state.elapsed.toFixed(2)}s`], ["BOMBS", String(state.usedBombs)]);
    if (success && result.bestScore !== null) {
      rows.push(["BEST", String(result.bestScore)]);
    }
    this.stats.innerHTML = rows
      .map(
        ([k, v, cls]) =>
          `<div${cls ? ` class="${cls}"` : ""}><dt>${k}</dt><dd>${v}</dd></div>`,
      )
      .join("");
  }

  hide(): void {
    this.shownKey = "";
    this.pauseRoot.hidden = true;
    this.root.hidden = true;
    this.nextButton.hidden = true;
    this.stars.hidden = true;
  }
}

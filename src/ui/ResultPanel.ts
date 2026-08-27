import type { FailReason } from "../app/GamePhase";
import type { StarCount } from "../level/StarRating";
import type { RunState } from "../simulation/GameState";
import { fillStarRow } from "./StarRow";

const FAIL_COPY: Record<FailReason, string> = {
  "out-of-bounds": "飞船离开画面",
  overshoot: "越过顶部但未进入终点",
  timeout: "超过时间",
};

export class ResultPanel {
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

  render(state: RunState, bestTime: number | null, canAdvance = false, stars: StarCount = 0): void {
    const paused = state.phase === "paused";
    const ended = state.phase === "success" || state.phase === "failed";
    this.pauseRoot.hidden = !paused;
    this.root.hidden = !ended;
    this.nextButton.hidden = !(ended && state.phase === "success" && canAdvance);
    if (!ended) {
      this.stars.hidden = true;
      return;
    }

    const success = state.phase === "success";
    this.root.classList.toggle("success", success);
    this.root.classList.toggle("fail", !success);
    this.kicker.textContent = success ? "LINK STABLE" : "SIGNAL LOST";
    this.title.textContent = success ? "SUCCESS" : "FAILED";
    this.copy.textContent = success
      ? "终点捕获完成。"
      : FAIL_COPY[state.failReason ?? "out-of-bounds"];
    this.stars.hidden = !success;
    if (success) {
      fillStarRow(this.stars, stars);
    }
    const rows = [
      ["TIME", `${state.elapsed.toFixed(2)}s`],
      ["BOMBS", String(state.usedBombs)],
    ];
    if (success && bestTime !== null) {
      rows.push(["BEST", `${bestTime.toFixed(2)}s`]);
    }
    this.stats.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  }

  hide(): void {
    this.pauseRoot.hidden = true;
    this.root.hidden = true;
    this.nextButton.hidden = true;
    this.stars.hidden = true;
  }
}

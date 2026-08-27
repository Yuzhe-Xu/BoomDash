import type { FailReason } from "../app/GamePhase";
import type { RunState } from "../simulation/GameState";

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
    private readonly pauseRoot: HTMLElement,
  ) {}

  bind(handlers: {
    resume: () => void;
    retry: () => void;
    redeploy: () => void;
  }): void {
    document.getElementById("btn-resume")?.addEventListener("click", handlers.resume);
    document.getElementById("btn-retry")?.addEventListener("click", handlers.retry);
    document.getElementById("btn-redeploy")?.addEventListener("click", handlers.redeploy);
    document.getElementById("btn-pause-retry")?.addEventListener("click", handlers.retry);
    document.getElementById("btn-pause-redeploy")?.addEventListener("click", handlers.redeploy);
  }

  render(state: RunState, bestTime: number | null): void {
    const paused = state.phase === "paused";
    const ended = state.phase === "success" || state.phase === "failed";
    this.pauseRoot.hidden = !paused;
    this.root.hidden = !ended;
    if (!ended) {
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
    const rows = [
      ["TIME", `${state.elapsed.toFixed(2)}s`],
      ["BOMBS", String(state.usedBombs)],
    ];
    if (success && bestTime !== null) {
      rows.push(["BEST", `${bestTime.toFixed(2)}s`]);
    }
    this.stats.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  }
}

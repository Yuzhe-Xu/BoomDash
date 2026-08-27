import type { LevelDefinition } from "../level/LevelDefinition";
import { starsForBestTime } from "../level/StarRating";
import { loadProgress } from "../storage/ProgressStore";
import { createStarRow } from "./StarRow";

export class StartScreen {
  constructor(
    private readonly root: HTMLElement,
    private readonly home: HTMLElement,
    private readonly selector: HTMLElement,
    private readonly list: HTMLElement,
    private readonly startButton: HTMLButtonElement,
    private readonly sectorsButton: HTMLButtonElement,
    private readonly backButton: HTMLButtonElement,
  ) {}

  bind(handlers: {
    start: () => void;
    openSelector: () => void;
    selectLevel: (id: string) => void;
    back: () => void;
  }): void {
    this.startButton.addEventListener("click", handlers.start);
    this.sectorsButton.addEventListener("click", handlers.openSelector);
    this.backButton.addEventListener("click", handlers.back);
    this.list.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const button = target.closest<HTMLButtonElement>("[data-level-id]");
      if (button?.dataset.levelId) {
        handlers.selectLevel(button.dataset.levelId);
      }
    });
  }

  render(levels: LevelDefinition[]): void {
    this.list.replaceChildren(
      ...levels.map((level) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "sector-option";
        button.dataset.levelId = level.id;

        const name = document.createElement("span");
        name.className = "sector-name";
        name.textContent = level.name;

        const progress = document.createElement("span");
        progress.className = "sector-progress";
        const bestTime = loadProgress(level.id).bestTime;
        progress.append(createStarRow(starsForBestTime(bestTime, level)));

        const best = document.createElement("span");
        best.className = "sector-best";
        best.textContent = bestTime === null ? "BEST --" : `BEST ${bestTime.toFixed(2)}s`;
        progress.append(best);

        button.append(name, progress);
        return button;
      }),
    );
  }

  showHome(): void {
    this.root.hidden = false;
    this.home.hidden = false;
    this.selector.hidden = true;
  }

  showSelector(): void {
    this.root.hidden = false;
    this.home.hidden = true;
    this.selector.hidden = false;
  }

  hide(): void {
    this.root.hidden = true;
  }
}

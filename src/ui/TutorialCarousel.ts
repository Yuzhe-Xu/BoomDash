import {
  type TutorialPage,
  clampTutorialPage,
  isFirstTutorialPage,
  isLastTutorialPage,
} from "./tutorialPages";

export class TutorialCarousel {
  private page = 0;
  private pages: TutorialPage[] = [];
  private complete: (() => void) | null = null;
  private swipeX: number | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly kicker: HTMLElement,
    private readonly title: HTMLElement,
    private readonly copy: HTMLElement,
    private readonly stage: HTMLElement,
    private readonly dots: HTMLElement,
    private readonly prevButton: HTMLButtonElement,
    private readonly nextButton: HTMLButtonElement,
    private readonly skipButton: HTMLButtonElement,
  ) {}

  bind(handlers: { complete: () => void }): void {
    this.complete = handlers.complete;
    this.skipButton.addEventListener("click", () => this.finish());
    this.prevButton.addEventListener("click", () => this.setPage(this.page - 1));
    this.nextButton.addEventListener("click", () => {
      if (isLastTutorialPage(this.page, this.pages.length)) {
        this.finish();
        return;
      }
      this.setPage(this.page + 1);
    });
    this.dots.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }
      const index = Number(target.dataset.page);
      if (Number.isInteger(index)) {
        this.setPage(index);
      }
    });
    this.stage.addEventListener("pointerdown", (event) => {
      this.swipeX = event.clientX;
    });
    this.stage.addEventListener("pointerup", (event) => {
      if (this.swipeX === null) {
        return;
      }
      const dx = event.clientX - this.swipeX;
      this.swipeX = null;
      if (dx <= -40) {
        this.setPage(this.page + 1);
      } else if (dx >= 40) {
        this.setPage(this.page - 1);
      }
    });
    this.stage.addEventListener("pointercancel", () => {
      this.swipeX = null;
    });
  }

  show(pages: TutorialPage[]): void {
    this.pages = pages;
    this.root.hidden = false;
    this.page = 0;
    this.sync();
  }

  hide(): void {
    this.root.hidden = true;
    this.swipeX = null;
  }

  private finish(): void {
    this.hide();
    this.complete?.();
  }

  private setPage(index: number): void {
    this.page = clampTutorialPage(index, this.pages.length);
    this.sync();
  }

  private sync(): void {
    const page = this.pages[this.page];
    if (!page) {
      return;
    }
    this.kicker.textContent = page.kicker;
    this.title.textContent = page.title;
    this.copy.textContent = page.copy;
    this.prevButton.hidden = isFirstTutorialPage(this.page, this.pages.length);
    this.nextButton.textContent = isLastTutorialPage(this.page, this.pages.length)
      ? "BEGIN"
      : "NEXT";
    for (const slide of this.stage.querySelectorAll<HTMLElement>(".tutorial-slide")) {
      slide.classList.toggle("is-active", slide.dataset.id === page.id);
    }
    this.dots.replaceChildren(
      ...this.pages.map((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.page = String(index);
        button.setAttribute("aria-label", `tutorial page ${index + 1}`);
        button.classList.toggle("active", index === this.page);
        return button;
      }),
    );
  }
}

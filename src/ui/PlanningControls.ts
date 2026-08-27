export class PlanningControls {
  constructor(
    private readonly bar: HTMLElement,
    private readonly clearBtn: HTMLButtonElement,
    private readonly deleteBtn: HTMLButtonElement,
    private readonly launchBtn: HTMLButtonElement,
  ) {}

  bind(handlers: { clear: () => void; remove: () => void; launch: () => void }): void {
    this.clearBtn.addEventListener("click", handlers.clear);
    this.deleteBtn.addEventListener("click", handlers.remove);
    this.launchBtn.addEventListener("click", handlers.launch);
  }

  setVisible(visible: boolean): void {
    this.bar.hidden = !visible;
  }

  setDeleteEnabled(enabled: boolean): void {
    this.deleteBtn.disabled = !enabled;
  }
}

export class PlanningControls {
  constructor(
    private readonly bar: HTMLElement,
    private readonly clearBtn: HTMLButtonElement,
    private readonly deleteBtn: HTMLButtonElement,
    private readonly launchBtn: HTMLButtonElement,
  ) {}

  bind(handlers: { clear: () => void; remove: () => void; launch: () => void }): void {
    this.bindActivation(this.clearBtn, handlers.clear);
    this.bindActivation(this.deleteBtn, handlers.remove);
    this.bindActivation(this.launchBtn, handlers.launch);
  }

  setVisible(visible: boolean): void {
    this.bar.hidden = !visible;
  }

  setDeleteEnabled(enabled: boolean): void {
    this.deleteBtn.disabled = !enabled;
  }

  private bindActivation(button: HTMLButtonElement, handler: () => void): void {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      handler();
    });
    button.addEventListener("click", (event) => {
      if (event.detail === 0) {
        handler();
      }
    });
  }
}

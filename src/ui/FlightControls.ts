import type { Bomb } from "../simulation/GameState";

export class FlightControls {
  constructor(private readonly rail: HTMLElement) {}

  bind(onDetonate: (id: string) => void): void {
    this.rail.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }
      const id = target.dataset.id;
      if (id) {
        event.preventDefault();
        onDetonate(id);
      }
    });
  }

  render(bombs: Bomb[], visible: boolean, selectedId: string | null = null, raised = false): void {
    this.rail.hidden = !visible;
    this.rail.classList.toggle("raised", raised);
    if (!visible) {
      return;
    }
    const markup = bombs
      .map((bomb) => {
        const classes = [
          bomb.state === "armed" ? "armed" : "used",
          bomb.id === selectedId ? "active" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<button type="button" data-id="${bomb.id}" class="${classes}" ${
          bomb.state === "detonated" ? "disabled" : ""
        }>${bomb.order}</button>`;
      })
      .join("");
    if (this.rail.innerHTML !== markup) {
      this.rail.innerHTML = markup;
    }
  }
}

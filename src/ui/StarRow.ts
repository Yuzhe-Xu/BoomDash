import { MAX_STARS, type StarCount } from "../level/StarRating";

export function fillStarRow(host: HTMLElement, stars: StarCount): void {
  host.replaceChildren(
    ...Array.from({ length: MAX_STARS }, (_, index) => {
      const mark = document.createElement("span");
      mark.className = index < stars ? "star filled" : "star";
      return mark;
    }),
  );
  host.setAttribute("aria-label", `${stars}/${MAX_STARS}`);
}

export function createStarRow(stars: StarCount): HTMLElement {
  const row = document.createElement("span");
  row.className = "star-row";
  fillStarRow(row, stars);
  return row;
}

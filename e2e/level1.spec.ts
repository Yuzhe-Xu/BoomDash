import { expect, test } from "@playwright/test";

test("loads the first sector and can place a bomb then launch", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("#game");
  await expect(canvas).toBeVisible();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 01");

  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height * 0.55);
  await expect(page.locator("#hud-stat")).toContainText("BOMBS 1/5");

  await page.getByRole("button", { name: "LAUNCH" }).click();
  await expect(page.locator("#planning-bar")).toBeHidden();
  await expect(page.locator("#hud-stat")).toContainText("T ");
});

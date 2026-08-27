import { expect, test } from "@playwright/test";

test("loads the first sector and can place a bomb then launch", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#start-screen")).toBeVisible();
  await page.getByRole("button", { name: "START" }).click();
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

test("returns to the main menu from pause", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "START" }).click();
  await page.getByRole("button", { name: "pause" }).click();

  await expect(page.locator("#pause-menu")).toBeVisible();
  await page.getByRole("button", { name: "MAIN MENU" }).click();

  await expect(page.locator("#start-screen")).toBeVisible();
  await expect(page.locator("#pause-menu")).toBeHidden();
  await expect(page.getByRole("button", { name: "START" })).toBeVisible();
});

test("keeps every listed sector available and scrolls sector two", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await expect(page.getByRole("button", { name: /SECTOR 01/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 02/ })).toBeEnabled();

  await page.getByRole("button", { name: /SECTOR 02/ }).click();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 02");
  await expect(page.locator("#debug")).toContainText("camera 844");

  const box = await page.locator("#game").boundingBox();
  expect(box).toBeTruthy();
  const x = box!.x + box!.width * 0.5;
  for (let gesture = 0; gesture < 2; gesture += 1) {
    await page.mouse.move(x, box!.y + box!.height * 0.75);
    await page.mouse.down();
    await page.mouse.move(x, box!.y + box!.height * 0.05, { steps: 4 });
    await page.mouse.up();
  }
  await expect(page.locator("#debug")).toContainText("camera 0");
});

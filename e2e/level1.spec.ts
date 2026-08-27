import { expect, test, type Page } from "@playwright/test";

async function skipTutorial(page: Page): Promise<void> {
  await page.getByRole("button", { name: "SKIP" }).click();
}

async function enterFirstSector(page: Page): Promise<void> {
  await page.getByRole("button", { name: "START" }).click();
  await skipTutorial(page);
}

test("shows a three-page tutorial before sector one", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "START" }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("游戏目标");
  await expect(page.locator(".anim-goal")).toBeVisible();

  await page.getByRole("button", { name: "NEXT" }).click();
  await expect(page.locator("#tutorial-title")).toHaveText("炸弹部署");
  await expect(page.locator(".anim-deploy")).toBeVisible();

  await page.getByRole("button", { name: "NEXT" }).click();
  await expect(page.locator("#tutorial-title")).toHaveText("飞船飞行");
  await expect(page.locator(".anim-flight")).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 01");
});

test("shows a one-page map survey tutorial before sector two", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 02/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("浏览地图");
  await expect(page.locator(".anim-scroll")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("鼠标滚轮");
  await expect(page.locator("#tutorial-copy")).toContainText("上下滑动");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 02");
});

test("loads the first sector and can place a bomb then launch", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#start-screen")).toBeVisible();
  await enterFirstSector(page);
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
  await enterFirstSector(page);
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
  await expect(page.getByRole("button", { name: /SECTOR 03/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 04/ })).toBeEnabled();

  await page.getByRole("button", { name: /SECTOR 02/ }).click();
  await expect(page.locator("#tutorial")).toBeVisible();
  await skipTutorial(page);
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

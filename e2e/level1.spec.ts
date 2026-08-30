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
  await expect(page.locator("#tutorial-title")).toHaveText("爆炸推动飞船");
  await expect(page.locator("#tutorial-copy")).toContainText("推离爆炸点");
  await expect(page.locator("#tutorial-copy")).toContainText("速度和方向");
  await expect(page.locator(".force-a span")).toHaveText("向右");
  await expect(page.locator(".force-b span")).toHaveText("向左");
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

test("shows a one-page rating tutorial before sector four", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 04/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("通关评分");
  await expect(page.locator(".anim-score")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("时间");
  await expect(page.locator("#tutorial-copy")).toContainText("引爆炸弹");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 04");
});

test("shows a one-page asteroid tutorial before sector six", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 06/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("陨石带");
  await expect(page.locator(".anim-asteroid")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("禁入区域");
  await expect(page.locator("#tutorial-copy")).toContainText("任务立即失败");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 06");
});

test("shows a one-page bonus-goal tutorial before sector nine", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 09/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("奖励终点");
  await expect(page.locator(".anim-bonus")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("奖励图样");
  await expect(page.locator("#tutorial-copy")).toContainText("额外加分");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 09");
});

test("shows a one-page gravity tutorial before sector thirty-one", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 31/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("行星引力");
  await expect(page.locator(".anim-gravity")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("引力");
  await expect(page.locator("#tutorial-copy")).toContainText("撞击表面立即失败");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 31");
});

test("shows a one-page interstellar-dust tutorial before sector twenty-one", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 21/ }).click();

  await expect(page.locator("#tutorial")).toBeVisible();
  await expect(page.locator("#tutorial-title")).toHaveText("星际尘埃");
  await expect(page.locator(".anim-dust")).toBeVisible();
  await expect(page.locator("#tutorial-copy")).toContainText("持续减速");
  await expect(page.getByRole("button", { name: "BEGIN" })).toBeVisible();

  await page.getByRole("button", { name: "BEGIN" }).click();
  await expect(page.locator("#tutorial")).toBeHidden();
  await expect(page.locator("#level-tag")).toHaveText("SECTOR 21");
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

test("activates planning controls with touch input", async ({ page }) => {
  await page.goto("/");
  await enterFirstSector(page);
  const canvas = page.locator("#game");
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();

  await page.touchscreen.tap(box!.x + box!.width * 0.5, box!.y + box!.height * 0.55);
  await expect(page.locator("#hud-stat")).toContainText("BOMBS 1/5");

  await page.getByRole("button", { name: "CLEAR" }).tap();
  await expect(page.locator("#hud-stat")).toContainText("BOMBS 0/5");

  await page.touchscreen.tap(box!.x + box!.width * 0.5, box!.y + box!.height * 0.55);
  await page.keyboard.press("1");
  await expect(page.getByRole("button", { name: "DEL" })).toBeEnabled();
  await page.getByRole("button", { name: "DEL" }).tap();
  await expect(page.locator("#hud-stat")).toContainText("BOMBS 0/5");

  await page.touchscreen.tap(box!.x + box!.width * 0.5, box!.y + box!.height * 0.55);
  await page.getByRole("button", { name: "LAUNCH" }).tap();
  await expect(page.locator("#planning-bar")).toBeHidden();
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
  await expect(page.getByRole("button", { name: /SECTOR 05/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 06/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 07/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 08/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 09/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 10/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 11/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 12/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 13/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 14/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 15/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 16/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 17/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 18/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 19/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 20/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 21/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 22/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 23/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 24/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 25/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 26/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 27/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 28/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 29/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 30/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 31/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 32/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 33/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 34/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 35/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 36/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 37/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 38/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 39/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 40/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 41/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 42/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 43/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 44/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 45/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 46/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 47/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 48/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 49/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /SECTOR 50/ })).toBeEnabled();
  await expect(page.locator(".sector-option")).toHaveCount(50);

  const sectorList = page.locator("#sector-list");
  await expect(sectorList).toHaveCSS("overflow-y", "auto");
  const initialScroll = await sectorList.evaluate((element) => ({
    top: element.scrollTop,
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(initialScroll.scrollHeight).toBeGreaterThan(initialScroll.clientHeight);
  await sectorList.hover();
  await page.mouse.wheel(0, 360);
  await expect.poll(() => sectorList.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await sectorList.evaluate((element) => {
    element.scrollTop = 0;
  });

  const listBox = await sectorList.boundingBox();
  expect(listBox).toBeTruthy();
  const cdp = await page.context().newCDPSession(page);
  const touchX = listBox!.x + listBox!.width * 0.5;
  const touchStartY = listBox!.y + listBox!.height * 0.76;
  const touchEndY = listBox!.y + listBox!.height * 0.24;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: touchX, y: touchStartY, id: 1 }],
  });
  for (let step = 1; step <= 8; step += 1) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: touchX, y: touchStartY + ((touchEndY - touchStartY) * step) / 8, id: 1 }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => sectorList.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await sectorList.evaluate((element) => {
    element.scrollTop = 0;
  });

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

test("renders sector twenty-six's center goal and asteroid rings", async ({ page }) => {
  await page.goto("/?debug=1&unlimited=0");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 26/ }).click();

  await expect(page.locator("#level-tag")).toHaveText("SECTOR 26");
  await expect(page.locator("#hud-stat")).toHaveText("BOMBS 0/8");
  const canvas = page.locator("#game");
  await canvas.hover();
  await page.mouse.wheel(0, -1000);
  await expect(page.locator("#debug")).toContainText("camera 0.0");

  const pixels = await canvas.evaluate((element: HTMLCanvasElement) => {
    const ctx = element.getContext("2d");
    if (!ctx) {
      return { goal: 0, hazard: 0 };
    }
    const data = ctx.getImageData(0, 0, element.width, element.height).data;
    let goal = 0;
    let hazard = 0;
    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      if (green > 160 && green > red * 1.35 && green > blue * 1.15) {
        goal += 1;
      }
      if (red > 150 && red > green * 1.3 && red > blue * 1.15) {
        hazard += 1;
      }
    }
    return { goal, hazard };
  });

  expect(pixels.goal).toBeGreaterThan(100);
  expect(pixels.hazard).toBeGreaterThan(100);
});

test("renders sector thirty-one's rocky planet and top goal", async ({ page }) => {
  await page.goto("/?debug=1&unlimited=0");
  await page.getByRole("button", { name: "SECTORS" }).click();
  await page.getByRole("button", { name: /SECTOR 31/ }).click();
  await page.getByRole("button", { name: "BEGIN" }).click();

  await expect(page.locator("#level-tag")).toHaveText("SECTOR 31");
  await expect(page.locator("#hud-stat")).toHaveText("BOMBS 0/8");

  const pixels = await page.locator("#game").evaluate((element: HTMLCanvasElement) => {
    const ctx = element.getContext("2d");
    if (!ctx) {
      return { goal: 0, planet: 0, variance: 0 };
    }
    const data = ctx.getImageData(0, 0, element.width, element.height).data;
    let goal = 0;
    let planet = 0;
    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      if (green > 160 && green > red * 1.35 && green > blue * 1.15) {
        goal += 1;
      }
      if (red > 70 && green > 28 && blue < green && red > green && red - blue > 18) {
        planet += 1;
        const luma = red * 0.3 + green * 0.59 + blue * 0.11;
        sum += luma;
        sumSq += luma * luma;
        count += 1;
      }
    }
    const mean = count > 0 ? sum / count : 0;
    return { goal, planet, variance: count > 0 ? sumSq / count - mean * mean : 0 };
  });

  expect(pixels.goal).toBeGreaterThan(100);
  expect(pixels.planet).toBeGreaterThan(100);
  expect(pixels.variance).toBeGreaterThan(40);
});

test("renders sectors thirty-two through thirty-four's planets", async ({ page }) => {
  for (const sector of [32, 33, 34]) {
    await page.goto("/?debug=1&unlimited=0");
    await page.getByRole("button", { name: "SECTORS" }).click();
    await page.getByRole("button", { name: new RegExp(`SECTOR ${sector}`) }).click();

    await expect(page.locator("#level-tag")).toHaveText(`SECTOR ${sector}`);
    await expect(page.locator("#hud-stat")).toHaveText("BOMBS 0/8");
    const pixels = await page.locator("#game").evaluate((element: HTMLCanvasElement) => {
      const ctx = element.getContext("2d");
      if (!ctx) {
        return { planet: 0, variance: 0 };
      }
      const data = ctx.getImageData(0, 0, element.width, element.height).data;
      let planet = 0;
      let sum = 0;
      let sumSq = 0;
      let count = 0;
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        if (red > 70 && green > 28 && blue < green && red > green && red - blue > 18) {
          planet += 1;
          const luma = red * 0.3 + green * 0.59 + blue * 0.11;
          sum += luma;
          sumSq += luma * luma;
          count += 1;
        }
      }
      const mean = count > 0 ? sum / count : 0;
      return { planet, variance: count > 0 ? sumSq / count - mean * mean : 0 };
    });

    expect(pixels.planet).toBeGreaterThan(100);
    expect(pixels.variance).toBeGreaterThan(40);
  }
});

test("renders sectors forty through forty-three's orbiting planets", async ({ page }) => {
  for (const sector of [40, 41, 42, 43]) {
    await page.goto("/?debug=1&unlimited=0");
    await page.getByRole("button", { name: "SECTORS" }).click();
    await page.getByRole("button", { name: new RegExp(`SECTOR ${sector}`) }).click();

    await expect(page.locator("#level-tag")).toHaveText(`SECTOR ${sector}`);
    const pixels = await page.locator("#game").evaluate((element: HTMLCanvasElement) => {
      const ctx = element.getContext("2d");
      if (!ctx) {
        return { goal: 0, planet: 0 };
      }
      const data = ctx.getImageData(0, 0, element.width, element.height).data;
      let goal = 0;
      let planet = 0;
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        if (green > 160 && green > red * 1.35 && green > blue * 1.15) {
          goal += 1;
        }
        if (red > 70 && green > 28 && blue < green && red > green && red - blue > 18) {
          planet += 1;
        }
      }
      return { goal, planet };
    });

    expect(pixels.goal).toBeGreaterThan(100);
    expect(pixels.planet).toBeGreaterThan(100);
  }
});

test("renders sectors twenty-eight through thirty's dynamic regions", async ({ page }) => {
  for (const sector of [28, 29, 30]) {
    await page.goto("/?debug=1&unlimited=0");
    await page.getByRole("button", { name: "SECTORS" }).click();
    await page.getByRole("button", { name: new RegExp(`SECTOR ${sector}`) }).click();

    await expect(page.locator("#level-tag")).toHaveText(`SECTOR ${sector}`);
    const pixels = await page.locator("#game").evaluate((element: HTMLCanvasElement) => {
      const ctx = element.getContext("2d");
      if (!ctx) {
        return { goal: 0, hazard: 0, dust: 0 };
      }
      const data = ctx.getImageData(0, 0, element.width, element.height).data;
      let goal = 0;
      let hazard = 0;
      let dust = 0;
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        if (green > 160 && green > red * 1.35 && green > blue * 1.15) {
          goal += 1;
        }
        if (red > 150 && red > green * 1.3 && red > blue * 1.15) {
          hazard += 1;
        }
        if (red > 80 && green > 80 && blue > 80 && Math.max(red, green, blue) - Math.min(red, green, blue) < 35) {
          dust += 1;
        }
      }
      return { goal, hazard, dust };
    });

    expect(pixels.goal).toBeGreaterThan(100);
    expect(pixels.hazard).toBeGreaterThan(100);
    expect(pixels.dust).toBeGreaterThan(100);
  }
});

const fs = require("fs");
const timeout = 30000;
const filename = "cookies.json";

let page;
beforeAll(async () => {
  jest.setTimeout(timeout);

  page = await global.__BROWSER__.newPage();

  let cookies = readCookieFile();

  if (cookies === undefined) {
    await page.goto("https://eksisozluk.com/giris");

    await page.waitForSelector("#username");
    await page.type("#username", "username");

    await page.waitForSelector("#password");
    await page.type("#password", "password");

    await page.$eval("#login-form-container form", form => form.submit());

    await page.waitForSelector(".messages", { visible: true, timeout: 0 });

    cookies = await page.cookies();
    let cookieData = JSON.stringify(cookies);

    fs.writeFileSync(filename, cookieData);
  } else {
    await page.setCookie(...cookies);
  }
});

describe("Login Test", () => {
  test(
    "Home page title",
    async () => {
      await page.goto("https://eksisozluk.com", {
        waitUntil: "domcontentloaded"
      });

      const expectedTitle = "ekşi sözlük - kutsal bilgi kaynağı";
      const title = await page.title();
      expect(title).toBe(expectedTitle);
    },
    timeout
  );
});

function readCookieFile() {
  try {
    let fileContent = fs.readFileSync(filename, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return undefined;
  }
}

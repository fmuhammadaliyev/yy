const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 3000;

app.use(express.json());

const arr = [
  { id: 1, name: "salom" },
  { id: 1, name: "salom" },
  { id: 1, name: "salom" },
  { id: 1, name: "salom" },
];

app.post("/url", (req, res) => {
  init(req.body.url).then((result) => {
    res.send(result);
  });
});

async function init(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto(url);
  await page.waitForSelector("h1");
  const h1 = await page.$eval("h1", (el) => el.innerText);
  return h1;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

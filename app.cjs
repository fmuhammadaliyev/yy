const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/url", (req, res) => {
  init(req.body.html).then((result) => {
    res.send(result);
  });
});

async function init(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle2",
  });

  return await page.pdf({
    format: "A4",
  });

  // Navigate the page to a URL.
  await page.goto(url);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

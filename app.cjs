const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/url", async (req, res) => {
  const { html, css } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const finalHTML = `
    <html>
      <head>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  await page.setContent(finalHTML, { waitUntil: "networkidle2" });

  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
});

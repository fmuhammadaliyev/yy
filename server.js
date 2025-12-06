import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import helmet from "helmet";
import { URL } from "url";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

function validateUrl(input) {
  try {
    const u = new URL(input);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

app.post("/screenshot", async (req, res) => {
  const { url } = req.body ?? {};

  if (!url || typeof url !== "string" || !validateUrl(url)) {
    return res.status(400).json({ error: "Invalid or missing URL." });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    await page.waitForTimeout(500);

    const imageBuffer = await page.screenshot({ fullPage: true, type: "png" });

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="screenshot.png"`,
      "Cache-Control": "no-store",
    });
    res.send(imageBuffer);
  } catch (err) {
    console.error("Screenshot error:", err);
    res.status(500).json({
      error: "Failed to take screenshot.",
      details: String(err.message),
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Screenshot server running on port ${PORT}`)
);

#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const label = process.argv[3] || '';

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  console.error('Example: node screenshot.mjs http://localhost:3000');
  console.error('Example: node screenshot.mjs http://localhost:3000 homepage');
  process.exit(1);
}

const screenshotDir = './temporary screenshots';

// Ensure directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Find next available number
function getNextNumber() {
  const files = fs.readdirSync(screenshotDir);
  const numbers = files
    .filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
    .map(f => {
      const match = f.match(/screenshot-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

const num = getNextNumber();
const filename = label
  ? `screenshot-${num}-${label}.png`
  : `screenshot-${num}.png`;
const filepath = path.join(screenshotDir, filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved: ${filepath}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

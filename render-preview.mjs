#!/usr/bin/env node
// Render templates/default.html with sample data to preview.html.
// Used for local visual verification. Not committed.
// Swap jsDelivr image URLs for local /assets/ paths so the preview
// works without pushing to GitHub.

import fs from 'fs';

const template = fs.readFileSync('templates/default.html', 'utf8');

// Edit this object to preview different scenarios.
const sample = {
  user: {
    full_name: 'Jerry Gennaria',
    job_title: 'President & CEO',
    phone: '314.496.4294',
    email: 'jerry@toky.com',
    credentials: '', // set to "B.C.Sc." to preview with credentials
    calendly_url: 'https://calendly.com/gennaria/', // clear to preview without the calendly line
  },
};

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ctx = {
  user: Object.fromEntries(Object.entries(sample.user).map(([k, v]) => [k, esc(v)])),
};

let html = template.replace(/<!--[\s\S]*?-->/g, '');

html = html.replace(/\{\{#if\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, body) => {
  const v = path.split('.').reduce((o, k) => (o ? o[k] : undefined), ctx);
  return v ? body : '';
});

html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
  const v = path.split('.').reduce((o, k) => (o ? o[k] : undefined), ctx);
  return v == null ? '' : String(v);
});

// Rewrite jsDelivr URLs to local asset paths for preview
html = html.replace(
  /https:\/\/cdn\.jsdelivr\.net\/gh\/jerrygennaria\/email-signatures@main\//g,
  '/'
);

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TOKY Signature Preview</title>
  <style>
    body { margin: 0; padding: 40px; background: #fff; font-family: Helvetica, Arial, sans-serif; }
    .meta { color: #999; font-size: 12px; margin-bottom: 32px; }
    .sig-container { padding: 24px; border: 1px dashed #e0e0e0; display: inline-block; }
  </style>
</head>
<body>
  <div class="meta">TOKY Signature Preview · sample data: Jerry Gennaria, with Calendly, no credentials</div>
  <div class="sig-container">
    ${html}
  </div>
</body>
</html>
`;

fs.writeFileSync('preview.html', page);
console.log('Wrote preview.html');
console.log('Rendered signature bytes:', html.length);

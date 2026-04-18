# email-signatures — Agent Guide

## Purpose

Generate HTML email signatures for the TOKY team from Airtable employee data. Replaces esig.ly. Delivered via two n8n workflows:

- **One-off**: an Airtable button on an Employees record hits a webhook that renders and emails that person's signature.
- **Bulk**: a manual n8n run that regenerates and emails every active employee.

Designed around a single HTML template with placeholders. Company-wide content (top CTA, logo, tagline, address, social links) is hardcoded in the template. Per-person content comes from Airtable.

This is the MVP. A web-app version is planned later — the template syntax, Airtable schema, and jsDelivr asset hosting carry forward to it. Design mockups for the future app live in `design-assets/` and are not used by the MVP.

## Related systems

- **Airtable base**: TOKY-OS (base ID and table IDs in the local `CLAUDE.md`, which is gitignored)
- **Airtable table**: Employees
- **n8n workflows**: `email-signature-generate-one` (webhook) and `email-signature-generate-all` (manual). n8n host URL is in the local `CLAUDE.md`.
- **GitHub repo**: `github.com/jerrygennaria/email-signatures` (public)
- **jsDelivr URL pattern**: `https://cdn.jsdelivr.net/gh/jerrygennaria/email-signatures@main/<path>`
- **Delivery from address**: internal TOKY automation account (see local `CLAUDE.md`)

## Repo layout

```
CLAUDE.md           one-liner: @AGENTS.md
AGENTS.md           this file
README.md           human-facing docs
templates/
  default.html      the single signature template
assets/             images served via jsDelivr
context-assets/     brand guidelines, esig.ly reference screenshots (not deployed)
design-assets/      future web app mockups (not used by MVP)
```

## Template syntax

A Handlebars-compatible subset (also valid in Liquid/Jinja):

- Variable: `{{ user.full_name }}`
- Conditional: `{{#if user.calendly_url}} ... {{/if}}`

Template variables are documented in the top-of-file comment in `templates/default.html`. If you add a variable, add it to that comment, then update the Airtable field mapping in the n8n workflow's Code node.

Renderer lives in the n8n Code node (not in this repo). It handles only these two constructs and HTML-escapes variable values.

## Cross-client constraints

The template must render in: Gmail web, Gmail iOS/Android, Apple Mail macOS/iOS, Outlook web, Outlook desktop Windows. Rules:

- **Only inline styles.** `<style>` blocks are stripped by Gmail.
- **Table-based layout.** No flexbox, no grid.
- **Explicit `width` and `height` attributes on every `<img>` and on spacer cells.** CSS width on images alone is unreliable in Outlook.
- **Spacer rows** (`<tr><td style="height:15px;font-size:0;line-height:0;">&nbsp;</td></tr>`) not `margin` / `padding-top`.
- **Short hex colors** (`#666` not `#666666`) — byte savings, no compatibility cost.
- **Character budget**: target under 6 KB rendered. Gmail's signature limit is 10,000 characters.

Before changing the template structure, consider why the defensive patterns are there. What looks like bloat is often keeping a client from breaking.

## Airtable fields used by the template

On the Employees table:

| Field | Used for |
|---|---|
| `Common Name` or `First Name` + `Last Name` | `user.full_name` |
| `Job Title` | `user.job_title` |
| `Email` | `user.email` + delivery destination |
| `Cell Phone` | `user.phone` |
| `Credentials` (added by this project) | `user.credentials` (optional) |
| `Calendly URL` (added by this project) | `user.calendly_url` (optional) |
| `Generate Signature` button (added by this project) | Triggers the one-off webhook |
| `Status` | Filter to `Active` for bulk runs |

## Adding a new social icon

1. Drop a 48×48 PNG into `assets/` named `social-<platform>.png`.
2. Edit `templates/default.html` — copy an existing `<td>` block in the socials table and update `href`, `src`, `alt`.
3. Commit, push. jsDelivr picks up the new file within ~12 hours (or force-purge via `https://purge.jsdelivr.net/gh/...`).
4. Trigger a bulk regenerate from n8n.

## Asset dimensions

- Logo: 98×23 display, 195×46 intrinsic (2x for retina). Source: `context-assets/TokyPrimary_Black.png`, resized with `sips --resampleHeight 46`.
- Social icons: 24×24 display, 48×48 intrinsic (2x for retina).

## How to work on this project

- Template changes: edit `templates/default.html`, commit, push. n8n fetches the raw file at runtime (via jsDelivr). No redeploy step.
- Asset changes: drop file into `assets/`, commit, push.
- Renderer changes: edit the Code node in the n8n workflow(s). Workflow JSON is backed up to `~/projects/n8n-backups/workflows/signatures/` by Jerry's existing backup automation.
- Airtable schema changes: use the Airtable MCP tools, or edit the base directly. Update the field table above when fields change.

## Local preview and verification

To visually check template changes before committing:

```bash
npm install           # first run only, installs puppeteer
node render-preview.mjs   # writes preview.html
node serve.mjs            # serves project root at http://localhost:3000
# open http://localhost:3000/preview.html in a browser
node screenshot.mjs http://localhost:3000/preview.html my-label   # optional screenshot
```

`preview.html` is gitignored. Edit the sample data at the top of `render-preview.mjs` to test different scenarios (with/without credentials, with/without Calendly). The preview rewrites jsDelivr URLs to local `/assets/` paths so it works without pushing.

Before claiming work is done, verify the signature renders correctly in at least Gmail web and Apple Mail. Paste it into a test Gmail signature and send to yourself.

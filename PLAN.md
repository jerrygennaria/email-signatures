# email-signatures — Current State and Runbook

This doc is the up-to-date picture of what's built, how it works, and how to make changes going forward. Complements [AGENTS.md](AGENTS.md) (agent guidance) and [README.md](README.md) (intro + install instructions).

## Status: shipping

The system is live and in use for the TOKY team. Jerry uses it as his primary signature source.

- **One-off**: Airtable button on an Employees record → n8n webhook → email with signature to that person.
- **Bulk**: Manual trigger in n8n → email every Active employee their current signature.
- Both workflows send from `automation@toky.com`.

## Architecture

```
┌───────────────────────┐  button click  ┌─────────────────────┐
│ Airtable              │───────────────▶│ n8n workflow A      │
│  Employees table      │                │ email-signature-    │
│  (buttons, data)      │◀───fetch data──│ generate-one        │
└───────────────────────┘                │                     │
         ▲                                │ 1. Fetch employee   │
         │ List Active                    │ 2. Fetch template   │
         │                                │ 3. Render + send    │
┌─────────────────────┐   manual run     │ 4. Respond to       │
│ n8n workflow B      │                   │    browser          │
│ email-signature-    │──────────────────▶└──────────┬──────────┘
│ generate-all        │                              │
└─────────────────────┘                              ▼
                                           ┌──────────────────┐
                                           │ automation@toky  │
                                           │ sends email to   │
                                           │ employee         │
                                           └──────────────────┘

        ┌──────────────────────────────┐
        │ github.com/jerrygennaria/    │
        │   email-signatures           │  Template + assets fetched
        │                              │  by n8n via GitHub raw and
        │  templates/default.html      │  jsDelivr CDN respectively.
        │  assets/*.png                │
        └──────────────────────────────┘
```

## Components

### GitHub repo

**`github.com/jerrygennaria/email-signatures`** — public.

Contains:

- `templates/default.html` — the HTML signature template with `{{ user.xxx }}` placeholders and `{{#if }}` conditionals.
- `assets/` — gray TOKY logo (`toky-logo.png`) and five social icons (`linkedin.png`, `instagram.png`, `facebook.png`, `vimeo.png`, `youtube.png`). Source `.ai` file is gitignored.
- `CLAUDE.md` — gitignored. Local-only Claude context including n8n host, Airtable IDs, etc.
- `AGENTS.md` — public. Generic agent guidance that references the local CLAUDE.md for specifics.
- `docs/n8n-workflows.md` — public. Step-by-step setup guide with the full renderer JS in case the workflows need to be rebuilt from scratch.
- `render-preview.mjs` / `serve.mjs` / `screenshot.mjs` — local preview tooling.

### Airtable

**Base**: TOKY-OS (ID in local `CLAUDE.md`). **Table**: Employees.

Fields added for this project:
- **Calendry URL** (URL, optional) — renders the "Schedule a meeting" line when set.
- **Credentials** (single line text, optional) — appears after name, e.g., "Jerry Gennaria, B.C.Sc."
- **Generate Signature** (button) — Open URL action that hits the n8n webhook with `record_id` query param. Appears on every row.

### n8n workflows

#### A) `email-signature-generate-one` (active)

Webhook → Airtable Get → Code (render) → Gmail send → Respond Success (with success page + "Open signature in new window" button).

- **Trigger path**: `/webhook/email-signature-generate`
- **Production URL**: `https://toky.app.n8n.cloud/webhook/email-signature-generate?record_id=<RECORD_ID>`
- **Gmail credential**: `Automation@toky.com` (id `lo8uA7VfKAFvgawJ`)
- **Error branches**: any failure on Get Employee, Render Signature, or Send Email routes to a shared "Respond Error" node that returns an HTML 500 page.

The success page embeds the rendered signature inside a `<template>` tag (not visually rendered) and has a button that reads it via JS, wraps it in minimal HTML, creates a Blob URL, and opens it in a new 640×640 window. That window is Cmd+A / Cmd+C friendly, which is the clean copy path for Gmail's signature editor.

#### B) `email-signature-generate-all` (inactive by default)

Manual Trigger → Airtable Search (filter `AND({Status} = 'Active', {Email} != '')`) → Code (render, one per item) → Gmail send per item.

- **Trigger**: click "Execute Workflow" in the n8n UI
- **Gmail credential**: same as A
- **Batch behavior**: Code node runs once per employee (`mode: runOnceForEachItem`). Gmail node has `onError: continueRegularOutput` so a single bad record doesn't halt the whole run.

Both workflows share the same renderer logic. Any change to rendering has to be applied to both.

### Template renderer (lives inside each n8n Code node)

Small in-node JS:

1. Fetches `templates/default.html` from **a commit-pinned raw.githubusercontent.com URL** (not @main).
2. Strips HTML comments.
3. Substitutes `{{ path.to.value }}` variables and evaluates `{{#if path }}…{{/if}}` conditionals.
4. HTML-escapes every variable value.
5. Collapses whitespace between tags.
6. Wraps the signature in an email body with install instructions (A) or just uses the signature directly (B).

The commit-pin in the template URL is the key trick that made rendering reliable — see "Known constraints" below.

## Data flow (one-off)

1. User in Airtable clicks "Generate Signature" on an Employees row.
2. Browser opens `https://toky.app.n8n.cloud/webhook/email-signature-generate?record_id=recXXX`.
3. Webhook fires. Node gets `$json.query.record_id = "recXXX"`.
4. Airtable node fetches that record via the Airtable Personal Access Token credential.
5. Code node fetches `templates/default.html` at pinned commit SHA from GitHub raw.
6. Code node builds the `user` object (with display-name preference for Common Name, phone formatting, etc.), renders the template, and constructs an email body with install instructions.
7. Gmail node sends the email from `automation@toky.com` to the employee's Email address.
8. Respond Success returns an HTML page with a button to open the signature in a new window for direct copy-paste.

## How to make changes

### Change the template (layout, wording, colors)

1. Edit `templates/default.html` locally.
2. Preview: `node render-preview.mjs && node serve.mjs`, open `http://localhost:3000/preview.html`.
3. `git add templates/default.html && git commit && git push`.
4. **Update the commit-pinned URL in both workflows' Code nodes.** Grab the new SHA with `git rev-parse --short HEAD`. In each workflow's Render Signature node, replace the existing SHA in the `templateUrl` with the new one. Can be done via n8n UI or MCP (`n8n_update_partial_workflow` with a `patchNodeField` op).

### Add or replace a social icon

1. Drop the new PNG into `assets/`, named `<platform>.png` (48×48, displayed at 24×24).
2. Edit `templates/default.html` — copy an existing social icon `<td>` block, update `href`, `src`, `alt`.
3. Commit + push.
4. Update the asset commit-pin in the template if it was pinned. Current social icons are pinned to commit `d6acf2a`.
5. Update workflow template-pin SHA (same as the template change flow).

### Replace the logo

1. Save the new PNG at `assets/toky-logo.png` (display size ~100×24; export at 2× for retina: ~200×48).
2. Commit + push.
3. Update workflow template-pin SHA.
4. If the image is cached at Gmail's image proxy, add a `?v=N` to the logo URL in the template (bump N) to force Gmail to re-fetch.

### Change the "from" address

1. Create or identify the target Gmail OAuth2 credential in n8n (must be a real Google Workspace user you can sign into).
2. Update the Gmail node's credential reference in both workflows.

### Add or modify an employee field rendered in the signature

1. Add the field in Airtable.
2. Update the template to reference it (`{{ user.<field_name> }}` or a conditional).
3. Update the renderer in **both** n8n Code nodes to populate the corresponding `user` object key from the Airtable field. The renderer currently maps `fields['Common Name']`, `fields['First Name']`, `fields['Last Name']`, `fields['Job Title']`, `fields['Cell Phone']`, `fields['Email']`, `fields['Credentials']`, `fields['Calendly URL']`.
4. Commit template changes + update workflow SHA.

### Trigger a bulk regenerate

1. Open workflow B in n8n.
2. Click **Execute Workflow**.
3. Every active employee gets a new email with the current template + their current data.

For a dry run against just one person, temporarily change the Airtable filter to `{Email} = '<your-email>'`, execute, verify, restore the filter.

## Known constraints and gotchas

### jsDelivr's `@main` branch cache is unreliable

jsDelivr caches the main branch → commit mapping separately from file content. Even after a successful `purge` API call, the branch-resolved URL (`@main/…`) sometimes keeps serving old content for an extended window.

**Fix we applied**: pin URLs to commit SHAs (`@<sha>/…`). Fresh commit = fresh cache entry. This is why the template URL in the n8n Code nodes uses a specific commit SHA, not `@main`.

### GitHub raw has its own Fastly cache

`raw.githubusercontent.com` caches for 5 minutes via Fastly, and query-string cache-busting is inconsistent.

**Fix we applied**: same — use commit-pinned URLs on GitHub raw too. Path includes the SHA, so there's no branch-cache layer to go stale.

### Gmail proxies and caches images

Gmail fetches images once and caches them indefinitely at `ci3.googleusercontent.com`. Updates at the source URL do not invalidate that cache.

**Fix**: when changing an image that's already in Gmail's cache, add or bump a `?v=N` query param on the image URL in the template. The logo currently uses `?v=2`.

### Superhuman dark mode desaturates mid-luminance, balanced-RGB colors

TOKY Dk Purple `#9E0085` and related variants get grayed out in Superhuman's Carbon theme. Red `#be1900` (heavily R-dominant) survives the transformation cleanly. We tested several purples; none worked. Reverted to red.

### Airtable API can't create button fields

The Generate Signature button was created manually in the Airtable UI and can only be modified there. Everything else (Calendly URL, Credentials) was added via the Airtable MCP.

### `$helpers` is not available in n8n Cloud Code nodes

Use `this.helpers.httpRequest(…)` instead.

### The Airtable `id` parameter on Get is a plain string, not a resource locator

Don't wrap it in `{__rl, value, mode}` — that breaks the lookup silently (returns 0 items). The n8n-mcp validator has a false-positive suggestion to use resource locator format for this field; ignore it.

## What's out of scope (intentionally)

- **Web app UI** — the `design-assets/` mockups show a future web-app version. Not built. Current workflow is fine at TOKY's scale (~20 employees).
- **Multiple templates** — one template, no selection mechanism. Fine for now.
- **Character-budget UI** — rendered signature comes in around 4 KB, well under Gmail's 10 KB ceiling. No need for a budget monitor.
- **Gmail API direct-install** — requires Workspace admin delegation. The copy-paste flow works well enough that the complexity isn't justified.
- **Automated asset update scripts** — could automate "push + patch n8n with new SHA" but not worth it until template changes are more frequent.

## Open items (known improvements, low priority)

- **Sync workflow B with workflow A's install instructions.** A was patched with the clearer install steps; B still has slightly older text since its emails are just the signature + instructions. Verify before next bulk run.
- **Remove unused logo source files.** `assets/toky-email-signature-logo-200.png` and `-400.png` are kept as reference backups alongside the deployed `toky-logo.png`. Small (~8 KB combined) but technically dead.
- **Try the brand purple again** if Superhuman changes its dark-mode algorithm, or move the accent to something not susceptible to desaturation.

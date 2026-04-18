# TOKY Email Signatures

HTML email signatures for the TOKY team, generated from Airtable employee data by n8n.

## What this is

A replacement for esig.ly. One template, rendered with per-person data from the Airtable Employees table, emailed to each person to paste into their Gmail signature.

Two ways to trigger it:

- **One employee at a time**: click the "Generate Signature" button on the employee's row in Airtable. They get an email with their signature a few seconds later.
- **Everyone at once**: manually run the `email-signature-generate-all` workflow in n8n. Every active employee gets an email with their updated signature.

## How to edit

**To change the template** (e.g., update the podcast CTA, change the tagline, tweak spacing):

1. Open `templates/default.html` in VS Code.
2. Make the edit. Company-wide content (top CTA, logo, company name, tagline, address, social links) is hardcoded in the template. Per-person content is in `{{ user.xxx }}` placeholders.
3. Commit and push. jsDelivr will serve the new version within ~12 hours, or force-purge via `https://purge.jsdelivr.net/gh/jerrygennaria/email-signatures@main/templates/default.html`.
4. Run the bulk regenerate in n8n to email everyone the new version.

**To add a social icon**:

1. Drop a 48×48 PNG into `assets/` named `social-<platform>.png`.
2. Copy an existing `<td>` block in the socials table in `templates/default.html`, update `href`, `src`, `alt`.
3. Commit, push, regenerate.

**To replace the logo**:

1. Resize source image: `sips --resampleHeight 46 <source> --out assets/toky-logo.png`.
2. Update `width` attribute in template if aspect ratio changed.
3. Commit, push, regenerate.

## Install a signature in Gmail

When an employee receives their signature email:

1. Open the email in Gmail on desktop (not mobile — mobile Gmail doesn't let you paste rich signatures).
2. Click anywhere in the signature block in the email body.
3. Press Cmd+A (or Ctrl+A on Windows) to select it all.
4. Cmd+C / Ctrl+C to copy.
5. Go to Gmail → Settings (gear) → See all settings → General → Signature.
6. Create a new signature (or edit the existing one), paste, save.
7. Scroll to the bottom and click Save Changes.

## Constraints

- **Gmail signature size limit**: 10,000 characters. This template lands well under that.
- **Cross-client**: designed to render in Gmail web, Gmail mobile (iOS/Android), Apple Mail, Outlook web, and Outlook desktop. If something looks wrong in Outlook, that's usually the culprit — check the test matrix in `AGENTS.md`.
- **Images**: hosted in this repo, served via jsDelivr CDN. If you rename or remove an image, signatures in the wild will show broken images.

## See also

- `AGENTS.md` — technical detail for AI agents working in this repo
- `context-assets/brand-guidelines.md` — TOKY color palette and typography
- `design-assets/` — mockups for the future web-app version (not built yet)

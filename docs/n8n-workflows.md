# n8n workflow setup

Two workflows. Both use the same render + send logic; only the trigger differs.

- **A) `email-signature-generate-one`** — webhook, triggered by the Airtable "Generate Signature" button on an Employees record.
- **B) `email-signature-generate-all`** — manual trigger, iterates over all Active employees.

Both are authored in the n8n UI (or via the n8n MCP at claude.ai) and backed up to `~/projects/n8n-backups/workflows/signatures/`.

---

## Shared: the renderer

This is the JS that lives in the Code node of both workflows. It fetches the template from jsDelivr, substitutes variables, and outputs rendered HTML.

```javascript
// Code node (JavaScript) — "Render signature"
// Input: one Airtable record per item
// Output: adds {renderedHtml, subject, to} to the item's json

const templateUrl = "https://cdn.jsdelivr.net/gh/jerrygennaria/email-signatures@main/templates/default.html";

// Fetch once per workflow run, cache across items.
let template = $getWorkflowStaticData("global").template;
let fetchedAt = $getWorkflowStaticData("global").fetchedAt || 0;
const TTL = 60 * 1000; // 60s cache per run

if (!template || Date.now() - fetchedAt > TTL) {
  const res = await this.helpers.httpRequest({
    method: "GET",
    url: templateUrl,
    returnFullResponse: false,
  });
  template = typeof res === "string" ? res : res.body || "";
  $getWorkflowStaticData("global").template = template;
  $getWorkflowStaticData("global").fetchedAt = Date.now();
}

// Build the normalized user object from the Airtable fields.
const fields = $input.item.json.fields || $input.item.json;
const fullName =
  (fields["Common Name"] && fields["Common Name"].trim()) ||
  [fields["First Name"], fields["Last Name"]].filter(Boolean).join(" ").trim();

const user = {
  full_name: fullName,
  job_title: fields["Job Title"] || "",
  phone: fields["Cell Phone"] || "",
  email: fields["Email"] || "",
  credentials: fields["Credentials"] || "",
  calendly_url: fields["Calendly URL"] || "",
};

// Escape HTML in user-provided values.
const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ctx = {
  user: Object.fromEntries(Object.entries(user).map(([k, v]) => [k, esc(v)])),
};

// Strip HTML comments (saves bytes, the template has instructional comments).
let html = template.replace(/<!--[\s\S]*?-->/g, "");

// Conditionals: {{#if path}} ... {{/if}}
html = html.replace(/\{\{#if\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, body) => {
  const v = path.split(".").reduce((o, k) => (o ? o[k] : undefined), ctx);
  return v ? body : "";
});

// Variables: {{ path }}
html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
  const v = path.split(".").reduce((o, k) => (o ? o[k] : undefined), ctx);
  return v == null ? "" : String(v);
});

// Collapse whitespace between tags for a slightly leaner output.
html = html.replace(/>\s+</g, "><").trim();

return {
  json: {
    ...$input.item.json,
    user,
    renderedHtml: html,
    to: user.email,
    subject: "Your updated TOKY email signature",
  },
};
```

---

## Workflow A: `email-signature-generate-one`

### Nodes

1. **Webhook** (trigger)
   - HTTP Method: `GET`
   - Path: `email-signature/generate`
   - Response Mode: "Using 'Respond to Webhook' node"
   - Full URL (to use in Airtable button): `https://<your-n8n-host>/webhook/email-signature/generate?record_id={RECORD_ID()}`

2. **Airtable — Get record**
   - Resource: Record
   - Operation: Get
   - Base: TOKY-OS (base ID in local `CLAUDE.md`)
   - Table: Employees (table ID in local `CLAUDE.md`)
   - Record ID: `={{ $json.query.record_id }}`

3. **Code — "Render signature"**
   - Paste the renderer code above.

4. **Gmail (or SMTP) — Send email**
   - To Email: `={{ $json.to }}`
   - From: TOKY automation account (see local `CLAUDE.md`; must be authorized in the connected Gmail credential)
   - Subject: `={{ $json.subject }}`
   - Email Format: HTML
   - Message: (see "Email body template" below)

5. **Respond to Webhook**
   - Response Code: 200
   - Content-Type: `text/html; charset=utf-8`
   - Response Body:

     ```html
     <!doctype html>
     <html><body style="font-family:Helvetica,Arial,sans-serif;padding:40px;color:#333;">
       <h2>Signature sent.</h2>
       <p>Check the inbox at <strong>{{ $('Code — "Render signature"').item.json.to }}</strong> for your updated TOKY signature and install instructions.</p>
       <p>You can close this tab.</p>
     </body></html>
     ```

### Error handling

- If the Airtable record is missing or missing `Email`: Respond to Webhook with a 400 and a "Record not found or missing email" message. Don't attempt to send.
- If Gmail send fails: return 500 with the error.

---

## Workflow B: `email-signature-generate-all`

### Nodes

1. **Manual Trigger**
   - When executing this node: clicks "Execute workflow" in the n8n UI.

2. **Airtable — List records**
   - Resource: Record
   - Operation: Search
   - Base: TOKY-OS (base ID in local `CLAUDE.md`)
   - Table: Employees (table ID in local `CLAUDE.md`)
   - Filter By Formula: `AND({Status} = 'Active', {Email} != '')`
   - Return All: true

3. **Split In Batches** (optional)
   - Batch Size: 5 (if concerned about Gmail rate limits; skip if not)

4. **Code — "Render signature"**
   - Same code as in workflow A.

5. **Gmail — Send email**
   - Same as workflow A.

6. **Aggregate** (Merge / Summarize)
   - Collect all items and count successes/failures.

7. **Gmail — Send summary to Jerry**
   - To: `jerry@toky.com`
   - Subject: `Signature regeneration complete — N of N delivered`
   - Body: short summary listing any failures with their employee name and error.

---

## Email body template (Gmail/SMTP node "Message" field)

Use this expression (n8n expression syntax):

```
={{ `
<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#333;">
  Your updated TOKY email signature is below. To install:
</p>
<ol style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#333;">
  <li>Open this email in <strong>Gmail on desktop</strong> (not mobile).</li>
  <li>Click anywhere in the signature block below, then press <strong>Cmd+A</strong> (or Ctrl+A on Windows) to select all.</li>
  <li>Press <strong>Cmd+C</strong> / Ctrl+C to copy.</li>
  <li>Go to <strong>Gmail → Settings (gear) → See all settings → General → Signature</strong>. Paste into your signature. Save.</li>
</ol>
<hr style="border:0;border-top:1px solid #ddd;margin:24px 0;"/>
${ $json.renderedHtml }
` }}
```

---

## Airtable button setup

On the Employees table, add a Button field named `Generate Signature`:

- Label: `Generate Signature`
- Style: Red / brand
- Action: **Open URL**
- URL formula:

  ```
  "https://<your-n8n-host>/webhook/email-signature/generate?record_id=" & RECORD_ID()
  ```

(Replace `<your-n8n-host>` with the base URL of your n8n instance.)

Clicking the button opens a new tab pointed at the webhook. n8n renders and sends the email, then returns the confirmation page from the Respond to Webhook node.

---

## Testing

1. **Template fetch**: manually run a Code node snippet that fetches the jsDelivr URL. Confirm 200 and the template body comes back. If 404, the repo isn't public or the commit isn't on main yet.
2. **One-off**: click the button on your own employee record. Confirm the confirmation page renders and your email arrives within 10 seconds.
3. **Conditional fields**: clear `Calendly URL` on your record, regenerate. Confirm the "Schedule a meeting" line is absent.
4. **Bulk**: run workflow B. Confirm the summary email matches the Active employee count.
5. **Cross-client**: paste the signature into Gmail → Settings → Signature. Send a test email to a colleague. Have them open in Apple Mail / Outlook / wherever. Check for broken rendering. Iterate on the template if needed.

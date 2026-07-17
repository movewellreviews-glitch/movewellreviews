# MoveWell Reviews — Deployment Guide

This is a **static** Astro site. `npm run build` produces a plain folder of
HTML/CSS/JS in `dist/` that you can upload to Hostinger (or any host). No Node
server or database runs in production.

There are three one-time setup steps, then a repeatable build-and-upload flow.

---

## ✅ Before you launch — fill in the placeholders

Open **`src/consts.js`** and replace every `[PLACEHOLDER]`:

| Field (in `LEGAL`) | What to put |
|---|---|
| `entity` | Your legal business name or LLC (e.g. `MoveWell Media LLC`) |
| `addressLine1` / `addressLine2` | A real mailing address (required for US privacy/CAN-SPAM compliance) |
| `governingState` | The US state whose law governs your Terms (e.g. `California`) |
| `privacyEmail` / `legalEmail` | Working inboxes (or point them at your main email) |
| `sharesDataForAds` | Leave `false` unless you run behavioral/interest-based ads |

Also review:
- `SITE.contactEmail` — your public contact address.
- `FORMS.newsletterEndpoint` / `FORMS.contactEndpoint` — see **Step 2** below.
- The **Example** products in `src/content/products/` are demo entries. Replace
  them with your own real, tested reviews and **real affiliate links** before
  launch. Each one has `> Template entry.` at the top of its body as a reminder.
- Your **Amazon Associate tag** and affiliate links live in each product's
  `affiliateUrl`. Never publish `YOUR_ASSOCIATE_TAG` placeholders.

> ⚖️ The legal pages (Privacy, Terms, Affiliate Disclosure, Editorial Policy,
> Disclaimer, Accessibility, Do Not Sell) are thorough templates, **not legal
> advice**. Have an attorney review them for your situation before launch.

---

## Step 1 — Push the code to GitHub

From the project folder (`C:\Users\hoangle\New folder`):

```bash
# 1. Create a repo on github.com (e.g. "movewellreviews"), then:
git remote add origin https://github.com/YOUR_USERNAME/movewellreviews.git
git branch -M main
git push -u origin main
```

If a remote already exists, just `git push`.

> A `git commit` with all of today's work has already been made for you — you
> only need to add the remote and push.

---

## Step 2 — Wire up the forms (Formspree, free)

The newsletter and contact form submit to [Formspree](https://formspree.io) so
they work on static hosting.

1. Sign up at formspree.io (free tier is fine).
2. Create **two** forms: one "Newsletter", one "Contact".
3. Copy each form's endpoint (looks like `https://formspree.io/f/abcdwxyz`).
4. Paste them into `src/consts.js` → `FORMS.newsletterEndpoint` and
   `FORMS.contactEndpoint`.
5. Rebuild (Step 3). Until you do this, the forms show a config message instead
   of submitting.

---

## Step 3 — Build the site

```bash
npm install      # first time only
npm run build
```

This creates the **`dist/`** folder. Everything you upload lives inside it.

Preview it locally first if you like:

```bash
npm run preview
```

---

## Step 4 — Upload to Hostinger

You have two options. **Option A (manual upload)** is simplest and matches the
"static site on shared hosting" plan.

### Option A — hPanel File Manager (manual)

1. Log in to Hostinger → **hPanel** → **Files → File Manager**.
2. Open the **`public_html`** folder of your domain.
3. Delete any default `index.html` / placeholder files already there.
4. On your computer, open the **`dist`** folder, select **everything inside it**
   (not the `dist` folder itself), and zip it → `site.zip`.
5. In File Manager, **Upload** `site.zip` into `public_html`, then **Extract**
   it there.
6. Confirm `public_html/index.html` now exists (plus `about/`, `best/`,
   `reviews/`, etc.). Visit your domain — you're live.

Repeat steps 3–6 each time you rebuild. (Delete old files first so removed pages
don't linger.)

### Option B — Git auto-deploy (optional, if your plan supports it)

Hostinger Business/Cloud plans have **hPanel → Advanced → GIT**. You can connect
your GitHub repo, but Hostinger will **not** run `npm run build` for you on
shared hosting — it just pulls files. So you'd need to commit the built `dist/`
folder, which we intentionally `.gitignore`. For most users, **Option A is the
recommended path.** If you want true CI/CD, build with a GitHub Action and deploy
`dist/` via FTP/SSH to `public_html`.

---

## Step 5 — Domain, HTTPS, and redirects

- **Domain:** point `movewellreviews.com` to your Hostinger hosting (hPanel →
  Domains). If the domain is registered elsewhere, update its nameservers or
  A-record to Hostinger.
- **HTTPS:** hPanel → **Security → SSL** → install the free SSL certificate, then
  enable **Force HTTPS**.
- **www → non-www (or vice-versa):** set your preferred version in hPanel and let
  Hostinger handle the redirect.
- The site's `site:` URL is set to `https://movewellreviews.com` in
  `astro.config.mjs`. If your final domain differs, change it there and rebuild
  so the sitemap and canonical URLs are correct.

---

## Content editing after launch

Add or edit reviews and posts by creating/editing Markdown files in:

- `src/content/products/` — one file per product review.
- `src/content/blog/` — one file per article.

Set `published: true` (products) or `draft: false` (posts) to make them live,
then `npm run build` and re-upload `dist/`.

> The `/admin` Decap CMS is included but requires a GitHub OAuth backend to work
> on Hostinger (it was originally set up for Netlify). Editing the Markdown files
> directly is the simplest workflow; wire up the CMS later if you want it.

---

## Quick reference

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Local dev (hot reload) | `npm run dev` → http://localhost:4321 |
| Build for production | `npm run build` → `dist/` |
| Preview the build | `npm run preview` |

**Launch checklist:** placeholders filled · Formspree endpoints set · example
products replaced with real reviews · real affiliate links · legal pages
reviewed · SSL + Force HTTPS on.

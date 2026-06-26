# Deploying berkshireenergy.info

This is the real site (Next.js). The goal: host it and point the
`berkshireenergy.info` domain at it, so that **every push to `main` goes live
automatically** — including changes made from Claude Code.

> Status: the repo builds cleanly (`npm run build` ✓) and is ready to deploy.
> The footer change ("…associated with ONYX SOLUTIONS LLC") is already on `main`.

---

## One-time setup (you do this once)

### 1. Create a Vercel account
- Go to [vercel.com](https://vercel.com) → **Sign Up**.
- Sign up with the **GitHub account that owns `rewbiz05-lab/berkshire-energy`**
  (so Vercel can see this repo). Free "Hobby" plan is enough.

### 2. Import this repo
- Vercel dashboard → **Add New… → Project**.
- Find **`rewbiz05-lab/berkshire-energy`** → **Import**.
- Framework preset auto-detects **Next.js** — leave build settings at default.
- **Production Branch** = `main` (default).

### 3. (Optional) Add environment variables
Only needed so the quote form / support chat email you. See `.env.example`.
In the import screen (or later under **Settings → Environment Variables**) add:

| Name | Value | Environments |
|------|-------|--------------|
| `RESEND_API_KEY` | your Resend key | Production, Preview, Development |
| `LEAD_EMAIL` | `afrancis@berkshireenergy.info` | Production, Preview, Development |
| `LEAD_FROM` | `Berkshire Energy <you@berkshireenergy.info>` | Production, Preview, Development |

Skip this and the site still works — forms just won't send email yet.

### 4. Deploy
- Click **Deploy**. In ~1–2 min you get a live `*.vercel.app` URL. Open it and
  confirm the footer line shows at the bottom.

### 5. Point the domain at Vercel
- Vercel → Project → **Settings → Domains** → add `berkshireenergy.info` and
  `www.berkshireenergy.info`. Vercel shows the exact DNS records to set.
- Set those records **wherever berkshireenergy.info's DNS lives**. Based on the
  account email, the domain is likely managed through **Squarespace** (the old
  trial) or **Google** — log in there, open the domain's DNS settings, and:
  - Apex `@` → **A** record `76.76.21.21`
  - `www` → **CNAME** `cname.vercel-dns.com`
  - Remove any existing parked-page / forwarding records that conflict.
  - If Squarespace is still "serving" the site, disconnect/unpublish it there so
    it stops answering for the domain.
- Vercel auto-issues SSL once it sees the records (minutes, up to 48h for DNS).

---

## After setup — the part you wanted

From then on, changes flow from one place:
1. You tell Claude Code what to change.
2. It edits the code and pushes to `main`.
3. Vercel rebuilds and publishes automatically. No Squarespace, no manual steps.

## Run it locally (optional)
```bash
npm install
cp .env.example .env.local   # fill in keys if you want email to work
npm run dev                  # http://localhost:3000
```

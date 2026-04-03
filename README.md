# Casualty's Field Guide — Ranch Roleplay

An interactive medical RP reference for the State of Monroe.

## Deploy to Vercel (easiest)

1. Push this entire folder to a **new GitHub repo**
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → select your repo → click **Deploy**
4. Done. Vercel auto-detects Vite and builds it.

### Custom domain (optional)
In your Vercel project → Settings → Domains → add `guide.ranchroleplay.com` (or whatever). Then add a CNAME record at your domain registrar pointing to `cname.vercel-dns.com`.

## Run locally (optional)

Requires [Node.js](https://nodejs.org) installed.

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Update the guide

Edit `src/App.jsx` — that's the entire app in one file. Push to GitHub and Vercel auto-deploys.

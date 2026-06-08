# Equity Solutions Network — equitysolutionsnetwork.com

Node.js + Express site. Static HTML served from `/public`. Contact form POSTs to `/contact` and delivers via nodemailer.

## Deploy to Railway

1. Push this repo to GitHub
2. In Railway → New Project → Deploy from GitHub repo
3. Railway auto-detects Node.js and runs `npm start`
4. Add environment variables (see `.env.example`):
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
5. In Railway Settings → Domains → Add custom domain: `equitysolutionsnetwork.com`
6. Update DNS: CNAME `www` → your-railway-app.up.railway.app

## Local dev

```bash
npm install
node server.js
# → http://localhost:3000
```

## Add headshot

Replace the placeholder in `public/index.html`:

Find: `<div class="about-photo-placeholder">`
Replace with: `<img src="/images/headshot.jpg" alt="[Your name]" class="about-photo" />`

Then add your photo to `public/images/headshot.jpg`.

## Update pricing

Search for `Placeholder` or `starting from` in `index.html` and update when rates are finalized.

## Contact form

Goes to `info@equitysolutionsnetwork.com` via nodemailer.
For Gmail: use an App Password (not your main password).
Google account → Security → 2FA → App passwords → generate one.

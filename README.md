# Voltix Electrical Website

Premium dark-themed marketing site for Voltix Electrical — energy infrastructure for estates, developers, and commercial clients.

## Pages

- `index.html` — Home (hero, solutions, solar, BOT model, CTA)
- `estate-solutions.html` — Communal solar, backup power, EV revenue, savings
- `services.html` — Solar, EV, maintenance, inverters & monitoring (tabbed)
- `contact.html` — Company profile, inquiry form, WhatsApp, proposal download

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Customize

- Contact email: `voltixelectrical_ptyltd@outlook.com`
- Contact form: [Web3Forms](https://web3forms.com) (recommended) — create a free access key for `voltixelectrical_ptyltd@outlook.com`, then in Vercel add environment variable `WEB3FORMS_ACCESS_KEY` and redeploy. Optional fallback: `RESEND_API_KEY` from [Resend](https://resend.com) for `/api/inquiry`.
- Proposal PDF: place source file at `assets/Voltix-Estate-Proposal-Source.pdf`, then run `python scripts/build_proposal_pdf.py` to regenerate `assets/Voltix-Proposal.pdf` (includes contact page)
- Swap Unsplash image URLs for your own WebP assets in `assets/images/`

## Stack

Vanilla HTML5, CSS3, and JavaScript — no build step required.

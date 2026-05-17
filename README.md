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

- Update phone, email, and WhatsApp links (`27821234567` placeholder)
- Proposal PDF: place source file at `assets/Voltix-Estate-Proposal-Source.pdf`, then run `python scripts/build_proposal_pdf.py` to regenerate `assets/Voltix-Proposal.pdf` (includes contact page)
- Swap Unsplash image URLs for your own WebP assets in `assets/images/`

## Stack

Vanilla HTML5, CSS3, and JavaScript — no build step required.

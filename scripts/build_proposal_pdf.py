"""Merge estate proposal PDF with a branded contact page."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "Voltix-Estate-Proposal-Source.pdf"
OUTPUT = ROOT / "assets" / "Voltix-Proposal.pdf"

CONTACT_LINES = [
    ("Phone / WhatsApp", "+27 60 595 6583"),
    ("Email", "voltrixelectrical@protonmail.com"),
    ("Location", "Johannesburg, Gauteng, South Africa"),
    ("Office Hours", "Monday – Friday, 08:00 – 17:00"),
    ("Registration", "Reg. No. 2026/382209"),
]


def make_contact_page() -> BytesIO:
    buffer = BytesIO()
    width, height = A4
    gold = HexColor("#D4AF37")
    white = HexColor("#F5F5F5")
    muted = HexColor("#9A9A9A")

    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.setFillColor(HexColor("#0F0F0F"))
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    y = height - 100
    pdf.setFillColor(gold)
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawCentredString(width / 2, y, "VOLTIX ELECTRICAL")

    y -= 26
    pdf.setFillColor(muted)
    pdf.setFont("Helvetica", 11)
    pdf.drawCentredString(
        width / 2,
        y,
        "Premium Energy Infrastructure for Estates & Commercial Clients",
    )

    y -= 52
    pdf.setFillColor(gold)
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawCentredString(width / 2, y, "CONTACT US")

    y -= 36
    for label, value in CONTACT_LINES:
        pdf.setFillColor(muted)
        pdf.setFont("Helvetica", 9)
        pdf.drawCentredString(width / 2, y, label.upper())
        y -= 16
        pdf.setFillColor(white)
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawCentredString(width / 2, y, value)
        y -= 28

    y -= 8
    pdf.setFillColor(gold)
    pdf.setFont("Helvetica", 10)
    pdf.drawCentredString(width / 2, y, "voltrixelectrical@protonmail.com  |  +27 60 595 6583")

    pdf.setStrokeColor(gold)
    pdf.setLineWidth(0.8)
    pdf.line(72, 56, width - 72, 56)

    pdf.save()
    buffer.seek(0)
    return buffer


def build() -> None:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"Source proposal not found: {SOURCE}")

    reader = PdfReader(str(SOURCE))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    contact_reader = PdfReader(make_contact_page())
    writer.add_page(contact_reader.pages[0])

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("wb") as handle:
        writer.write(handle)

    print(f"Built {OUTPUT} ({len(writer.pages)} pages, {OUTPUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    build()

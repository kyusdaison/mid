from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import datetime
from pathlib import Path

from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
DESIGN_DIR = ROOT / "workbench"
DESIGN_VERSIONS_DIR = DESIGN_DIR / "versions"
PDF_DIR = ROOT / "exports" / "pdf"
PDF_VERSIONS_DIR = PDF_DIR / "versions"
MANIFEST_PATH = DESIGN_VERSIONS_DIR / "manifest.jsonl"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "design"


def next_version_number() -> int:
    existing = []
    if DESIGN_VERSIONS_DIR.exists():
        for path in DESIGN_VERSIONS_DIR.glob("mid-card-*-v*.html"):
            match = re.search(r"-v(\d+)\.html$", path.name)
            if match:
                existing.append(int(match.group(1)))
    return max(existing, default=0) + 1


def render_png_to_pdf(source_png: Path, output_pdf: Path) -> None:
    page_width = 16 * 72
    page_height = 9 * 72

    image = ImageReader(str(source_png))
    image_width, image_height = image.getSize()

    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    pdf = canvas.Canvas(str(output_pdf), pagesize=(page_width, page_height))
    pdf.setTitle("Montserrat Digital Identity Card")
    pdf.setAuthor("Codex")
    pdf.setSubject("Versioned MID card design snapshot")
    pdf.setCreator("reportlab")

    scale = min(page_width / image_width, page_height / image_height)
    draw_width = image_width * scale
    draw_height = image_height * scale
    x = (page_width - draw_width) / 2
    y = (page_height - draw_height) / 2

    pdf.drawImage(
        image,
        x,
        y,
        width=draw_width,
        height=draw_height,
        preserveAspectRatio=True,
        mask="auto",
    )
    pdf.showPage()
    pdf.save()


def main() -> None:
    parser = argparse.ArgumentParser(description="Archive a versioned MID card design snapshot.")
    parser.add_argument("--label", required=True, help="Human-friendly version label, e.g. state-issued")
    parser.add_argument(
        "--html",
        default=str(DESIGN_DIR / "reference-source.html"),
        help="Source HTML file to archive",
    )
    parser.add_argument(
        "--preview",
        default=str(DESIGN_DIR / "state-identity-preview.png"),
        help="Source preview PNG to archive",
    )
    parser.add_argument(
        "--note",
        default="",
        help="Optional short note about what changed in this version",
    )
    args = parser.parse_args()

    label = slugify(args.label)
    html_path = Path(args.html)
    preview_path = Path(args.preview)

    if not html_path.exists():
        raise FileNotFoundError(f"HTML source not found: {html_path}")
    if not preview_path.exists():
        raise FileNotFoundError(f"Preview source not found: {preview_path}")

    DESIGN_VERSIONS_DIR.mkdir(parents=True, exist_ok=True)
    PDF_VERSIONS_DIR.mkdir(parents=True, exist_ok=True)

    version_number = next_version_number()
    version_tag = f"v{version_number:03d}"
    base_name = f"mid-card-{label}-{version_tag}"

    archived_html = DESIGN_VERSIONS_DIR / f"{base_name}.html"
    archived_preview = DESIGN_VERSIONS_DIR / f"{base_name}-preview.png"
    archived_note = DESIGN_VERSIONS_DIR / f"{base_name}.txt"
    archived_pdf = PDF_VERSIONS_DIR / f"{base_name}.pdf"

    shutil.copy2(html_path, archived_html)
    shutil.copy2(preview_path, archived_preview)
    render_png_to_pdf(archived_preview, archived_pdf)

    created_at = datetime.now().astimezone().isoformat(timespec="seconds")
    note_lines = [
        f"Version: {version_tag}",
        f"Label: {label}",
        f"Created: {created_at}",
        f"HTML Source: {html_path}",
        f"Preview Source: {preview_path}",
        f"Archived HTML: {archived_html}",
        f"Archived Preview: {archived_preview}",
        f"Archived PDF: {archived_pdf}",
    ]
    if args.note:
        note_lines.append(f"Notes: {args.note}")
    archived_note.write_text("\n".join(note_lines) + "\n", encoding="utf-8")

    manifest_record = {
        "version": version_tag,
        "label": label,
        "created_at": created_at,
        "html": str(archived_html),
        "preview": str(archived_preview),
        "pdf": str(archived_pdf),
        "note": args.note,
    }
    with MANIFEST_PATH.open("a", encoding="utf-8") as manifest_file:
        manifest_file.write(json.dumps(manifest_record, ensure_ascii=True) + "\n")

    print(json.dumps(manifest_record, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()

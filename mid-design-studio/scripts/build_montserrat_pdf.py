from pathlib import Path

from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "workbench" / "preview.png"
OUTPUT = ROOT / "exports" / "pdf" / "montserrat-digital-identity-card-clean.pdf"
LATEST_OUTPUT = ROOT / "exports" / "pdf" / "montserrat-digital-identity-card-latest.pdf"

# Match the intended 16:9 presentation page from the concept board.
PAGE_WIDTH = 16 * 72
PAGE_HEIGHT = 9 * 72


def write_pdf(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)

    image = ImageReader(str(SOURCE))
    image_width, image_height = image.getSize()

    pdf = canvas.Canvas(str(output), pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    pdf.setTitle("Montserrat Digital Identity Card")
    pdf.setAuthor("Codex")
    pdf.setSubject("Latest MID card design exported for presentation and review")
    pdf.setCreator("reportlab")

    scale = min(PAGE_WIDTH / image_width, PAGE_HEIGHT / image_height)
    draw_width = image_width * scale
    draw_height = image_height * scale
    x = (PAGE_WIDTH - draw_width) / 2
    y = (PAGE_HEIGHT - draw_height) / 2

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
    write_pdf(OUTPUT)
    write_pdf(LATEST_OUTPUT)


if __name__ == "__main__":
    main()

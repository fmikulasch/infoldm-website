#!/usr/bin/env python3
"""Render one PDF page to WebP using Ghostscript and Pillow.

Dependencies: brew install ghostscript; python3 -m pip install Pillow
Example: python3 scripts/pdf_to_webp.py figure.pdf figure.webp --dpi 200
"""

import argparse
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Source PDF")
    parser.add_argument("output", type=Path, nargs="?", help="Output WebP; defaults to the PDF name with .webp")
    parser.add_argument("--page", type=int, default=1, help="Page number, starting at 1 (default: 1)")
    parser.add_argument("--dpi", type=int, default=150, help="Rendering resolution (default: 150)")
    parser.add_argument("--quality", type=int, default=94, help="WebP quality from 0 to 100 (default: 94)")
    args = parser.parse_args()

    if not args.input.is_file():
        parser.error(f"PDF not found: {args.input}")
    if args.page < 1 or args.dpi < 1 or not 0 <= args.quality <= 100:
        parser.error("Page and DPI must be positive; quality must be between 0 and 100.")
    ghostscript = shutil.which("gs")
    if not ghostscript:
        parser.error("Ghostscript is required. On macOS: brew install ghostscript")

    output = args.output or args.input.with_suffix(".webp")
    if output.resolve() == args.input.resolve():
        parser.error("Output must differ from the source PDF.")

    with tempfile.TemporaryDirectory(prefix="pdf-to-webp-") as directory:
        rendered = Path(directory) / "page.png"
        subprocess.run([
            ghostscript, "-q", "-dSAFER", "-dBATCH", "-dNOPAUSE",
            "-sDEVICE=png16m", "-dTextAlphaBits=4", "-dGraphicsAlphaBits=4",
            f"-r{args.dpi}", f"-dFirstPage={args.page}", f"-dLastPage={args.page}",
            f"-sOutputFile={rendered}", "-f", str(args.input.resolve()),
        ], check=True)
        if not rendered.is_file():
            parser.error(f"Page {args.page} did not render. Check the PDF's page count.")
        output.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(rendered) as image:
            image.save(output, "WEBP", quality=args.quality, method=6)
            print(f"Saved {output} ({image.width} × {image.height} pixels)")


if __name__ == "__main__":
    main()

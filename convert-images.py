
from pathlib import Path
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

folder = Path("public/images")

for file in folder.iterdir():
    if file.is_file() and file.suffix.lower() in (".heic", ".heif"):
        try:
            with Image.open(file) as img:
                output = file.with_suffix(".jpg")

                # Convert to RGB for JPEG compatibility
                if img.mode not in ("RGB", "L"):
                    img = img.convert("RGB")
                elif img.mode == "L":
                    img = img.convert("RGB")

                img.save(output, "JPEG", quality=90, optimize=True)

            print(f"Converted: {file.name} -> {output.name}")

        except Exception as error:
            print(f"FAILED: {file.name}: {error}")

print("Conversion complete!")

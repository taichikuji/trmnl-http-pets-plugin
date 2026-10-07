"""Measure the image catalogue and print a JavaScript tone table to copy into TRMNL."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import json
from pathlib import Path
import re
import sys
from urllib.request import urlopen

from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
TRANSFORM = ROOT / "TRMNL/src/transform.js"
START = "// BEGIN GENERATED IMAGE TONES"
END = "// END GENERATED IMAGE TONES"


def photo_region(image, pet):
    # ponytail: known meme layouts, review these crops if a provider changes its format.
    boxes = {(750, 600): (80, 55, 670, 440), (600, 750): (64, 68, 536, 550)} if pet == "httpcats" else {
        (1000, 875): (40, 55, 960, 655)
    }
    if image.size not in boxes:
        raise ValueError(f"unrecognised layout {image.size}; review the photo crop")
    return image.crop(boxes[image.size]).convert("RGB").resize((96, 64), Image.Resampling.BOX)


def image_tone(photo):
    # Display-referred luma (0..1), rather than a physical illumination measurement.
    grey = photo.convert("L", (0.2126, 0.7152, 0.0722, 0))
    levels = sorted(grey.tobytes())
    mean = ImageStat.Stat(grey).mean[0] / 255
    spread = (levels[int(len(levels) * 0.9)] - levels[int(len(levels) * 0.1)]) / 255
    # ponytail: conservative global heuristic; subject-aware exposure needs a different model.
    brightness = 1 if 0.45 <= mean <= 0.60 else max(0.85, min(1.25, 1 + 0.5 * (0.52 - mean) / max(mean, 0.01)))
    contrast = 1 if 0.45 <= spread <= 0.75 else max(0.95, min(1.05, 1 + 0.5 * (0.60 - spread)))
    histogram = [sum(counts) for counts in zip(*(channel.histogram() for channel in photo.split()))]

    def clipped(b, c):
        # Same order as the CSS: brightness, then contrast, with channel clamping.
        return sum(count for x, count in enumerate(histogram) if 0 < x < 255 and (
                   ((min(255, x * b) / 255 - 0.5) * c + 0.5) >= 1 or
                   ((min(255, x * b) / 255 - 0.5) * c + 0.5) <= 0))

    # Limit additional fully black/white channel samples to two percentage points.
    budget = 0.02 * sum(histogram)
    brightness, contrast = round(brightness, 2), round(contrast, 2)
    while clipped(brightness, contrast) > budget:
        brightness = round(brightness + (0.01 if brightness < 1 else -0.01 if brightness > 1 else 0), 2)
        contrast = round(contrast + (0.01 if contrast < 1 else -0.01 if contrast > 1 else 0), 2)
    return [brightness, contrast]


def check():
    """Check exposure direction, crop isolation and clipping without downloading."""
    assert image_tone(Image.new("RGB", (96, 64), (50, 50, 50)))[0] > 1
    assert image_tone(Image.new("RGB", (96, 64), (220, 220, 220)))[0] < 1
    assert image_tone(Image.new("RGB", (96, 64), (133, 133, 133)))[0] == 1

    for pet, size, box in (("fish", (1000, 875), (40, 55, 960, 655)),
                           ("httpcats", (750, 600), (80, 55, 670, 440)),
                           ("httpcats", (600, 750), (64, 68, 536, 550))):
        meme = Image.new("RGB", size, "black")
        meme.paste((220, 220, 220), box)
        photo = photo_region(meme, pet)
        assert photo.getextrema() == ((220, 220),) * 3
        assert image_tone(photo)[0] < 1
    try:
        photo_region(Image.new("RGB", (100, 100)), "fish")
        raise AssertionError("Unknown layouts must not silently use the wrong crop")
    except ValueError:
        pass

    photo = Image.new("RGB", (96, 64), (50, 50, 50))
    photo.paste((245, 245, 245), (0, 0, 24, 64))
    brightness, contrast = image_tone(photo)
    newly_clipped = sum(1 for x in photo.tobytes() if 0 < x < 255 and (
        ((min(255, x * brightness) / 255 - 0.5) * contrast + 0.5) >= 1 or
        ((min(255, x * brightness) / 255 - 0.5) * contrast + 0.5) <= 0))
    assert newly_clipped <= 0.02 * photo.width * photo.height * 3
    print("Tone checks passed: dark, bright, neutral, frames, unknown layouts, highlight clipping")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="re-download cached images")
    parser.add_argument("--check", action="store_true", help="run offline self-checks instead of calibrating")
    args = parser.parse_args()
    if args.check:
        check()
        return
    source = TRANSFORM.read_bytes().decode()
    pets = re.findall(r"^\s*(\w+):\s*\{[^\n]*baseUrl: '([^']+)'", source, re.M)
    codes = sorted(set(map(int, re.findall(r'\[(\d+), "', source))))
    if not pets or not codes:
        raise SystemExit("Could not read PET_CONFIGS / STATUSES")
    cache = ROOT / "tmp/tone-images"
    cache.mkdir(parents=True, exist_ok=True)

    def measure(item):
        pet, url, code = item
        path = cache / f"{pet}-{code}.jpg"
        try:
            if args.refresh or not path.exists():
                with urlopen(f"{url}{code}.jpg", timeout=10) as response:
                    data = response.read(4_000_001)
                    if len(data) > 4_000_000:
                        raise ValueError("image exceeds 4 MB")
                # Decode before caching so errors never leave invalid cache entries.
                with Image.open(BytesIO(data)) as image:
                    tone = image_tone(photo_region(image, pet))
                path.write_bytes(data)
            else:
                with Image.open(path) as image:
                    tone = image_tone(photo_region(image, pet))
            return pet, code, tone
        except Exception as error:
            print(f"{pet}/{code}: {error}; neutral fallback", file=sys.stderr)
            return pet, code, None

    tones = {pet: {} for pet, _ in pets}
    jobs = [(pet, url, code) for pet, url in pets for code in codes]
    with ThreadPoolExecutor(max_workers=4) as pool:
        for pet, code, tone in pool.map(measure, jobs):
            if tone is not None:
                tones[pet][str(code)] = tone
    rows = [f"  {pet}: {json.dumps(values, separators=(',', ':'))}" for pet, values in tones.items()]
    generated = "\n".join([START, "const IMAGE_TONES = {", ",\n".join(rows), "};", END])
    measured = sum(map(len, tones.values()))
    if measured == 0:
        raise SystemExit("No images measured; no table generated")
    print(generated)
    print(f"Measured {measured}/{len(jobs)} images; {len(jobs) - measured} neutral fallbacks", file=sys.stderr)


if __name__ == "__main__":
    main()

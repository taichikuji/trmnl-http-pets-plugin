# Image tone calibration

`calibrate-images.py` downloads the image catalogue and prints a JavaScript
brightness/contrast table to copy into `TRMNL/src/transform.js`. It only reads
that file for the sources and status codes; it never edits it.
Requires Python 3 and Pillow 9.1+ (`python3 -m pip install Pillow`).

Run from the repository root:

```sh
python3 scripts/calibrate-images.py
python3 scripts/calibrate-images.py --refresh  # re-download changed photos
python3 scripts/calibrate-images.py --check    # offline self-checks
```

Copy the output and replace the entire `BEGIN GENERATED IMAGE TONES` /
`END GENERATED IMAGE TONES` block in the transform, including its markers.
The table goes to stdout; warnings and the measurement summary go to stderr.
Images are cached in the ignored `tmp/tone-images/` directory; failed measurements
use neutral values at runtime.

- `photo_region()` crops out the frame and caption, then samples at 96x64 pixels.
- `image_tone()` measures mean luma and p90-p10 spread. It limits brightness to
  0.85-1.25, contrast to 0.95-1.05, and newly clipped sampled RGB channels to 2%.
- `check()` verifies dark, bright and neutral photos, crops and clipping offline.
- `main()` reads the sources/codes from the transform, downloads and measures
  images, then prints the generated table for manual copy/paste.

At runtime, `transform.js` selects the measured pair and `shared.liquid` applies
it to the pet photo. Serverless needs no downloads or image libraries. Review
the crops if a provider changes its layout, and tune `image_tone()` using your
TRMNL screen: this is a conservative global adjustment, not subject detection.

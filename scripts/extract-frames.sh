#!/usr/bin/env bash
set -e

# Configuration: REVERSE=true to extract in reverse order, false for forward
REVERSE=true

# Video input resolution (supports source/video.mp4, with fallback to public/videos/ShowIndustry.mp4)
INPUT="source/video.mp4"
if [ ! -f "$INPUT" ]; then
  if [ -f "public/videos/ShowIndustry.mp4" ]; then
    INPUT="public/videos/ShowIndustry.mp4"
  else
    echo "Error: Video input not found at source/video.mp4 or public/videos/ShowIndustry.mp4" >&2
    exit 1
  fi
fi

OUTPUT_DIR="public/images/frames-1"
TEMP_DIR="public/images/frames-temp"

# Ensure output directory exists and is cleared of old frames
mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DIR"/*.webp "$OUTPUT_DIR"/*.jpg

# Clean any leftover temp directory
rm -rf "$TEMP_DIR"

# Check webp support in ffmpeg
CODEC="libwebp"
EXT="webp"
QUALITY_FLAG="-quality 75"
if ! ffmpeg -encoders 2>/dev/null | grep -q libwebp; then
  echo "Warning: libwebp encoder not found in ffmpeg. Falling back to mjpeg (-q:v 4)." >&2
  CODEC="mjpeg"
  EXT="jpg"
  QUALITY_FLAG="-q:v 4"
fi

if [ "$REVERSE" = "true" ]; then
  echo "Extracting frames in REVERSE order from $INPUT..."
  # Try reverse filter directly (fps and scale MUST precede reverse)
  FILTER="fps=7,scale=1280:-2,reverse"
  if ! ffmpeg -y -i "$INPUT" -an -vf "$FILTER" -c:v "$CODEC" $QUALITY_FLAG "$OUTPUT_DIR/%04d.$EXT"; then
    echo "Direct reverse failed or crashed. Falling back to forward extraction + reverse rename..."
    rm -f "$OUTPUT_DIR"/*.webp "$OUTPUT_DIR"/*.jpg
    mkdir -p "$TEMP_DIR"
    ffmpeg -y -i "$INPUT" -an -vf "fps=7,scale=1280:-2" -c:v "$CODEC" $QUALITY_FLAG "$TEMP_DIR/%04d.$EXT"
    
    # Count total frames in temp folder
    TOTAL=$(ls -1 "$TEMP_DIR"/*."$EXT" 2>/dev/null | wc -l | tr -d ' ')
    echo "Total forward frames extracted: $TOTAL. Renaming in reverse order..."
    
    IDX=1
    for FILE in "$TEMP_DIR"/*."$EXT"; do
      REV_IDX=$((TOTAL + 1 - IDX))
      NEW_NAME=$(printf "%04d.%s" "$REV_IDX" "$EXT")
      cp "$FILE" "$OUTPUT_DIR/$NEW_NAME"
      IDX=$((IDX + 1))
    done
    
    rm -rf "$TEMP_DIR"
  fi
else
  echo "Extracting frames in FORWARD order from $INPUT..."
  FILTER="fps=7,scale=1280:-2"
  ffmpeg -y -i "$INPUT" -an -vf "$FILTER" -c:v "$CODEC" $QUALITY_FLAG "$OUTPUT_DIR/%04d.$EXT"
fi

# Ensure temp directory cleanup
rm -rf "$TEMP_DIR"

TOTAL_EXTRACTED=$(ls -1 "$OUTPUT_DIR"/*."$EXT" 2>/dev/null | wc -l | tr -d ' ')
echo "Extraction complete! Total frames in $OUTPUT_DIR: $TOTAL_EXTRACTED"

#!/bin/bash
ZIP="$1"
AREA=$(ogrinfo -ro -so -q "$ZIP" | awk '{print $2}' | head -n1)
rm -f "${AREA}.json"
ogr2ogr -f GeoJSON -t_srs crs:84 "${AREA}.json" "$ZIP" "$AREA" && \
mapshaper -i "${AREA}.json" -simplify 10% keep-shapes -o "${AREA}_simplified.json" && \
node area_converter.js < "${AREA}_simplified.json"

#!/bin/bash
set -e
files=$(git status --porcelain | awk '{print $2}')
for file in $files; do
  echo "Processing $file"
  git add "$file"
  filename=$(basename "$file")
  git commit -m "Update $filename"
  git push
done
echo "All done!"

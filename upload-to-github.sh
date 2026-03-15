#!/bin/bash
# ============================================
# Push MID project to GitHub
# The repo kyusdaison/mid already exists!
# Just run: bash upload-to-github.sh
# ============================================

set -e

echo "Pushing MID project to GitHub..."

# Clean up any old .git directory
if [ -d ".git" ]; then
    rm -rf .git
fi

# Initialize fresh
git init
git checkout -b main

# Add all files (excluding system files)
git add -A

# Commit
git commit -m "Add MID project files - website, card designs, and assets"

# Add remote and force push (to overwrite the README-only commit)
git remote add origin https://github.com/kyusdaison/mid.git
git push -u origin main --force

echo ""
echo "Done! View your repo at: https://github.com/kyusdaison/mid"

#!/bin/bash

# Exit on error, unset variables, and pipefail
set -euo pipefail

# Backup branch (optional safety net)
echo "🛡️ Creating backup branch..."
git branch -D cleanup-backup 2>/dev/null || true
git checkout -b cleanup-backup
git checkout -

# Install required tools
echo "📦 Installing tools..."
pnpm add -D ts-prune eslint-plugin-unused-imports > /dev/null 2>&1

# 1. Find and clean unused exports
echo "🔍 Finding unused exports..."
npx ts-prune | grep -v 'used in module' | awk '{print $1}' | sort -u > unused-exports.txt

if [ -s unused-exports.txt ]; then
    echo "🧹 Cleaning unused exports..."
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            # Safely remove export lines (keeping implementation)
            sed -i.bak '/^export [^=]*$/d' "$file" 2>/dev/null || true
            [ -f "$file.bak" ] && rm -f "$file.bak"
            echo "➖ Cleaned exports in: $file"
        fi
    done < unused-exports.txt
else
    echo "✅ No unused exports found"
fi

# 2. Find potentially unused files (optimized for Next.js app dir)
echo "🔍 Finding potentially unused files..."
{
    # Get all TS/JS files in app directory
    find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \)
    # Get all components
    find components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null || true
    # Get all lib files
    find lib -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null || true
} | sort > all-files.txt

# Get imported files (sorted)
git grep -l "import" | sort > imported-files.txt

# Compare to find unused files
comm -23 <(sort all-files.txt) <(sort imported-files.txt) > unused-files.txt

if [ -s unused-files.txt ]; then
    echo "🧨 Found potentially unused files:"
    cat unused-files.txt
    read -p "Delete these files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xargs rm -v < unused-files.txt
    fi
else
    echo "✅ No unused files found"
fi

# 3. Clean unused imports
echo "🧹 Cleaning unused imports..."
npx eslint --fix --rule 'unused-imports/no-unused-imports: error' . > /dev/null 2>&1 || true

# Cleanup
rm -f unused-exports.txt unused-files.txt all-files.txt imported-files.txt
echo "🔥 Deep cleanup complete! Verify with 'git status' and 'pnpm build'"
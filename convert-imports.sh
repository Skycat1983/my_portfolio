#!/bin/bash

# Script to convert relative imports to @ alias imports
echo "Converting relative imports to @ alias..."

# Find all TypeScript and TSX files in src directory
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    echo "Processing: $file"
    
    # Replace relative imports with @ alias
    # Pattern: "../../../../ -> "@/
    sed -i '' 's|from ["'\'']\.\./\.\./\.\./\.\./|from "@/|g' "$file"
    sed -i '' 's|import ["'\'']\.\./\.\./\.\./\.\./|import "@/|g' "$file"
    
    # Pattern: "../../../ -> "@/
    sed -i '' 's|from ["'\'']\.\./\.\./\.\./|from "@/|g' "$file"
    sed -i '' 's|import ["'\'']\.\./\.\./\.\./|import "@/|g' "$file"
    
    # Pattern: "../../ -> "@/
    sed -i '' 's|from ["'\'']\.\./\.\./|from "@/|g' "$file"
    sed -i '' 's|import ["'\'']\.\./\.\./|import "@/|g' "$file"
done

echo "✅ Conversion complete!"
echo "🔍 Checking for any remaining relative imports..."

# Check for any remaining relative imports that go up multiple directories
echo ""
echo "Remaining multi-directory imports:"
grep -r "from [\"']\.\.\/\.\." src/ --include="*.ts" --include="*.tsx" | head -10

echo ""
echo "Note: Same-directory imports (./filename) are preserved as they should be." 
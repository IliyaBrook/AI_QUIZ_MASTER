#!/bin/bash

echo 'Starting language installation...'

apk add --no-cache git curl

echo 'Cloning Piston CLI...'
git clone https://github.com/engineer-man/piston.git /tmp/piston-cli
cd /tmp/piston-cli/cli
npm install

PISTON_URL="http://piston:2000"

LANGUAGES=(
  "node"
  "typescript"
  "javascript"
)

echo "Installing programming languages..."

for lang in "${LANGUAGES[@]}"; do
  echo "Installing $lang..."
  if node index.js -u "$PISTON_URL" ppman install "$lang"; then
    echo "$lang installed successfully"
  else
    echo "$lang install failed"
  fi
done

echo 'Cleaning up...'
rm -rf /tmp/piston-cli

echo 'Language installation process completed!'

echo 'Available runtimes check:'
if command -v curl >/dev/null 2>&1; then
  curl -s "$PISTON_URL/api/v2/runtimes" | head -20 || echo 'Could not fetch runtime list'
fi 
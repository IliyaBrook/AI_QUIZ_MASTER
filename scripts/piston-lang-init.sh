#!/bin/bash

echo "Installing required packages..."
apt-get update && apt-get install -y wget curl git

echo "Starting Piston server..."
node src/index.js &
PISTON_PID=$!

echo "Waiting for Piston to be ready..."
until curl -f http://localhost:2000/api/v2/runtimes >/dev/null 2>&1; do
  echo "Waiting for Piston API..."
  sleep 5
done

echo "Piston is ready! Installing Node.js for CLI..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "Getting list of available packages..."
curl -s http://localhost:2000/api/v2/packages | head -20

echo "Installing core languages..."
LANGUAGES=("node" "typescript" "python" "java" "gcc" "mono" "go" "rust" "php" "ruby")

for lang in "${LANGUAGES[@]}"; do
  echo "Checking $lang..."
  if curl -s http://localhost:2000/api/v2/runtimes | grep -q "$lang"; then
    echo "$lang already installed, skipping..."
  else
    echo "Installing $lang..."
    curl -X POST http://localhost:2000/api/v2/packages \
      -H 'Content-Type: application/json' \
      -d "{\"language\":\"$lang\"}" && \
    echo "$lang installed successfully"
  fi
done

echo "Final runtime check..."
curl -s http://localhost:2000/api/v2/runtimes | \
  grep -o '"language":"[^"]*"' | \
  sed 's/"language":"\([^"]*\)"/Available runtime: \1/'

echo "Language installation completed! Piston is running with all languages."
wait $PISTON_PID 
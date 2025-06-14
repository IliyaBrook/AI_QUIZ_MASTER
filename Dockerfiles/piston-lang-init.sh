#!/bin/bash

LANGUAGES=("node" "typescript" "python" "java" "cpp" "csharp" "go" "rust" "php" "ruby")

echo 'Starting Piston server...'
node src/index.js &
PISTON_PID=$!

echo 'Waiting for Piston to be ready...'
until curl -f http://localhost:2000/api/v2/runtimes >/dev/null 2>&1; do
  echo 'Waiting for Piston API...'
  sleep 5
done

echo 'Piston is ready! Installing Node.js for CLI...'
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - 
apt-get install -y nodejs

echo 'Cloning Piston CLI...'
git clone https://github.com/engineer-man/piston.git /tmp/piston-cli
cd /tmp/piston-cli/cli
npm install

echo 'Getting list of installed packages...'
INSTALLED_PACKAGES=$(node index.js ppman list --url http://localhost:2000 2>/dev/null || echo '')

echo 'Installing core languages...'
for language in "${LANGUAGES[@]}"; do
  echo "Checking $language..."
  if echo "$INSTALLED_PACKAGES" | grep -q "$language"; then
    echo "$language already installed, skipping..."
  else
    echo "Installing $language..."
    (node index.js ppman install "$language" --url http://localhost:2000 || echo "$language install failed")
  fi
done

rm -rf /tmp/piston-cli
echo 'Language installation completed! Piston is running with all languages.'

wait $PISTON_PID 
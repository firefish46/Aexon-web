#!/usr/bin/env bash
# Pull the latest code, rebuild and restart. Run on the server from the project folder.
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
npm ci
npm run build
pm2 reload ecosystem.config.cjs --update-env
echo "Deployed $(git rev-parse --short HEAD)"

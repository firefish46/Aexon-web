#!/usr/bin/env bash
# Pull the latest code, rebuild and restart. Run from the project folder,
# as root (WHM Terminal) or as the cPanel user.
set -euo pipefail
cd "$(dirname "$0")/.."

# Who owns the folder (the cPanel account). Root's build creates root-owned
# files, so they are handed back to this account at the end.
OWNER=$(stat -c '%U' .)

git pull --ff-only
npm ci
npm run build

if [ "$(id -u)" -eq 0 ] && [ "$OWNER" != "root" ]; then
  chown -R "$OWNER:$OWNER" .
fi

pm2 reload ecosystem.config.cjs --update-env
pm2 save
echo "Deployed $(git rev-parse --short HEAD), running as $OWNER"

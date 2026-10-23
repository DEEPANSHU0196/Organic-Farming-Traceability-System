#!/usr/bin/env bash
# One command to run AgroVerse locally: MongoDB + backend (5000) + frontend (5173).
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 1. MongoDB (Homebrew install)
if ! nc -z 127.0.0.1 27017 2>/dev/null; then
  echo "▶ Starting MongoDB…"
  mkdir -p "$ROOT/.mongo-data"
  mongod --dbpath "$ROOT/.mongo-data" --bind_ip 127.0.0.1 --port 27017 --fork --logpath "$ROOT/.mongo-data/mongod.log"
fi

# 2. Dependencies (first run only)
[ -d "$ROOT/node_modules" ] || (cd "$ROOT" && npm install)
[ -d "$ROOT/backend/node_modules" ] || (cd "$ROOT/backend" && npm install)

# 3. Backend + frontend; Ctrl+C stops both
echo "▶ Starting backend on http://localhost:5000"
(cd "$ROOT/backend" && node server.js) &
BACKEND_PID=$!
trap 'kill $BACKEND_PID 2>/dev/null' EXIT INT TERM

echo "▶ Starting website on http://localhost:5173"
cd "$ROOT" && npx vite --port 5173 --open

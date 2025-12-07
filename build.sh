#!/usr/bin/env bash
# exit on error
set -o errexit

cd kuravote
npm install --legacy-peer-deps
npm run build

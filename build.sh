#!/usr/bin/env bash
# exit on error
set -o errexit

cd Kuravote
npm install --legacy-peer-deps
npm run build

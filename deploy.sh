#!/bin/bash

set -euo pipefail

# Ensure we are in the same dir as script
SCRIPT=$(realpath "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

# Check if .env file exists (using absolute path)
if [ ! -f ".env" ]; then
  echo "Error: .env file is missing!"
  echo "Please create a .env file at: $SCRIPT_DIR/.env"
  echo "Example contents:"
  echo "PING_URL=https://example.com"
  exit 1
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Verify that PING_URL is set
if [ -z "$PING_URL" ]; then
  echo "Error: PING_URL is not set in the .env file!"
  echo "Please add PING_URL=https://your-website.com to your .env file."
  exit 1
fi

# Build the Rust Lambda
cd rust/pinger
cargo lambda build --release --arm64
cd ../..

# Deploy CDK
cd cdk
npx cdk deploy
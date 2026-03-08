#!/bin/bash

# Render build script
# This script is executed during the build process on Render

set -e

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Creating logs directory..."
mkdir -p backend/logs

echo "Build completed successfully!"

#!/usr/bin/env bash
# Exit immediately if a command fails (except for our handled audits)
set -e

echo "🛡️ Starting Security Audits..."

# 1. Concept: Check and install Semgrep using Homebrew
if ! command -v semgrep &> /dev/null; then
    echo "🔍 Semgrep not found. Installing via Homebrew..."
    brew install semgrep
else
    echo "✅ Semgrep is already installed."
fi

echo "-----------------------------------------"

# 2. Concept: Run npm audit
echo "📦 Running npm audit..."
# We use '|| true' so a vulnerability warning doesn't crash the script before Semgrep runs
npm audit || true

echo "-----------------------------------------"

# 3. Concept: Run Semgrep
echo "🔍 Running Semgrep scan..."
semgrep scan --config auto

echo "🚀 All security tasks executed!"
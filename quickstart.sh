#!/bin/bash

# GreenOps AI - Quick Start Script

echo "🚀 GreenOps AI - Quick Start"
echo "=============================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11+"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Azure OpenAI credentials!"
    echo "   - AZURE_OPENAI_API_KEY"
    echo "   - AZURE_OPENAI_ENDPOINT"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure .env has your Azure OpenAI credentials"
echo "  2. Run: python orchestrator/main.py"
echo "  3. Test: python test_api.py"
echo ""
echo "📚 Documentation:"
echo "  - Setup: SETUP.md"
echo "  - API: docs/API.md"
echo "  - Demo: DEMO_SCRIPT.md"
echo ""

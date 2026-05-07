#!/usr/bin/env bash
set -e

# DermaLens Setup Script
# ----------------------
# Checks prerequisites, installs dependencies, and validates configuration.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=============================="
echo "  DermaLens Setup"
echo "=============================="
echo ""

ERRORS=0

# ----------------------------
# 1. Check Python
# ----------------------------
echo -n "Checking Python... "
if command -v python3 &>/dev/null; then
    PY_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
    if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 9 ]; then
        echo -e "${GREEN}OK${NC} (Python $PY_VERSION)"
    else
        echo -e "${RED}FAIL${NC} (Python $PY_VERSION — need 3.9+)"
        ERRORS=$((ERRORS + 1))
    fi
elif command -v python &>/dev/null; then
    PY_VERSION=$(python --version 2>&1 | awk '{print $2}')
    PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
    if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 9 ]; then
        echo -e "${GREEN}OK${NC} (Python $PY_VERSION)"
    else
        echo -e "${RED}FAIL${NC} (Python $PY_VERSION — need 3.9+)"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}FAIL${NC} (Python not found)"
    ERRORS=$((ERRORS + 1))
fi

# ----------------------------
# 2. Check Node.js
# ----------------------------
echo -n "Checking Node.js... "
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}OK${NC} ($NODE_VERSION)"
else
    echo -e "${RED}FAIL${NC} (Node.js not found — need v18+)"
    ERRORS=$((ERRORS + 1))
fi

# ----------------------------
# 3. Backend setup
# ----------------------------
echo ""
echo "--- Backend Setup ---"

# Create venv if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv 2>/dev/null || python -m venv backend/venv
fi

echo "Installing backend dependencies..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    source backend/venv/Scripts/activate
else
    source backend/venv/bin/activate
fi
pip install -r backend/requirements.txt --quiet
echo -e "${GREEN}Backend dependencies installed.${NC}"

# ----------------------------
# 4. Check model weights
# ----------------------------
echo ""
echo -n "Checking model weights... "
MODEL_PATH="backend/models/final.keras"
if [ -f "$MODEL_PATH" ]; then
    FILE_SIZE=$(wc -c < "$MODEL_PATH" 2>/dev/null || stat -f%z "$MODEL_PATH" 2>/dev/null || echo "0")
    echo -e "${GREEN}OK${NC} ($MODEL_PATH, $(echo "$FILE_SIZE" | xargs) bytes)"
else
    echo -e "${YELLOW}MISSING${NC}"
    echo ""
    echo -e "${YELLOW}  Model weights not found at: $MODEL_PATH${NC}"
    echo "  The backend will NOT start without model weights."
    echo ""
    echo "  To get the weights:"
    echo "    1. Train the model using notebooks/train_model.ipynb on Google Colab"
    echo "    2. Download the .keras file from Colab"
    echo "    3. Place it at: $MODEL_PATH"
    echo ""
    ERRORS=$((ERRORS + 1))
fi

# ----------------------------
# 5. Check backend .env
# ----------------------------
echo -n "Checking backend .env... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}MISSING${NC} — copying from .env.example"
    cp backend/.env.example backend/.env 2>/dev/null || echo -e "${RED}  Could not copy .env.example${NC}"
fi

# ----------------------------
# 6. Frontend setup
# ----------------------------
echo ""
echo "--- Frontend Setup ---"

echo "Installing frontend dependencies..."
cd frontend
npm install --silent 2>/dev/null || npm install
cd ..
echo -e "${GREEN}Frontend dependencies installed.${NC}"

# ----------------------------
# 7. Check frontend .env.local
# ----------------------------
echo -n "Checking frontend .env.local... "
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}MISSING${NC} — copying from .env.local.example"
    cp frontend/.env.local.example frontend/.env.local 2>/dev/null || echo -e "${RED}  Could not copy .env.local.example${NC}"
fi

# ----------------------------
# Summary
# ----------------------------
echo ""
echo "=============================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}  Setup complete! All checks passed.${NC}"
    echo ""
    echo "  To start the app:"
    echo "    Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
    echo "    Frontend: cd frontend && npm run dev"
else
    echo -e "${YELLOW}  Setup complete with $ERRORS issue(s).${NC}"
    echo "  Please resolve the issues above before running the app."
fi
echo "=============================="

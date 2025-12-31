#!/bin/bash

# Enterprise Certificate Generator - Quick Setup Script
# This script automates the initial setup process

echo "🚀 Enterprise Certificate Generator - Quick Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v14+ first."
    exit 1
fi
print_success "Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm $(npm --version) found"

# Check if MongoDB is running
echo ""
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB not found. Please ensure MongoDB is installed and running."
else
    print_success "MongoDB found"
fi

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend || exit

# Install backend dependencies
echo "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.enterprise.example .env
    print_success ".env file created"
    print_warning "Please edit backend/.env with your SMTP credentials"
else
    print_warning ".env file already exists, skipping..."
fi

# Create upload directories
echo "Creating upload directories..."
mkdir -p uploads/designs
mkdir -p uploads/csv
print_success "Upload directories created"

cd ..

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
cd frontend || exit

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Final Instructions
echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Email (CRITICAL):"
echo "   cd backend"
echo "   nano .env"
echo "   # Add your SMTP credentials"
echo ""
echo "2. Start Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (in new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "   - IMPLEMENTATION_GUIDE.md - Complete setup guide"
echo "   - ENTERPRISE_COMPLETE.md - Feature overview"
echo "   - README.md - Project documentation"
echo ""
echo "🎉 Happy Certificate Generating!"
echo ""

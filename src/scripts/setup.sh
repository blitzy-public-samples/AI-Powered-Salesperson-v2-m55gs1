#!/bin/bash

# Set global variables
PROJECT_ROOT=$(pwd)
NODE_VERSION="14.17.0"
PYTHON_VERSION="3.9.5"

# Function to check if required dependencies are installed
check_dependencies() {
    echo "Checking dependencies..."

    # Check Node.js version
    if ! command -v node &> /dev/null || [[ $(node -v) != *"$NODE_VERSION"* ]]; then
        echo "Node.js $NODE_VERSION is required but not found."
        return 1
    fi

    # Check Python version
    if ! command -v python3 &> /dev/null || [[ $(python3 --version) != *"$PYTHON_VERSION"* ]]; then
        echo "Python $PYTHON_VERSION is required but not found."
        return 1
    fi

    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        echo "PostgreSQL is required but not found."
        return 1
    fi

    # Check Redis
    if ! command -v redis-cli &> /dev/null; then
        echo "Redis is required but not found."
        return 1
    fi

    echo "All dependencies are met."
    return 0
}

# Function to set up the Node.js environment
setup_node_environment() {
    echo "Setting up Node.js environment..."

    # Navigate to project root
    cd "$PROJECT_ROOT" || return 1

    # Install Node.js dependencies
    npm install || return 1

    # Build the frontend application
    npm run build || return 1

    echo "Node.js environment setup complete."
    return 0
}

# Function to set up the Python environment
setup_python_environment() {
    echo "Setting up Python environment..."

    # Create a Python virtual environment
    python3 -m venv venv || return 1

    # Activate the virtual environment
    source venv/bin/activate || return 1

    # Install Python dependencies
    pip install -r requirements.txt || return 1

    echo "Python environment setup complete."
    return 0
}

# Function to set up the PostgreSQL database
setup_database() {
    echo "Setting up PostgreSQL database..."

    # Create the database if it doesn't exist
    createdb ai_salesperson || echo "Database already exists."

    # Run database migrations
    python manage.py db upgrade || return 1

    # Seed the database with initial data
    python manage.py seed_db || return 1

    echo "Database setup complete."
    return 0
}

# Function to set up Redis for caching
setup_redis() {
    echo "Setting up Redis..."

    # Start Redis server
    redis-server --daemonize yes || return 1

    # Verify Redis connection
    if ! redis-cli ping > /dev/null 2>&1; then
        echo "Failed to connect to Redis."
        return 1
    fi

    echo "Redis setup complete."
    return 0
}

# Main function to orchestrate the setup process
main() {
    echo "Welcome to the AI-powered salesperson chat system setup!"

    check_dependencies || return 1
    setup_node_environment || return 1
    setup_python_environment || return 1
    setup_database || return 1
    setup_redis || return 1

    echo "Setup completed successfully!"
    return 0
}

# Main execution
main
exit $?
#!/bin/bash

# VibeMD Process Management Script
# This script provides better control over Electron processes to avoid conflicts with Cursor IDE

APP_NAME="VibeMD"
PROJECT_DIR="/Users/cameron/Projects/VibeMD"
PID_FILE="$PROJECT_DIR/.vibemd.pid"
LOG_FILE="$PROJECT_DIR/.vibemd.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[VibeMD]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[VibeMD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[VibeMD]${NC} $1"
}

print_error() {
    echo -e "${RED}[VibeMD]${NC} $1"
}

# Function to check if process is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to start the application
start_app() {
    print_status "Starting $APP_NAME..."
    
    if is_running; then
        print_warning "$APP_NAME is already running (PID: $(cat $PID_FILE))"
        return 1
    fi
    
    # Kill any existing Electron processes
    print_status "Cleaning up existing Electron processes..."
    pkill -f "electron-forge\|webpack-dev-server\|electron.*VibeMD" 2>/dev/null || true
    
    # Free up port 3000
    print_status "Freeing up port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Start the application
    cd "$PROJECT_DIR"
    print_status "Launching Electron Forge..."
    
    # Start in background and capture PID
    npm run start > "$LOG_FILE" 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"
    
    # Wait a moment to see if it starts successfully
    sleep 3
    
    if is_running; then
        print_success "$APP_NAME started successfully (PID: $pid)"
        print_status "Logs available at: $LOG_FILE"
        return 0
    else
        print_error "Failed to start $APP_NAME"
        print_error "Check logs: $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

# Function to stop the application
stop_app() {
    print_status "Stopping $APP_NAME..."
    
    if is_running; then
        local pid=$(cat "$PID_FILE")
        print_status "Terminating process $pid..."
        kill -TERM "$pid" 2>/dev/null || true
        
        # Wait for graceful shutdown
        local count=0
        while [ $count -lt 10 ] && ps -p "$pid" > /dev/null 2>&1; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if ps -p "$pid" > /dev/null 2>&1; then
            print_warning "Force killing process $pid..."
            kill -KILL "$pid" 2>/dev/null || true
        fi
        
        rm -f "$PID_FILE"
        print_success "$APP_NAME stopped"
    else
        print_warning "$APP_NAME is not running"
    fi
    
    # Clean up any remaining Electron processes
    print_status "Cleaning up remaining Electron processes..."
    pkill -f "electron-forge\|webpack-dev-server\|electron.*VibeMD" 2>/dev/null || true
    
    # Free up port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
}

# Function to restart the application
restart_app() {
    print_status "Restarting $APP_NAME..."
    stop_app
    sleep 2
    start_app
}

# Function to show status
show_status() {
    if is_running; then
        local pid=$(cat "$PID_FILE")
        print_success "$APP_NAME is running (PID: $pid)"
        print_status "Logs: $LOG_FILE"
    else
        print_warning "$APP_NAME is not running"
    fi
}

# Function to show logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_status "Showing recent logs (last 50 lines):"
        echo "----------------------------------------"
        tail -50 "$LOG_FILE"
        echo "----------------------------------------"
    else
        print_warning "No log file found"
    fi
}

# Function to show help
show_help() {
    echo "VibeMD Process Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start the VibeMD application"
    echo "  stop      Stop the VibeMD application"
    echo "  restart   Restart the VibeMD application"
    echo "  status    Show application status"
    echo "  logs      Show recent logs"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the application"
    echo "  $0 stop     # Stop the application"
    echo "  $0 restart  # Restart the application"
}

# Main script logic
case "${1:-help}" in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac






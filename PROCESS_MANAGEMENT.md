# VibeMD Process Management

This document explains how to manage VibeMD processes to avoid conflicts with Cursor IDE and other development tools.

## Quick Start

```bash
# Start the application (with cleanup)
npm run start:clean

# Stop the application
npm run stop

# Restart the application
npm run restart

# Check status
npm run status

# View logs
npm run logs
```

## Process Management Script

The `vibemd.sh` script provides better control over Electron processes:

### Commands

- `./vibemd.sh start` - Start VibeMD with process cleanup
- `./vibemd.sh stop` - Stop VibeMD and clean up processes
- `./vibemd.sh restart` - Restart VibeMD
- `./vibemd.sh status` - Show current status
- `./vibemd.sh logs` - Show recent logs
- `./vibemd.sh help` - Show help

### Features

- **Process Isolation**: Kills existing Electron processes before starting
- **Port Management**: Frees up port 3000 automatically
- **PID Tracking**: Tracks the main process PID for clean shutdown
- **Logging**: Captures all output to `.vibemd.log`
- **Graceful Shutdown**: Attempts graceful termination before force kill

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE: address already in use :::3000`:

```bash
# Use the process management script
./vibemd.sh restart

# Or manually free the port
lsof -ti:3000 | xargs kill -9
```

### Electron Processes Not Stopping

If Electron processes persist after stopping:

```bash
# Force cleanup
pkill -f "electron-forge\|webpack-dev-server\|electron.*VibeMD"

# Or use the script
./vibemd.sh stop
```

### Cursor IDE Conflicts

If Cursor IDE becomes unresponsive:

1. Stop VibeMD: `./vibemd.sh stop`
2. Restart Cursor IDE
3. Start VibeMD: `./vibemd.sh start`

## Development Workflow

### Recommended Workflow

1. **Start Development**:
   ```bash
   npm run start:clean
   ```

2. **During Development**:
   - Use `npm run restart` to restart after major changes
   - Use `npm run logs` to check for errors
   - Use `npm run status` to verify the app is running

3. **End Development**:
   ```bash
   npm run stop
   ```

### Integration with Cursor IDE

- Always stop VibeMD before closing Cursor IDE
- Use `npm run start:clean` when starting development
- If Cursor becomes slow, restart VibeMD with `npm run restart`

## File Locations

- **PID File**: `.vibemd.pid` - Contains the main process PID
- **Log File**: `.vibemd.log` - Contains all application output
- **Script**: `vibemd.sh` - Process management script

## Environment Variables

The script uses these environment variables:

- `PROJECT_DIR` - Project directory (default: `/Users/cameron/Projects/VibeMD`)
- `APP_NAME` - Application name (default: `VibeMD`)

## Security Notes

- The script only manages VibeMD-related processes
- It doesn't affect other Electron applications
- PID files are cleaned up automatically
- Log files are rotated (manual cleanup required)













# Parea Development Environment Stopper
# Safely stops Laravel and Expo processes started by start-parea-dev.ps1

# Colors for output
$colors = @{
    Reset = [System.ConsoleColor]::White
    Info = [System.ConsoleColor]::Cyan
    Success = [System.ConsoleColor]::Green
    Warning = [System.ConsoleColor]::Yellow
    Error = [System.ConsoleColor]::Red
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [System.ConsoleColor]$Color = $colors.Reset
    )
    $originalColor = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $Color
    Write-Host $Message
    $host.UI.RawUI.ForegroundColor = $originalColor
}

function Stop-DevelopmentServers {
    param([string]$MobilePath)
    
    Write-Host "Stopping Parea development servers..." -ForegroundColor $colors.Info
    
    $stateDir = Join-Path $MobilePath ".parea-dev"
    $stateFile = Join-Path $stateDir "processes.json"
    
    if (-not (Test-Path $stateFile)) {
        Write-Host "No development server state found. Servers may not be running." -ForegroundColor $colors.Warning
        return $false
    }
    
    try {
        $state = Get-Content $stateFile | ConvertFrom-Json
        
        $stoppedProcesses = 0
        $totalProcesses = 2
        
        # Stop Laravel process
        if ($state.LaravelProcessId) {
            $process = Get-Process -Id $state.LaravelProcessId -ErrorAction SilentlyContinue
            if ($process) {
                # Verify this is actually a PHP process to prevent killing wrong processes
                if ($process.ProcessName -like "*php*" -or $process.ProcessName -eq "php") {
                    Stop-Process -Id $state.LaravelProcessId -Force
                    Write-Host "Laravel API server stopped" -ForegroundColor $colors.Success
                    $stoppedProcesses++
                } else {
                    Write-Host "Laravel process ID $($state.LaravelProcessId) is not a PHP process, skipping for safety" -ForegroundColor $colors.Warning
                }
            } else {
                Write-Host "Laravel API server process not found (may have already stopped)" -ForegroundColor $colors.Warning
            }
        }
        
        # Stop Expo process
        if ($state.ExpoProcessId) {
            $process = Get-Process -Id $state.ExpoProcessId -ErrorAction SilentlyContinue
            if ($process) {
                # Verify this is actually a Node.js process to prevent killing wrong processes
                if ($process.ProcessName -like "*node*" -or $process.ProcessName -eq "node") {
                    Stop-Process -Id $state.ExpoProcessId -Force
                    Write-Host "Expo Metro server stopped" -ForegroundColor $colors.Success
                    $stoppedProcesses++
                } else {
                    Write-Host "Expo process ID $($state.ExpoProcessId) is not a Node.js process, skipping for safety" -ForegroundColor $colors.Warning
                }
            } else {
                Write-Host "Expo Metro server process not found (may have already stopped)" -ForegroundColor $colors.Warning
            }
        }
        
        # Clean up state directory
        if (Test-Path $stateDir) {
            Remove-Item -Path $stateDir -Recurse -Force
            Write-Host "Development server state cleaned up" -ForegroundColor $colors.Success
        }
        
        if ($stoppedProcesses -eq 0) {
            Write-Host "No processes were actively stopped" -ForegroundColor $colors.Warning
            return $false
        } elseif ($stoppedProcesses -lt $totalProcesses) {
            Write-Host "Some processes may still be running" -ForegroundColor $colors.Warning
            return $true
        } else {
            Write-Host "All development servers stopped successfully" -ForegroundColor $colors.Success
            return $true
        }
        
    } catch {
        Write-Host "Error stopping servers: $($_.Exception.Message)" -ForegroundColor $colors.Error
        return $false
    }
}

# Main execution
try {
    Write-Host "Parea Development Environment Stopper" -ForegroundColor $colors.Info
    Write-Host ""
    
    $mobilePath = "C:\Users\Michael\Desktop\New folder\parea-app"
    
    if (Stop-DevelopmentServers -MobilePath $mobilePath) {
        Write-Host ""
        Write-Host "Development environment shutdown complete" -ForegroundColor $colors.Success
    } else {
        Write-Host ""
        Write-Host "Development environment shutdown completed with warnings" -ForegroundColor $colors.Warning
    }
    
} catch {
    Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor $colors.Error
    exit 1
}
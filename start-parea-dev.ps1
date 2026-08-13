# Parea Development Environment Launcher
# Automatically detects LAN IP, configures environment, and starts Laravel & Expo

param(
    [switch]$SkipMigrations = $false,
    [switch]$ValidationOnly = $false
)

# Colors for output
$colors = @{
    Reset = [System.ConsoleColor]::White
    Info = [System.ConsoleColor]::Cyan
    Success = [System.ConsoleColor]::Green
    Warning = [System.ConsoleColor]::Yellow
    Error = [System.ConsoleColor]::Red
}

# Save original progress preference and suppress progress output
$originalProgressPreference = $ProgressPreference
$ProgressPreference = 'SilentlyContinue'

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

function Find-LanIpAddress {
    Write-Host "Detecting LAN IP address..." -ForegroundColor $colors.Info
    
    # Get all IPv4 network interfaces that are up
    $interfaces = Get-NetAdapter | Where-Object { 
        $_.Status -eq "Up" -and 
        $_.Virtual -eq $false -and
        $_.InterfaceDescription -notlike "*Bluetooth*" -and
        $_.InterfaceDescription -notlike "*Hyper-V*" -and
        $_.InterfaceDescription -notlike "*VMware*" -and
        $_.InterfaceDescription -notlike "*VirtualBox*" -and
        $_.InterfaceDescription -notlike "*WSL*" -and
        $_.Name -notlike "*Loopback*" -and
        $_.Name -notlike "*Bluetooth*" -and
        $_.Name -notlike "*VPN*"
    } | Sort-Object InterfaceIndex
    
    $validAddresses = @()
    
    foreach ($interface in $interfaces) {
        $ipConfig = Get-NetIPAddress -InterfaceIndex $interface.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
        
        foreach ($ip in $ipConfig) {
            # Skip loopback and APIPA addresses
            if ($ip.IPAddress -ne "127.0.0.1" -and 
                -not $ip.IPAddress.StartsWith("169.254.") -and
                $ip.IPAddress -ne "0.0.0.0") {
                
                # Check if interface has a default gateway (indicates it's connected to a network)
                $gateway = Get-NetRoute -InterfaceIndex $interface.InterfaceIndex -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue
                
                $validAddresses += [PSCustomObject]@{
                    IPAddress = $ip.IPAddress
                    InterfaceName = $interface.Name
                    InterfaceDescription = $interface.InterfaceDescription
                    HasGateway = ($null -ne $gateway)
                }
            }
        }
    }
    
    if ($validAddresses.Count -eq 0) {
        Write-Host "No valid LAN IP addresses found!" -ForegroundColor $colors.Error
        exit 1
    }
    
    # Prefer interface with gateway, otherwise take the first one
    $selectedAddress = $validAddresses | Where-Object { $_.HasGateway } | Select-Object -First 1
    if (-not $selectedAddress) {
        $selectedAddress = $validAddresses[0]
    }
    
    if ($validAddresses.Count -gt 1) {
        Write-Host "Multiple valid network interfaces found:" -ForegroundColor $colors.Info
        for ($i = 0; $i -lt $validAddresses.Count; $i++) {
            $prefix = if ($validAddresses[$i].IPAddress -eq $selectedAddress.IPAddress) { "[SELECTED] " } else { "          " }
            Write-Host "$prefix [$($i+1)] $($validAddresses[$i].IPAddress) ($($validAddresses[$i].InterfaceName))"
        }
        
        Write-Host ""
        $choice = Read-Host "Select interface [1-$($validAddresses.Count)] (Enter for default)"
        if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $validAddresses.Count) {
            $selectedAddress = $validAddresses[[int]$choice - 1]
        }
    }
    
    Write-Host "Selected IP: $($selectedAddress.IPAddress) ($($selectedAddress.InterfaceName))" -ForegroundColor $colors.Success
    return $selectedAddress.IPAddress
}

function Test-GitIgnoreSafety {
    param([string]$ProjectPath)
    
    Write-Host "Checking Git ignore safety..." -ForegroundColor $colors.Info
    
    $envPath = Join-Path $ProjectPath ".env"
    $gitignorePath = Join-Path $ProjectPath ".gitignore"
    
    if (-not (Test-Path $gitignorePath)) {
        Write-Host ".gitignore file not found!" -ForegroundColor $colors.Error
        return $false
    }
    
    $gitignoreContent = Get-Content $gitignorePath -Raw
    if ($gitignoreContent -notlike "*`.env*") {
        Write-Host "CRITICAL SECURITY ISSUE: .env is not ignored by Git!" -ForegroundColor $colors.Error
        Write-Host "   Add '.env' to your .gitignore file before continuing." -ForegroundColor $colors.Warning
        return $false
    }
    
    Write-Host ".env file is properly ignored by Git" -ForegroundColor $colors.Success
    return $true
}

function Update-MobileEnv {
    param(
        [string]$ProjectPath,
        [string]$IpAddress
    )
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping .env update during validation" -ForegroundColor $colors.Info
        return $true
    }
    
    Write-Host "Updating mobile .env file..." -ForegroundColor $colors.Info
    
    $envPath = Join-Path $ProjectPath ".env"
    $envContent = "EXPO_PUBLIC_API_BASE_URL=http://$IpAddress`:8000"
    
    try {
        Set-Content -Path $envPath -Value $envContent -Encoding UTF8
        Write-Host "Mobile .env updated with API base URL: http://$IpAddress`:8000" -ForegroundColor $colors.Success
        return $true
    }
    catch {
        Write-Host "Failed to update .env file: $($_.Exception.Message)" -ForegroundColor $colors.Error
        return $false
    }
}

function Test-ProjectFiles {
    param(
        [string]$MobilePath,
        [string]$BackendPath
    )
    
    Write-Host "Verifying project files..." -ForegroundColor $colors.Info
    
    # Check mobile project files
    $mobileFiles = @(
        @{ Path = Join-Path $MobilePath "package.json"; Name = "package.json" },
        @{ Path = Join-Path $MobilePath "app.json"; Name = "app.json" }
    )
    
    # Check backend project files
    $backendFiles = @(
        @{ Path = Join-Path $BackendPath "artisan"; Name = "artisan" },
        @{ Path = Join-Path $BackendPath "composer.json"; Name = "composer.json" }
    )
    
    $allFiles = @($mobileFiles + $backendFiles)
    $missingFiles = @()
    
    foreach ($file in $allFiles) {
        if (-not (Test-Path $file.Path)) {
            $missingFiles += $file.Name
            Write-Host "Missing file: $($file.Name)" -ForegroundColor $colors.Error
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        return $false
    }
    
    Write-Host "All required project files found" -ForegroundColor $colors.Success
    return $true
}

function Setup-SqliteDatabase {
    param([string]$BackendPath)
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping SQLite setup during validation" -ForegroundColor $colors.Info
        return
    }
    
    Write-Host "Checking SQLite database..." -ForegroundColor $colors.Info
    
    $databasePath = Join-Path (Join-Path $BackendPath "database") "database.sqlite"
    $envPath = Join-Path $BackendPath ".env"
    
    # Check if .env exists to determine database type
    if (-not (Test-Path $envPath)) {
        Write-Host "Backend .env file not found, skipping database setup" -ForegroundColor $colors.Warning
        return
    }
    
    $envContent = Get-Content $envPath -Raw
    if ($envContent -like "*sqlite*") {
        # Ensure database directory exists
        $dbDir = Split-Path $databasePath -Parent
        if (-not (Test-Path $dbDir)) {
            New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
        }
        
        # Create SQLite file if it doesn't exist
        if (-not (Test-Path $databasePath)) {
            try {
                New-Item -ItemType File -Path $databasePath -Force | Out-Null
                Write-Host "Created SQLite database file: database/database.sqlite" -ForegroundColor $colors.Success
            }
            catch {
                Write-Host "Failed to create SQLite database file: $($_.Exception.Message)" -ForegroundColor $colors.Warning
            }
        } else {
            Write-Host "SQLite database file already exists" -ForegroundColor $colors.Success
        }
    }
}

function Test-EnvironmentSafety {
    param([string]$BackendPath)
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping environment safety check during validation" -ForegroundColor $colors.Info
        return $true
    }
    
    Write-Host "Checking environment safety..." -ForegroundColor $colors.Info
    
    $envPath = Join-Path $BackendPath ".env"
    
    if (-not (Test-Path $envPath)) {
        Write-Host "Backend .env file not found, cannot verify environment" -ForegroundColor $colors.Warning
        return $false
    }
    
    $envContent = Get-Content $envPath -Raw
    
    # Check for production environment
    if ($envContent -like "*APP_ENV=production*" -or $envContent -like "*APP_ENV=""production""*") {
        Write-Host "CRITICAL: Production environment detected! Aborting migrations." -ForegroundColor $colors.Error
        return $false
    }
    
    # Check for production database URL
    if ($envContent -like "*DATABASE_URL=*heroku*" -or $envContent -like "*DATABASE_URL=*aws*") {
        Write-Host "CRITICAL: Production database URL detected! Aborting migrations." -ForegroundColor $colors.Error
        return $false
    }
    
    Write-Host "Environment verified as safe for development" -ForegroundColor $colors.Success
    return $true
}

function Run-Migrations {
    param([string]$BackendPath)
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping migrations during validation" -ForegroundColor $colors.Info
        return
    }
    
    Write-Host "Running database migrations..." -ForegroundColor $colors.Info
    
    if (-not (Test-EnvironmentSafety -BackendPath $BackendPath)) {
        Write-Host "Skipping migrations due to environment safety concerns" -ForegroundColor $colors.Warning
        Write-Host "   To run migrations manually: cd `"$BackendPath`" && php artisan migrate --force" -ForegroundColor $colors.Info
        return
    }
    
    try {
        Push-Location $BackendPath
        $migrationResult = & php artisan migrate --force 2>&1
        Pop-Location
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database migrations completed successfully" -ForegroundColor $colors.Success
        } else {
            Write-Host "Database migrations failed or produced warnings:" -ForegroundColor $colors.Warning
            Write-Host $migrationResult
        }
    }
    catch {
        Write-Host "Failed to run migrations: $($_.Exception.Message)" -ForegroundColor $colors.Warning
        Write-Host "   To run migrations manually: cd `"$BackendPath`" && php artisan migrate --force" -ForegroundColor $colors.Info
    }
}

function Test-PortAvailability {
    param([int]$Port, [string]$ServiceName)
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping port availability check during validation" -ForegroundColor $colors.Info
        return $true
    }
    
    Write-Host "Checking port $Port availability..." -ForegroundColor $colors.Info
    
    # Use Test-NetConnection with timeout instead of Get-NetTCPConnection to avoid progress output
    try {
        $testResult = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($testResult.TcpTestSucceeded) {
            Write-Host "Port $Port is already in use" -ForegroundColor $colors.Warning
            
            $choice = Read-Host "Reuse existing $ServiceName service? (Y/n)"
            if ($choice -ne 'n' -and $choice -ne 'N') {
                Write-Host "Will reuse existing $ServiceName service on port $Port" -ForegroundColor $colors.Success
                return $true
            } else {
                Write-Host "Cannot start $ServiceName - port $Port is occupied" -ForegroundColor $colors.Error
                return $false
            }
        }
    } catch {
        # If Test-NetConnection fails, fall through to port available
    }
    
    Write-Host "Port $Port is available" -ForegroundColor $colors.Success
    return $true
}

function WaitForService {
    param(
        [string]$Url,
        [string]$ServiceName,
        [int]$TimeoutSeconds = 30
    )
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping service wait during validation" -ForegroundColor $colors.Info
        return $true
    }
    
    Write-Host "Waiting for $ServiceName to become ready..." -ForegroundColor $colors.Info
    
    $startTime = Get-Date
    $timeout = $startTime.AddSeconds($TimeoutSeconds)
    
    do {
        try {
            # Use Invoke-WebRequest with timeout
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "$ServiceName is ready" -ForegroundColor $colors.Success
                return $true
            }
        }
        catch {
            # Service not ready yet, continue waiting
        }
        
        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $timeout)
    
    Write-Host "$ServiceName did not become ready within $TimeoutSeconds seconds" -ForegroundColor $colors.Warning
    return $false
}

function Start-DevelopmentServers {
    param(
        [string]$MobilePath,
        [string]$BackendPath,
        [string]$IpAddress
    )
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping server start during validation" -ForegroundColor $colors.Info
        return $true
    }
    
    Write-Host "Starting development servers..." -ForegroundColor $colors.Info
    
    # Create state directory
    $stateDir = Join-Path $MobilePath ".parea-dev"
    if (-not (Test-Path $stateDir)) {
        New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
    }
    
    # Test port availability
    if (-not (Test-PortAvailability -Port 8000 -ServiceName "Laravel API")) {
        return $false
    }
    
    if (-not (Test-PortAvailability -Port 8081 -ServiceName "Expo Metro")) {
        return $false
    }
    
    # Create separate log files for stdout and stderr
    $laravelStdOutLog = Join-Path $stateDir "laravel.stdout.log"
    $laravelStdErrLog = Join-Path $stateDir "laravel.stderr.log"
    $expoStdOutLog = Join-Path $stateDir "expo.stdout.log"
    $expoStdErrLog = Join-Path $stateDir "expo.stderr.log"
    
    # Start Laravel server using Start-Process for cross-session persistence
    Write-Host "Starting Laravel API server..." -ForegroundColor $colors.Info
    $laravelProcess = Start-Process -FilePath "php" -ArgumentList "artisan", "serve", "--host=0.0.0.0", "--port=8000" -WorkingDirectory $BackendPath -PassThru -WindowStyle Hidden -RedirectStandardOutput $laravelStdOutLog -RedirectStandardError $laravelStdErrLog
    
    # Start Expo server using Start-Process for cross-session persistence
    Write-Host "Starting Expo Metro server..." -ForegroundColor $colors.Info
    
    # Set environment variable for this process
    $env:REACT_NATIVE_PACKAGER_HOSTNAME = $IpAddress
    
    # Start Expo process
    $expoProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx expo start --dev-client --lan" -WorkingDirectory $MobilePath -PassThru -WindowStyle Hidden -RedirectStandardOutput $expoStdOutLog -RedirectStandardError $expoStdErrLog
    
    # Save process information with safe identity metadata
    $state = @{
        LaravelProcessId = $laravelProcess.Id
        LaravelStartTime = $laravelProcess.StartTime.ToString("o")
        LaravelWorkingDirectory = $BackendPath
        ExpoProcessId = $expoProcess.Id
        ExpoStartTime = $expoProcess.StartTime.ToString("o")
        ExpoWorkingDirectory = $MobilePath
        IpAddress = $IpAddress
        StartTime = (Get-Date).ToString("o")
    }
    
    $state | ConvertTo-Json | Set-Content (Join-Path $stateDir "processes.json")
    
    Write-Host "Waiting for servers to initialize..." -ForegroundColor $colors.Info
    
    # Wait for services to become ready
    $laravelReady = WaitForService -Url "http://$IpAddress`:8000/api/v1/health" -ServiceName "Laravel API" -TimeoutSeconds 30
    $expoReady = WaitForService -Url "http://$IpAddress`:8081" -ServiceName "Expo Metro" -TimeoutSeconds 30
    
    if ($laravelReady -and $expoReady) {
        Write-Host "Both development servers are running successfully" -ForegroundColor $colors.Success
        return $true
    } else {
        Write-Host "Some services failed to start properly" -ForegroundColor $colors.Warning
        return $false
    }
}

function Show-FinalSummary {
    param([string]$IpAddress)
    
    # Skip during validation
    if ($ValidationOnly) {
        Write-Host "Skipping final summary during validation" -ForegroundColor $colors.Info
        return
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor $colors.Success
    Write-Host "PAREA DEVELOPMENT ENVIRONMENT READY" -ForegroundColor $colors.Success
    Write-Host "========================================" -ForegroundColor $colors.Success
    Write-Host ""
    Write-Host "Parea API:" -ForegroundColor $colors.Info
    Write-Host "http://$IpAddress`:8000/api/v1/health"
    Write-Host ""
    Write-Host "Expo Metro:" -ForegroundColor $colors.Info
    Write-Host "http://$IpAddress`:8081"
    Write-Host ""
    Write-Host "Mobile API base URL:" -ForegroundColor $colors.Info
    Write-Host "http://$IpAddress`:8000"
    Write-Host ""
    Write-Host "Instructions for Xiaomi device:" -ForegroundColor $colors.Info
    Write-Host "- Keep device on the same Wi-Fi network"
    Write-Host "- Scan the QR code shown in Expo Metro"
    Write-Host "- Do not use old development-server history entries"
    Write-Host "- No EAS build needed for normal changes"
    Write-Host ""
    Write-Host "To stop development servers:" -ForegroundColor $colors.Info
    Write-Host "PowerShell -ExecutionPolicy Bypass -File .\stop-parea-dev.ps1"
    Write-Host ""
}

# Main execution
try {
    Write-Host "Parea Development Environment Launcher" -ForegroundColor $colors.Info
    Write-Host ""
    
    # Define paths
    $mobilePath = "C:\Users\Michael\Desktop\New folder\parea-app"
    $backendPath = "C:\Users\Michael\Desktop\New folder\parea-api"
    
    # Step 1: Find LAN IP
    $ipAddress = Find-LanIpAddress
    
    # Validate IP address format
    if ($ipAddress -notmatch "^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$") {
        Write-Host "Invalid IP address format: $ipAddress" -ForegroundColor $colors.Error
        exit 1
    }
    
    # If validation only, exit early
    if ($ValidationOnly) {
        Write-Host "Validation completed successfully" -ForegroundColor $colors.Success
        # Restore original progress preference
        $ProgressPreference = $originalProgressPreference
        exit 0
    }
    
    # Step 2: Check Git ignore safety
    if (-not (Test-GitIgnoreSafety -ProjectPath $mobilePath)) {
        # Restore original progress preference
        $ProgressPreference = $originalProgressPreference
        exit 1
    }
    
    # Step 3: Update mobile .env
    if (-not (Update-MobileEnv -ProjectPath $mobilePath -IpAddress $ipAddress)) {
        # Restore original progress preference
        $ProgressPreference = $originalProgressPreference
        exit 1
    }
    
    # Step 4: Verify project files
    if (-not (Test-ProjectFiles -MobilePath $mobilePath -BackendPath $backendPath)) {
        # Restore original progress preference
        $ProgressPreference = $originalProgressPreference
        exit 1
    }
    
    # Step 5: Setup SQLite database
    Setup-SqliteDatabase -BackendPath $backendPath
    
    # Step 6: Run migrations (if not skipped)
    if (-not $SkipMigrations) {
        Run-Migrations -BackendPath $backendPath
    }
    
    # Step 7: Start development servers
    if (-not (Start-DevelopmentServers -MobilePath $mobilePath -BackendPath $backendPath -IpAddress $ipAddress)) {
        # Restore original progress preference
        $ProgressPreference = $originalProgressPreference
        exit 1
    }
    
    # Step 8: Show final summary
    Show-FinalSummary -IpAddress $ipAddress
    
    # Restore original progress preference
    $ProgressPreference = $originalProgressPreference
    
} catch {
    Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor $colors.Error
    # Restore original progress preference
    $ProgressPreference = $originalProgressPreference
    exit 1
}
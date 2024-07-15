# Simple Powershell script for setting up the project on Windows machines.

# Set the working directory
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location -Path $scriptDir

# Check if Git Bash is installed
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"

if (-not (Test-Path $gitBashPath)) {
    Write-Host "Git Bash is not installed. Please install it and try again."
    exit 1
}

# Make setup.sh executable
Write-Output "Making setup.sh executable..."
& $gitBashPath -c "chmod +x setup.sh"

# Run the setup script
Write-Output "Running setup.sh..."
& $gitBashPath -c "bash setup.sh"
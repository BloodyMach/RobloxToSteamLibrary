const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { run } = require('./addToSteam');

// Logging helper
const logFile = path.join(path.dirname(process.execPath), 'debug_exe.log');
function log(msg) {
    try {
        fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
    } catch (e) { }
}

log('Starting main.js...');
log(`Arguments: ${process.argv.join(' ')}`);

// Check arguments
const args = process.argv.slice(2);

// Detect if we are being called as the launcher wrapper
if (args.length >= 1 && args[0].endsWith('steamLauncher.js')) {
    log('Running as steamLauncher wrapper');
    require(args[0]);
    return;
}

// If running with --add argument (from GUI)
if (args[0] === '--add') {
    log('Running in --add mode');
    const url = args[1];
    run(url).catch(e => log(`Error in run: ${e.message}`));
    return;
}

// Default mode: GUI
log('Running in GUI mode');
const tempDir = process.env.TEMP;
const guiPath = path.join(tempDir, 'RobloxToSteamGUI.ps1');
const sourceGuiPath = path.join(__dirname, '..', 'gui.ps1');

log(`Extracting GUI from ${sourceGuiPath} to ${guiPath}`);

try {
    fs.copyFileSync(sourceGuiPath, guiPath);
    log('GUI extracted successfully');
} catch (e) {
    log(`Failed to extract GUI script: ${e.message}`);
    console.error('Failed to extract GUI script:', e);
    process.exit(1);
}

// Run PowerShell
log(`Spawning PowerShell: ${guiPath}`);
const ps = spawn('powershell', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', guiPath,
    '-ExecutablePath', process.execPath
], {
    stdio: 'inherit'
});

ps.on('error', (err) => {
    log(`PowerShell spawn error: ${err.message}`);
});

ps.on('exit', (code) => {
    log(`PowerShell exited with code ${code}`);
    process.exit(code);
});

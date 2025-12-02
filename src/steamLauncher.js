const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'launcher.log');

function log(msg) {
    try {
        fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
    } catch (e) { }
}

const args = process.argv.slice(2);

// --- WATCHDOG MODE ---
if (args[0] === '--watchdog') {
    const parentPid = parseInt(args[1]);
    const placeId = args[2]; // Not strictly needed for kill, but good for context

    log(`[Watchdog] Started. Monitoring Parent PID: ${parentPid}`);

    const checkInterval = setInterval(() => {
        try {
            process.kill(parentPid, 0); // Check if parent exists
        } catch (e) {
            // Parent is gone!
            log(`[Watchdog] Parent ${parentPid} gone. Killing Roblox...`);
            clearInterval(checkInterval);
            try {
                execSync('taskkill /F /IM RobloxPlayerBeta.exe');
                log('[Watchdog] Roblox killed.');
            } catch (err) {
                log(`[Watchdog] Error killing Roblox: ${err.message}`);
            }
            process.exit(0);
        }
    }, 1000);

    return;
}

// --- MAIN LAUNCHER MODE ---
const placeId = args[0];

if (!placeId) {
    console.error('Please specify a Place ID.');
    process.exit(1);
}

log(`[Main] Starting for Place ID: ${placeId}. PID: ${process.pid}`);

// Spawn Watchdog
const watchdog = spawn(process.execPath, [__filename, '--watchdog', process.pid, placeId], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true
});
watchdog.unref();
log(`[Main] Watchdog spawned. PID: ${watchdog.pid}`);

const robloxUrl = `roblox://placeID=${placeId}/`;
const processName = 'RobloxPlayerBeta.exe';

console.log(`Launching Roblox for Place ID: ${placeId}...`);
exec(`start "" "${robloxUrl}"`, { windowsHide: true });

console.log('Waiting for Roblox to start...');

// Helper to check if process is running
function isRobloxRunning() {
    return new Promise((resolve) => {
        exec('tasklist', (err, stdout) => {
            if (err) {
                resolve(false);
                return;
            }
            resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
        });
    });
}

async function monitor() {
    // Wait for process to start (timeout after 60s)
    let attempts = 0;
    let running = false;
    while (attempts < 30) { // 30 * 2s = 60s
        running = await isRobloxRunning();
        if (running) break;
        await new Promise(r => setTimeout(r, 2000));
        attempts++;
    }

    if (!running) {
        console.error('Roblox did not start or was not detected.');
        // If we exit here, watchdog will kill Roblox (which isn't running) and exit.
        process.exit(1);
    }

    console.log('Roblox is running. Monitoring...');

    // Wait for process to stop
    while (running) {
        await new Promise(r => setTimeout(r, 5000)); // Check every 5s
        running = await isRobloxRunning();
    }

    console.log('Roblox closed. Exiting...');
    process.exit(0);
}

monitor();

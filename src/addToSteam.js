const path = require('path');
const fs = require('fs');
const axios = require('axios');
const shortcut = require('steam-shortcut-editor');
const pngToIco = require('png-to-ico');

function findSteamUserDir() {
    const steamPath = 'C:\\Program Files (x86)\\Steam\\userdata';
    if (!fs.existsSync(steamPath)) {
        return null;
    }
    const dirs = fs.readdirSync(steamPath).filter(f => fs.statSync(path.join(steamPath, f)).isDirectory());
    if (dirs.length === 0) return null;
    return path.join(steamPath, dirs[0]);
}

async function addToSteam(targetUrl) {
    try {
        const placeIdMatch = targetUrl.match(/[0-9]+/);
        if (!placeIdMatch) {
            throw new Error('Could not find place ID in URL');
        }
        const placeId = placeIdMatch[0];

        console.log(`Fetching game info for Place ID: ${placeId}...`);

        const universeIdResponse = await axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
        const universeId = universeIdResponse.data.universeId;

        const gameNameResponse = await axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
        const gameName = gameNameResponse.data.data[0].name.replace(/[^a-zA-Z0-9 ]/g, ""); // Clean name

        console.log(`Game Name: ${gameName}`);

        // Get game icon
        const iconUrlResponse = await axios.get(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=false`);
        const iconUrl = iconUrlResponse.data.data[0].imageUrl;

        // Ensure icons directory exists
        // When running in pkg, __dirname might be inside snapshot. We should use process.cwd() or a temp dir for icons if we want them to persist or be accessible.
        // However, Steam needs a persistent path for the icon.
        // Let's use a dedicated folder in %APPDATA% or similar to be safe, or just relative to the exe.
        // For now, let's stick to relative to process.cwd() (where the user runs the exe).
        const iconsDir = path.join(process.cwd(), 'gameicons');
        if (!fs.existsSync(iconsDir)) {
            fs.mkdirSync(iconsDir);
        }

        const iconPath = path.join(iconsDir, `${gameName}.ico`);

        console.log(`Downloading icon...`);
        const response = await axios({ method: "get", url: iconUrl, responseType: "stream" });

        const tempPngPath = path.join(iconsDir, 'temp.png');
        const writer = fs.createWriteStream(tempPngPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const buf = await pngToIco(tempPngPath);
        fs.writeFileSync(iconPath, buf);
        fs.unlinkSync(tempPngPath); // Clean up temp file

        console.log(`Icon saved to: ${iconPath}`);

        // Find shortcuts.vdf
        const userDir = findSteamUserDir();
        if (!userDir) {
            throw new Error('Could not find Steam userdata directory. Is Steam installed in the default location?');
        }
        const shortcutsPath = path.join(userDir, 'config', 'shortcuts.vdf');

        console.log(`Reading shortcuts from: ${shortcutsPath}`);

        // Load existing shortcuts
        let shortcuts = { shortcuts: [] };
        if (fs.existsSync(shortcutsPath)) {
            const buffer = fs.readFileSync(shortcutsPath);
            shortcuts = shortcut.parseBuffer(buffer);
        }

        // Add new shortcut
        // IMPORTANT: When packaged, process.execPath is the executable itself.
        // We need to make sure the launcher script is accessible.
        // If packaged, we can't just point to src/steamLauncher.js inside the snapshot.
        // We might need to extract steamLauncher.js to the same folder as the icon or temp.

        // Strategy: Extract steamLauncher.js to iconsDir (which is persistent)
        const launcherPath = path.join(iconsDir, 'steamLauncher.js');
        // We need to read the content of steamLauncher.js from our source (or snapshot) and write it there.
        const sourceLauncherPath = path.join(__dirname, 'steamLauncher.js');
        fs.copyFileSync(sourceLauncherPath, launcherPath);

        const newShortcut = {
            AppName: gameName,
            Exe: `"${process.execPath}"`, // Points to our EXE
            StartDir: `"${iconsDir}"`, // Run from icons dir
            icon: iconPath,
            LaunchOptions: `"${launcherPath}" ${placeId}`, // Pass the extracted launcher path
            IsHidden: false,
            AllowDesktopConfig: true,
            AllowOverlay: true,
            OpenVR: false,
            Devkit: false,
            DevkitGameID: "",
            tags: {}
        };

        // Check if already exists
        const exists = shortcuts.shortcuts.some(s => s.AppName === gameName && s.LaunchOptions === newShortcut.LaunchOptions);
        if (exists) {
            console.log('Shortcut already exists.');
        } else {
            shortcuts.shortcuts.push(newShortcut);
            const newBuffer = shortcut.writeBuffer(shortcuts);
            fs.writeFileSync(shortcutsPath, newBuffer);
            console.log('Shortcut added to Steam!');
            console.log('Please restart Steam to see the new game.');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
    }
}

async function run(gameUrl) {
    if (!gameUrl) {
        console.error('Please specify a Roblox game URL.');
        process.exit(1);
    }
    await addToSteam(gameUrl);
}

module.exports = { run };

if (require.main === module) {
    const url = process.argv[2];
    run(url);
}

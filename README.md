# Roblox to Steam Library

This is a fork of [ImDarkTom/RobloxToDesktopShortcut](https://github.com/ImDarkTom/RobloxToDesktopShortcut).

It extends the original project by adding **Steam Integration**, allowing you to launch Roblox games directly from your Steam Library.

## Features

- **Add to Steam**: Easily add Roblox games as non-Steam games.
- **Status Support**: Steam correctly shows the game as "Running" while you play.
- **Stop Support**: Pressing "Stop" in Steam will correctly close the Roblox process.
- Automatically gets name and icon using the [Roblox API](https://games.roblox.com/docs/index.html).
- Skips opening a browser by launching the game directly.
- Converts game icon into ICO format automatically.

## Steam Usage

To add a Roblox game to Steam:

```bash
npm run steam <roblox_game_url>
```

Example:
```bash
npm run steam https://www.roblox.com/games/920587237/Adopt-Me
```

**Note**: You must restart Steam to see the new game. The shortcut includes a helper script to ensure Steam correctly detects when you are playing.
## License

[MIT](https://choosealicense.com/licenses/mit/)

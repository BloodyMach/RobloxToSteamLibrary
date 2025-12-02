# Roblox to Desktop Shortcut

A small NodeJS project that turns a Roblox game URL into a desktop shortcut.
## Features

- Automatically gets name and icon using the [Roblox API](https://games.roblox.com/docs/index.html).
- Skips opening a browser by launching the game directly.
- Converts game icon into ICO format automatically.
- **Steam Integration**: Adds Roblox games as non-Steam games to your library with "Running" status support.

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

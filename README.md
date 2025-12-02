# Roblox to Steam Library

This is a fork of [ImDarkTom/RobloxToDesktopShortcut](https://github.com/ImDarkTom/RobloxToDesktopShortcut).

It adapts the project for **Steam**, allowing you to launch Roblox games directly from your Steam Library.

## Features

- **Add to Steam**: Easily add Roblox games as non-Steam games.
- **Status Support**: Steam correctly shows the game as "Running" while you play.
- **Stop Support**: Pressing "Stop" in Steam will close the Roblox process.
- Automatically gets name and icon using the [Roblox API](https://games.roblox.com/docs/index.html).
- Skips opening a browser by launching the game directly.
- Converts game icon into ICO format automatically.

## Getting Started

Follow these steps to set up the program.

### 1. Prerequisites

Before you begin, you need to have **Node.js** installed on your computer. If you don't have it, you can download it here:

-   **[Download Node.js](https://nodejs.org/)**
.

## How to Use

### To use the GUI

1.  **Run the Application**: Double-click on `run_gui.bat` to start the program.
2.  **Enter Game URL**: Paste the full URL of the Roblox game you want to add (e.g., `https://www.roblox.com/games/123456/Game-Name`).
3.  **Add to Steam**: Click the "Add to Steam" button.
4.  **Restart Steam**: You must restart Steam (make sure to close the background processs as well) to see the new shortcut in your library.

### To use command line

If you prefer using the command line, you can add a game directly using `npm`:

```bash
npm run steam <roblox_game_url>
```

Example:
```bash
npm run steam https://www.roblox.com/games/920587237/Adopt-Me
```




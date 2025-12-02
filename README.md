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

## Getting Started

Follow these steps to set up the program.

### 1. Prerequisites

Before you begin, you need to have **Node.js** installed on your computer. If you don't have it, you can download it here:

-   **[Download Node.js](https://nodejs.org/)**

## Steam Usage

To add a Roblox game to Steam:

```bash
npm run steam <roblox_game_url>
```

Example:
```bash
npm run steam https://www.roblox.com/games/920587237/Adopt-Me
```

**Note**: You must restart Steam (make sure to close the background process as well) to see the new game.

## GUI Usage

You can also use the graphical interface:

1.  Double-click `run_gui.bat`.
2.  Enter the URL and click **Add to Steam**.
## Installation

1.  Install [Node.js](https://nodejs.org/).
2.  Download this repository.
3.  Open a terminal in the folder and run:
    ```bash
    npm install
    ```

## Usage

### GUI (Recommended)
Double-click `run_gui.bat`.

### Command Line
```bash
npm run steam <roblox_game_url>
```


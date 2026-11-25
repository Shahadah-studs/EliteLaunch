# EliteLaunch

EliteLaunch is a lightweight, browser-based launcher for **EaglerCraft 1.8.8**. It provides a clean interface and supports launching the game in an embedded frame, a new browser tab, or an `about:blank` tab.

**Live site:** https://shahadah-studs.github.io/EliteLaunch/

## Features

- **Release 1.8.8 (IR Edition)** support
- Embedded fullscreen game view
- Launch in a new browser tab
- Launch in an `about:blank` cloak tab
- Remembers the selected launch mode with `localStorage`
- Responsive interface for desktop and mobile screens
- No build tools or package installation required

## Available Launch Modes

- **Fullscreen Embedded Frame** — Opens the game inside the EliteLaunch overlay.
- **New Browser Tab** — Opens the game HTML file in a separate tab.
- **about:blank Cloak Tab** — Opens a blank tab containing the game in a fullscreen iframe.

> Some browsers may block popup launch modes. Allow popups for EliteLaunch if the game does not open.

## Project Structure

```text
EliteLaunch/
├── index.html                 # Launcher interface
├── style.css                  # Layout and visual styling
├── script.js                  # Launch controls and game modes
└── Eaglercraft_IR_1.8.8.html  # Bundled EaglerCraft 1.8.8 web build
```

## Run Locally

Because EliteLaunch runs entirely in the browser, no build step is required.

### Option 1: Open directly

Open `index.html` in a modern browser.

### Option 2: Use a local server

Using Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

### Option 3: Use VS Code Live Server

1. Open the repository in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings** in the GitHub repository.
3. Navigate to **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder.
6. Save the settings.

The site will become available at:

```text
https://shahadah-studs.github.io/EliteLaunch/
```

## Browser Compatibility

A current version of Chrome, Edge, Firefox, or Safari is recommended. Fullscreen support may vary between browsers.

## Planned Versions

- EaglerCraft 1.5.2
- EaglerCraft Beta 1.7.3

## Disclaimer

EliteLaunch is an independent launcher interface. It is not affiliated with Mojang AB or Microsoft.

## License

No license is currently specified for this repository. All rights for contributions, redistribution, or commercial use should be confirmed with the repository owner before use.

document.addEventListener("DOMContentLoaded", () => {
    const versionSelect = document.getElementById("version-select");
    const launchModeSelect = document.getElementById("launch-mode");
    const launchBtn = document.getElementById("launch-btn");
    const statusMessage = document.getElementById("status-message");

    const gameOverlay = document.getElementById("game-overlay");
    const gameFrame = document.getElementById("game-frame");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const closeGameBtn = document.getElementById("close-game-btn");

    // Save user's preferred launch mode locally
    const savedMode = localStorage.getItem("elitelaunch_mode");
    if (savedMode) {
        launchModeSelect.value = savedMode;
    }

    launchModeSelect.addEventListener("change", () => {
        localStorage.setItem("elitelaunch_mode", launchModeSelect.value);
    });

    // Launch Handler
    launchBtn.addEventListener("click", () => {
        const targetFile = versionSelect.value;
        const mode = launchModeSelect.value;

        if (!targetFile || targetFile === "coming-soon") {
            statusMessage.textContent = "Please select an available version.";
            return;
        }

        statusMessage.textContent = `Initializing ${targetFile}...`;

        if (mode === "embed") {
            // Load inside the built-in overlay iframe
            gameFrame.src = targetFile;
            gameOverlay.classList.remove("hidden");
            statusMessage.textContent = "";
        } else if (mode === "tab") {
            // Open directly in a new tab
            window.open(targetFile, "_blank");
            statusMessage.textContent = "Opened in a new tab!";
        } else if (mode === "cloak") {
            // Open inside an about:blank window
            const win = window.open("about:blank", "_blank");
            if (!win) {
                statusMessage.textContent = "Popup blocked! Please allow popups for cloak mode.";
                return;
            }
            const fullUrl = new URL(targetFile, window.location.href).href;
            win.document.open();
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>New Tab</title>
                    <style>
                        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
                        iframe { width: 100%; height: 100%; border: none; }
                    </style>
                </head>
                <body>
                    <iframe src="${fullUrl}" allowfullscreen></iframe>
                </body>
                </html>
            `);
            win.document.close();
            statusMessage.textContent = "Launched in cloaked tab!";
        }
    });

    // Fullscreen toggle for embedded mode
    fullscreenBtn.addEventListener("click", () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) {
            gameFrame.webkitRequestFullscreen();
        }
    });

    // Close embedded game
    closeGameBtn.addEventListener("click", () => {
        gameOverlay.classList.add("hidden");
        gameFrame.src = "";
    });
});

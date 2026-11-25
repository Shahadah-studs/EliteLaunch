document.addEventListener("DOMContentLoaded", () => {
    const versionSelect = document.getElementById("version-select");
    const launchModeSelect = document.getElementById("launch-mode");
    const launchBtn = document.getElementById("launch-btn");
    const launchText = document.getElementById("launch-text");
    const statusMessage = document.getElementById("status-message");

    const bannerTitle = document.getElementById("banner-title");
    const bannerDesc = document.getElementById("banner-desc");

    const gameOverlay = document.getElementById("game-overlay");
    const overlayTitle = document.getElementById("overlay-title");
    const gameFrame = document.getElementById("game-frame");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const closeGameBtn = document.getElementById("close-game-btn");

    // Update UI labels based on selected version
    function updateVersionUI() {
        const selectedOption = versionSelect.options[versionSelect.selectedIndex];
        if (!selectedOption || selectedOption.value === "coming-soon") return;

        const shortName = selectedOption.getAttribute("data-short") || "Game";
        const title = selectedOption.getAttribute("data-title") || "Minecraft Web Edition";
        const desc = selectedOption.getAttribute("data-desc") || "";

        launchText.textContent = `LAUNCH ${shortName.toUpperCase()}`;
        bannerTitle.textContent = title;
        bannerDesc.textContent = desc;
        overlayTitle.innerHTML = `EliteLaunch &mdash; ${shortName}`;
    }

    // Restore saved preferences
    const savedVersion = localStorage.getItem("elitelaunch_version");
    if (savedVersion) {
        const optionExists = Array.from(versionSelect.options).some(
            (opt) => opt.value === savedVersion && !opt.disabled
        );
        if (optionExists) {
            versionSelect.value = savedVersion;
        }
    }

    const savedMode = localStorage.getItem("elitelaunch_mode");
    if (savedMode) {
        launchModeSelect.value = savedMode;
    }

    // Initialize UI on load
    updateVersionUI();

    versionSelect.addEventListener("change", () => {
        localStorage.setItem("elitelaunch_version", versionSelect.value);
        updateVersionUI();
    });

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
            gameFrame.src = targetFile;
            gameOverlay.classList.remove("hidden");
            statusMessage.textContent = "";
        } else if (mode === "tab") {
            window.open(targetFile, "_blank");
            statusMessage.textContent = "Opened in a new tab!";
        } else if (mode === "cloak") {
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

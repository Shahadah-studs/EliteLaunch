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
    const focusGameBtn = document.getElementById("focus-game-btn");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const closeGameBtn = document.getElementById("close-game-btn");

    // Helper: Force focus into the game iframe and its internal canvas/inputs
    function focusGameCanvas() {
        if (gameOverlay.classList.contains("hidden")) return;
        
        // Blur any active button on the parent launcher so Spacebar doesn't click it
        if (document.activeElement && document.activeElement !== gameFrame) {
            document.activeElement.blur();
        }

        gameFrame.focus();

        try {
            if (gameFrame.contentWindow) {
                gameFrame.contentWindow.focus();
                const innerDoc = gameFrame.contentDocument || gameFrame.contentWindow.document;
                if (innerDoc) {
                    const canvas = innerDoc.querySelector("canvas");
                    if (canvas) {
                        canvas.setAttribute("tabindex", "0");
                        canvas.focus();
                    }
                }
            }
        } catch (err) {
            // Safe fallback if browser restricts cross-context access
        }
    }

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

    updateVersionUI();

    versionSelect.addEventListener("change", () => {
        localStorage.setItem("elitelaunch_version", versionSelect.value);
        updateVersionUI();
    });

    launchModeSelect.addEventListener("change", () => {
        localStorage.setItem("elitelaunch_mode", launchModeSelect.value);
    });

    // Prevent parent page from hijacking Space/Arrow keys while game is open
    window.addEventListener("keydown", (e) => {
        if (!gameOverlay.classList.contains("hidden")) {
            if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
                if (document.activeElement !== gameFrame) {
                    e.preventDefault();
                    focusGameCanvas();
                }
            }
        }
    });

    // Automatically focus game whenever iframe loads or user clicks/hovers it
    gameFrame.addEventListener("load", () => {
        focusGameCanvas();
        try {
            const innerWin = gameFrame.contentWindow;
            if (innerWin) {
                innerWin.addEventListener("mousedown", focusGameCanvas);
                innerWin.addEventListener("keydown", (e) => {
                    // Prevent Spacebar from scrolling the inner document
                    if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                        e.preventDefault();
                    }
                });
            }
        } catch (err) {}
    });

    gameFrame.addEventListener("mouseenter", focusGameCanvas);

    // Launch Handler
    launchBtn.addEventListener("click", () => {
        const targetFile = versionSelect.value;
        const mode = launchModeSelect.value;

        if (!targetFile || targetFile === "coming-soon") {
            statusMessage.textContent = "Please select an available version.";
            return;
        }

        launchBtn.blur();
        statusMessage.textContent = `Initializing ${targetFile}...`;

        if (mode === "embed") {
            gameFrame.src = targetFile;
            gameOverlay.classList.remove("hidden");
            statusMessage.textContent = "";
            setTimeout(focusGameCanvas, 200);
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
                    <iframe 
                        src="${fullUrl}" 
                        allow="pointer-lock; fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-popups"
                        allowfullscreen>
                    </iframe>
                </body>
                </html>
            `);
            win.document.close();
            statusMessage.textContent = "Launched in cloaked tab!";
        }
    });

    // Manual Refocus button in top bar
    focusGameBtn.addEventListener("click", () => {
        focusGameBtn.blur();
        focusGameCanvas();
    });

    // Fullscreen toggle for embedded mode
    fullscreenBtn.addEventListener("click", () => {
        fullscreenBtn.blur();
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen().then(focusGameCanvas).catch(() => {});
        } else if (gameFrame.webkitRequestFullscreen) {
            gameFrame.webkitRequestFullscreen();
            focusGameCanvas();
        }
    });

    // Close embedded game
    closeGameBtn.addEventListener("click", () => {
        gameOverlay.classList.add("hidden");
        gameFrame.src = "";
    });
});

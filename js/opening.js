/* =========================================
   ENTRY PAGE → CHAPTER MENU
   BUBBLE DISSOLVE TRANSITION
========================================= */

(() => {
    const entryPage = document.getElementById("entry-page");

    if (!entryPage) return;

    let isNavigating = false;
    let touchStartY = 0;

    const transition = document.createElement("div");
    transition.className = "page-transition";
    transition.setAttribute("aria-hidden", "true");

    // Buat gelembung dengan posisi dan ukuran berbeda
    const bubbles = [
        [12, 18, 150],
        [82, 20, 190],
        [24, 72, 220],
        [72, 78, 170],
        [50, 35, 120],
        [42, 88, 150],
        [92, 52, 140],
        [7, 48, 180],
        [60, 12, 100],
        [34, 42, 130],
        [88, 88, 110],
        [18, 90, 120],
        [56, 63, 190],
        [39, 10, 90],
        [96, 35, 130],
        [4, 75, 100]
    ];

    bubbles.forEach(([x, y, size], index) => {
        const bubble = document.createElement("span");

        bubble.className = "transition-bubble";
        bubble.style.left = `${x}%`;
        bubble.style.top = `${y}%`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.marginLeft = `${-size / 2}px`;
        bubble.style.marginTop = `${-size / 2}px`;
        bubble.style.animationDelay = `${(index % 5) * 45}ms`;

        transition.appendChild(bubble);
    });

    document.body.appendChild(transition);

    function goToChapterMenu() {
        // Tunggu sampai loading selesai
        if (document.body.classList.contains("is-loading")) {
            return;
        }

        if (isNavigating) return;
        isNavigating = true;

        transition.classList.add("is-active");

        // Pindah setelah efek transisi selesai
        window.setTimeout(() => {
            window.location.href = "chapters/chaptermenu/index.html";
        }, 1200);
    }

    // Scroll mouse / touchpad
    window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) {
            goToChapterMenu();
        }
    }, { passive: true });

    // Swipe ke atas pada HP dan tablet
    window.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (event) => {
        const touchEndY = event.changedTouches[0].clientY;

        if (touchStartY - touchEndY > 50) {
            goToChapterMenu();
        }
    }, { passive: true });

    // Klik tulisan Scroll to begin juga memulai transisi
    const scrollIndicator = entryPage.querySelector(".scroll-indicator");

    if (scrollIndicator) {
        scrollIndicator.style.cursor = "pointer";

        scrollIndicator.addEventListener("click", goToChapterMenu);
    }

    // Saat kembali dengan tombol Back, reset supaya tidak macet di layar transisi
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            isNavigating = false;
            transition.classList.remove("is-active");
        }
    });

    // Keyboard: panah bawah / Page Down, atau Enter/Spasi pada tulisan Scroll
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "PageDown") {
            goToChapterMenu();
        }
    });

    scrollIndicator?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goToChapterMenu();
        }
    });

/* =========================================
   SOUND — klik tombol = putar / jeda musik,
   ikon SoundOn / SoundOff ikut berganti.
   Tempel di PALING BAWAH js/opening.js
   (setelah penutup })(); yang terakhir).
========================================= */
(() => {
    const audio = document.getElementById("background-audio");
    const button = document.getElementById("audio-toggle");
    const icon = document.getElementById("audio-icon");

    if (!audio || !button || !icon) return;

    const ON = "assets/global/icons/SoundOn.webp";
    const OFF = "assets/global/icons/SoundOff.webp";

    audio.volume = 0.5;

    const isPlaying = () => !audio.paused && !audio.muted && audio.volume > 0;

    // Ganti ikon sesuai kondisi audio
    const sync = () => {
        const playing = isPlaying();
        const target = playing ? ON : OFF;

        if (icon.getAttribute("src") !== target) {
            icon.setAttribute("src", target);
        }

        button.setAttribute(
            "aria-label",
            playing ? "Matikan musik" : "Nyalakan musik"
        );
    };

    // Klik tombol: diambil alih di sini (capture) supaya tidak bentrok
    // dengan pengendali klik lama di audio.js
    document.addEventListener("click", async (event) => {
        if (!event.target.closest("#audio-toggle")) return;

        event.stopImmediatePropagation();

        if (isPlaying()) {
            audio.pause();
        } else {
            audio.muted = false;

            try {
                await audio.play();
            } catch (error) {
                console.error(
                    "Musik gagal diputar. Cek lokasi file audio:",
                    audio.currentSrc,
                    error
                );
            }
        }

        sync();
    }, true);

    // Ikon juga ikut berubah kalau audio berubah dari tempat lain
    ["play", "playing", "pause", "ended", "volumechange"].forEach((name) =>
        audio.addEventListener(name, sync)
    );

    sync();
})();

})();

document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // SIDEBAR (UNTUK CHAPTER)
    // =========================
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    function closeSidebar() {
        sidebar?.classList.remove("active");
    }

    menuToggle?.addEventListener("click", () => {
        sidebar?.classList.add("active");
    });

    sidebarClose?.addEventListener("click", closeSidebar);

    // =========================
    // ABOUT IMAGE OVERLAY
    // =========================
    const aboutToggle = document.getElementById("aboutToggle");
    const aboutOverlay = document.getElementById("aboutOverlay");
    const aboutClose = document.getElementById("aboutClose");

    function openAbout(event) {
        event?.preventDefault();

        if (!aboutOverlay) return;

        // Tutup sidebar agar About tampil sebagai overlay mandiri
        closeSidebar();

        // Tampilkan overlay di atas seluruh halaman
        aboutOverlay.classList.add("active");
        aboutOverlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("about-open");

        // Fokuskan tombol tutup jika tersedia
        aboutClose?.focus();
    }

    function closeAbout() {
        if (!aboutOverlay) return;

        aboutOverlay.classList.remove("active");
        aboutOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("about-open");

        // Kembalikan fokus ke tombol About
        aboutToggle?.focus();
    }

    aboutToggle?.addEventListener("click", openAbout);
    aboutClose?.addEventListener("click", closeAbout);

    // Tutup jika area gelap di luar gambar diklik
    aboutOverlay?.addEventListener("click", (event) => {
        if (event.target === aboutOverlay) {
            closeAbout();
        }
    });

    // =========================
    // BACKSOUND
    // =========================
    const soundToggle = document.getElementById("soundToggle");
    const soundIcon = document.getElementById("soundIcon");
    const backgroundMusic = document.getElementById("backgroundMusic");

    if (soundToggle && backgroundMusic) {
        function updateSoundState() {
            const isPlaying = !backgroundMusic.paused;

            soundToggle.setAttribute(
                "aria-pressed",
                String(isPlaying)
            );

            soundToggle.setAttribute(
                "aria-label",
                isPlaying ? "Matikan musik" : "Nyalakan musik"
            );

            if (soundIcon) {
                soundIcon.src = isPlaying
                    ? "../../assets/global/icons/SoundOn.webp"
                    : "../../assets/global/icons/SoundOff.webp";
            }
        }

        soundToggle.addEventListener("click", async () => {
            try {
                if (backgroundMusic.paused) {
                    await backgroundMusic.play();
                } else {
                    backgroundMusic.pause();
                }
            } catch (error) {
                console.error(
                    "Backsound gagal diputar:",
                    error
                );
            }

            updateSoundState();
        });

        backgroundMusic.addEventListener("play", updateSoundState);
        backgroundMusic.addEventListener("pause", updateSoundState);

        updateSoundState();
    }

    // =========================
    // KEYBOARD
    // =========================
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (aboutOverlay?.classList.contains("active")) {
                closeAbout();
            } else {
                closeSidebar();
            }
        }
    });
});

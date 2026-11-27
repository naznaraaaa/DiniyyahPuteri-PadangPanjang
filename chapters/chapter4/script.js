document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       TOMBOL MENU
    ========================================= */
    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle) {
        menuToggle.classList.remove("is-hidden");
        menuToggle.style.setProperty("display", "flex", "important");
        menuToggle.style.setProperty("opacity", "1", "important");
        menuToggle.style.setProperty("visibility", "visible", "important");
        menuToggle.style.setProperty("pointer-events", "auto", "important");
    }

    /* =========================================
       SIDEBAR
    ========================================= */
    const sidebar = document.getElementById("sidebar");
    const sidebarClose = document.getElementById("sidebarClose");

    const openSidebar = () => sidebar?.classList.add("active");
    const closeSidebar = () => sidebar?.classList.remove("active");

    menuToggle?.addEventListener("click", openSidebar);
    sidebarClose?.addEventListener("click", closeSidebar);

    /* =========================================
       ABOUT OVERLAY
    ========================================= */
    const aboutToggle = document.getElementById("aboutToggle");
    const aboutOverlay = document.getElementById("aboutOverlay");
    const aboutClose = document.getElementById("aboutClose");

    function openAbout() {
        if (!aboutOverlay) return;
        aboutOverlay.classList.add("active");
        aboutOverlay.setAttribute("aria-hidden", "false");
        aboutToggle?.setAttribute("aria-expanded", "true");
    }

    function closeAbout() {
        if (!aboutOverlay) return;
        aboutOverlay.classList.remove("active");
        aboutOverlay.setAttribute("aria-hidden", "true");
        aboutToggle?.setAttribute("aria-expanded", "false");
    }

    aboutToggle?.addEventListener("click", openAbout);
    aboutClose?.addEventListener("click", closeAbout);

    aboutOverlay?.addEventListener("click", (event) => {
        if (event.target === aboutOverlay) closeAbout();
    });

    /* =========================================
       SOUND TOGGLE
    ========================================= */
    (() => {
        const soundToggle = document.getElementById("soundToggle");
        const soundIcon = document.getElementById("soundIcon");
        const backgroundMusic = document.getElementById("backgroundMusic");

        if (!soundToggle || !soundIcon || !backgroundMusic) return;

        const soundOn = "../../assets/global/icons/SoundOn.webp";
        const soundOff = "../../assets/global/icons/SoundOff.webp";

        const setState = (playing) => {
            soundIcon.src = playing ? soundOn : soundOff;
            soundToggle.setAttribute("aria-pressed", String(playing));
            soundToggle.setAttribute(
                "aria-label",
                playing ? "Matikan musik" : "Nyalakan musik"
            );
        };

        backgroundMusic.volume = 0.5;
        backgroundMusic.pause();
        setState(false);

        soundToggle.addEventListener("click", async () => {
            if (backgroundMusic.paused) {
                try {
                    await backgroundMusic.play();
                } catch (error) {
                    console.error("Musik gagal diputar:", error);
                }
            } else {
                backgroundMusic.pause();
            }
        });

        backgroundMusic.addEventListener("play", () => setState(true));
        backgroundMusic.addEventListener("pause", () => setState(false));
    })();

    /* =========================================
       KARTU ALUMNI
       Klik kartu  → kartu melebar & menampilkan penjelasan,
                     kartu lain menghilang.
       Klik lagi / klik di luar / tekan Esc → kembali semula.
    ========================================= */
    const alumniGrid = document.getElementById("alumniGrid");
    const alumniCards = alumniGrid
        ? Array.from(alumniGrid.querySelectorAll(".alumni-card"))
        : [];

    let refreshTimer;
    function refreshScrollLater() {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        }, 900);
    }

    function setCardState(card, state) {
        const photo = card.querySelector(".alumni-photo");

        card.classList.toggle("is-open", state === "open");
        card.classList.toggle("is-hidden", state === "hidden");
        photo?.setAttribute("aria-expanded", String(state === "open"));

        // Kartu yang disembunyikan tidak boleh bisa difokus keyboard
        card.inert = state === "hidden";
    }

    function openCard(target) {
        alumniGrid.classList.add("has-open");
        alumniCards.forEach((card) =>
            setCardState(card, card === target ? "open" : "hidden")
        );
        refreshScrollLater();
    }

    function closeCards() {
        alumniGrid.classList.remove("has-open");
        alumniCards.forEach((card) => setCardState(card, "closed"));
        refreshScrollLater(); 
    }

    if (alumniGrid) {
        alumniCards.forEach((card) => {
            const photo = card.querySelector(".alumni-photo");
            const panel = card.querySelector(".alumni-panel");

            photo?.addEventListener("click", () => {
                card.classList.contains("is-open")
                    ? closeCards()
                    : openCard(card);
            });

            // Klik pada panel penjelasan juga menutup kartu
            panel?.addEventListener("click", closeCards);
        });

        // Klik di luar area kartu menutup kartu
        document.addEventListener("click", (event) => {
            if (!alumniGrid.classList.contains("has-open")) return;
            if (event.target.closest(".alumni-card")) return;
            closeCards();
        });
    }

    /* =========================================
       ESC: tutup kartu, About, dan sidebar
    ========================================= */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeAbout();
        closeSidebar();
        if (alumniGrid?.classList.contains("has-open")) closeCards();
    });

    /* =========================================
       ANIMASI SCROLL (GSAP + ScrollTrigger)
       Bagian di atas tetap berjalan walau GSAP gagal dimuat.
    ========================================= */
    const hasGsap =
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined";

    if (!hasGsap) {
        console.error("GSAP atau ScrollTrigger belum dimuat.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const paper = document.querySelector(".chapter-paper");
    const heading = document.querySelector(".chapter-heading");
    const curve = document.querySelector(".curve-bottom");

    /* Samakan ukuran kertas dengan akhir transisi dari menu */
    const isEnteringFromMenu =
        sessionStorage.getItem("fromChapterMenu") === "chapter4";

    if (paper && isEnteringFromMenu) {
        const savedWidth = Number(sessionStorage.getItem("paperFinalWidth"));
        const savedHeight = Number(sessionStorage.getItem("paperFinalHeight"));

        if (savedWidth > 0 && savedHeight > 0) {
            paper.style.setProperty("width", ${savedWidth}px, "important");
            paper.style.setProperty("height", ${savedHeight}px, "important");
            paper.style.setProperty("max-width", "none", "important");
            paper.style.setProperty("max-height", "none", "important");
            paper.style.setProperty("object-fit", "contain", "important");
        }
    }

    sessionStorage.removeItem("fromChapterMenu");

    if (paper) {
        gsap.set(paper, {
            scale: 1,
            transformOrigin: "center center",
            force3D: false
        });
    }

    if (heading) {
        gsap.set(heading, { opacity: 1, y: 0 });
    }

    /* Kurva membesar mengikuti scroll */
    if (curve) {
        gsap.set(curve, { xPercent: -50 });

        gsap.to(curve, {
            height: "160vh",
            width: "200vw",
            ease: "none",
            scrollTrigger: {
                trigger: ".chapter-opening",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }

    /* Judul memudar saat mulai scroll */
    if (heading) {
        gsap.to(heading, {
            opacity: 0,
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: ".chapter-opening",
                start: "top top",
                end: "+=300",
                scrub: true
            }
        });
    }

    /* Muncul perlahan saat di-scroll */
    const reveal = (selector, start, end) => {
        const el = document.querySelector(selector);
        if (!el) return;

        gsap.fromTo(
            el,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start,
                    end,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        );
    };

    reveal(".intro-paper", "top 100%", "top 80%");   // sebelumnya "top 90%", "top 65%"
    reveal(".alumni-grid", "top 95%", "top 72%");    // sebelumnya "top 92%", "top 68%"

    /* Penutup: muncul satu per satu */
    reveal(".closing-label", "top 92%", "top 78%");
    reveal(".closing-title", "top 90%", "top 68%");
    reveal(".closing-text",  "top 88%", "top 62%");

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});

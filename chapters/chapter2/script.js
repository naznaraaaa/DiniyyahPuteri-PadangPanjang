
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
    menuToggle.classList.remove("is-hidden");
    menuToggle.style.setProperty("display", "flex", "important");
    menuToggle.style.setProperty("opacity", "1", "important");
    menuToggle.style.setProperty("visibility", "visible", "important");
    menuToggle.style.setProperty("pointer-events", "auto", "important");
}

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        console.error("GSAP atau ScrollTrigger belum dimuat.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const paper = document.querySelector(".chapter-paper");
    const wrapper = document.querySelector(".paper-wrapper");
    const heading = document.querySelector(".chapter-heading");
    const videoFrame = document.querySelector(".video-frame");
    const story = document.querySelector(".story");

    const enteredChapter = sessionStorage.getItem("fromChapterMenu");
    const isEnteringFromMenu = enteredChapter === "chapter2";

    /*
     * SAMAKAN UKURAN KERTAS DENGAN AKHIR TRANSISI MENU
     *
     * Tidak mengatur scale kembali ke 1.
     * Tidak menggunakan object-fit: cover yang dapat
     * memotong gambar dan mengubah tampilan PNG.
     */
    if (paper && isEnteringFromMenu) {
        const savedWidth = Number(
            sessionStorage.getItem("paperFinalWidth")
        );

        const savedHeight = Number(
            sessionStorage.getItem("paperFinalHeight")
        );

        if (savedWidth > 0 && savedHeight > 0) {
            paper.style.setProperty(
                "width",
                `${savedWidth}px`,
                "important"
            );

            paper.style.setProperty(
                "height",
                `${savedHeight}px`,
                "important"
            );

            paper.style.setProperty(
                "max-width",
                "none",
                "important"
            );

            paper.style.setProperty(
                "max-height",
                "none",
                "important"
            );

            paper.style.setProperty(
                "object-fit",
                "contain",
                "important"
            );
        }

       if (wrapper && savedWidth > 0 && savedHeight > 0) {
    wrapper.style.setProperty("width", `${savedWidth}px`, "important");
    wrapper.style.setProperty("max-width", "none", "important");
    wrapper.style.setProperty("position", "relative", "important");
    wrapper.style.setProperty("margin", "0 auto", "important");
         }
    }

    // Jangan lakukan animasi scale pada kertas.
    if (paper) {
        gsap.set(paper, {
            scale: 1,
            transformOrigin: "center center",
            force3D: false
        });
     }
     if (heading) {
    gsap.set(heading, {
        opacity: 1,
        y: 0
    });
}

    /* KURVA SCROLL TRANSITION */
    const curve = document.querySelector(".curve-bottom");

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

    /*
     * Jangan hapus ukuran akhir dari sessionStorage.
     * Nilai ini dapat digunakan selama halaman chapter
     * masih membutuhkan ukuran tersebut.
     */
    sessionStorage.removeItem("fromChapterMenu");

/* SIDEBAR */
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");

function openSidebar() {
    sidebar?.classList.add("active");
}

function closeSidebar() {
    sidebar?.classList.remove("active");
}

menuToggle?.addEventListener("click", openSidebar);
sidebarClose?.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        sidebar?.classList.contains("active")
    ) {
        closeSidebar();
    }
});

    // STORY REVEAL
    if (story) {
        gsap.fromTo(
            story,
            {
                y: 70,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: story,
                    start: "top 80%",
                    end: "top 55%",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        );
    }

    // Perbarui pengukuran setelah gambar dan layout siap.
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});

// ABOUT OVERLAY
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

aboutOverlay?.addEventListener("click", function (event) {
  if (event.target === aboutOverlay) {
    closeAbout();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAbout();
  }
});

// SOUND TOGGLE
(() => {
    const soundToggle = document.getElementById("soundToggle");
    const soundIcon = document.getElementById("soundIcon");
    const backgroundMusic = document.getElementById("backgroundMusic");

    if (!soundToggle || !soundIcon || !backgroundMusic) {
        console.error("Elemen sound tidak ditemukan.");
        return;
    }

    const soundOn = "../../assets/global/icons/SoundOn.png";
    const soundOff = "../../assets/global/icons/SoundOff.png";

    // Kondisi awal
    backgroundMusic.volume = 0.5;
    backgroundMusic.pause();
    soundIcon.src = soundOff;
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.setAttribute("aria-label", "Nyalakan musik");

    // Tombol untuk menyalakan atau mematikan musik
    soundToggle.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();

                soundIcon.src = soundOn;
                soundToggle.setAttribute("aria-pressed", "true");
                soundToggle.setAttribute("aria-label", "Matikan musik");
            } catch (error) {
                console.error("Musik gagal diputar:", error);
            }
        } else {
            backgroundMusic.pause();

            soundIcon.src = soundOff;
            soundToggle.setAttribute("aria-pressed", "false");
            soundToggle.setAttribute("aria-label", "Nyalakan musik");
        }
    });

    // Sinkronkan ikon dengan kondisi audio
    backgroundMusic.addEventListener("play", () => {
        soundIcon.src = soundOn;
        soundToggle.setAttribute("aria-pressed", "true");
        soundToggle.setAttribute("aria-label", "Matikan musik");
    });

    backgroundMusic.addEventListener("pause", () => {
        soundIcon.src = soundOff;
        soundToggle.setAttribute("aria-pressed", "false");
        soundToggle.setAttribute("aria-label", "Nyalakan musik");
    });

    backgroundMusic.addEventListener("error", () => {
        console.error(
            "File Backsound.mp3 tidak bisa dimuat. Periksa lokasi file audio."
        );
    });
})();
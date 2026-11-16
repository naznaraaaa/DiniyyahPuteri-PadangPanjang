document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
    menuToggle.classList.remove("is-hidden");
    menuToggle.style.setProperty("display", "flex", "important");
    menuToggle.style.setProperty("opacity", "1", "important");
    menuToggle.style.setProperty("visibility", "visible", "important");
    menuToggle.style.setProperty("pointer-events", "auto", "important");
}

    /* GSAP CHECK */
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        console.error("GSAP atau ScrollTrigger belum dimuat.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

/* CURVE SCROLL TRANSITION */
    const creamCurve = document.querySelector(".cream-curve-bottom");
    const chapterHeading = document.querySelector(".chapter-heading");

    if (creamCurve) {
        gsap.to(creamCurve, {
            height: "160vh",
            width: "200vw",   // sebelumnya 350vw, ini yang membuat kurva rata
            ease: "none",
            scrollTrigger: {
                trigger: ".chapter-opening",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
            }
        });

        gsap.to(".opening-sticky", {
            backgroundColor: "#eee2cc",
            ease: "none",
            scrollTrigger: {
                trigger: ".chapter-opening",
                start: "60% top",
                end: "bottom top",
                scrub: true,
            }
        });
    }

    if (chapterHeading) {
        gsap.to(chapterHeading, {
            opacity: 0,
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: ".chapter-opening",
                start: "top top",
                end: "+=300",
                scrub: true,
            }
        });
    }
    
    const paper = document.querySelector(".chapter-paper");
    const wrapper = document.querySelector(".paper-wrapper");
    const heading = document.querySelector(".chapter-heading");
    const videoFrame = document.querySelector(".video-frame");
    const story = document.querySelector(".story");

    const enteredChapter = sessionStorage.getItem("fromChapterMenu");
    const isEnteringFromMenu = enteredChapter === "chapter1";

    /* SAMAKAN UKURAN KERTAS DARI TRANSISI MENU */
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
            wrapper.style.setProperty(
                "width",
                `${savedWidth}px`,
                "important"
            );

            wrapper.style.setProperty(
                "max-width",
                "none",
                "important"
            );

            wrapper.style.setProperty(
                "position",
                "relative",
                "important"
            );

            wrapper.style.setProperty(
                "margin",
                "0 auto",
                "important"
            );
        }
    }

    /* Jangan animasikan scale kertas */
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

    
    /*
    * Ukuran bulatan sudah disiapkan di atas.
    * Tampilkan elemen setelah konfigurasi awal selesai.
    */

    if (isEnteringFromMenu) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const paper = document.getElementById("chapterTransition");
                const heading = document.querySelector(".chapter-heading");

                document.documentElement.classList.remove("is-entering-chapter");

                if (typeof gsap !== "undefined") {
                    gsap.fromTo(
                        [paper, heading].filter(Boolean),
                        {
                            autoAlpha: 0
                        },
                        {
                            autoAlpha: 1,
                            duration: 0.65,
                            ease: "power2.out",
                            stagger: 0.08,
                            clearProps: "opacity,visibility"
                        }
                    );
                } else {
                    if (paper) paper.style.visibility = "visible";
                    if (heading) heading.style.visibility = "visible";
                }

                sessionStorage.removeItem("fromChapterMenu");
            });
        });
    } else {
        sessionStorage.removeItem("fromChapterMenu");
    }



    /* VIDEO PLAY BUTTON */
    const chapterVideo = document.getElementById("chapterVideo");
    const videoPlayButton = document.getElementById("videoPlayButton");
    const videoFrameElement = document.querySelector(".video-frame");

    if (chapterVideo && videoPlayButton && videoFrameElement) {
        videoPlayButton.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (chapterVideo.paused || chapterVideo.ended) {
                try {
                    await chapterVideo.play();
                } catch (error) {
                    console.error("Video gagal diputar:", error);
                }
            } else {
                chapterVideo.pause();
            }
        });

        chapterVideo.addEventListener("play", () => {
            videoFrameElement.classList.add("is-playing");
            videoPlayButton.innerHTML = "Ⅱ";
            videoPlayButton.setAttribute("aria-label", "Jeda video");
        });

        chapterVideo.addEventListener("pause", () => {
            videoFrameElement.classList.remove("is-playing");

            videoPlayButton.innerHTML = `
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    aria-hidden="true"
                >
                    <path
                        d="M8 4 L20 12 L8 20 Z"
                        fill="currentColor"
                    />
                </svg>
            `;

            videoPlayButton.setAttribute("aria-label", "Putar video");
        });

        chapterVideo.addEventListener("ended", () => {
            videoFrameElement.classList.remove("is-playing");
            videoPlayButton.innerHTML = `
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    aria-hidden="true"
                >
                    <path
                        d="M8 4 L20 12 L8 20 Z"
                        fill="currentColor"
                    />
                </svg>
            `;
            videoPlayButton.setAttribute("aria-label", "Putar video");
        });
    }

    /* VIDEO REVEAL */
    if (videoFrame) {
        gsap.fromTo(
            videoFrame,
            {
                y: 100,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: videoFrame,
                    start: "top 90%",
                    end: "top 50%",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        );
    }

    /* STORY REVEAL */
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

    /* REFRESH UKURAN SETELAH HALAMAN SIAP */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});

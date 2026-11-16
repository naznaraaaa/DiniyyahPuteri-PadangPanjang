
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("chapterTrack");
    const items = document.querySelectorAll(".chapter-item");
    const transitionLayer = document.getElementById("transitionLayer");
    const transitionImage = document.getElementById("transitionImage");
    const transitionTitle = document.querySelector(".transition-title");

    if (!track || !transitionLayer || !transitionImage) {
        console.error("Elemen transisi Chapter Menu tidak ditemukan.");
        return;
    }

    let isNavigating = false;
    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let startScroll = 0;

    // DRAG CAROUSEL
    track.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch" || isNavigating) return;

        isDragging = true;
        didDrag = false;
        startX = event.clientX;
        startScroll = track.scrollLeft;

        track.classList.add("dragging");
    });

    window.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        const distance = event.clientX - startX;

        if (Math.abs(distance) > 5) {
            didDrag = true;
        }

        track.scrollLeft = startScroll - distance * 1.2;
    });

    window.addEventListener("pointerup", () => {
        isDragging = false;
        track.classList.remove("dragging");
    });

    window.addEventListener("pointercancel", () => {
        isDragging = false;
        track.classList.remove("dragging");
    });

    // TRANSISI CHAPTER
    items.forEach((item) => {
        item.addEventListener("click", () => {
            if (isNavigating || didDrag) {
                didDrag = false;
                return;
            }

            const circle = item.querySelector(".chapter-circle");
            const circleLabel = item.querySelector(".chapter-circle-label");
            const target = item.dataset.target;

            if (!circle || !target) return;

            if (typeof gsap === "undefined") {
                console.error("GSAP belum dimuat.");
                return;
            }

            const rect = circle.getBoundingClientRect();

            if (!rect.width || !rect.height) return;

            isNavigating = true;

            const labelRect = circleLabel
                ? circleLabel.getBoundingClientRect()
                : null;

            const chapterNumber =
                circle.dataset.transition || "chapter1";

            const chapterLabel =
                item.querySelector(".chapter-info p")?.textContent || "";

            const chapterTitle =
                item.querySelector(".chapter-info h2")?.textContent || "";

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Titik tengah layar
            const centerX = viewportWidth / 2;
            const centerY = viewportHeight / 2;

            // Perpindahan yang SAMA untuk bulatan dan tulisan
            const moveX = centerX - (rect.left + rect.width / 2);
            const moveY = centerY - (rect.top + rect.height / 2);

            // Skala agar bulatan menutupi seluruh viewport
            const coverScale = Math.max(
                (viewportWidth * 2) / rect.width,
                (viewportHeight * 2) / rect.height
            );

            const finalWidth = rect.width * coverScale;
            const finalHeight = rect.height * coverScale;

            sessionStorage.setItem("fromChapterMenu", chapterNumber);
            sessionStorage.setItem("chapterTitle", chapterTitle);
            sessionStorage.setItem("chapterLabel", chapterLabel);
            sessionStorage.setItem("paperFinalWidth", finalWidth);
            sessionStorage.setItem("paperFinalHeight", finalHeight);

            // Bersihkan sisa elemen transisi sebelumnya
            transitionLayer
                .querySelectorAll(".transition-svg, .transition-circle-label")
                .forEach((element) => element.remove());

            let transitionTarget = transitionImage;

            // SIAPKAN BULATAN TRANSISI
            if (circle.tagName.toLowerCase() === "svg") {
                const svg = circle.cloneNode(true);

                svg.removeAttribute("class");
                svg.removeAttribute("data-transition");
                svg.setAttribute("aria-hidden", "true");
                svg.classList.add("transition-svg");

                transitionImage.style.display = "none";

                transitionLayer.appendChild(svg);

                transitionTarget = svg;

                // Sembunyikan bulatan asli supaya tidak tertinggal.
                circle.style.visibility = "hidden";

                
            } else {
                transitionImage.src = circle.currentSrc || circle.src;
                transitionImage.alt = "";
                transitionImage.style.display = "block";
            }

            // SIAPKAN JUDUL PADA LAYER TRANSISI
            if (transitionTitle) {
                const label = transitionTitle.querySelector("p");
                const heading = transitionTitle.querySelector("h1");

                if (label) label.textContent = chapterLabel;
                if (heading) heading.textContent = chapterTitle;
            }

            // AKTIFKAN LAYER TRANSISI
            Object.assign(transitionLayer.style, {
                position: "fixed",
                inset: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "99999",
                opacity: "1",
                visibility: "visible",
                pointerEvents: "auto",
                overflow: "hidden"
            });

            // POSISI AWAL BULATAN
            gsap.set(transitionTarget, {
                position: "fixed",
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                margin: 0,
                padding: 0,
                x: 0,
                y: 0,
                xPercent: 0,
                yPercent: 0,
                scale: 1,
                transformOrigin: "center center",
                objectFit: "contain",
                maxWidth: "none",
                maxHeight: "none",
                borderRadius: 0,
                display: "block"
            });

            // BUAT SALINAN TULISAN DI ATAS BULATAN
            let transitionLabel = null;

            if (circleLabel && labelRect && labelRect.width && labelRect.height) {
                transitionLabel = circleLabel.cloneNode(true);

                transitionLabel.classList.add("transition-circle-label");
                transitionLabel.removeAttribute("id");
                transitionLabel.setAttribute("aria-hidden", "true");

                // Hindari style asli mengganggu posisi overlay
                Object.assign(transitionLabel.style, {
                position: "fixed",
                left: `${labelRect.left}px`,
                top: `${labelRect.top}px`,
                width: `${labelRect.width}px`,
                height: `${labelRect.height}px`,
                margin: "0",
                transform: "none",
                transformOrigin: "center center",
                pointerEvents: "none",
                zIndex: "100001",
                opacity: "1",
                visibility: "visible",
                color: getComputedStyle(circleLabel).color
            }); 
                

                transitionLayer.appendChild(transitionLabel);

                gsap.set(transitionLabel, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transformOrigin: "center center"
                });

                // Sembunyikan tulisan asli agar tidak tertinggal
                circleLabel.style.visibility = "hidden";
            }

            // TIMELINE ANIMASI
            const timeline = gsap.timeline({
                defaults: {
                    overwrite: "auto"
                },
                onComplete: () => {
                    window.location.href = target;
                }
            });

            // FASE 1:
            // Bulatan dan tulisan bergerak bersama ke tengah layar.
            // Ukurannya tetap sama.
            timeline.to(transitionTarget, {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power2.inOut",
                force3D: true
            }, 0);

            if (transitionLabel) {
                timeline.to(transitionLabel, {
                    x: moveX,
                    y: moveY,
                    duration: 1,
                    ease: "power2.inOut",
                    force3D: true
                }, 0);
            }

            // FASE 2:
            // Bulatan membesar, tulisan ikut membesar dengan skala sama.
            // Tulisan memudar selama pembesaran berlangsung.
            timeline.to(transitionTarget, {
                scale: coverScale,
                duration: 1.5,
                ease: "power2.in",
                force3D: true
            });

            if (transitionLabel) {
                timeline.to(transitionLabel, {
                    scale: coverScale,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.in",
                    force3D: true
                }, "<");
            }
        });
    });

        // Reset tampilan saat halaman dipulihkan dari tombol Back
    window.addEventListener("pageshow", () => {
        isNavigating = false;
        didDrag = false;

        document
            .querySelectorAll(".chapter-circle, .chapter-circle-label")
            .forEach((element) => {
                element.style.visibility = "";
            });

        transitionLayer
            .querySelectorAll(".transition-svg, .transition-circle-label")
            .forEach((element) => element.remove());

        Object.assign(transitionLayer.style, {
            opacity: "0",
            visibility: "hidden",
            pointerEvents: "none"
        });

        transitionImage.style.display = "";
    });
});

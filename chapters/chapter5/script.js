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

        const soundOn = "../../assets/global/icons/SoundOn.png";
        const soundOff = "../../assets/global/icons/SoundOff.png";

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
       ANDONG — tarik untuk membuka foto masa kini
       p = 0 → foto lama penuh   (andong di kiri)
       p = 1 → foto masa kini penuh (andong di kanan)
       Foto masa kini dibuka dari sisi kanan.
    ========================================= */
    const track = document.getElementById("timeTrack");
    const andong = document.getElementById("andong");
    const present = document.getElementById("photoPresent");
    const caption = document.getElementById("timeCaption");
    const stage = document.getElementById("timeStage");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (track && andong && present) {
        let current = 0;        // posisi yang sedang digambar
        let target = 0;         // posisi tujuan
        let dragging = false;
        let grabOffset = 0;
        let interacted = false;
        let rafId = null;
        let facing = 1;         // 1 = menghadap kanan (masa kini), -1 = kiri (masa lalu)
        let moveAcc = 0;

        const clamp = (v) => Math.min(1, Math.max(0, v));
        const travel = () => Math.max(1, track.clientWidth - andong.offsetWidth);

        function render(p) {
            andong.style.transform = `translate3d(${p * travel()}px, 0, 0)`;
            present.style.clipPath = `inset(0 0 0 ${(1 - p) * 100}%)`;

            const isPresent = p >= 0.5;
            caption?.classList.toggle("is-present", isPresent);
            caption?.querySelector(".caption-past")?.setAttribute("aria-hidden", String(isPresent));
            caption?.querySelector(".caption-present")?.setAttribute("aria-hidden", String(!isPresent));

            andong.setAttribute("aria-valuenow", String(Math.round(p * 100)));
            andong.setAttribute(
                "aria-valuetext",
                p < 0.34 ? "Masa lalu" : p < 0.67 ? "Perjalanan waktu" : "Masa kini"
            );
        }

        function loop() {
            const ease = dragging ? 0.4 : 0.14;
            current += (target - current) * ease;

            if (Math.abs(target - current) < 0.0008) current = target;

            render(current);
            rafId = current !== target ? requestAnimationFrame(loop) : null;
        }

        function setFacing(dir) {
            if (dir === facing) return;
            facing = dir;
            andong.classList.toggle("is-facing-left", dir < 0);
        }

        function noteMove(delta) {
            if (Math.sign(delta) !== Math.sign(moveAcc)) moveAcc = 0;
            moveAcc += delta;
            if (Math.abs(moveAcc) > 0.012) setFacing(moveAcc > 0 ? 1 : -1);
        }

        function moveTo(p) {
            const next = clamp(p);
            noteMove(next - target);
            target = next;
            if (reduceMotion) { current = target; render(current); return; }
            if (!rafId) rafId = requestAnimationFrame(loop);
        }

        const pointerToP = (clientX) => {
            const left = track.getBoundingClientRect().left;
            return (clientX - grabOffset - left) / travel();
        };

        /* Tarik andong */
        andong.addEventListener("pointerdown", (event) => {
            interacted = true;
            dragging = true;
            grabOffset = event.clientX - andong.getBoundingClientRect().left;
            andong.setPointerCapture(event.pointerId);
            andong.classList.add("is-dragging");
            event.preventDefault();
        });

        andong.addEventListener("pointermove", (event) => {
            if (!dragging) return;
            moveTo(pointerToP(event.clientX));
        });

        const endDrag = (event) => {
            if (!dragging) return;
            dragging = false;
            andong.classList.remove("is-dragging");
            if (andong.hasPointerCapture?.(event.pointerId)) {
                andong.releasePointerCapture(event.pointerId);
            }
            // Dekat ujung → tarik sampai ujung
            if (target < 0.06) moveTo(0);
            else if (target > 0.94) moveTo(1);
        };

        andong.addEventListener("pointerup", endDrag);
        andong.addEventListener("pointercancel", endDrag);

        /* Klik di jalur → andong meluncur ke sana */
        track.addEventListener("pointerdown", (event) => {
            if (event.target.closest(".andong")) return;
            interacted = true;
            grabOffset = andong.offsetWidth / 2;
            moveTo(pointerToP(event.clientX));
        });

        /* Keyboard */
        andong.addEventListener("keydown", (event) => {
            const step = event.shiftKey ? 0.25 : 0.1;
            const keys = {
                ArrowRight: () => moveTo(target + step),
                ArrowUp:    () => moveTo(target + step),
                ArrowLeft:  () => moveTo(target - step),
                ArrowDown:  () => moveTo(target - step),
                Home:       () => moveTo(0),
                End:        () => moveTo(1)
            };
            if (!keys[event.key]) return;
            event.preventDefault();
            interacted = true;
            keys[event.key]();
        });

        window.addEventListener("resize", () => render(current));

        /* Petunjuk: andong bergeser sedikit saat pertama terlihat */
        if (stage && !reduceMotion && "IntersectionObserver" in window) {
            const hintObserver = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) return;
                hintObserver.disconnect();

                setTimeout(() => {
                    if (interacted) return;
                    moveTo(0.16);
                    setTimeout(() => {
                        if (interacted) return;
                        moveTo(0);
                        setTimeout(() => { if (!interacted) setFacing(1); }, 900);
                    }, 900);
                }, 600);
            }, { threshold: 0.6 });

            hintObserver.observe(stage);
        }

        render(0);
    }

    /* =========================================
       FOTO-FOTO — ganti step mengikuti scroll
       (tidak bergantung pada GSAP)
    ========================================= */
    const story = document.getElementById("photoStory");
    const steps = story ? Array.from(story.querySelectorAll(".story-step")) : [];

    if (story && steps.length) {
        let activeStep = -1;

        const setStep = (index) => {
            if (index === activeStep) return;
            activeStep = index;
            steps.forEach((step, i) => {
                step.classList.toggle("is-active", i === index);
                step.classList.toggle("is-past", i < index);
                step.setAttribute("aria-hidden", String(i !== index));
            });
        };

        const updateStory = () => {
            const rect = story.getBoundingClientRect();
            const total = Math.max(1, story.offsetHeight - window.innerHeight);
            const progress = Math.min(1, Math.max(0, -rect.top / total));
            setStep(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
        };

        window.addEventListener("scroll", updateStory, { passive: true });
        window.addEventListener("resize", updateStory);
        updateStory();
    }

    /* =========================================
   FOTO — HOVER ZOOM
   Kursor masuk ke foto → foto membesar (CSS: .is-hovered), titik zoom
   ada di posisi kursor dan ikut bergeser halus. Berlian kecil menyusul
   di belakang kursor. Hanya untuk perangkat dengan mouse.
========================================= */
(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const diamond = document.getElementById("diamondCursor");
    if (!canHover || reduceMotion) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v) => Math.min(100, Math.max(0, v));

    const items = Array.from(document.querySelectorAll(".stamp"))
        .map((stamp) => {
            const photo = stamp.querySelector(".stamp-photo");
            return photo ? { stamp, photo, ox: 50, oy: 50, tox: 50, toy: 50, hover: false } : null;
        })
        .filter(Boolean);

    let mx = 0, my = 0, dx = 0, dy = 0;
    let raf = null;

    /* posisi kursor di dalam foto (%), dikoreksi untuk foto yang miring */
    function localPercent(it, event) {
        const r = it.stamp.getBoundingClientRect();
        const m = new DOMMatrixReadOnly(getComputedStyle(it.stamp).transform);
        const ang = Math.atan2(m.b, m.a);
        const vx = event.clientX - (r.left + r.width / 2);
        const vy = event.clientY - (r.top + r.height / 2);
        const lx = vx * Math.cos(-ang) - vy * Math.sin(-ang);
        const ly = vx * Math.sin(-ang) + vy * Math.cos(-ang);
        return {
            x: clamp(50 + (lx / it.photo.offsetWidth) * 100),
            y: clamp(50 + (ly / it.photo.offsetHeight) * 100)
        };
    }

    function tick() {
        let busy = false;

        items.forEach((it) => {
            if (!it.hover) return;
            it.ox = lerp(it.ox, it.tox, 0.15);
            it.oy = lerp(it.oy, it.toy, 0.15);
            it.photo.style.setProperty("--ox", `${it.ox}%`);
            it.photo.style.setProperty("--oy", `${it.oy}%`);
            if (Math.abs(it.ox - it.tox) > 0.05 || Math.abs(it.oy - it.toy) > 0.05) busy = true;
        });

        if (diamond) {
            dx = lerp(dx, mx, 0.2);
            dy = lerp(dy, my, 0.2);
            diamond.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
            if (diamond.classList.contains("is-on") &&
                (Math.abs(dx - mx) > 0.2 || Math.abs(dy - my) > 0.2)) busy = true;
        }

        raf = busy ? requestAnimationFrame(tick) : null;
    }

    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    items.forEach((it) => {
        it.stamp.addEventListener("pointerenter", (event) => {
            if (event.pointerType && event.pointerType !== "mouse") return;
            const p = localPercent(it, event);
            it.ox = it.tox = p.x;
            it.oy = it.toy = p.y;
            it.photo.style.setProperty("--ox", `${p.x}%`);   // titik zoom mulai tepat di kursor
            it.photo.style.setProperty("--oy", `${p.y}%`);
            it.hover = true;
            it.stamp.classList.add("is-hovered");

            mx = event.clientX; my = event.clientY;
            if (diamond && !diamond.classList.contains("is-on")) { dx = mx; dy = my; }
            diamond?.classList.add("is-on");
            start();
        });

        it.stamp.addEventListener("pointermove", (event) => {
            if (!it.hover) return;
            const p = localPercent(it, event);
            it.tox = p.x;
            it.toy = p.y;
            mx = event.clientX; my = event.clientY;
            start();
        });

        it.stamp.addEventListener("pointerleave", () => {
            it.hover = false;
            it.stamp.classList.remove("is-hovered");   // origin dibiarkan agar tidak loncat
            if (!items.some((other) => other.hover)) diamond?.classList.remove("is-on");
            start();
        });
    });
})();
       /* =========================================
       KARTU TEKS — BLOB ORGANIK
       Satu blob satu warna di belakang tiap teks; warnanya beda tiap kartu.
       Tepinya bergoyang pelan, dan saat kursor mendekat tepinya melar ke
       arah kursor (efek cairan / jelly), bukan kotak kaku.
    ========================================= */
    (() => {
        const texts = Array.from(document.querySelectorAll(".story-text"));
        const storySection = document.getElementById("photoStory");
        if (!texts.length || !storySection) return;

        const NS = "http://www.w3.org/2000/svg";
        const PAD = 70;                 // sama dengan left/top negatif .story-blob di CSS
        const N = 34;                   // jumlah titik tepi (makin banyak makin halus)
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        /* Warna tiap kartu (berurutan: kartu 1, 2, 3, 4, lalu mengulang). Ubah sesukamu.
           Pilih warna yang cukup gelap supaya teks krem tetap terbaca.
           Bisa juga per kartu lewat atribut di HTML: <div class="story-text" data-blob="#B85A42"> */
        const COLORS = [
            "#2E8589",   // 1 — teal
            "#BA5E45",   // 2 — terakota
            "#44639A",   // 3 — biru
            "#E3C875"    // 4 — ungu
        ];

        /* Watak blob (satu lapis) */
        const LAYERS = [
            { grow: 1.04, dx: 0, dy: 0, wobble: 6, pull: 0.42, reach: 200, spring: 0.10, damp: 0.82 }
        ];
        const MAX_PULL = 62;            // batas maksimal tepi melar (px)
        const SQUIRCLE = 3.4;           // 2 = elips, makin besar makin mirip persegi membulat

        const items = texts.map((el, idx) => {
            const svg = document.createElementNS(NS, "svg");
            svg.setAttribute("class", "story-blob");
            svg.setAttribute("aria-hidden", "true");

            const color = el.dataset.blob || el.closest(".story-step")?.dataset.blob || COLORS[idx % COLORS.length];

            const layers = LAYERS.map((cfg) => {
                const path = document.createElementNS(NS, "path");
                path.setAttribute("fill", color);
                path.setAttribute("fill-opacity", "0.95");
                svg.appendChild(path);
                return {
                    cfg, path,
                    ox: new Float32Array(N), oy: new Float32Array(N),     // geseran tiap titik
                    vx: new Float32Array(N), vy: new Float32Array(N)      // kecepatan (untuk pegas)
                };
            });

            el.insertBefore(svg, el.firstChild);
            return { el, svg, layers, w: 0, h: 0 };
        });

               const measure = (it) => {
            it.pad = -parseFloat(getComputedStyle(it.svg).left) || PAD;   // ikut nilai CSS (70px desktop, 34px HP)
            it.w = it.el.offsetWidth;
            it.h = it.el.offsetHeight;
            it.svg.setAttribute("viewBox", `0 0 ${it.w + it.pad * 2} ${it.h + it.pad * 2}`);
        };

        items.forEach(measure);
        window.addEventListener("resize", () => items.forEach(measure));
        if ("ResizeObserver" in window) {
            const ro = new ResizeObserver(() => items.forEach(measure));
            items.forEach((it) => ro.observe(it.el));
        }

        /* Posisi kursor (koordinat layar) */
        let mx = -9999, my = -9999;
        if (canHover) {
            window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
            document.addEventListener("pointerleave", () => { mx = my = -9999; });
        }

        /* Kurva tertutup halus (Catmull-Rom → Bezier) */
        const toPath = (pts) => {
            const n = pts.length;
            let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
            for (let i = 0; i < n; i++) {
                const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
                const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
                const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
                d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
            }
            return d + " Z";
        };

        const sgnPow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);

        function draw(it, time) {
            const rect = it.svg.getBoundingClientRect();
            const sx = rect.width ? (it.w + it.pad * 2) / rect.width : 1;      // layar → koordinat svg
            const cx0 = it.w / 2 + it.pad, cy0 = it.h / 2 + it.pad;
            const curX = (mx - rect.left) * sx, curY = (my - rect.top) * sx;

            it.layers.forEach((L, li) => {
                const { cfg } = L;
                const a = (it.w / 2) * cfg.grow + 12, b = (it.h / 2) * cfg.grow + 12;
                const pts = [];

                for (let i = 0; i < N; i++) {
                    const t = (i / N) * Math.PI * 2;
                    const c = Math.cos(t), s = Math.sin(t);

                    // titik dasar: persegi membulat (squircle)
                    let x = cx0 + cfg.dx + a * sgnPow(c, 2 / SQUIRCLE);
                    let y = cy0 + cfg.dy + b * sgnPow(s, 2 / SQUIRCLE);

                    // goyang pelan (napas): arah normal ≈ arah dari pusat
                    const wob = cfg.wobble * (
                        Math.sin(time * 0.0011 + i * 0.75 + li * 1.7) +
                        Math.sin(time * 0.0007 - i * 1.35 + li * 0.9)
                    ) * 0.5;
                    x += c * wob; y += s * wob;

                    // tarikan kursor: tepi melar ke arah kursor
                    let tx = 0, ty = 0;
                    const vx = curX - x, vy = curY - y;
                    const dist = Math.hypot(vx, vy);
                    if (dist > 1 && dist < cfg.reach * 2.2) {
                        const fall = Math.exp(-Math.pow(dist / cfg.reach, 2));
                        const pull = Math.min(MAX_PULL, cfg.pull * Math.min(dist, 140)) * fall * 1.9;
                        tx = (vx / dist) * pull;
                        ty = (vy / dist) * pull;
                    }

                    // pegas → bergoyang kenyal, bukan kaku
                    L.vx[i] = (L.vx[i] + (tx - L.ox[i]) * cfg.spring) * cfg.damp;
                    L.vy[i] = (L.vy[i] + (ty - L.oy[i]) * cfg.spring) * cfg.damp;
                    L.ox[i] += L.vx[i];
                    L.oy[i] += L.vy[i];

                    pts.push([x + L.ox[i], y + L.oy[i]]);
                }
                L.path.setAttribute("d", toPath(pts));
            });
        }

        /* Jalan hanya saat bagian foto-foto terlihat, dan hanya untuk kartu yang aktif */
        let visible = false;
        let raf = null;

        function frame(time) {
            items.forEach((it) => {
                const step = it.el.closest(".story-step");
                if (step && step.classList.contains("is-active")) draw(it, reduceMotion ? 0 : time);
            });
            raf = visible ? requestAnimationFrame(frame) : null;
        }

        if ("IntersectionObserver" in window) {
            new IntersectionObserver((entries) => {
                visible = entries[0].isIntersecting;
                if (visible && !raf) raf = requestAnimationFrame(frame);
            }, { threshold: 0 }).observe(storySection);
        } else {
            visible = true;
            raf = requestAnimationFrame(frame);
        }

        items.forEach((it) => draw(it, 0));   // gambar awal
    })();
    /* =========================================
       ESC: tutup About dan sidebar
    ========================================= */
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeAbout();
        closeSidebar();
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
        sessionStorage.getItem("fromChapterMenu") === "chapter5";

    if (paper && isEnteringFromMenu) {
        const savedWidth = Number(sessionStorage.getItem("paperFinalWidth"));
        const savedHeight = Number(sessionStorage.getItem("paperFinalHeight"));

        if (savedWidth > 0 && savedHeight > 0) {
            paper.style.setProperty("width", `${savedWidth}px`, "important");
            paper.style.setProperty("height", `${savedHeight}px`, "important");
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

    /* Kurva (setengah lingkaran) membesar mengikuti scroll */
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

    /* Bagian andong sudah naik menimpa ujung opening; ia muncul
       (fade + naik sedikit) bersamaan dengan kurva yang menutupi layar */
    const timeWrap = document.querySelector(".time-wrap");

    if (timeWrap) {
        gsap.fromTo(
            timeWrap,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".chapter-opening",
                    start: "top -25%",
                    end: "bottom bottom",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            }
        );
    }

    /* =========================================
       PENUTUP — foto ter-scroll di kiri, teks diam di kanan
       - Layar dikunci (sticky) selama foto bergeser.
       - Tinggi section dihitung dari tinggi foto + ruang atas/bawah.
       - Teks muncul halus (judul dulu, lalu isi) saat bagian ini masuk.
    ========================================= */
    (() => {
        const finale = document.getElementById("finale");
        const track = document.getElementById("finaleTrack");
        if (!finale || !track) return;

        const title = finale.querySelector(".finale-title");
        const body = finale.querySelector(".finale-body");

        const HOLD = 0.2;   // jeda setelah foto terakhir (dalam tinggi layar) sebelum bagian ini lewat

        const clamp01 = (v) => Math.min(1, Math.max(0, v));
        const smooth = (a, b, x) => {
            const t = clamp01((x - a) / (b - a));
            return t * t * (3 - 2 * t);
        };

        const fade = (el, p, rise, blur) => {
            if (!el || reduceMotion) return;
            el.style.opacity = p;
            el.style.transform = p < 1 ? `translateY(${(1 - p) * rise}px)` : "";
            el.style.filter = p < 1 ? `blur(${(1 - p) * blur}px)` : "";
        };

        function layout() {
            const vh = window.innerHeight;
            const travel = Math.max(0, track.offsetHeight - vh);      // jarak foto bergeser
            finale.style.height = `${vh + travel + vh * HOLD}px`;
            return { vh, travel };
        }

        function update() {
            const { vh, travel } = layout();
            const top = finale.getBoundingClientRect().top;

            // foto: bergeser 1:1 dengan scroll selama layar dikunci
            const progress = travel > 0 ? clamp01(-top / travel) : 0;
            track.style.transform = `translate3d(0, ${-progress * travel}px, 0)`;

            // teks: muncul halus saat bagian ini masuk dari bawah
            const enter = clamp01((vh - top) / vh);
            fade(title, smooth(0.45, 0.85, enter), 28, 6);
            fade(body,  smooth(0.60, 1.00, enter), 28, 6);
        }

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("load", update);   // hitung ulang setelah foto selesai dimuat
        update();
    })();

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});
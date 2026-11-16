document.addEventListener("DOMContentLoaded", () => {

    const refreshScroll = () => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    };

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
       DATA CARD
       Folder gambar: ../../assets/chapter3/images/
    ========================================= */

    const IMG = "../../assets/chapter3/images/";

    const cards = [
        {
            label: "Sebuah Gagasan",
            teaser: "Bagaimana jika perempuan tidak pernah diberi kesempatan untuk menentukan hidupnya sendiri?",
            img: "PerempuanDulu.png", // <-- ganti kalau nama file card 1 berbeda
            paragraphs: [
                "Rahmah melihat banyak perempuan di sekitarnya hidup dalam keterbatasan, direndahkan, ditindas, bahkan tidak memiliki ruang untuk memperoleh pendidikan yang layak.",
                "Pengalamannya belajar di Diniyah School yang didirikan kakaknya, Zainuddin Labay El-Yunusy, membuat Rahmah semakin memahami pentingnya pendidikan. Ia juga memperdalam ilmu agama di Surau Jembatan Besi dan lingkungan pengajaran Haji Rasul. Dalam lingkungan belajar tersebut, jumlah murid perempuan masih sangat sedikit dibandingkan laki-laki.",
                "Pengalaman tersebut menjadi salah satu latar belakang yang membentuk pemikirannya tentang pentingnya pendidikan bagi perempuan. Rahmah kemudian memiliki cita-cita untuk menghadirkan ruang pendidikan yang secara khusus memberikan kesempatan kepada perempuan untuk belajar dan berkembang."
            ]
        },
        {
            label: "1 November 1923",
            teaser: "Bukan sekadar sekolah baru. Sebuah ruang yang sebelumnya belum tersedia untuk mereka.",
            img: "Berdiri.jpg",
            paragraphs: [
                "Keinginan Rahmah untuk mendirikan lembaga pendidikan khusus perempuan semakin kuat. Pada tahun 1923, ia membicarakan cita-cita tersebut dengan kakaknya, Zainuddin Labay El-Yunusy.",
                "Ketika ditanya apakah ia sanggup mendirikan sekolah putri yang dicita-citakannya, Rahmah menyatakan kesanggupannya. Gagasan tersebut kemudian disampaikan kepada teman-temannya yang tergabung dalam organisasi PMDS dan memperoleh dukungan.",
                "Pada tanggal 1 November 1923, berdirilah sebuah lembaga pendidikan perempuan di Padang Panjang dengan nama awal Al-Madrasah Diniyah Lil Banat, yang kemudian dikenal sebagai Perguruan Diniyyah Puteri.",
                "Pada awal pendiriannya, sekolah ini memiliki 71 orang murid perempuan. Berdirinya lembaga ini menjadi langkah penting dalam mewujudkan cita-cita Rahmah untuk menghadirkan pendidikan bagi perempuan."
            ]
        },
        {
            label: "Dari Yang Ada",
            teaser: "Sebuah sekolah sederhana. Puluhan perempuan datang. Dan tidak semua orang menyukainya.",
            img: "Awal.png",
            paragraphs: [
                "Pada masa awal berdirinya, Diniyyah Puteri memulai perjalanan dengan fasilitas yang masih sederhana dan jumlah murid sebanyak 71 orang. Sebagian besar murid bahkan merupakan perempuan yang telah berumah tangga.",
                "Rahmah tidak hanya ingin menghadirkan tempat belajar, tetapi juga membangun sistem pendidikan yang sesuai dengan kebutuhan perempuan. Pada awalnya, pembelajaran lebih banyak berfokus pada pengetahuan agama dan bahasa Arab.",
                "Seiring berjalannya waktu, sistem pendidikan mulai dikembangkan. Rahmah melakukan berbagai upaya untuk menyempurnakan pembelajaran, termasuk melakukan perjalanan studi perbandingan ke sejumlah wilayah di Pulau Jawa dan Sumatera.",
                "Dari proses tersebut, kurikulum kemudian mengalami perkembangan dengan memasukkan keterampilan, pelajaran kewanitaan, ketangkasan, serta kegiatan pembelajaran di luar jam kelas."
            ]
        },
        {
            label: "Lalu, Sekolah Itu Runtuh",
            teaser: "28 Juni 1926. Dalam satu hari, tempat yang dibangun dengan susah payah itu hancur.",
            img: "gempa.jpg",
            paragraphs: [
                "Perjalanan Diniyyah Puteri tidak selalu berjalan mudah. Pada tahun 1926, gempa besar mengguncang Padang Panjang dan menyebabkan kerusakan pada banyak bangunan, termasuk gedung Perguruan Diniyyah Puteri.",
                "Bencana tersebut menjadi pukulan berat bagi Rahmah. Sekolah yang baru dirintis sekitar sepuluh bulan sebelumnya harus menghadapi kerusakan besar. Para murid terpaksa dipulangkan, sementara kegiatan pendidikan tidak dapat berjalan seperti sebelumnya.",
                "Peristiwa tersebut juga membawa kehilangan bagi lingkungan perguruan. Salah seorang pengajar, Nanisah, menjadi korban dalam bencana tersebut.",
                "Di tengah keadaan yang sulit, keberlangsungan pendidikan Diniyyah Puteri menghadapi ujian besar. Namun, kehancuran bangunan tidak mengakhiri cita-cita yang telah diperjuangkan Rahmah."
            ]
        },
        {
            label: "Mereka Kembali",
            teaser: "Bangunannya boleh runtuh, tetapi cita-cita pendidikannya tidak ikut berhenti.",
            img: "Berdakwah.jpg",
            paragraphs: [
                "Setelah gempa menghancurkan bangunan perguruan, Rahmah tidak membiarkan kegiatan pendidikan berhenti begitu saja.",
                "Sekitar 45 hari setelah bencana, Rahmah bersama para guru dan bantuan siswa Thawalib School Padang Panjang mulai mendirikan bangunan sementara dari bambu dengan atap daun rumbia dan lantai tanah. Bangunan sederhana tersebut digunakan untuk melanjutkan kegiatan pendidikan.",
                "Para murid kemudian dipanggil kembali dari daerah asal mereka, sementara proses perbaikan dan pembangunan sekolah dilakukan secara bertahap.",
                "Upaya pemulihan juga mendapat dukungan dari para orang tua murid yang membentuk komite penyelamat perguruan untuk mengumpulkan dana pembangunan kembali.",
                "Pada 22 Agustus 1927, Rahmah melakukan perjalanan ke luar Sumatera Barat untuk mencari dukungan dan dana. Perjalanan tersebut menjadi bagian dari perjuangannya untuk memastikan Diniyyah Puteri dapat terus berdiri."
            ]
        },
        {
            label: "Melewati Zaman",
            teaser: "Ketika sekolah itu mulai tumbuh, zaman kembali mengujinya.",
            img: "AsramaDiniyyah.jpg",
            paragraphs: [
                "Seiring berjalannya waktu, Diniyyah Puteri harus menjalani perjalanan di tengah berbagai perubahan sosial dan politik. Masa kolonial Belanda, pendudukan Jepang, hingga kemerdekaan Indonesia menjadi bagian dari periode yang turut memengaruhi perjalanan Rahmah dan perguruannya.",
                "Pada masa pendudukan Jepang, kondisi pendidikan dan kehidupan masyarakat mengalami tekanan. Pada awal 1942, ketika situasi semakin tidak aman, Rahmah mengambil langkah untuk mengevakuasi sekitar 100 murid ke daerah Bunga Tanjung, Pitalah. Ia turut menanggung kebutuhan para murid selama masa evakuasi.",
                "Setelah Indonesia merdeka, Diniyyah Puteri juga memiliki peran dalam mendukung perjuangan masyarakat. Perguruan ini digunakan sebagai dapur umum dan tempat persinggahan para pejuang.",
                "Perjalanan tersebut menunjukkan bahwa Diniyyah Puteri tidak berdiri terpisah dari perubahan zaman. Institusi ini turut menghadapi dan melewati berbagai keadaan yang terjadi di sekitarnya."
            ]
        },
        {
            label: "Terus Bertumbuh",
            teaser: "Diniyyah Puteri terus berkembang dan meneruskan gagasan Rahmah.",
            img: "DiniyyahNow.jpg",
            paragraphs: [
                "Perjuangan Rahmah tidak berhenti pada mempertahankan sekolah yang telah didirikannya. Ia terus berupaya mengembangkan sistem pendidikan agar mampu menjawab kebutuhan masyarakat.",
                "Kurikulum yang pada awalnya berfokus pada pengetahuan agama dan bahasa Arab kemudian mengalami penyempurnaan. Pendidikan keterampilan, pelajaran kewanitaan, dan berbagai kegiatan pembelajaran lainnya turut dikembangkan.",
                "Perjalanan pendidikan tersebut juga melahirkan berbagai bagian dan jenjang pendidikan. Artikel sejarah mencatat perkembangan Diniyyah Puteri, termasuk Kuliyatul Muallimat dan Fakultas Tarbiyah dan Dakwah yang diwujudkan pada 1964.",
                "Rahmah wafat pada 1969, tetapi perjalanan lembaga pendidikan yang dirintisnya terus berlanjut.",
                "Kini, perkembangan Diniyyah Puteri dapat dilihat melalui perjalanan institusi, fasilitas, program pendidikan, serta generasi yang menjadi bagian di dalamnya."
            ]
        }
    ];

    /* =========================================
       BUAT CARD
    ========================================= */

    const board = document.getElementById("memoryBoard");
    const track = document.getElementById("memoryTrack");
    const memoryString = document.getElementById("memoryString");
    const stringMain = document.getElementById("memoryStringPath");
    const stringTwist = document.getElementById("memoryStringTwist");

    if (track) {
        cards.forEach((data, index) => {

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "memory-card";
            btn.dataset.index = index;
            btn.setAttribute("aria-label", `Buka cerita: ${data.label}`);

            btn.innerHTML = `
                <span class="memory-pin">
                    <img src="${IMG}Pin.png" alt="" draggable="false">
                </span>
                <span class="mc-photo">
                    <img src="${IMG}${data.img}" alt="${data.label}" draggable="false">
                    <span class="mc-label">${data.label}</span>
                </span>
                <span class="mc-teaser">${data.teaser}</span>
            `;

            track.appendChild(btn);
        });
    }

    /* =========================================
       TALI ANTAR PIN
    ========================================= */

    function updateMemoryString() {

        if (!track || !memoryString || !stringMain) return;

        const pins = [...track.querySelectorAll(".memory-pin")];
        if (pins.length < 2) return;

        const trackRect = track.getBoundingClientRect();

        memoryString.setAttribute("width", track.offsetWidth);
        memoryString.setAttribute("height", track.offsetHeight);
        memoryString.setAttribute("viewBox", `0 0 ${track.offsetWidth} ${track.offsetHeight}`);

        const points = pins.map((pin) => {
            const r = pin.getBoundingClientRect();
            return {
                x: r.left + r.width / 2 - trackRect.left,
                y: r.top + r.height / 2 - trackRect.top + 2
            };
        });

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const cur = points[i];
            const midX = (prev.x + cur.x) / 2;
            const midY = (prev.y + cur.y) / 2;
            const sag = Math.min(34, Math.abs(cur.x - prev.x) * 0.12) + 6;

            d += ` Q ${midX} ${midY + sag}, ${cur.x} ${cur.y}`;
        }

        stringMain.setAttribute("d", d);
        stringTwist?.setAttribute("d", d);
    }

    /* update terus selama animasi hover (card bergeser) */
    function trackString(duration = 500) {
        const end = performance.now() + duration;
        (function loop() {
            updateMemoryString();
            if (performance.now() < end) requestAnimationFrame(loop);
        })();
    }

    window.addEventListener("resize", updateMemoryString);

    track?.querySelectorAll(".memory-card").forEach((card) => {
        card.addEventListener("mouseenter", () => trackString());
        card.addEventListener("mouseleave", () => trackString());
        card.addEventListener("focus", () => trackString());
        card.addEventListener("blur", () => trackString());
    });

    // gambar pin / foto selesai dimuat -> ukuran bisa berubah
    track?.querySelectorAll("img").forEach((img) => {
        img.addEventListener("load", updateMemoryString);
    });

    if (track && typeof ResizeObserver !== "undefined") {
        new ResizeObserver(updateMemoryString).observe(track);
    }

    requestAnimationFrame(updateMemoryString);

    /* =========================================
       DRAG UNTUK GESER (MOUSE)
       Di HP/tablet sudah otomatis bisa swipe.
    ========================================= */

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    board?.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = board.scrollLeft;
    });

    window.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) {
            moved = true;
            board.classList.add("is-dragging");
        }
        if (moved) board.scrollLeft = startScroll - dx;
    });

    window.addEventListener("pointerup", () => {
        if (!isDown) return;
        isDown = false;
        board?.classList.remove("is-dragging");
    });

    /* =========================================
       FADE TEPI CAROUSEL
       Kiri muncul setelah digeser, kanan hilang di ujung
    ========================================= */

    function updateBoardFade() {
        if (!board) return;
        const max = board.scrollWidth - board.clientWidth;
        board.classList.toggle("has-left", board.scrollLeft > 20);
        board.classList.toggle("at-end", board.scrollLeft >= max - 20);
    }

    board?.addEventListener("scroll", updateBoardFade, { passive: true });
    window.addEventListener("resize", updateBoardFade);
    updateBoardFade();

    /* =========================================
       OVERLAY DETAIL
       Klik di mana saja = tutup
    ========================================= */

    const modal = document.getElementById("memoryModal");
    const detailImg = document.getElementById("memoryDetailImg");
    const detailEyebrow = document.getElementById("memoryDetailEyebrow");
    const detailTitle = document.getElementById("memoryDetailTitle");
    const detailText = document.getElementById("memoryDetailText");
    const detailContent = modal?.querySelector(".memory-detail-content");

    function openModal(index) {
        const data = cards[index];
        if (!data || !modal) return;

        detailImg.src = IMG + data.img;
        detailImg.alt = data.label;
        detailEyebrow.textContent = `Diniyyah Puteri · ${String(index + 1).padStart(2, "0")}`;
        detailTitle.textContent = data.label;
        detailText.innerHTML = data.paragraphs.map((p) => `<p>${p}</p>`).join("");

        if (detailContent) detailContent.scrollTop = 0;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    track?.addEventListener("click", (e) => {
        if (moved) { moved = false; return; } // abaikan klik setelah drag
        const card = e.target.closest(".memory-card");
        if (card) openModal(Number(card.dataset.index));
    });

    modal?.addEventListener("click", closeModal);

    /* =========================================
       ESC: tutup overlay detail, About, dan sidebar
    ========================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeAbout();
        closeSidebar();
        if (modal?.classList.contains("is-open")) closeModal();
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
        sessionStorage.getItem("fromChapterMenu") === "chapter3";

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

    window.addEventListener("load", () => {
        updateMemoryString();
        updateBoardFade();
        refreshScroll();
    });
});
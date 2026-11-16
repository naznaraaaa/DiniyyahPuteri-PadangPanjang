/* ==================================================
   ELEMENTS
================================================== */

const loadingScreen =
    document.getElementById(
        "loading-screen"
    );


const loadingPercentage =
    document.getElementById(
        "loading-percentage"
    );


const loadingText =
    document.getElementById(
        "loading-text"
    );


const entryPage =
    document.getElementById(
        "entry-page"
    );


/* ==================================================
   VARIABLES
================================================== */

let progress = 0;

let dotIndex = 0;

let loadingFinished = false;


/* ==================================================
   CURSOR POSITION
================================================== */

function updateLoadingCursor(
    x,
    y
) {

    loadingScreen.style.setProperty(
        "--cursor-x",
        `${x}px`
    );


    loadingScreen.style.setProperty(
        "--cursor-y",
        `${y}px`
    );


    loadingScreen.classList.add(
        "spotlight-active"
    );

}


/* ==================================================
   DESKTOP CURSOR
================================================== */

window.addEventListener(
    "mousemove",
    (event) => {

        if (
            window.innerWidth <= 767
        ) {

            return;

        }


        updateLoadingCursor(
            event.clientX,
            event.clientY
        );

    }
);


/* ==================================================
   MOBILE TOUCH
================================================== */

window.addEventListener(
    "touchmove",
    (event) => {

        if (
            window.innerWidth > 767
        ) {

            return;

        }


        const touch =
            event.touches[0];


        if (!touch) {

            return;

        }


        updateLoadingCursor(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: true
    }
);


/* ==================================================
   INITIAL SPOTLIGHT
================================================== */

/*
   Kalau cursor belum bergerak,
   spotlight dimulai dari tengah.
*/

loadingScreen.style.setProperty(
    "--cursor-x",
    "50vw"
);


loadingScreen.style.setProperty(
    "--cursor-y",
    "50vh"
);


/* ==================================================
   LOADING DOTS
================================================== */

const loadingDots = [
    "Loading.",
    "Loading..",
    "Loading..."
];


const dotsInterval =
    setInterval(
        () => {

            dotIndex++;

            if (
                dotIndex >=
                loadingDots.length
            ) {

                dotIndex = 0;

            }


            loadingText.textContent =
                loadingDots[dotIndex];

        },
        400
    );


/* ==================================================
   PROGRESS
================================================== */

/*
   Total loading sekitar 6.5 detik.

   Kita tidak menggunakan:
   1% = 25ms

   karena itu terlalu cepat.

   Progress berjalan berdasarkan waktu.
*/

const loadingDuration = 6500;

const startTime = performance.now();


function animateLoading(
    currentTime
) {

    const elapsed =
        currentTime - startTime;


    progress =
        Math.min(
            elapsed / loadingDuration,
            1
        );


    /*
       Ease-out supaya progress
       terasa natural.
    */

    const easedProgress =
        1 -
        Math.pow(
            1 - progress,
            2
        );


    const percentage =
        Math.floor(
            easedProgress * 100
        );


    loadingPercentage.textContent =
        `${percentage}%`;


    if (progress < 1) {

        requestAnimationFrame(
            animateLoading
        );

    } else {

        finishLoading();

    }

}


requestAnimationFrame(
    animateLoading
);


/* ==================================================
   FINISH LOADING
================================================== */

function finishLoading() {

    if (loadingFinished) {

        return;

    }


    loadingFinished = true;


    loadingPercentage.textContent =
        "100%";


    loadingText.textContent =
        "Loading...";


    /*
       Tunggu sebentar setelah 100%
       agar angka 100% terasa.
    */

    setTimeout(
        () => {

            expandToEntry();

        },
        500
    );

}


/* ==================================================
   EXPAND SPOTLIGHT
================================================== */

function expandToEntry() {

    /*
       Ini inti transisinya.

       Spotlight kecil
              ↓
       membesar
              ↓
       seluruh layar
              ↓
       foto modern fullscreen
    */

    loadingScreen.classList.add(
        "expanding"
    );


    /*
       Tunggu animasi expansion selesai
       sebelum memunculkan Entry Page.
    */

    setTimeout(
        () => {

            entryPage.classList.add(
                "is-visible"
            );


            document.body.classList.remove(
                "is-loading"
            );


            /*
               Setelah Entry Page terlihat,
               loading screen dihilangkan.
            */

            setTimeout(
                () => {

                    loadingScreen.classList.add(
                        "finished"
                    );


                    /*
                       Beri tahu audio bahwa
                       Entry Page sudah siap.
                    */

                    window.dispatchEvent(
                        new Event(
                            "entryReady"
                        )
                    );

                },
                450
            );

        },
        1800
    );

}
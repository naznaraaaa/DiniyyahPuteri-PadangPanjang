/* ==================================================
   AUDIO
================================================== */

const backgroundAudio =
    document.getElementById(
        "background-audio"
    );


const audioToggle =
    document.getElementById(
        "audio-toggle"
    );


const audioIcon =
    document.getElementById(
        "audio-icon"
    );


const audioLabel =
    document.getElementById(
        "audio-label"
    );


let audioStarted = false;


/* ==================================================
   SETTINGS
================================================== */

backgroundAudio.volume = 0.35;

backgroundAudio.loop = true;


/* ==================================================
   START AUDIO
================================================== */

function startAudio() {

    if (audioStarted) {

        return;

    }


    backgroundAudio
        .play()
        .then(() => {

            audioStarted = true;

            updateAudioUI();

        })
        .catch(() => {

            console.log(
                "Audio menunggu interaksi pengguna."
            );

        });

}


/* ==================================================
   TOGGLE
================================================== */

audioToggle.addEventListener(
    "click",
    () => {

        if (
            backgroundAudio.paused
        ) {

            backgroundAudio
                .play()
                .then(() => {

                    audioStarted = true;

                    updateAudioUI();

                });

        } else {

            backgroundAudio.pause();

            updateAudioUI();

        }

    }
);


/* ==================================================
   UI
================================================== */

function updateAudioUI() {

    if (
        backgroundAudio.paused
    ) {

        audioIcon.textContent =
            "×";

        audioLabel.textContent =
            "Muted";

        audioToggle.setAttribute(
            "aria-label",
            "Unmute audio"
        );

    } else {

        audioIcon.textContent =
            "♪";

        audioLabel.textContent =
            "Sound";

        audioToggle.setAttribute(
            "aria-label",
            "Mute audio"
        );

    }

}


/* ==================================================
   USER INTERACTION
================================================== */

window.addEventListener(
    "pointerdown",
    () => {

        startAudio();

    },
    {
        once: true
    }
);


/* ==================================================
   ENTRY READY
================================================== */

window.addEventListener(
    "entryReady",
    () => {

        startAudio();

    }
);
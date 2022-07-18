var wavesurfer = WaveSurfer.create({
    container: ".audio",
    waveColor: "#eee",
    progressColor: "red",
    barWidth: 0.05,
    plugins: [
        WaveSurfer.regions.create({}),
        WaveSurfer.cursor.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
                'background-color': '#000',
                color: '#fff',
                padding: '2px',
                'font-size': '10px'
            }
        }),
        WaveSurfer.markers.create({
            markers: [
                {
                    time: 5.5,
                    label: "V1",
                    color: '#ff990a'
                },
                {
                    time: 40,
                    label: "V2",
                    color: '#00ffcc',
                    position: 'top'
                },
                {
                    time: 80,
                    label: "V2",
                    color: '#00ffcc',
                    position: 'top'
                },
                {
                    time: 120,
                    label: "V3",
                    color: '#00fdcc',
                    position: 'top'
                },
                {
                    time: 220,
                    label: "V3",
                    color: '#00fdcc',
                    position: 'top'
                }
            ]
        })

    ]
});

// var wavesurfer = WaveSurfer.create({
//     container: ".audio",
//     plugins: [
//             WaveSurfer.markers.create({
//                 markers: [
//                     {
//                         time: 5.5,
//                         label: "V1",
//                         color: '#ff990a'
//                     },
//                     {
//                         time: 10,
//                         label: "V2",
//                         color: '#00ffcc',
//                         position: 'top'
//                     }
//                 ]
//             })
//     ]
// });

wavesurfer.load("./track1.mp3");

const playBtn = document.querySelector(".play-btn");
const stopBtn = document.querySelector(".stop-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");

playBtn.addEventListener("click", () => {
    wavesurfer.playPause();

    if (wavesurfer.isPlaying()) {
        playBtn.classList.add("playing");
    } else {
        playBtn.classList.remove("playing");
    }
});

stopBtn.addEventListener("click", () => {
    wavesurfer.stop();
    playBtn.classList.remove("playing");
});

volumeSlider.addEventListener("mouseup", () => {
    changeVolume(volumeSlider.value);
});

const changeVolume = (volume) => {
    if (volume == 0) {
        muteBtn.classList.add("muted");
    } else {
        muteBtn.classList.remove("muted");
    }

    wavesurfer.setVolume(volume);
};

muteBtn.addEventListener("click", () => {
    if (muteBtn.classList.contains("muted")) {
        muteBtn.classList.remove("muted");
        wavesurfer.setVolume(0.5);
        volumeSlider.value = 0.5;
    } else {
        wavesurfer.setVolume(0);
        muteBtn.classList.add("muted");
        volumeSlider.value = 0;
    }
});
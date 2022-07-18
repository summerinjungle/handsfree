import React, { useEffect, useRef, useState } from "react";
import "./edit.css";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import Stop from "@material-ui/icons/Stop";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";

const Edit = () => {
  const wavesurfer = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const playBtn = document.querySelector(".play-btn");
  const playButton = () => {
    console.log("SDSDADASDSADADAD ", isPlay);
    waveSurfer.playPause();
    setIsPlay((current) => !current);
  };

  const stopButton = () => {
    setIsPlay(false);
  };

  useEffect(() => {
    setWaveSurfer(
      WaveSurfer.create({
        container: ".audio",
        waveColor: "#eee",
        progressColor: "red",
        barWidth: 0.05,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              "background-color": "red",
              color: "#fff",
              padding: "6px",
              "font-size": "15px",
            },
          }),
          MarkersPlugin.create({
            markers: [
              {
                time: 5.5,
                label: "V1",
                color: "#ff990a",
              },
              {
                time: 40,
                label: "V2",
                color: "#00ffcc",
                position: "top",
              },
              {
                time: 50,
                label: "V2",
                color: "red",
                position: "bottom",
              },
              {
                time: 120,
                label: "V3",
                color: "#00fdcc",
                position: "top",
              },
              {
                time: 220,
                label: "V3",
                color: "#00fdcc",
                position: "top",
              },
            ],
          }),
        ],
      })
    );
    console.log("시;발 ㅡㅡ ", waveSurfer);
    // waveSurfer.current.load("./track1.mp3");
  }, []);

  return (
    <div>
      <h1>편집실</h1>
      <div className='audio-container'>
        {/* <div className='track-name'>The name of the track</div> */}

        <div className='audio'></div>

        <div className='buttons'>
          <span
            className={"play-btn btn" + (isPlay === true ? " playing" : "")}
            onClick={playButton}
          >
            <PlayArrowIcon className='fas fa-play' />
            <PauseIcon className='fas fa-pause' />
          </span>

          <span className='stop-btn btn' onClick={stopButton}>
            <Stop className='fas fa-stop' />
          </span>

          <span className='mute-btn btn'>
            <VolumeUp className='fas fa-volume-up' />
            <VolumeOff className='fas fa-volume-mute' />
          </span>

          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value='0.5'
            className='volume-slider'
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Edit;

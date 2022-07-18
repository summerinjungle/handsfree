import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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

const Wave = () => {
  const wavesurfer = useRef(null);
  const [isPlay, setIsPlay] = useState(false);
  const [volume, setVolume] = useState(1);
  const playButton = () => {
    wavesurfer.current.playPause();
    if (wavesurfer.current.isPlaying()) {
      setIsPlay(true);
    } else {
      setIsPlay(false);
    }
  };
  const stopButton = () => {
    wavesurfer.current.stop();
    setIsPlay(false);
  };

  const changeVolume = (event) => {
    setVolume(event.target.valueAsNumber);
    wavesurfer.current.setVolume(volume);
  };

  useEffect(() => {
    // loadAllRecord(); // 회의에서 저장된 기록들 가져오기

    wavesurfer.current = WaveSurfer.create({
      container: ".audio",
      waveColor: "#eee",
      progressColor: "red",
      barWidth: 0.05,
      plugins: [
        RegionsPlugin.create({
          regionsMinLength: 2,
          regions: [
            {
              id: "selected",
              start: 13,
              end: 156,
              loop: false,
              color: "hsla(400, 100%, 30%, 0.5)",
            },
          ],
          dragSelection: {
            slop: 5,
          },
        }),
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
              time: 60,
              label: "V2",
              color: "#00ffcc",
              position: "top",
            },
            {
              time: 950,
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
          ],
        }),
      ],
    });
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      console.log(" ㅡㅡ ", wavesurfer.current);
      wavesurfer.current.load(
        "https://openvidu.shop/openvidu/recordings/SessionB/ownweapon.webm"
      );
    }
  }, []);

  //   async function loadAllRecord() {
  //     await axios
  //       .get("/api/rooms/" + roomId + "/editingroom")
  //       .then(function (response) {
  //         console.log(response.data);
  //         chatList = response.data.chatList;
  //         starList = response.data.starList;
  //         recordMuteList = response.data.recordMuteList;
  //         // chatList, starList, recordMuteList 저장

  //         // dispatch(changeSession(response.data.roomId));
  //         // dispatch(changeIsPublisher(true));
  //         // dispatch(changeUserName(getUserNameInCookie()))
  //         // navigate("/meeting");
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }

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

          <span className={"mute-btn btn" + (!volume ? " muted" : "")}>
            <VolumeUp className='fas fa-volume-up' />
            <VolumeOff className='fas fa-volume-mute' />
          </span>

          <input
            type='range'
            min={0}
            max={20}
            step={1}
            value={volume}
            className='volume-slider'
            onChange={changeVolume}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Wave;

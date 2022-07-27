import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./edit.css";
import { useSelector } from "react-redux";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Stop from "@material-ui/icons/Stop";
import WaveSurfer from "wavesurfer.js";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";

const wavesurfer = useRef(null);
const [isPlay, setIsPlay] = useState(false);
const [volume, setVolume] = useState(1);
const [isLoading, setIsLoading] = useState(true);
const [chatList, setChatList] = useState([]); // 음성 기록들
const navigate = useNavigate();

const Wave = ({ sessionId }) => {
  let reduxCheck = useSelector((state) => {
    return state;
  });
  let newSessionId = "edit" + sessionId;
  // let gap = parseFloat(localStorage.getItem("createAt") - reduxCheck.user.createdAt) / 1000 -1;
  const sessionStartTime = parseFloat(localStorage.getItem("createAt")) + 1100;
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
    console.log("sessionId 입니다", sessionId);
    loadAllRecord(); // 회의에서 저장된 기록들 가져오기

    wavesurfer.current = WaveSurfer.create({
      container: ".audio",
      waveColor: "#F7F2EC",
      progressColor: "#FF7833",
      barWidth: 3,
      height: 65,
      plugins: [
        RegionsPlugin.create({}),
        MarkersPlugin.create({}),
        CursorPlugin.create({
          showTime: true,
          opacity: 0.9,
          customShowTimeStyle: {
            "background-color": "#6A573D",
            color: "#E3DDD5",
            padding: "6px",
            "font-size": "12px",
          },
        }),
      ],
    });
  }, []);

  async function loadAllRecord() {
    await axios
      .get("/api/rooms/" + sessionId + "/editingroom") // this.state.roomId 맞나요?
      .then(function (response) {
        const { chatList, starList, recordMuteList } =
          response.data.editingRoom;
        setChatList(chatList);
        console.log(" ----- editingroom response : ", response);

        // [잡담 구간] 표시
        console.log("RecordMuteList", recordMuteList);
        for (let i = 0; i < recordMuteList.length; i++) {
          let currLeft, currRight;
          if (recordMuteList[i].left == 0) {
            currLeft = 0;
          } else {
            currLeft =
              parseFloat(recordMuteList[i].left - sessionStartTime) / 1000;
          }
          currRight =
            parseFloat(recordMuteList[i].right - sessionStartTime) / 1000;

          console.log("left!!!!!!", currLeft);
          console.log("right!!!!!!", currRight);

          wavesurfer.current.regions.add({
            start: currLeft,
            end: currRight,
            // color: "#CEBFAC",
            color: "rgba(228, 209, 185, 0.7)",
            drag: false,
            resize: false,
          });
        }

        // [막둥아 별표] 표시
        console.log("starList", starList);
        for (let i = 0; i < starList.length; i++) {
          wavesurfer.current.addMarker({
            time: parseFloat(starList[i].startTime - sessionStartTime) / 1000,
            label: "",
            size: 100,
            color: "#ed7785",
            position: "top",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.current.load(
        "https://hyunseokmemo.shop/openvidu/recordings/" +
          sessionId +
          "/ownweapon.webm"
      ); // OPEN_VIDU 주소 전달해주면 됨
      wavesurfer.current.on("loading", (data) => {
        console.log("녹음 데이터~~", data);
        if (data >= 100) {
          setIsLoading(false);
        }
      });
    }
  }, []);
  return (
    <div>
      <div className='audio-container'>
        <div className='track-name'>The name of the track</div>
        <div className='audiobar'>
          <div className='audio'></div>
        </div>
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

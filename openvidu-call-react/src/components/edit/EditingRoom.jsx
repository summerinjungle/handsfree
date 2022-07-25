import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./edit.css";
import mainLogo from "../../assets/images/mainLogo.png";
import testMp3File from "./track1.mp3";
import ChatItem from "../edit/chat/ChatItem";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import Stop from "@material-ui/icons/Stop";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";
import { connect, useSelector } from "react-redux";
import TextEditor from "./TextEditor";
import saveButton from "./docx";
import { useNavigate } from "react-router-dom";

const EditingRoom = ({ sessionId }) => {
  let reduxCheck = useSelector((state) => {
    return state;
  });

  // let gap = parseFloat(localStorage.getItem("createAt") - reduxCheck.user.createdAt) / 1000 -1;
  const sessionStartTime = parseFloat(localStorage.getItem("createAt")) + 1100;
  console.log(localStorage.getItem("createAt"));
  console.log(reduxCheck.user.createdAt);
  // console.log("@@@@@@@@", gap);

  const wavesurfer = useRef(null);
  const [isPlay, setIsPlay] = useState(false);
  const [volume, setVolume] = useState(1);
  const navigate = useNavigate();

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

  const [chatList, setChatList] = useState([]); // 음성 기록들

  useEffect(() => {
    console.log("sessionId 입니다", sessionId);
    loadAllRecord(); // 회의에서 저장된 기록들 가져오기

    wavesurfer.current = WaveSurfer.create({
      container: ".audio",
      waveColor: "#FFFFFF",
      progressColor: "#FF7833",
      barWidth: 3,
      plugins: [
        RegionsPlugin.create({}),
        MarkersPlugin.create({}),
        CursorPlugin.create({
          showTime: true,
          opacity: 0.9,
          customShowTimeStyle: {
            "background-color": "#FF7833",
            color: "#fff",
            padding: "6px",
            "font-size": "12px",
          },
        }),
      ],
    });
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      console.log("WaveSurfer 녹음 파일 =====> ", mapStateToProps);
      //   wavesurfer.current.load(recordFile.url);
      //   wavesurfer.current.load(testMp3File)
      wavesurfer.current.load(
        "https://hyunseokmemo.shop/openvidu/recordings/" +
          sessionId +
          "/ownweapon.webm"
      ); // OPEN_VIDU 주소 전달해주면 됨
    }
  }, []);


  /**
   * [GET] http://{BASE_URL}/api/rooms/{roomId}/editingroom
   *
   * 잡담구간, 별표표시, 음성기록에 필요한 정보들 받아와
   * WaveSurfer에 뿌려줌
   *
   * TODO: 아래 for 반복문 2개 함수로 분리
   */
  async function loadAllRecord() {
    await axios
      .get("/api/rooms/" + sessionId + "/editingroom") // this.state.roomId 맞나요?
      .then(function (response) {
        const { chatList, starList, recordMuteList } =
          response.data.editingRoom;
        setChatList(chatList);
        console.log("WWWWW", response);

        // [잡담 구간] 표시
        console.log("RecordMuteList", recordMuteList);
        for (let i = 0; i < recordMuteList.length; i++) {
          console.log("left!!!!!!", (recordMuteList[i].left - sessionStartTime) / 1000);
          console.log("right!!!!!!", (recordMuteList[i].right - sessionStartTime) / 1000);

          wavesurfer.current.regions.add({
            start: parseFloat(recordMuteList[i].left - sessionStartTime) / 1000,
            end: parseFloat(recordMuteList[i].right - sessionStartTime) / 1000,
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
            color: "#FF7715",
            position: "top",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /* 음성기록 Item에서 [재생]버튼 클릭 시 실행 */
  function playTimeWaveSurfer(startTime) {
    if (startTime) {
      console.log(parseFloat(startTime - sessionStartTime) / 1000);
      wavesurfer.current.play(parseFloat(startTime - sessionStartTime) / 1000);
    } else {
      console.log("timeWaveSurfer 값이 존재하지 않습니다.");
    }
  }

  /**
   * 음성기록 리스트 내 아이템 삭제 함수
   */
  function deleteChatItem(paramId) {
    setChatList(chatList.filter((chat) => chat.id !== paramId));
  }

  function saveMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8" />`;
    let targetString = ns.serializeToString(
      document.querySelector(".ql-editor")
    );
    return korean + targetString;
  }

  function saveSoundMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8" />`;
    let targetString = ns.serializeToString(
      // document.querySelector(".ql-editor")
      document.querySelector(".contents-right")
    );
    targetString = targetString.replace("음성 기록", "<h2>음성 기록</h2>");
    targetString = targetString.replace(/▶︎/g, "");
    targetString = targetString.replace(/수정/g, "");
    targetString = targetString.replace(/삭제/g, "");
    targetString = targetString.replace(/메모장에 추가/g, "");
    console.log(targetString);
    return korean + targetString;
  }

  return (
    <div id='editingroom-container'>
      {/* <Voice sessionId={sessionId} /> */}
      {/* <VoiceRoom /> */}
      <div className='header'>
        <div className='header-contents'>
          <img className='header-logo' src={mainLogo} />
        </div>
        <div className='header-contents text-right'>
          <button
            className='download'
            onClick={() => saveButton(saveMemo(), "메모")}
          >
            메모 다운로드
          </button>
          <button
            className='download2'
            onClick={() => saveButton(saveSoundMemo(), "음성 기록")}
          >
            음성기록 다운로드
          </button>
          <button className='exit' onClick={() => navigate("/")}>
            나가기
          </button>
        </div>
      </div>
      <hr className='my-0'></hr>
      <div className='contents'>
        <div className='contents-left'>
          <div className='contents-label'>메모장</div>
          <TextEditor sessionId={sessionId} />
        </div>
        <div className='contents-right'>
          <div className='contents-label'>음성 기록</div>
          <div className='recorditems'>
            {chatList &&
              chatList.map((recordItem) => (
                <ChatItem
                  key={recordItem.id}
                  id={recordItem.id}
                  userName={recordItem.nickname}
                  time={recordItem.time}
                  startTime={recordItem.startTime}
                  isMarker={recordItem.marker}
                  message={recordItem.message}
                  playTimeWaveSurfer={playTimeWaveSurfer}
                  deleteChatItem={deleteChatItem}
                />
              ))}
          </div>
        </div>
      </div>
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

const mapStateToProps = (state) => {
  return {
    roomId: state.user.sessionId,
  };
};

export default connect(mapStateToProps)(EditingRoom);

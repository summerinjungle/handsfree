import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./edit.css";
import "./wave.css";
import ChatItem from "../edit/chat/ChatItem";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Stop from "@material-ui/icons/Stop";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";
import { connect, useSelector } from "react-redux";
import TextEditor from "./TextEditor";
import saveButton from "./docx";
import { getUserNameInCookie } from "../../main/cookie";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import VoiceRoom from "../voiceroom/VoiceRoom";
import Header from "./Header";
import ChatItemList from "./chat/ChatItemList";
const EditingRoom = ({ sessionId }) => {
  let reduxCheck = useSelector((state) => {
    return state;
  });
  let newSessionId = "edit" + sessionId;
  // let gap = parseFloat(localStorage.getItem("createAt") - reduxCheck.user.createdAt) / 1000 -1;
  const sessionStartTime = parseFloat(localStorage.getItem("createAt")) + 1100;

  const wavesurfer = useRef(null);
  const [isPlay, setIsPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatList, setChatList] = useState([]); // 음성 기록들
  const playButton = () => {
    wavesurfer.current.playPause();
    if (wavesurfer.current.isPlaying()) {
      setIsPlay((prevIsPlay) => !prevIsPlay);
    } else {
      setIsPlay((prevIsPlay) => !prevIsPlay);
    }
  };

  const playButtonFromWaveSurfer = (startTime, id) => {
    wavesurfer.current.playPause();
    setChatList((chatList) =>
      chatList.map((list) =>
        list.id == id ? { ...list, play: !list.play } : list
      )
    );
    if (wavesurfer.current.isPlaying()) {
      setIsPlay((prevIsPlay) => !prevIsPlay);
      wavesurfer.current.play(parseFloat(startTime - sessionStartTime) / 1000);
    } else {
      setIsPlay((prevIsPlay) => !prevIsPlay);
    }
  };

  const stopButton = () => {
    wavesurfer.current.stop();
    setIsPlay(false);
  };

  useEffect(() => {
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

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.current.load(
        // "https://hyunseokmemo.shop/openvidu/recordings/" +
        // sessionId +
        // "/ownweapon.webm"
        "https://onxmoreplz.shop/openvidu/recordings/" +
          sessionId +
          "/ownweapon.webm"
      ); // OPEN_VIDU 주소 전달해주면 됨
      wavesurfer.current.on("loading", (data) => {
        if (data >= 100) {
          setIsLoading(false);
        }
      });
    }
  }, []);

  async function loadAllRecord() {
    await axios
      .get("/api/rooms/" + sessionId + "/editingroom") // this.state.roomId 맞나요?
      .then(function (response) {
        console.log("EditingRoom", response.data.editingRoom);
        const { chatList, starList, recordMuteList } =
          response.data.editingRoom;
        setChatList(chatList);
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

          wavesurfer.current.regions.add({
            start: currLeft,
            end: currRight,
            // color: "#CEBFAC",
            color: "rgba(96, 95, 95, 0.85)",
            drag: false,
            resize: false,
          });
        }

        // [막둥아 별표] 표시
        for (let i = 0; i < starList.length; i++) {
          wavesurfer.current.addMarker({
            time: parseFloat(starList[i].startTime - sessionStartTime) / 1000,
            label: "별표",
            size: 100,
            color: "red",
            position: "top",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
      document.querySelector(".contents-right")
    );
    targetString = targetString.replace("음성 기록", "<h2>음성 기록</h2>");
    targetString = targetString.replace(/▶︎/g, "");
    targetString = targetString.replace(/수정/g, "");
    targetString = targetString.replace(/다운로드/g, "");
    targetString = targetString.replace(/삭제/g, "");
    targetString = targetString.replace(/메모장에 추가/g, "");
    return korean + targetString;
  }

  return (
    <>
      <Header />
      <div className='textedit'>
        <div className='contents-left'>
          <TextEditor sessionId={sessionId} />
        </div>
      </div>
      <ChatItemList
        chatList={chatList}
        playTimeWaveSurfer={playButtonFromWaveSurfer}
        deleteChatItem={deleteChatItem}
        isPlay={isPlay}
      />

      <hr className='my-0'></hr>

      <div className='audio-container'>
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
        </div>
      </div>
      <VoiceRoom sessionId={newSessionId} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roomId: state.user.sessionId,
  };
};

export default connect(mapStateToProps)(EditingRoom);

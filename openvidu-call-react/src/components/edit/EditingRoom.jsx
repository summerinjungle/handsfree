import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./edit.css";
import "./wave.css";
import mainLogo from "../../assets/images/mainLogo.png";
import ChatItem from "../edit/chat/ChatItem.jsx";
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
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Voicechat from "./chat/Voicechat";
import { getUserNameInCookie } from "../../main/cookie";
import VoiceRoom from "../voiceroom/VoiceRoom";
import Spinner from "./Spinner";
import swal from "sweetalert";

const EditingRoom = ({ sessionId }) => {
  let reduxCheck = useSelector((state) => {
    return state;
  });
  let newSessionId = "edit" + sessionId;
  // let gap = parseFloat(localStorage.getItem("createAt") - reduxCheck.user.createdAt) / 1000 -1;
  const sessionStartTime = parseFloat(localStorage.getItem("createAt")) + 1000;

  const wavesurfer = useRef(null);
  const [isPlay, setIsPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [prevId, setPrevId] = useState(-1);
  const [recordId, setRecordId] = useState(-1);
  const [playItem, setPlayItem] = useState(false);
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]); // 음성 기록들

  const playButton = () => {
    wavesurfer.current.playPause();
    if (wavesurfer.current.isPlaying() || playItem === true) {
      if (playItem) {
        setChatList((chatList) =>
          chatList.map((list) =>
            list.id == recordId ? { ...list, play: !list.play } : list
          )
        );
        setPlayItem(false);
        setIsPlay(false);
      } else {
        setIsPlay(true);
      }
    } else {
      setIsPlay(false);
    }
    setRecordId(-1);
    setPrevId(-1);
  };

  const PlayingRecord = (startTime, id) => {
    if (id === prevId) {
      wavesurfer.current.playPause();
      setChatList((chatList) =>
        chatList.map((list) =>
          list.id == id ? { ...list, play: !list.play } : list
        )
      );
      setPlayItem(false);
      setIsPlay(false);
    } else {
      setChatList((chatList) =>
        chatList.map((list) =>
          list.id == prevId ? { ...list, play: !list.play } : list
        )
      );

      setChatList((chatList) =>
        chatList.map((list) =>
          list.id == id ? { ...list, play: !list.play } : list
        )
      );
      wavesurfer.current.play(parseFloat(startTime - sessionStartTime) / 1000);
      setPlayItem(true);
      setIsPlay(true);
    }
  };

  const playButtonFromWaveSurfer = (startTime, id) => {
    let floorStartTime = Math.floor(startTime)
    if (wavesurfer.current.isPlaying()) {
      PlayingRecord(floorStartTime, id);
    } else {
      wavesurfer.current.playPause();
      setChatList((chatList) =>
        chatList.map((list) =>
          list.id == id ? { ...list, play: !list.play } : list
        )
      );
      setPlayItem(true);
      setIsPlay(true);
      wavesurfer.current.play(parseFloat(floorStartTime - sessionStartTime) / 1000);
    }

    setRecordId(id);
    setPrevId(id);
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
      progressColor: "#ffd6cd",
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
        //"https://eehnoeg.shop/openvidu/recordings/"+
        "https://hyunseokmemo.shop/openvidu/recordings/" +
          sessionId +
          "/ownweapon.webm"
        // "https://onxmoreplz.shop/openvidu/recordings/" +
        // sessionId +
        // "/ownweapon.webm"
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
          let currLeft;
          if (recordMuteList[i].start == 0) {
            currLeft = 0;
          } else {
            currLeft =
              parseFloat(recordMuteList[i].start - sessionStartTime) / 1000;
          }

          wavesurfer.current.regions.add({
            start: currLeft,
            end: parseFloat(recordMuteList[i].end - sessionStartTime) / 1000,
            // color: "#CEBFAC",
            color: "rgba(216, 207, 182, 0.85)",
            drag: false,
            resize: false,
          });
        }

        // [막둥아 별표] 표시
        for (let i = 0; i < starList.length; i++) {
          wavesurfer.current.addMarker({
            time: parseFloat(starList[i].startTime - sessionStartTime) / 1000,
            label: "",
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

  /* 음성기록 Item에서 [재생]버튼 클릭 시 실행 */
  // function playTimeWaveSurfer(startTime) {
  //   if (startTime) {
  //     console.log(parseFloat(startTime - sessionStartTime) / 1000);
  //     wavesurfer.current.play(parseFloat(startTime - sessionStartTime) / 1000);
  //   } else {
  //     console.log("timeWaveSurfer 값이 존재하지 않습니다.");
  //   }
  // }

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
      <div
        id='editingroom-container'
        style={
          // isLoading ? { backgroundColor: "rgba(112,125,233,0.2)" } : null
          isLoading ? { backgroundColor: "#73746033" } : null
          // isLoading ? { opacity: 0.2 } : null
        }
      >
        <div className='header'>
          <span className='header-contents vertical-align-middle'>
            <img className='header-logo' src={mainLogo} />
            {/* <div>현재 참여자 :</div> */}
          </span>
          <div className='header-contents text-right'>
            <Button
              className='exit'
              // icon={<ExitToAppIcon />}
              onClick={() => {
                swal({
                  title: "나가기",
                  text: "편집을 종료하시겠습니까?",
                  icon: "warning",
                  buttons: true,
                  // dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    navigate("/");
                    window.location.reload();
                  }
                });
              }}
            >
              나가기
            </Button>
          </div>
        </div>
        <hr className='my-0'></hr>
        <div className='contents'>
          <div className='contents-left'>
            <Voicechat userName={getUserNameInCookie()} roomId={sessionId} />
          </div>
          <div className='contents-middle'>
            <div className='contents-middle-wrap'>
              <div className='contents-label'>메모장&nbsp;</div>
              <Button
                type='primary'
                className='ant1'
                shape='round'
                icon={<DownloadOutlined />}
                onClick={() => {
                  saveButton(saveMemo(), "메모");
                }}
              >
                다운로드
              </Button>
            </div>
            <div className='textedit'>
              <TextEditor sessionId={sessionId} />
            </div>
          </div>
          <div className='contents-right'>
            <div className='contents-right-wrap'>
              <div className='contents-label'>
                &nbsp;&nbsp;&nbsp;음성 기록&nbsp;
              </div>
              <Button
                type='primary'
                className='antsound'
                shape='round'
                icon={<DownloadOutlined />}
                onClick={() => {
                  saveButton(saveSoundMemo(), "음성 기록");
                }}
              >
                다운로드
              </Button>
            </div>
            <div className='recorditems'>
              {chatList &&
                chatList.map((recordItem) => (
                  <ChatItem
                    key={recordItem._id}
                    id={recordItem.id}
                    nickname={recordItem.nickname}
                    time={recordItem.time}
                    startTime={recordItem.startTime}
                    isMarker={recordItem.marker}
                    message={recordItem.message}
                    play={recordItem.play}
                    playTimeWaveSurfer={playButtonFromWaveSurfer}
                    deleteChatItem={deleteChatItem}
                  />
                ))}
            </div>
          </div>
          {isLoading && <Spinner />}
        </div>
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
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roomId: state.user.sessionId,
  };
};

export default connect(mapStateToProps)(EditingRoom);

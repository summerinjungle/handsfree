import React, { useEffect, useRef, useState } from "react";
import Star from "@material-ui/icons/Star";
import "./ChatComponent.css";
import Recognition from "../recognition/Recognition";
import yellow from "@material-ui/core/colors/yellow";

const ChatComponent = ({ localUser, closeBtn, terminate }) => {
  const [messageList, setMessageList] = useState([]);
  const [starList, setStartList] = useState([]);
  const [recordMuteList, setRecordMuteList] = useState([]);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isStar, setIsStar] = useState(false);
  const [isRecordMute, setIsRecordMute] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const chatScroll = useRef(null);

  // if (this.props.terminate === true) {
  //   if (this.state.isRecog === false) {
  //     this.state.recordMuteList.push({
  //       left: this.state.left,
  //       right: new Date().getTime(),
  //     });
  //   }
  //   const chatInfo = {
  //     messageList: this.state.messageList,
  //     starList: this.state.starList,
  //     recordMuteList: this.state.recordMuteList,
  //   };
  //   this.props.rootFunction(chatInfo);
  // }

  // 컴포넌트가 웹 브라우저 상에 나타난 후 호출하는 메서드입니다.
  useEffect(() => {
    localUser.getStreamManager().stream.session.on("signal:chat", (event) => {
      const data = JSON.parse(event.data);
      console.log("채팅 데이터 === ", data);
      let length = messageList.length;
      setIsRecording(data.isRocrd);
      setIsStar(data.isStar);
      setIsRecordMute(data.isRecordMute);

      if (isRecording === false) return;

      if (isRecordMute === true) {
        setRecordMuteList((list) => [
          ...list,
          recordMuteList.concat({ left, right }),
        ]);
        setIsRecordMute(false);
      }
      if (
        data.message.includes("막둥아 기록 시작") ||
        data.message.includes("막둥아 기록시작") ||
        data.message.includes("박종화 기록시작") ||
        data.message.includes("박동화 기록시작")
      ) {
        return;
      }

      if (isRecording === true) {
        if (isStar === true && length > 0) {
          const stars = {
            message: messageList[length - 1].message,
            startTime: messageList[length - 1].startTime,
            id: msgIndex - 1,
          };

          setStartList((list) => [...list, starList.concat(stars)]);
          setIsStar(false);
          messageList[length - 1].marker = true;
          this.forceUpdate();
          return;
        }
        setMessageList((list) => [
          ...list,
          messageList.concat({
            connectionId: event.from.connectionId,
            nickname: data.nickname,
            message: data.message,
            time: data.time,
            startTime: data.startTime,
            marker: isStar,
            id: msgIndex,
          }),
        ]);
        setMsgIndex(msgIndex + 1);
        scrollToBottom();
      }
    });
  }, [message]);

  const sendMessage = () => {
    if (localUser && message) {
      console.log("메세지 보냄 ==", message);
      const date = new Date();
      const data = {
        isRecordMute: isRecordMute,
        isRecord: isRecording,
        isStar: isStar,
        time: date.getHours() + ":" + date.getMinutes(),
        message: message,
        nickname: localUser.getNickname(),
        streamId: localUser.getStreamManager().stream.streamId,
        startTime: startTime,
      };
      localUser.getStreamManager().stream.session.signal({
        data: JSON.stringify(data),
        type: "chat",
      });
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  };

  const close = () => {
    closeBtn(undefined);
  };

  const parentFunction = (data) => {
    setMessage(data.text);
    setStartTime(data.startTime);
    console.log("parent func !", message);
    console.log("text = ", data.text);
    if (
      data.text.includes("막둥아 기록 중지") ||
      data.text.includes("막둥아 기록중지") ||
      data.text.includes("기록 중지") ||
      data.text.includes("박종화 기록 중지")
    ) {
      if (isRecording === true) {
        setLeft(new Date().getTime() + 1000);
      }
      setIsRecording(false);
    } else if (
      data.text.includes("막둥아 기록 시작") ||
      data.text.includes("막둥아 기록시작") ||
      data.text.includes("기록시작") ||
      data.text.includes("기록 시작")
    ) {
      if (isRecording === false) {
        setRight(new Date().getTime() + 1000);
        setIsRecordMute(true);
      }
      setIsRecording(true);
    } else if (
      data.text.includes("막둥아 발표") ||
      data.text.includes("막둥아 대표") ||
      data.text.includes("막둥아 별표") ||
      data.text.includes("박동화 발표") ||
      data.text.includes("박동화 대표") ||
      data.text.includes("박동화 별표") ||
      data.text.includes("박종화 발표") ||
      data.text.includes("박종화 대표") ||
      data.text.includes("박종화 별표")
    ) {
      setIsStar(true);
    }

    sendMessage();
  };

  return (
    <div>
      <div className='isRecog'>
        {isRecording ? (
          <h1
            style={{
              color: "skyblue",
              fontSize: "25px",
              textAlign: "center",
            }}
          >
            🔵 기록중 🔵
          </h1>
        ) : (
          <h1 style={{ color: "pink", fontSize: "25px", textAlign: "center" }}>
            ❌ 기록중지 ❌
          </h1>
        )}
      </div>
      <div id='chatContainer'>
        <div id='chatComponent'>
          <div className='message-wrap' ref={chatScroll}>
            {messageList.map((data, i) => (
              <div
                key={i}
                id='remoteUsers'
                className={
                  "message" +
                  (data.connectionId !== localUser.getConnectionId()
                    ? " left"
                    : " right")
                }
              >
                <div className='msg-detail'>
                  <div className='msg-info'>
                    <p>
                      <b>{data.nickname} </b>
                      {data.time}
                    </p>
                  </div>

                  <div className='msg-content'>
                    <p className='text'>
                      {data.marker ? (
                        <Star style={{ color: yellow[800] }} />
                      ) : null}
                      {data.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Recognition parentFunction={parentFunction} />
      </div>
    </div>
  );
};

export default ChatComponent;

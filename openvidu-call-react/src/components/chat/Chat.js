import React, { Component, useEffect, useRef, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Send from "@material-ui/icons/Send";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import "./ChatComponent.css";
import { Tooltip } from "@material-ui/core";
import Dictaphone from "../Dictaphone";

const ChatComponent = ({ chatDisplay, user, rootFunction, closeBtn }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { transcript, resetTranscipt } = useSpeechRecognition();
  const chatScroll = useRef(null);

  // componentDidMount와 componentDidUpdate, componentWillUnmount가 합쳐진 것
  // componentDidMount : 컴포넌트가 웹 브라우저 상에 나타난 후 호출 하는 메서드
  // componentDidUpdate : 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드
  // componentWillUnmount : 컴포넌트가 웹 브라우저상에 사라지기 전에 호출하는 메서드
  useEffect(() => {
    // setMessage(transcript);
    // sendMessage();
    user.getStreamManager().stream.session.on("signal:chat", (event) => {
      console.log("event ===== >", event);
      const data = JSON.parse(event.data);
      datas = {
        connectionId: event.from.connectionId,
        nickname: data.nickname,
        message: data.message,
      };

      // messageList = messageList.concat(datas);
      setMessageList((messageList) => [...messageList, data]);
      // setMessageList((messageList) => [...messageList, datas]);
      // setMessageList((list) => [...list, messageList]);
      // setMessageList([...messageList, datas]);
      console.log();
      // const document = window.document;
      setTimeout(() => {
        const userImg = document.getElementById(
          "userImg-" + messageList.length - 1
        );
        const video = document.getElementById("video-" + data.streamId);
        // console.log("userImg = ", userImg);
        console.log("length = ", messageList.length);
        console.log("length = ", messageList);
        // const avatar = userImg.getContext("2d");
        // avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
        // this.props.messageReceived();
      }, 50);
      // this.setState({ messageList: messageList });
      scrollToBottom();
    });
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);
    // this.setState({ message: event.target.value });
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    console.log("send Message TQ", message);
    // setMessage(transcript);

    if (user && message) {
      const msg = message.replace(/ +(?= )/g, "");
      if (msg !== "" && msg !== " ") {
        const data = {
          message: msg,
          nickname: user.getNickname(),
          streamId: user.getStreamManager().stream.streamId,
        };

        user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    setMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  };

  const close = () => {
    closeBtn(undefined);
  };

  const parentFunction = (data) => {
    console.log("parentFunction , data ", data);
    // setMessage(data);
    sendMessage();
  };

  const styleChat = { display: chatDisplay };
  return (
    <div id='chatContainer'>
      <div id='chatComponent' style={styleChat}>
        <div id='chatToolbar'>
          <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span>
          <IconButton id='closeButton' onClick={close}>
            <HighlightOff color='secondary' />
          </IconButton>
        </div>
        <div className='message-wrap' ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id='remoteUsers'
              className={
                "message" +
                (data.connectionId !== user.getConnectionId()
                  ? " left"
                  : " right")
              }
            >
              <canvas
                id={"userImg-" + i}
                width='60'
                height='60'
                className='user-img'
              />
              <div className='msg-detail'>
                <div className='msg-info'>
                  <p> {data.nickname}</p>
                </div>
                <div className='msg-content'>
                  <span className='triangle' />
                  <p className='text'>{data.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div id='messageInput'>
          <input
            placeholder='Send a messge'
            id='chatInput'
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
          />
          <Tooltip title='Send message'>
            <Fab size='small' id='sendButton' onClick={sendMessage}>
              <Send />
            </Fab>
          </Tooltip>
        </div>
      </div>
      {/* {this.props.type == "stt" && (
          <Dictaphone
            parentFunction={this.parentFunction}
            rootFunction={this.props.rootFunction}
          />
        )} */}
      <Dictaphone parentFunction={parentFunction} rootFunction={rootFunction} />
    </div>
  );
};
export default ChatComponent;

import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import HighlightOff from "@material-ui/icons/HighlightOff";

import "./ChatComponent.css";
import Recognition from "../recognition/Recognition";

export default class ChatHandsFree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageList: [],
      message: "",
      isRecog: true,
      time: "",
    };
    this.chatScroll = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.close = this.close.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  // 컴포넌트가 웹 브라우저 상에 나타난 후 호출하는 메서드입니다.
  componentDidMount() {
    this.props.localUser
      .getStreamManager()
      .stream.session.on("signal:chat", (event) => {
        // console.log("event = ", event);
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;

        console.log("state record  =", this.state.isRecog);
        console.log("data record  =", data.isRecord);
        this.setState({ isRecog: data.isRecord });
        if (data.message === "기록 중지" || data.message === "기록중지") return;
        if (data.isRecord === true) {
          messageList.push({
            connectionId: event.from.connectionId,
            nickname: data.nickname,
            message: data.message,
            time: data.time,
          });
          const document = window.document;
          setTimeout(() => {
            const userImg = document.getElementById(
              "userImg-" + (this.state.messageList.length - 1)
            );
            const video = document.getElementById("video-" + data.streamId);
            const avatar = userImg.getContext("2d");
            avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
            // this.props.messageReceived();
          }, 50);
          this.setState({ messageList: messageList });
          this.scrollToBottom();
        }
      });
  }

  componentWillUnmount() {
    this.parentFunction();
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handlePressKey(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.props.localUser && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, "");
      if (message !== "" && message !== " ") {
        const date = new Date();
        const data = {
          isRecord: this.state.isRecog,
          time: date.getHours() + ":" + date.getMinutes(),
          message: message,
          nickname: this.props.localUser.getNickname(),
          streamId: this.props.localUser.getStreamManager().stream.streamId,
        };
        this.props.localUser.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    this.setState({ message: "" });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  }

  close() {
    this.props.closeBtn(undefined);
  }

  parentFunction = (data) => {
    this.state.message = data;
    console.log("!!!!! data", data);
    if (data === "기록 중지" || data === "기록중지") {
      this.setState({ isRecog: false });
    } else if (data === "기록 시작" || data === "기록시작") {
      this.setState({ isRecog: true });
    }

    this.sendMessage();
  };

  render() {
    const styleChat = { display: this.props.chatDisplay };
    return (
      <div id='chatContainer'>
        <div id='chatComponent' style={styleChat}>
          <div id='chatToolbar'>
            <span>
              {this.props.localUser.getStreamManager().stream.session.sessionId}{" "}
              - CHAT
            </span>
            <IconButton id='closeButton' onClick={this.close}>
              <HighlightOff color='secondary' />
            </IconButton>
          </div>
          <div className='message-wrap' ref={this.chatScroll}>
            {this.state.messageList.map((data, i) => (
              <div
                key={i}
                id='remoteUsers'
                className={
                  "message" +
                  (data.connectionId !== this.props.localUser.getConnectionId()
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
                    <p className='text'>{data.time}</p>
                  </div>
                  <div className='msg-content'>
                    <span className='triangle' />
                    <p className='text'>{data.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <Recognition parentFunction={this.parentFunction} /> */}
      </div>
    );
  }
}

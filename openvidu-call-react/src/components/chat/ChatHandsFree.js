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
      starList: [],
      recordMuteList: [],
      message: "",
      isRecog: true,
      isStar: false,
      isRecordMute: false,
      startTime: "",
      duringTime: this.props.duringTime,
      enterTime: this.props.enterTime,
      left: "",
      right: "",
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
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        let length = messageList.length;
        this.setState({ isRecog: data.isRecord });
        console.log("잡담구간 체크 = ", this.state.isRecordMute);

        if (this.state.isRecordMute === true) {
          this.state.recordMuteList.push({
            left: this.state.left,
            right: this.state.right,
          });
          this.setState({
            isRecordMute: false,
          });
        }
        console.log("잡담구간 확인", this.state.isRecordMute);

        if (data.message === "기록 중지" || data.message === "기록중지") return;
        if (data.isRecord === true) {
          const duringTime = this.state.duringTime;
          const enterTime = this.state.enterTime;
          console.log("기존회의 진행시간 :", duringTime);
          console.log("입장시간 :", enterTime);

          // 막둥아 별표 시간 : duringTime + (new Date().getTime() - entertime)
          console.log("그 전 데이터  = ", messageList[length - 1]);
          console.log("막둥아 별표 = ", data.isStar);
          if (this.state.isStar) {
            const stars = {
              message: messageList[length - 1].message,
              startTime: messageList[length - 1].startTime,
            };
            this.state.starList.push(stars);
            this.setState({ isStar: false });
          }
          console.log("마커 리스트", this.state.starList);

          messageList.push({
            connectionId: event.from.connectionId,
            nickname: data.nickname,
            message: data.message,
            time: data.time,
            startTime: data.startTime,
          });
          const document = window.document;
          setTimeout(() => {
            const userImg = document.getElementById(
              "userImg-" + (this.state.messageList.length - 1)
            );
            const video = document.getElementById("video-" + data.streamId);
            const avatar = userImg.getContext("2d");
            avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
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
          isStar: this.state.isStar,
          time: date.getHours() + ":" + date.getMinutes(),
          message: message,
          nickname: this.props.localUser.getNickname(),
          streamId: this.props.localUser.getStreamManager().stream.streamId,
          startTime: this.state.startTime,
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
    this.state.message = data.text;
    this.state.startTime = data.startTime;
    console.log("text = ", data.text);
    console.log("chat_comp startTime = ", data.startTime);
    if (data.text === "기록 중지" || data.text === "기록중지") {
      if (this.state.isRecog === true) {
        this.setState({
          left: data.startTime,
        });
      }
      this.setState({ isRecog: false });
    } else if (data.text === "기록 시작" || data.text === "기록시작") {
      if (this.state.isRecog === false) {
        this.setState({
          right: data.startTime,
          isRecordMute: true,
        });
      }
      this.setState({ isRecog: true });
    } else if (data.text === "막둥아 별표") {
      this.setState({ isStar: true });
    }

    this.sendMessage();
  };

  render() {
    return (
      <div id='chatContainer'>
        <div id='chatComponent'>
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
        <Recognition
          parentFunction={this.parentFunction}
          duringTime={this.state.duringTime}
          enterTime={this.state.enterTime}
        />
      </div>
    );
  }
}

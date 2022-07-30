import React, { Component } from "react";
import Star from "@material-ui/icons/Star";
import "./ChatHandsFree.css";
import Recognition from "../recognition/Recognition";
import yellow from "@material-ui/core/colors/yellow";
import isWriting from "../../assets/images/isWriting.png";
import isNotWriting from "../../assets/images/isNotWriting.png";
import { connect } from "react-redux";

class ChatHandsFree extends Component {
  state = {
    messageList: [],
    starList: [],
    recordMuteList: [],
    message: "",
    isRecog: false,
    startRecord: false,
    isStar: false,
    isRecordMute: false,
    startTime: "",
    left: 0,
    right: "",
    msgIndex: 0,
  };
  chatScroll = React.createRef();

  // 컴포넌트가 웹 브라우저 상에 나타난 후 호출하는 메서드입니다.
  componentDidMount() {
    this.props.localUser
      .getStreamManager()
      .stream.session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        let length = messageList.length;
        this.setState({
          isRecog: data.isRecord,
          isStar: data.isStar,
          isRecordMute: data.isRecordMute,
        });

        if (data.isRecord === false) return;

        if (this.state.isRecordMute === true) {
          this.state.recordMuteList.push({
            left: this.state.left,
            right: this.state.right,
          });
          this.setState({
            isRecordMute: false,
          });
        }
        if (this.state.startRecord === true) {
          this.setState({
            startRecord: false,
          });
          return;
        }

        if (this.state.isRecog === true) {
          if (this.state.isStar === true && length > 0) {
            const stars = {
              message: messageList[length - 1].message,
              startTime: messageList[length - 1].startTime,
              id: this.state.msgIndex - 1,
            };
            this.state.starList.push(stars);
            this.setState({ isStar: false });
            messageList[length - 1].marker = true;
            this.forceUpdate();
            return;
          }
          messageList.push({
            connectionId: event.from.connectionId,
            nickname: data.nickname,
            message: data.message,
            time: data.time,
            startTime: data.startTime,
            marker: this.state.isStar,
            id: this.state.msgIndex,
          });
          this.setState({
            msgIndex: this.state.msgIndex + 1,
          });
          this.setState({ messageList: messageList });
          this.scrollToBottom();
        }
      });
  }

  componentWillUnmount() {
    // this.parentFunction();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.terminate !== this.props.terminate) {
      if (this.state.isRecog === false) {
        this.state.recordMuteList.push({
          left: this.state.left,
          right: new Date().getTime() + 20000,
        });
      }
      const chatInfo = {
        messageList: this.state.messageList,
        starList: this.state.starList,
        recordMuteList: this.state.recordMuteList,
      };
      console.log("@@@ - componentDidUpdate", chatInfo);
      this.props.rootFunction(chatInfo);
    }
  }

  sendMessage = () => {
    if (this.props.localUser && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, "");
      if (message !== "" && message !== " ") {
        const date = new Date();
        const data = {
          isRecordMute: this.state.isRecordMute,
          isRecord: this.state.isRecog,
          startRecord: this.state.startRecord,
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
        // this.props.localUser.getStreamManager().stream
      }
      this.props.localUser.getStreamManager().stream.session.connection.disposed =
        this.state.isRecog;
    }
    this.setState({ message: "" });
  };

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) { }
    }, 20);
  }

  close = () => {
    this.props.closeBtn(undefined);
  };

  parentFunction = (data) => {
    console.log("text ==", data.text);
    this.setState({
      message: data.text,
      startTime: data.startTime,
    });
    if (
      data.text.includes("막둥아 기록 중지") ||
      data.text.includes("막둥아 기록중지") ||
      data.text.includes("박동화 기록 중지") ||
      data.text.includes("통화 기록 중지") ||
      data.text.includes("막둥아 중지") ||
      data.text.includes("박종화 기록 중지")
    ) {
      if (this.state.isRecog === true) {
        this.setState({
          left: new Date().getTime() + 1000,
        });
      }
      this.setState({ isRecog: false });
    } else if (
      data.text.includes("막둥아 기록 시작") ||
      data.text.includes("막둥아 기록시작") ||
      data.text.includes("박동화 기록 시작") ||
      data.text.includes("통화 기록 시작") ||
      data.text.includes("막둥아 시작") ||
      data.text.includes("박종화 기록 시작")
    ) {
      if (this.state.isRecog === false) {
        this.setState({
          right: new Date().getTime() + 1000,
          isRecordMute: true,
        });
      }
      this.setState({
        isRecog: true,
        startRecord: true,
      });
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
      this.setState({ isStar: true });
    }

    this.sendMessage();
  };

  render() {
    console.log("채팅 컴포넌트 호출");
    return (
      <div className='status-container'>
        <div className='recording'>
          <div className='writingStatus'>
            <div
              // className={`mackdoong-switch ${this.state.isRecog ? "colorYellow" : "colorRed"
              //   }`}
            >
<<<<<<< HEAD
              {this.state.isRecog ? "ON" : "OFF"}
=======
              {/* {this.state.isRecog ? "ON" : "OFF"} */}
>>>>>>> 9ba88c2d55d4da2b7322b3bfeb795f26a6ae9996
            </div>
            <div className='mackdoong-logo'>
              <img
                alt='막둥이'
                src={this.state.isRecog ? isWriting : isNotWriting}
<<<<<<< HEAD
                height={this.state.isRecog ? "40" : "20"}
                width={this.state.isRecog ? "42" : "22"}
=======
                height={this.state.isRecog ? "100" : "90"}
                width={this.state.isRecog ? "130" : "117"}
>>>>>>> 9ba88c2d55d4da2b7322b3bfeb795f26a6ae9996
              />
            </div>
            <div
              className='mackdoong-txt'
              style={{ marginBottom: 4 }}
            >
              {this.state.isRecog
                ? "막둥이가 기록 중이에요!"
<<<<<<< HEAD
                : " 막둥이를 불러주세요!   "}
=======
                : "막둥이를 불러주세요!   "}
>>>>>>> 9ba88c2d55d4da2b7322b3bfeb795f26a6ae9996
            </div>
          </div>
        </div>

        <div id='chatContainer'>
          <div id='chatComponent'>
            <div className='wrap' ref={this.chatScroll}>
              {this.state.messageList.map((data, i) => (
                <div
                  key={i}
                  id='remoteUsers'
                  className={
                    "message" +
                    (data.connectionId !==
                      this.props.localUser.getConnectionId()
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

                    <div
                      className={`
                      ${data.connectionId !==
                          this.props.localUser.getConnectionId()
                          ? " f-left"
                          : " f-right"
                        } ${data.marker ? "msg-content-star" : "msg-content"}
                      `}
                    >
                      {/* <span className='triangle' /> */}
                      <p className='text'>
                        {data.marker ? (
                          <Star
                            className='starInChat'
                            style={{ color: yellow[800] }}
                          />
                        ) : null}

                        {data.message}
                      </p>
                    </div>
                    {/* <div className='user-img '>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Recognition parentFunction={this.parentFunction} />
        </div>
      </div>
    );
  }
}

<<<<<<< HEAD
const mapStateToProps = (state) => {
  return {
    // duringTime: state.user.duringTime,
    // enterTime: state.user.enterTime,
  };
};

export default connect(mapStateToProps)(ChatHandsFree);
=======
export default ChatHandsFree;
>>>>>>> 9ba88c2d55d4da2b7322b3bfeb795f26a6ae9996

import React, { Component } from "react";
import Star from "@material-ui/icons/Star";
import "./ChatHandsFree.css";
import Recognition from "../recognition/Recognition";
import yellow from "@material-ui/core/colors/yellow";
import isWriting from "../../assets/images/isWriting.png";
import isNotWriting from "../../assets/images/isNotWriting.png";
import Balloons from "../../assets/images/Balloons.png";

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
        let length = this.state.messageList.length;
        this.setState({
          isRecog: data.isRecord,
          isStar: data.isStar,
          isRecordMute: data.isRecordMute,
          startRecord: data.startRecord,
        });
        if (data.isRecord === false) return;

        if (this.state.isRecordMute === true) {
          this.setState({
            isRecordMute: false,
            recordMuteList: this.state.recordMuteList.concat({
              left: this.state.left,
              right: this.state.right,
            }),
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
            this.setState({
              isStar: false,
              starList: this.state.starList.concat({
                message: this.state.messageList[length - 1].message,
                startTime: this.state.messageList[length - 1].startTime,
                id: this.state.msgIndex - 1,
              }),
            });
            this.state.messageList[length - 1].marker = true;
            this.forceUpdate();
            return;
          }
          this.setState((prevState) => ({
            msgIndex: prevState.msgIndex + 1,
            messageList: [
              ...prevState.messageList,
              {
                connectionId: event.from.connectionId,
                nickname: data.nickname,
                message: data.message,
                time: data.time,
                startTime: data.startTime,
                endTime: data.endTime,
                marker: this.state.isStar,
                id: this.state.msgIndex,
                play: false,
              },
            ],
          }));
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
          endTime: this.state.endTime,
        };
        this.props.localUser.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
  };

  scrollToBottom = () => {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  };

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
            className={`mackdoong-txt ${this.state.isRecog ? "colorYellow" : "colorRed"
              }`}
            >
              {/* {this.state.isRecog ? "ON" : "OFF"} */}
            </div>
            <img className='balloon' src={Balloons} />
            <div className='mackdoong-logo'>
              <img
                alt='막둥이'
                src={this.state.isRecog ? isWriting : isNotWriting}
                height={this.state.isRecog ? "90" : "80"}
                width={this.state.isRecog ? "120" : "115"}
              />
            </div>
            <div className='mackdoong-txt2'>막둥이는</div>
            {
              this.state.isRecog ? (
                <div className='mackdoong-txt-rec' style={{ marginBottom: 4 }}>
                  기록시작
                </div>
                ):(
                <div className='mackdoong-txt-noRec' style={{ marginBottom: 4 }}>
                  기록중지
                </div>
                )
            }
          </div>
        </div>
        {/* <button onClick={() => {
          this.state.isRecog? this.setState({ isRecog: false }):this.setState({ isRecog: true })
          console.log("change")
        }}>onoasd</button> */}
        <div id='chatContainer'>
          <div id='chatComponent'>
            <div className='wrap' ref={this.chatScroll}>
              {this.state.messageList?.map((data, i) => (
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
                      ${
                        data.connectionId !==
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

export default ChatHandsFree;

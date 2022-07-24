import React, { Component } from "react";
import Star from "@material-ui/icons/Star";
import "./ChatComponent.css";
import Recognition from "../recognition/Recognition";
import yellow from "@material-ui/core/colors/yellow";
import { connect } from "react-redux";
import { StarSpeech } from "../speech/Speech";

class ChatHandsFree extends Component {
  state = {
    messageList: [],
    starList: [],
    recordMuteList: [],
    message: "",
    isRecog: true,
    isStar: false,
    isRecordMute: false,
    startTime: "",
    left: 0,
    right: "",
    msgIndex: 0,
  };
  chatScroll = React.createRef();
  constructor(props) {
    super(props);
    console.log("11111", this.props.localUser.getStreamManager());
    console.log("22222", this.props.localUser.getStreamManager().stream);
  }

  // 컴포넌트가 웹 브라우저 상에 나타난 후 호출하는 메서드입니다.
  async componentDidMount() {
    await this.setState({
      isRecog:
        this.props.localUser.getStreamManager().stream.session.connection
          .disposed,
    });
    console.log("기록 가능?", this.state.isRecog);
    console.log(
      "disposed ==",
      this.props.localUser.getStreamManager().stream.session.connection.disposed
    );
    this.props.localUser
      .getStreamManager()
      .stream.session.on("signal:chat", (event) => {
        console.log(
          "diseposed 변경됨 ? =",
          this.props.localUser.getStreamManager().stream.session.connection
            .disposed
        );
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        let length = messageList.length;
        this.setState({ isRecog: data.isRecord });
        this.setState({ isStar: data.isStar });
        console.log("잡담구간 체크 = ", this.state.isRecordMute);

        if (data.isRecord === false) return;
        if (
          data.message.includes("막둥아 기록 시작") ||
          data.message.includes("막둥아 기록시작")
        )
          return;

        if (data.isRecordMute === true) {
          this.state.recordMuteList.push({
            left: this.state.left,
            right: this.state.right,
          });
          this.setState({
            isRecordMute: false,
          });
        }
        console.log("잡담구간 확인", this.state.isRecordMute);

        if (this.state.isRecog === true) {
          // 막둥아 별표 시간 : duringTime + (new Date().getTime() - entertime)
          console.log("그 전 데이터  = ", messageList[length - 1]);
          console.log("막둥아 별표 = ", data.isStar);
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

          console.log("마커 리스트", this.state.starList);
          console.log("메세지 리스트", this.state.messageList);
          this.setState({ messageList: messageList });
          this.scrollToBottom();
        }
      });
  }

  componentWillUnmount() {
    // this.parentFunction();
  }

  sendMessage = () => {
    if (this.props.localUser && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, "");
      if (message !== "" && message !== " ") {
        const date = new Date();
        const data = {
          isRecordMute: this.state.isRecordMute,
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
      } catch (err) {}
    }, 20);
  }

  close = () => {
    this.props.closeBtn(undefined);
  };

  parentFunction = (data) => {
    this.state.message = data.text;
    this.state.startTime = data.startTime;
    console.log("text = ", data.text);
    console.log("chat_comp startTime = ", data.startTime);
    if (
      data.text.includes("막둥아 기록 중지") ||
      data.text.includes("막둥아 기록중지")
    ) {
      if (this.state.isRecog === true) {
        this.setState({
          left: new Date().getTime() + 1000,
        });
      }
      this.setState({ isRecog: false });
    } else if (
      data.text.includes("막둥아 기록 시작") ||
      data.text.includes("막둥아 기록시작")
    ) {
      if (this.state.isRecog === false) {
        this.setState({
          right: new Date().getTime() + 1000,
          isRecordMute: true,
        });
      }
      this.setState({ isRecog: true });
    } else if (
      data.text.includes("막둥아 별표") ||
      data.text.includes("막둥아 대표") ||
      data.text.includes("막둥아 발표") ||
      data.text.includes("박종화 별표") ||
      data.text.includes("박종화 대표")
    ) {
      this.setState({ isStar: true });
    }

    this.sendMessage();
  };

  render() {
    if (this.props.terminate === true) {
      if (this.state.isRecog === false) {
        this.state.recordMuteList.push({
          left: this.state.left,
          right: new Date().getTime()
            // this.props.duringTime +
            // (new Date().getTime() - this.props.enterTime),
        });
      }
      const chatInfo = {
        messageList: this.state.messageList,
        starList: this.state.starList,
        recordMuteList: this.state.recordMuteList,
      };
      this.props.rootFunction(chatInfo);
    }
    return (
      <div>
        <div className='isRecog'>
          {this.state.isRecog ? (
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
            <h1
              style={{ color: "pink", fontSize: "25px", textAlign: "center" }}
            >
              ❌ 기록중지 ❌
            </h1>
          )}
        </div>
        <div id='chatContainer'>
          <div id='chatComponent'>
            <div className='message-wrap' ref={this.chatScroll}>
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

                    <div className='msg-content'>
                      {/* <span className='triangle' /> */}
                      <p className='text'>
                        {data.marker ? (
                          <Star style={{ color: yellow[800] }} />
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

const mapStateToProps = (state) => {
  return {
    duringTime: state.user.duringTime,
    enterTime: state.user.enterTime,
  };
};

export default connect(mapStateToProps)(ChatHandsFree);

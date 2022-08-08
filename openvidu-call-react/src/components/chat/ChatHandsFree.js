import React, { Component } from "react";
import Star from "@material-ui/icons/Star";
import "./ChatHandsFree.css";
import Recognition from "../recognition/Recognition";
import yellow from "@material-ui/core/colors/yellow";
import isWriting from "../../assets/images/isWriting.png";
import isNotWriting from "../../assets/images/isNotWriting.png";
import Balloons from "../../assets/images/Balloons.png";
import { throttle } from "lodash";
import { debounce } from "lodash";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";

class ChatHandsFree extends Component {
  state = {
    messageList: [],
    starList: [],
    recordMuteList: [],
    message: "",
    isRecog: true,
    startRecord: false,
    isStar: false,
    isRecordMute: false,
    startTime: "",
    start: 0,
    end: "",
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
              start: this.state.start,
              end: this.state.end,
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
          start: this.state.start,
          end: new Date().getTime() + 20000,
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

  throttle = (cb, delay = 3500) => {
    let shouldWait = false;
    let waitingArgs;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false;
      } else {
        cb(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
      }
    };

    return (...args) => {
      if (shouldWait) {
        waitingArgs = args;
        return;
      }

      cb(...args);
      this.sendMessage();
      shouldWait = true;
      setTimeout(timeoutFunc, delay);
    };
  };

  debouncedStopRecord = debounce(
    () => {
      this.stopRecording();
    },
    5000,
    {
      leading: true,
      trailing: false,
    }
  );

  debouncedStartRecord = debounce(
    () => {
      this.startRecording();
    },
    5000,
    {
      leading: true,
      trailing: false,
    }
  );

  debouncedMarkStar = debounce(
    () => {
      this.markStar();
    },
    5000,
    {
      leading: true,
      trailing: false,
    }
  );

  throttleStopRecord = throttle(() => {
    this.stopRecording();
  }, 5000);

  throttleStartRecord = throttle(() => {
    this.startRecording();
  }, 5000);

  throttleMarkStar = throttle(() => {
    this.markStar();
  }, 5000);

  debounceLeading = (cb, leading = false) => {
    let timer;
    return (...args) => {
      let callNow = leading && !timer;
      const later = () => {
        timer = null;
        if (!leading) {
          cb(...args);
        }
      };
      clearTimeout(timer);
      timer = setTimeout(later, 3500);
      if (callNow) {
        cb(...args);
      }
    };
  };

  myThrottle = (cb, delay = 2000) => {
    let shouldWait = false;
    let waitingArgs;
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false;
      } else {
        cb(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
        ToastsStore.info("막둥이를 소중히 다뤄주세요.");
      }
    };

    return (...args) => {
      if (shouldWait) {
        waitingArgs = args;
        return;
      }

      cb(...args);
      shouldWait = true;

      setTimeout(timeoutFunc, delay);
    };
  };

  makdoongDebounce = this.myThrottle((text) => {
    this.debouncing(text);
  });

  debouncing = (text) => {
    console.log("디바운싱~");

    if (
      text.includes(" 기록 중지") ||
      text.includes("중지") ||
      text.includes("정지")
    ) {
      // this.debouncedStopRecord();
      this.stopRecording();
      // debounce(() => {
      //   console.log("111");
      //   this.stopRecording();
      // }, 5000);
    } else if (
      text.includes(" 시작") ||
      text.includes(" 기록 시작") ||
      text.includes(" 시작 ")
    ) {
      // this.debouncedStartRecord();
      // debounce(() => {
      this.startRecording();
      // }, 5000);
    } else if (
      text.includes("발표") ||
      text.includes("대표") ||
      text.includes("별표")
    ) {
      this.markStar();
      // this.debouncedMarkStar();
      // this.debounce(this.markStar());
    }
    // ToastsStore.info("막둥이를 소중히 다뤄주세요.");
  };

  startRecording = () => {
    if (this.state.isRecog === false) {
      this.setState({
        end: new Date().getTime() + 1000,
        isRecordMute: true,
      });
    }
    this.setState({
      isRecog: true,
      startRecord: true,
    });
    this.sendMessage();
  };

  stopRecording = () => {
    if (this.state.isRecog === true) {
      this.setState({
        start: new Date().getTime() + 1000,
      });
    }
    this.setState({ isRecog: false });
    this.sendMessage();
  };

  markStar = () => {
    this.setState({ isStar: true });
    this.sendMessage();
  };

  parentFunction = (data) => {
    console.log("text ==", data.text);
    this.setState({
      message: data.text,
      startTime: data.startTime,
    });

    if (
      data.text.includes("막둥아") ||
      data.text.includes("통화") ||
      data.text.includes("박종화") ||
      data.text.includes("박동화") ||
      data.text.includes("박종학") ||
      data.text.includes("박동하")
    ) {
      console.log("막둥이 로직");
      this.makdoongDebounce(data.text);
      // this.debounceLeading(this.debouncing(data.text));
      // this.debouncing(data.text);
    } else {
      this.sendMessage();
    }
  };

  render() {
    return (
      <div className='status-container'>
        <div className='recording'>
          <div className='writingStatus'>
            <div
              className={`mackdoong-txt ${
                this.state.isRecog ? "colorYellow" : "colorRed"
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
            {this.state.isRecog ? (
              <div className='mackdoong-txt-rec' style={{ marginBottom: 4 }}>
                기록중
              </div>
            ) : (
              <div className='mackdoong-txt-noRec' style={{ marginBottom: 4 }}>
                쉬는중
              </div>
            )}
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

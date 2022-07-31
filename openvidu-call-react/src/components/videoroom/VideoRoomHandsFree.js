import React, { Component } from "react";
import axios from "axios";
import "./VideoRoomHandsFree.css";
import { OpenVidu } from "openvidu-browser";
import StreamHandFree from "../stream/StreamHandFree";
import DialogExtensionComponent from "../dialog-extension/DialogExtension";
import ChatHandsFree from "../chat/ChatHandsFree";
import OpenViduLayout from "../../layout/openvidu-layout";
import UserModel from "../../models/user-model";
import ToolbarComponent from "../toolbar/ToolbarComponent";
import { connect } from "react-redux";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import swal from "sweetalert";

var localUser = new UserModel();

class VideoRoomHandsFree extends Component {
  state = {
    myUserName: this.props.user
      ? this.props.user
      : "user" + Math.floor(Math.random() * 100),
    session: undefined,
    localUser: undefined,
    subscribers: [],
    currentVideoDevice: undefined,
    terminate: false,
  };
  remotes = [];
  layout = new OpenViduLayout();
  hasBeenUpdated = false;
  localUserAccessAllowed = false;

  constructor(props) {
    super(props);
    this.OPENVIDU_SERVER_URL = this.props.openviduServerUrl
      ? this.props.openviduServerUrl
      // : "https://oeg.shop:443";
      : "https://hyunseokmemo.shop:443";
    // : "https://onxmoreplz.shop:443";
    // : "https://" + window.location.hostname + ":4443";
    this.OPENVIDU_SERVER_SECRET = this.props.openviduSecret
      ? this.props.openviduSecret
      : "MY_SECRET";
  }

  componentDidMount = () => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
      fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      bigClass: "OV_big", // The class to add to elements that should be sized bigger
      bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
      bigFixedRatio: false, // fixedRatio for the big ones
      bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
      animate: true, // Whether you want to animate the transitions
    };

    this.layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );
    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.updateLayout);
    window.addEventListener("resize", this.checkSize);
    this.joinSession();

    // window.onbeforeunload = function() {
    //   return "";
    // }.bind(this);
  };

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    window.removeEventListener("resize", this.updateLayout);
    window.removeEventListener("resize", this.checkSize);
    // this.leaveSession();
    // this.connectToSession();
    // this.connect();
    // this.connectWebCam();
    // this.camStatusChanged();
  };

  onbeforeunload = (event) => {
    // this.meetingEnd();
  };

  joinSession = () => {
    this.OV = new OpenVidu();
    this.OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 100, // Frequency of the polling of audio streams in ms (default 100)
        threshold: -50, // Threshold volume in dB (default -50)
      },
    });

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        this.subscribeToStreamCreated();
        this.connectToSession();
      }
    );
  };

  connectToSession = () => {
    if (this.props.token !== undefined) {
      this.connect(this.props.token);
    } else {
      this.getToken()
        .then((token) => {
          this.connect(token);
        })
        .catch((error) => {
          if (this.props.error) {
            this.props.error({
              error: error.error,
              messgae: error.message,
              code: error.code,
              status: error.status,
            });
          }
          console.log(
            "There was an error getting the token:",
            error.code,
            error.message
          );
          alert("There was an error getting the token:", error.message);
        });
    }
  };

  connect = (token) => {
    this.state.session
      .connect(token, { clientData: this.state.myUserName })
      .then(() => {
        this.connectWebCam();
      })
      .catch((error) => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error connecting to the session:", error.message);
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  };
  /** SessionID 복사 함수 */
  copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(this.props.sessionId);
    } catch (error) {
      alert("복사 실패!");
    }
  };

  onClickToastPopup() {
    ToastsStore.info("초대코드를 복사 하였습니다.");
  }

  connectWebCam = async () => {
    var devices = await this.OV.getDevices();
    var videoDevices = devices.filter((device) => device.kind === "videoinput");

    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    if (this.state.session.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        this.state.session.publish(publisher).then(() => {
          this.updateSubscribers();
          this.localUserAccessAllowed = true;
          if (this.props.joinSession) {
            this.props.joinSession();
          }
        });
      });
    }
    localUser.setNickname(this.state.myUserName);
    localUser.setConnectionId(this.state.session.connection.connectionId);

    if (this.props.isPublisher === true) {
      localUser.setScreenShareActive(true);
    } else {
      localUser.setScreenShareActive(false);
    }

    // localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    this.subscribeToUserChanged();
    this.subscribeToStreamDestroyed();
    this.sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    });

    this.setState(
      { currentVideoDevice: videoDevices[0], localUser: localUser },
      () => {
        this.state.localUser.getStreamManager().on("streamPlaying", (e) => {
          this.updateLayout();
          publisher.videos[0].video.parentElement.classList.remove(
            "custom-class"
          );
        });
      }
    );
  };

  updateSubscribers = () => {
    var subscribers = this.remotes;
    this.setState(
      {
        subscribers: subscribers,
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            isVideoActive: this.state.localUser.isVideoActive(),
            nickname: this.state.localUser.getNickname(),
            isScreenShareActive: this.state.localUser.isScreenShareActive(),
          });
        }
        this.updateLayout();
      }
    );
  };

  getMessageList = async (chatData) => {
    console.log("#@@@@@@@ getMessage", chatData);
    await axios
      .post(
        `/api/rooms/${this.props.sessionId}/chat`,
        {
          chatList: chatData.messageList,
          starList: chatData.starList,
          recordMuteList: chatData.recordMuteList,
          // recordingUrl: OPENVIDU_SERVER_URL + "/recordings/" + sessionId + "/ownweapon.webm",  추가됨
        }
      )
      .then((res) => { })
      .catch((err) => {
        console.log("err === ", err);
      });

    const mySession = this.state.session;
    if (mySession) {
      mySession.disconnect();
    }
    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
      localUser: undefined,
    });

    swal({
      title: "회의종료",
      text: "편집실로 가시겠습니까?",
      icon: "warning",
      buttons: true,
      // dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.props.navigate("meeting/" + this.props.sessionId + "/edit");
      } else {
        this.props.navigate("/");
      }
    });
  };

  meetingEnd = async () => {
    if (this.props.isPublisher) {
      this.forceDisconnect(this.props.sessionId);
      this.startRecordingChk(this.props.sessionId);
      this.setState({
        terminate: true,
      });
    } else {
      if (window.confirm("회의실에서 나가시겠습니까?")) {
        const mySession = this.state.session;

        if (mySession) {
          mySession.disconnect();
        }
        // Empty all properties...
        this.OV = null;
        this.setState({
          session: undefined,
          subscribers: [],
          mySessionId: "SessionA",
          myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
          localUser: undefined,
        });
        if (this.props.leaveSession) {
          this.props.leaveSession();
        }

        this.props.navigate("/");
      }
    }
  };

  camStatusChanged = () => {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    this.setState({ localUser: localUser });
  };

  micStatusChanged = () => {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    this.setState({ localUser: localUser });
  };

  deleteSubscriber = (stream) => {
    const remoteUsers = this.state.subscribers;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      this.setState({
        subscribers: remoteUsers,
      });
    }

    if (userStream.screenShareActive) {
      // 회의 종료 알림창 확인창
      if (
        window.confirm(
          "방장이 회의를 종료하였습니다.\n" +
          "편집실로 아동하시겠습니까?\n" +
          "[취소]를 누르시면 메인 페이지로 이동합니다."
        )
      ) {
        // [확인] 클릭 -> 다음 [편집실] 페이지로 이동
        this.props.navigate("meeting/" + this.props.sessionId + "/edit");
      } else {
        // [취소] 클릭 -> Lobby로 이동
        this.props.navigate("");
      }
    }
  };

  subscribeToStreamCreated = () => {
    this.state.session.on("streamCreated", (event) => {
      const subscriber = this.state.session.subscribe(event.stream, undefined);
      // var subscribers = this.state.subscribers;
      subscriber.on("streamPlaying", (e) => {
        subscriber.videos[0].video.parentElement.classList.remove(
          "custom-class"
        );
      });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      this.remotes.push(newUser);
      if (this.localUserAccessAllowed) {
        this.updateSubscribers();
      }
    });
  };

  subscribeToStreamDestroyed = () => {
    // On every Stream destroyed...
    this.startRecordingChk(this.props.sessionId);
    this.state.session.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream);
      event.preventDefault();
      this.updateLayout();
    });
  };

  subscribeToUserChanged = () => {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
      this.setState({
        subscribers: remoteUsers,
      });
    });
  };

  updateLayout = () => {
    setTimeout(() => {
      this.layout.updateLayout();
    }, 20);
  };

  sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    this.state.session.signal(signalOptions);
  };

  closeDialogExtension = () => {
    this.setState({ showExtensionDialog: false });
  };

  checkSize = () => {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = true;
    }
    if (
      document.getElementById("layout").offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false;
    }
  };

  getToken = async () => {
    return this.createSession(this.props.sessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  };

  createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        customSessionId: sessionId,
        recordingMode: "ALWAYS", // 녹화를 위한 BODY 추가 추가
        defaultRecordingProperties: {
          name: "ownweapon",
          hasAudio: true,
          hasVideo: false,
          outputMode: "COMPOSED",
          resolution: "640x480",
          frameRate: 24,
        },
      });
      axios
        .post(this.OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
              this.OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                this.OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. ' +
                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                this.OPENVIDU_SERVER_URL +
                '"'
              )
            ) {
              window.location.assign(
                this.OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  };

  createToken = (sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .post(
          this.OPENVIDU_SERVER_URL +
          "/openvidu/api/sessions/" +
          sessionId +
          "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response.data.token);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  /**
   * 회의 Recording 종료 함수
   *  (현재 사용 안 함)
   *
   * @param {*} sessionId
   */
  stopRecording = async (sessionId) => {
    await axios
      .post(
        this.OPENVIDU_SERVER_URL + "/openvidu/api/recordings/stop/" + sessionId //sessionId랑 recordingId랑 똑같음 그래서 걍 sessionId 씀
      )
      .then((response) => {
        // this.props.getRecordFile(response.data.url);
        // resolve(response.data.token);
      })
      .catch((error) => {
        console.log("stop record  error ===> ", error);
      });
  };

  /**
   * * 방장(Publisher)이 회의 종료 시, 모든 Subscribers 회의 강제 종료
   *
   * @param {*} sessionId
   */
  forceDisconnect = async (sessionId) => {
    await axios
      .delete(this.OPENVIDU_SERVER_URL + "/api/sessions/" + sessionId, {
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // resolve(response.data.token);
      })
      .catch((error) => console.log("force error", error));
  };

  startRecordingChk = async (sessionId) => {
    await axios
      .get(this.OPENVIDU_SERVER_URL + "/openvidu/api/recordings/" + sessionId, {
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        localStorage.setItem("createAt", response.data.createdAt);
      })
      .catch((error) => {
        console.log("error !!", error);
      });
  };

  render() {
    const localUser = this.state.localUser;

    return (
      <div className='container' id='container'>
        <DialogExtensionComponent
          showDialog={this.state.showExtensionDialog}
          cancelClicked={this.closeDialogExtension}
        />

        <div id='layout' className='bounds'>
          {localUser !== undefined &&
            localUser.getStreamManager() !== undefined && (
              <div className='OT_root OT_publisher custom-class' id='localUser'>
                <StreamHandFree user={localUser} />
              </div>
            )}

          {this.state.subscribers
            ? this.state.subscribers.map((sub, i) => (
              <div
                key={i}
                className='OT_root OT_publisher custom-class'
                id='remoteUsers'
              >
                <StreamHandFree
                  user={sub}
                  streamId={sub.streamManager.stream.streamId}
                />
              </div>
            ))
            : null}
        </div>

        <div className='soundScribe'></div>
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div className='OT_root OT_publisher custom-class'>
            <ChatHandsFree
              localUser={localUser}
              rootFunction={this.getMessageList}
              terminate={this.state.terminate}
            />

            <button
              className='copy'
              onClick={() => {
                this.copyUrl();
                this.onClickToastPopup();
              }}
            >
              초대코드 복사
            </button>
            <button
              className='exitt'
              onClick={() => {
                swal({
                  title: "나가기",
                  text: "정말로 나가시겠습니까",
                  icon: "warning",
                  buttons: true,
                  // dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    this.meetingEnd();
                  }
                });
              }}
            >
              {this.props.isPublisher ? "회의종료" : "나가기"}
            </button>
            <ToastsContainer
              position={ToastsContainerPosition.BOTTOM_CENTER}
              store={ToastsStore}
              lightBackground
            />
          </div>
        )}
        <ToolbarComponent
          sessionId={this.props.sessionId}
          user={localUser}
          camStatusChanged={this.camStatusChanged}
          micStatusChanged={this.micStatusChanged}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sessionId: state.user.sessionId,
    isPublisher: state.user.isPublisher,
  };
};

export default connect(mapStateToProps)(VideoRoomHandsFree);

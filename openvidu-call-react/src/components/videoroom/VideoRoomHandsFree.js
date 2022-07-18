import React, { Component } from "react";
import axios from "axios";
import "./VideoRoomComponent.css";
import { OpenVidu } from "openvidu-browser";
import StreamHandFree from "./../stream/StreamHandFree";
import DialogExtensionComponent from "./../dialog-extension/DialogExtension";
import ChatHandsFree from "./../chat/ChatHandsFree";
import OpenViduLayout from "../../layout/openvidu-layout";
import UserModel from "../../models/user-model";
import LeftSide from "./../chat/Leftside";
import ToolbarComponent from "./../toolbar/ToolbarComponent";

var localUser = new UserModel();

class VideoRoomHandsFree extends Component {
  constructor(props) {
    super(props);
    this.OPENVIDU_SERVER_URL = this.props.openviduServerUrl
      ? this.props.openviduServerUrl
      : "https://" + window.location.hostname + ":4443";
    this.OPENVIDU_SERVER_SECRET = this.props.openviduSecret
      ? this.props.openviduSecret
      : "MY_SECRET";
    this.hasBeenUpdated = false;
    this.layout = new OpenViduLayout();
    let sessionName = this.props.sessionName
      ? this.props.sessionName
      : "SessionA";
    let userName = this.props.user
      ? this.props.user
      : "OpenVidu_User" + Math.floor(Math.random() * 100);

    this.remotes = [];
    this.localUserAccessAllowed = false;
    this.state = {
      mySessionId: sessionName,
      myUserName: userName,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      chatDisplay: "none",
      currentVideoDevice: undefined,
      // history: this.props,
    };
  }

  componentDidMount() {
    console.log("sdsdsdsd ]  = ", this.props.history);
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
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    window.removeEventListener("resize", this.updateLayout);
    window.removeEventListener("resize", this.checkSize);
    // this.leaveSession();
    this.connectToSession();
    this.connect();
    this.connectWebCam();
    this.camStatusChanged();
  }

  // onbeforeunload = (event) => {
  //   this.leaveSession();
  // };

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

  connectToSession() {
    if (this.props.token !== undefined) {
      console.log("token received: ", this.props.token);
      this.connect(this.props.token);
    } else {
      this.getToken()
        .then((token) => {
          console.log(token);
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
  }

  connect(token) {
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
  }

  async connectWebCam() {
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
    localUser.setScreenShareActive(false);
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
  }

  screenShare = () => {
    const videoSource =
      navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
          this.setState({ showExtensionDialog: true });
        } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
          alert("Your browser does not support screen sharing");
        } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
          alert("You need to enable screen sharing extension");
        } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
          alert("You need to choose a window or application to share");
        }
      }
    );

    publisher.once("accessAllowed", () => {
      this.state.session.unpublish(localUser.getStreamManager());
      localUser.setStreamManager(publisher);
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true);
        this.setState({ localUser: localUser }, () => {
          this.sendSignalUserChanged({
            isScreenShareActive: localUser.isScreenShareActive(),
          });
        });
      });
    });
    publisher.on("streamPlaying", () => {
      this.updateLayout();
      publisher.videos[0].video.parentElement.classList.remove("custom-class");
    });
  };

  updateSubscribers() {
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
  }

  // leaveSession = () => {
  //   if (
  //     // [예] 눌렀을 때
  //     window.confirm("회의를 종료하시겠습니까?")
  //   ) {
  //     // const mySession = this.state.session;
  //     // if (mySession) {
  //     //   mySession.disconnect();
  //     // }
  //     // // Empty all properties...
  //     // this.OV = null;
  //     // this.setState({
  //     //   session: undefined,
  //     //   subscribers: [],
  //     //   mySessionId: "SessionA",
  //     //   myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
  //     //   localUser: undefined,
  //     // });
  //     // if (this.props.leaveSession) {
  //     //   this.props.leaveSession();
  //     // }
  //     // 방장만 실행하는 함수 (회의 강제 종료)
  //     // this.forceDisconnect(this.state.mySessionId);
  //     this.props.navigate("edit");
  //   } else {
  //     // [아니오] 눌렀을 때
  //     console.log(this.state);
  //     console.log(this.state.session);
  //     console.log(this.state.session.capabilities);
  //     console.log(this.state.session.capabilities.publish); // true
  //     console.log(this.state.localUser.streamManager); // publisher 객체
  //     console.log(this.state.session.openvidu.role); // "PUBLISHER"
  //     // console.log(this.session.connection.role);
  //     // console.log("WHO ARE YOU", this.props.user.streamManager);// undefined
  //     console.log("TEST_PUBLISHER--3", this.state.session.streamManagers);
  //     console.log(
  //       "TEST_PUBLISHER--4",
  //       this.state.session.streamManagers.length
  //     );
  //     console.log("CONNIE", localUser);
  //     console.log("CONNIE", this.state.subscribers);
  //   }
  // };

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

  nicknameChanged = (nickname) => {
    let localUser = this.state.localUser;
    localUser.setNickname(nickname);
    this.setState({ localUser: localUser });
    this.sendSignalUserChanged({
      nickname: this.state.localUser.getNickname(),
    });
  };

  deleteSubscriber(stream) {
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
  }

  subscribeToStreamCreated() {
    this.state.session.on("streamCreated", (event) => {
      const subscriber = this.state.session.subscribe(event.stream, undefined);
      // var subscribers = this.state.subscribers;
      subscriber.on("streamPlaying", (e) => {
        this.checkSomeoneShareScreen();
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
  }

  subscribeToStreamDestroyed() {
    // On every Stream destroyed...
    this.state.session.on("streamDestroyed", (event) => {
      console.log("Destroyed", this.state.localUser.connectionId);

      // 회의 종료 알림창 확인창
      if (
        window.confirm(
          "방장이 회의를 종료하였습니다.\n" +
            "편집실로 아동하시겠습니까?\n" +
            "[취소]를 누르시면 메인 페이지로 이동합니다."
        )
      ) {
        // [확인] 클릭 -> 다음 [편집실] 페이지로 이동
        this.props.navigate("edit");
      } else {
        // [취소] 클릭 -> Lobby로 이동
        this.props.navigate("");
      }

      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream);
      setTimeout(() => {
        this.checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
      this.updateLayout();
    });
  }

  subscribeToUserChanged() {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
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
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
      );
    });
  }

  updateLayout = () => {
    setTimeout(() => {
      this.layout.updateLayout();
    }, 20);
  };

  sendSignalUserChanged(data) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    this.state.session.signal(signalOptions);
  }

  toggleFullscreen = () => {
    const document = window.document;
    const fs = document.getElementById("container");
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen();
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen();
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  closeDialogExtension = () => {
    this.setState({ showExtensionDialog: false });
  };

  stopScreenShare = () => {
    this.state.session.unpublish(localUser.getStreamManager());
    this.connectWebCam();
  };

  checkSomeoneShareScreen = () => {
    let isScreenShared;
    // return true if at least one passes the test
    isScreenShared =
      this.state.subscribers.some((user) => user.isScreenShareActive()) ||
      localUser.isScreenShareActive();
    const openviduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };
    this.layout.setLayoutOptions(openviduLayoutOptions);
    this.updateLayout();
  };

  toggleChat = (property) => {
    let display = property;
    console.log("chat event", display);
    if (display === undefined) {
      display = this.state.chatDisplay === "none" ? "block" : "none";
    }

    if (display === "block") {
      this.setState({ chatDisplay: display, messageReceived: false });
    } else {
      console.log("chat", display);
      this.setState({ chatDisplay: display });
    }
    this.updateLayout();
  };

  checkNotification = (event) => {
    this.setState({
      messageReceived: this.state.chatDisplay === "none",
    });
  };
  checkSize = () => {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.toggleChat("none");
      this.hasBeenUpdated = true;
    }
    if (
      document.getElementById("layout").offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false;
    }
  };

  render() {
    const mySessionId = this.state.mySessionId;
    const localUser = this.state.localUser;
    var chatDisplay = { display: this.state.chatDisplay };

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
                <StreamHandFree
                  user={localUser}
                  handleNickname={this.nicknameChanged}
                />
              </div>
            )}
          {this.state.subscribers.map((sub, i) => (
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
          ))}
          {localUser !== undefined &&
            localUser.getStreamManager() !== undefined && (
              <div
                className='OT_root OT_publisher custom-class'
                style={chatDisplay}
              >
                <ChatHandsFree
                  localUser={localUser}
                  chatDisplay={this.state.chatDisplay}
                  closeBtn={this.toggleChat}
                />
              </div>
            )}
        </div>
        <div className='soundScribe'>
          <LeftSide />
        </div>

        <ToolbarComponent
          sessionId={mySessionId}
          user={localUser}
          camStatusChanged={this.camStatusChanged}
          micStatusChanged={this.micStatusChanged}
          screenShare={this.screenShare}
          stopScreenShare={this.stopScreenShare}
          toggleFullscreen={this.toggleFullscreen}
          // leaveSession={this.leaveSession}
          toggleChat={this.toggleChat}
        />
      </div>
    );
  }

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
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
          console.log("CREATE SESION", response);
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
  }

  createToken(sessionId) {
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
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * 회의 Recording 종료 함수
   *  (현재 사용 안 함)
   *
   * @param {*} sessionId
   */
  stopRecording(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .post(
          this.OPENVIDU_SERVER_URL +
            "/openvidu/api/recordings/stop/" +
            sessionId, //sessionId랑 recordingId랑 똑같음 그래서 걍 sessionId 씀
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
          console.log("STOP_RECORDING", response);
          // resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * * 방장(Publisher)이 회의 종료 시, 모든 Subscribers 회의 강제 종료
   *
   * @param {*} sessionId
   */
  forceDisconnect(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .delete(this.OPENVIDU_SERVER_URL + "/api/sessions/" + sessionId, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("FORCE_DISCONNECT", response);
          // resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}
export default VideoRoomHandsFree;

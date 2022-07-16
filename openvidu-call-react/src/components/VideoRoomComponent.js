import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import "./VideoRoomComponent.css";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import DialogExtensionComponent from "./dialog-extension/DialogExtension";
import ChatComponent from "./chat/ChatComponent";
import ChatHandsFree from "./chat/ChatHandsFree";

import OpenViduLayout from "../layout/openvidu-layout";
import UserModel from "../models/user-model";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import ToolbarComponent from "./toolbar/ToolbarComponent";
var localUser = new UserModel();

const VideoRoomComponent = ({
  openviduServerUrl,
  openviduSecret,
  token,
  leaveSession,
  sessionName,
  user,
}) => {
  const OPENVIDU_SERVER_URL = openviduServerUrl
    ? openviduServerUrl
    : 'https://openvidu.shop:443';
  const OPENVIDU_SERVER_SECRET = openviduSecret ? openviduSecret : "MY_SECRET";
  const [hasBeenUpdated, setHasBeenUpdate] = useState(false);
  const layout = new OpenViduLayout();
  let sName = sessionName ? sessionName : "SessionA";
  let userName = user
    ? user
    : "OpenVidu_User" + Math.floor(Math.random() * 100);

  const [remotes, setRemotes] = useState([]);
  const [localUserAccessAllowed, setLocalUserAccessAllowed] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [info, setInfo] = useState({
    mySessionId: sName,
    myUserName: userName,
    session: undefined,
    localUser: undefined,
    subscribers: [], // 화상회의에 참여한 다른 유저
    chatDisplay: "none",
    currentVideoDevice: undefined,
  });
  // this.type = this.props.match.params.type
  //   ? this.props.match.params.type
  //   : "stt";

  let OV;
  const updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout();
    }, 20);
  };

  useEffect(() => {
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

    layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );
    window.addEventListener("beforeunload", onbeforeunload());
    window.addEventListener("resize", updateLayout());
    window.addEventListener("resize", checkSize());
    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload());
      window.removeEventListener("resize", updateLayout());
      window.removeEventListener("resize", checkSize());
      disconnectSession();
    };
  }, []);
  // componentWillUnmount() {

  // }

  const disconnectSession = () => {
    const mySession = info.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    OV = null;
    setInfo({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
      localUser: undefined,
    });

    if (leaveSession) {
      leaveSession();
    }
  };

  const onbeforeunload = (event) => {
    disconnectSession();
  };

  const joinSession = () => {
    OV = new OpenVidu();

    OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 100, // Frequency of the polling of audio streams in ms (default 100)
        threshold: -50, // Threshold volume in dB (default -50)
      },
    });

    setInfo(
      {
        session: OV.initSession(),
      },
      () => {
        subscribeToStreamCreated();
        connectToSession();
      }
    );
  };

  const connectToSession = () => {
    if (token !== undefined) {
      console.log("token received: ", token);
      connect(token);
    } else {
      getToken()
        .then((token) => {
          console.log(token);
          connect(token);
        })
        .catch((error) => {
          if (error) {
            error({
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

  const connect = (token) => {
    info.session
      .connect(token, { clientData: info.myUserName })
      .then(() => {
        connectWebCam();
      })
      .catch((error) => {
        if (error) {
          error({
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

  const connectWebCam = async () => {
    var devices = await OV.getDevices();
    var videoDevices = devices.filter((device) => device.kind === "videoinput");

    let publisher = OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    if (info.session.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        info.session.publish(publisher).then(() => {
          updateSubscribers();
          setLocalUserAccessAllowed(true);

          if (info.joinSession) {
            joinSession();
          }
        });
      });
    }
    localUser.setNickname(info.myUserName);
    localUser.setConnectionId(info.session.connection.connectionId);
    localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    });

    setInfo(
      {
        currentVideoDevice: videoDevices[0],
        localUser: localUser,
      },
      () => {
        info.localUser.getStreamManager().on("streamPlaying", (e) => {
          updateLayout();
          publisher.videos[0].video.parentElement.classList.remove(
            "custom-class"
          );
        });
      }
    );
  };

  const updateSubscribers = () => {
    var subscribers = remotes;

    setInfo(
      {
        subscribers: subscribers,
      },
      () => {
        if (info.state.localUser) {
          sendSignalUserChanged({
            isAudioActive: info.state.localUser.isAudioActive(),
            isVideoActive: info.state.localUser.isVideoActive(),
            nickname: info.state.localUser.getNickname(),
            isScreenShareActive: info.state.localUser.isScreenShareActive(),
          });
        }
        info.updateLayout();
      }
    );
  };

  const camStatusChanged = () => {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    setInfo({
      localUser: localUser,
    });
  };

  const micStatusChanged = () => {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    setInfo({
      localUser: localUser,
    });
  };

  const nicknameChanged = (nickname) => {
    let localUser = info.state.localUser;
    localUser.setNickname(nickname);
    info.setState({ localUser: localUser });
    info.sendSignalUserChanged({
      nickname: info.state.localUser.getNickname(),
    });
  };

  const deleteSubscriber = (stream) => {
    const remoteUsers = info.state.subscribers;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      setInfo({
        subscribers: remoteUsers,
      });
    }
  };

  const subscribeToStreamCreated = () => {
    info.session.on("streamCreated", (event) => {
      const subscriber = info.session.subscribe(event.stream, undefined);
      // var subscribers = this.state.subscribers;
      subscriber.on("streamPlaying", (e) => {
        checkSomeoneShareScreen();
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
      remotes.push(newUser);
      if (localUserAccessAllowed) {
        updateSubscribers();
      }
    });
  };

  const subscribeToStreamDestroyed = () => {
    // On every Stream destroyed...
    info.session.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream);
      setTimeout(() => {
        checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
      updateLayout();
    });
  };

  const subscribeToUserChanged = () => {
    info.session.on("signal:userChanged", (event) => {
      let remoteUsers = info.subscribers;
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

      setInfo(
        {
          subscribers: remoteUsers,
        },
        () => checkSomeoneShareScreen()
      );
    });
  };

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    info.session.signal(signalOptions);
  };

  const toggleFullscreen = () => {
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

  // async switchCamera() {
  //     try{
  //         const devices = await this.OV.getDevices()
  //         var videoDevices = devices.filter(device => device.kind === 'videoinput');

  //         if(videoDevices && videoDevices.length > 1) {

  //             var newVideoDevice = videoDevices.filter(device => device.deviceId !== this.state.currentVideoDevice.deviceId)

  //             if (newVideoDevice.length > 0) {
  //                 // Creating a new publisher with specific videoSource
  //                 // In mobile devices the default and first camera is the front one
  //                 var newPublisher = this.OV.initPublisher(undefined, {
  //                     audioSource: undefined,
  //                     videoSource: newVideoDevice[0].deviceId,
  //                     publishAudio: localUser.isAudioActive(),
  //                     publishVideo: localUser.isVideoActive(),
  //                     mirror: true
  //                 });

  //                 //newPublisher.once("accessAllowed", () => {
  //                 await this.state.session.unpublish(this.state.localUser.getStreamManager());
  //                 await this.state.session.publish(newPublisher)
  //                 this.state.localUser.setStreamManager(newPublisher);
  //                 this.setState({
  //                     currentVideoDevice: newVideoDevice,
  //                     localUser: localUser,
  //                 });
  //             }
  //         }
  //     } catch (e) {
  //         console.error(e);
  //     }
  // }

  const screenShare = () => {
    const videoSource =
      navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
    const publisher = OV.initPublisher(
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

  const closeDialogExtension = () => {
    setShowExtensionDialog(false);
  };

  const stopScreenShare = () => {
    info.session.unpublish(localUser.getStreamManager());
    connectWebCam();
  };

  const checkSomeoneShareScreen = () => {
    let isScreenShared;
    // return true if at least one passes the test
    isScreenShared =
      info.subscribers.some((user) => user.isScreenShareActive()) ||
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
    layout.setLayoutOptions(openviduLayoutOptions);
    updateLayout();
  };

  const toggleChat = (property) => {
    let display = property;
    console.log("chat event", display);
    if (display === undefined) {
      display = info.chatDisplay === "none" ? "block" : "none";
    }

    if (display === "block") {
      setInfo({
        chatDisplay: display,
      });
    } else {
      console.log("chat", display);
      setInfo({
        chatDisplay: display,
      });
    }
    updateLayout();
  };

  const checkNotification = (event) => {
    setInfo({
      messageReceived: info.chatDisplay === "none",
    });
    this.setState({
      messageReceived: info.chatDisplay === "none",
    });
  };

  const checkSize = () => {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !hasBeenUpdated
    ) {
      toggleChat("none");
      setHasBeenUpdate(true);
    }
    if (document.getElementById("layout").offsetWidth > 700 && hasBeenUpdated) {
      setHasBeenUpdate(false);
    }
  };

  const rootFunction = ({ command }) => {
    if (command === "막둥아 마이크 꺼" && localUser.isAudioActive()) {
      micStatusChanged();
    } else if (command === "막둥아 마이크 켜" && !localUser.isAudioActive()) {
      micStatusChanged();
    } else if (command === "막둥아 카메라 켜" && !localUser.isVideoActive()) {
      camStatusChanged();
    } else if (command === "막둥아 카메라 꺼" && localUser.isVideoActive()) {
      camStatusChanged();
    } else if (
      command === "막둥아 채팅 켜" ||
      command === "막둥아 채팅 창 켜" ||
      command === "막둥아 채팅창 켜"
    ) {
      toggleChat("");
    } else if (
      command === "막둥아 채팅 꺼" ||
      command === "막둥아 채팅 창 꺼" ||
      command === "막둥아 채팅창 꺼"
    ) {
      toggleChat("none");
    }
  };

  const getToken = () => {
    return createSession(info.mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  };

  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        customSessionId: sessionId,
        recordingMode: "ALWAYS", // 녹화를 위한 BODY 추가 추가
        defaultRecordingProperties: {
            "name": "OwnWeapon",
            "hasAudio": true,
            "hasVideo": false,
            "outputMode": "COMPOSED",
            "resolution": "640x480",
            "frameRate": 24
        }
    });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          console.log("@@@@@@@@@@@@@@@@@@@@@", response.data.sessionId);
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
  const createToken = (sessionId) => {
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
  };

  const mySessionId = info.mySessionId;
  const localUser = info.localUser;
  var chatDisplay = { display: info.chatDisplay };
  return (
    <div>
      <div className='container' id='container'>
        <ToolbarComponent
          sessionId={mySessionId}
          user={localUser}
          // showNotification={this.state.messageReceived}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          screenShare={screenShare}
          stopScreenShare={stopScreenShare}
          toggleFullscreen={toggleFullscreen}
          leaveSession={disconnectSession}
          toggleChat={toggleChat}
        />

        <DialogExtensionComponent
          showDialog={info.showExtensionDialog}
          cancelClicked={closeDialogExtension}
        />

        <div id='layout' className='bounds'>
          {localUser !== undefined &&
            localUser.getStreamManager() !== undefined && (
              <div className='OT_root OT_publisher custom-class' id='localUser'>
                <StreamComponent
                  user={localUser}
                  handleNickname={nicknameChanged}
                />
              </div>
            )}
          {info.subscribers.map((sub, i) => (
            <div
              key={i}
              className='OT_root OT_publisher custom-class'
              id='remoteUsers'
            >
              <StreamComponent
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
                  user={localUser}
                  chatDisplay={chatDisplay}
                  closeBtn={toggleChat}
                  // messageReceived={this.checkNotification}
                  rootFunction={rootFunction}
                />
                {/* <ChatComponent
                  user={localUser}
                  chatDisplay={this.state.chatDisplay}
                  closeBtn={this.toggleChat}
                  // messageReceived={this.checkNotification}
                  message={this.message}
                  rootFunction={this.rootFunction}
                /> */}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoRoomComponent;

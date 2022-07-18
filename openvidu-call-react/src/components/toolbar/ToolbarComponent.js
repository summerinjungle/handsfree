import React, { Component } from "react";
import "./ToolbarComponent.css";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Mic from "@material-ui/icons/Mic";
import MicOff from "@material-ui/icons/MicOff";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import PictureInPicture from "@material-ui/icons/PictureInPicture";
import ScreenShare from "@material-ui/icons/ScreenShare";
import StopScreenShare from "@material-ui/icons/StopScreenShare";
import Tooltip from "@material-ui/core/Tooltip";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import QuestionAnswer from "@material-ui/icons/QuestionAnswer";
import red from "@material-ui/core/colors/red";
import IconButton from "@material-ui/core/IconButton";
import { Modal } from "@material-ui/core";
import ModalComponent from "./ModalComponent";
const logo = require("../../assets/images/zoom.jpg");

export default class ToolbarComponent extends Component {
  state = {
    fullscreen: false,
    openModal: true,
  };

  micStatusChanged = () => {
    this.props.micStatusChanged();
  };

  camStatusChanged = () => {
    this.props.camStatusChanged();
  };

  screenShare = () => {
    this.props.screenShare();
  };

  stopScreenShare = () => {
    this.props.stopScreenShare();
  };

  toggleFullscreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen });
    this.props.toggleFullscreen();
  };

  leaveSession = () => {
    this.props.leaveSession();
  };

  toggleChat = () => {
    this.props.toggleChat();
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
      },
    };
    const mySessionId = this.props.sessionId;
    const localUser = this.props.user;
    return (
      <AppBar className='toolbar' id='header'>
        <Toolbar className='toolbar'>
          <div id='navSessionInfo'>
            {/* <img id='header_img' alt='OpenVidu Logo' src={logo} /> */}
            {this.props.sessionId && (
              <div id='titleContent'>
                <span id='session-title'>{mySessionId}</span>
              </div>
            )}
          </div>

          <div className='buttonsContent'>
            <IconButton
              color='inherit'
              className='navButton'
              id='navMicButton'
              onClick={this.micStatusChanged}
            >
              {localUser !== undefined && localUser.isAudioActive() ? (
                <Mic />
              ) : (
                <MicOff color='secondary' />
              )}
            </IconButton>

            <IconButton
              color='inherit'
              className='navButton'
              id='navCamButton'
              onClick={this.camStatusChanged}
            >
              {localUser !== undefined && localUser.isVideoActive() ? (
                <Videocam />
              ) : (
                <VideocamOff style={{ color: red[800] }} />
              )}
            </IconButton>

            <IconButton
              color='inherit'
              className='navButton'
              onClick={this.screenShare}
            >
              {localUser !== undefined && localUser.isScreenShareActive() ? (
                <PictureInPicture />
              ) : (
                <ScreenShare />
              )}
            </IconButton>

            {localUser !== undefined && localUser.isScreenShareActive() && (
              <IconButton onClick={this.stopScreenShare} id='navScreenButton'>
                <StopScreenShare color='secondary' />
              </IconButton>
            )}
            <IconButton
              color='inherit'
              className='navButton'
              onClick={this.toggleFullscreen}
            >
              {localUser !== undefined && this.state.fullscreen ? (
                <FullscreenExit />
              ) : (
                <Fullscreen />
              )}
            </IconButton>
            <IconButton
              style={{ color: red[800] }}
              color='secondary'
              className='navButton'
              onClick={this.leaveSession}
              id='navLeaveButton'
            >
              <PowerSettingsNew />
            </IconButton>

            {/* <IconButton
              color='inherit'
              onClick={this.toggleChat}
              id='navChatButton'
            >
              {this.props.showNotification && <div id='point' className='' />}
              <Tooltip title='Chat'>
                <QuestionAnswer />
              </Tooltip>
            </IconButton> */}
            
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

import React, { Component } from "react";
import "./ToolbarComponent.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Mic from "@material-ui/icons/Mic";
import MicOff from "@material-ui/icons/MicOff";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import red from "@material-ui/core/colors/red";
import IconButton from "@material-ui/core/IconButton";

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

  leaveSession = () => {
    this.props.leaveSession();
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const localUser = this.props.user;
    return (
      <AppBar className='toolbar' id='header'>
        <Toolbar className='toolbar'>
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
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

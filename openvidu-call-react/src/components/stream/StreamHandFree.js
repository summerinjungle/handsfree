import React, { Component } from "react";
import "./StreamComponent.css";
import OvVideoComponent from "./OvVideo";
export default class StreamComponent extends Component {
  state = {
    nickname: this.props.user.getNickname(),
  };
  toggleSound = () => {
    this.setState({ mutedSound: !this.state.mutedSound });
  };

  render() {
    return (
      <div className='OT_widget-container'>
        <div className='pointer nickname'>
          <div onClick={this.toggleNicknameForm}>
            <span id='nickname'>{this.props.user.getNickname()}</span>
            {this.props.user.isLocal() && <span id=''> (Hands Free)</span>}
          </div>
        </div>

        {this.props.user !== undefined &&
        this.props.user.getStreamManager() !== undefined ? (
          <div className='streamComponent'>
            <OvVideoComponent user={this.props.user} />
          </div>
        ) : null}
      </div>
    );
  }
}

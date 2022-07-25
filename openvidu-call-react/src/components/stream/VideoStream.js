import React, { Component } from "react";
import "./StreamComponent.css";

export default class VideoStream extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    console.log("비디오 정보 =", this.videoRef);
  }

  componentDidMount() {
    this.videoRef = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (this.props && this.props.user.streamManager && !!this.videoRef) {
      console.log("PROPS: ", this.props);
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
      console.log("비디오 정보 2 =", this.videoRef);
    }

    if (
      this.props &&
      this.props.user.streamManager.session &&
      this.props.user &&
      !!this.videoRef
    ) {
      this.props.user.streamManager.session.on(
        "signal:userChanged",
        (event) => {
          const data = JSON.parse(event.data);
          if (data.isScreenShareActive !== undefined) {
            this.props.user
              .getStreamManager()
              .addVideoElement(this.videoRef.current);
          }
        }
      );
    }
  }

  componentDidUpdate(props) {
    if (props && !!this.videoRef) {
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return (
      <video
        autoPlay={true}
        id={"video-" + this.props.user.getStreamManager().stream.streamId}
        ref={this.videoRef}
      />
    );
  }
}

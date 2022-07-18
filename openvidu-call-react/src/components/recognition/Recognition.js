import React, { useEffect, useState, Component } from "react";

// 소리감지체크
let sound_detect_check = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "ko-KR";

class Recognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcript: "",
      start_time: "",
    };
  }

  componentDidMount() {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.start();
    const date = new Date();
    const meeting_start_time = date.getTime();
    console.log("회의시작 시간 :", meeting_start_time);

    // 음성인식 시작 로그 찍어야함
    recognition.onstart = () => {
      sound_detect_check = false;
    };

    recognition.onend = () => {
      if (this.state.transcript !== "") {
        const date = new Date();
        const sttData = {
          text: this.state.transcript,
          startTime: this.state.start_time,
        };
        // 막둥이 로직추가
        this.props.parentFunction(sttData);
        console.log(this.state.transcript);

        console.log("end_time :", date.getTime() - meeting_start_time);
      }
      this.setState({ transcript: "" });
      recognition.start();
    };

    // 음성감지 된경우 시작시간을 등록한다
    recognition.onresult = (event) => {
      if (sound_detect_check !== true) {
        texts = "";
        const date = new Date();
        this.state.start_time = date.getTime() - meeting_start_time;
        console.log(
          "recog comp start_time",
          date.getTime() - meeting_start_time
        );
        sound_detect_check = true;
      }
      let texts = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      this.setState({ transcript: texts });
    };
  }
  render() {
    return (
      <div>
        <script></script>
      </div>
    );
  }
}

export default Recognition;

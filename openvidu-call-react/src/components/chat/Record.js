import React, { Component } from "react";
import io from "socket.io-client";
let sound_detect_check = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "ko-KR";

class Record extends Component {
  state = {
    script: "",
    start_time: "",
  };

  componentDidMount() {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.start();

    // 음성인식 시작 로그 찍어야함
    recognition.onstart = () => {
      sound_detect_check = false;
    };

    recognition.onend = () => {
      if (this.state.script !== "") {
        // 막둥이 로직추가
        if (
          this.state.script.includes("막둥아 기록 중지")||
          this.state.script.includes("막둥아 기록중지")||
          this.state.script.includes("박동화 기록 중지")||
          this.state.script.includes("통화 기록 중지")||
          this.state.script.includes("막둥아 중지")||
          this.state.script.includes("박종화 기록 중지")
          ) {
          this.setState({ script: "기록중지@" });
          this.state.start_time = new Date().getTime()
        } else if (
          this.state.script.includes("막둥아 기록 시작")||
          this.state.script.includes("막둥아 기록시작")||
          this.state.script.includes("박동화 기록 시작")||
          this.state.script.includes("통화 기록 시작")||
          this.state.script.includes("막둥아 시작")||
          this.state.script.includes("박종화 기록 시작")
          ) {
          this.setState({ script: "기록시작@" });
          this.state.start_time = new Date().getTime()
        } else if (
          this.state.script.includes("막둥아 발표")||
          this.state.script.includes("막둥아 대표")||
          this.state.script.includes("막둥아 별표")||
          this.state.script.includes("박동화 발표")||
          this.state.script.includes("박동화 대표")||
          this.state.script.includes("박동화 별표")||
          this.state.script.includes("박종화 발표")||
          this.state.script.includes("박종화 대표")||
          this.state.script.includes("박종화 별표")
        ) {
          this.setState({ script: "별표&"});
        } 
        const today = new Date();
        const hour = ('0' + today.getHours()).slice(-2);
        const min = ('0' + today.getMinutes()).slice(-2);
        const sttData = {
          text: this.state.script,
          now: hour + ":" + min,
          time: this.state.start_time
        };
        
        this.props.parentFunction(sttData);

        // console.log(this.state.script);
      }
      this.setState({ script: "" });
      recognition.start();
    };

    // 음성감지 된경우 시작시간을 등록한다
    recognition.onresult = (event) => {
      if (sound_detect_check !== true) {
        texts = "";
        this.state.start_time = new Date().getTime()
        sound_detect_check = true;
      }
      let texts = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      this.setState({ script: texts });
    };

  }

  componentWillUnmount() {
    console.log("component!!!");
    recognition.onend = () => {
      
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

export default Record;
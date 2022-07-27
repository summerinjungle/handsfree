import React, { PureComponent } from "react";
let sound_detect_check = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "ko-KR";

class Recognition extends PureComponent {
  state = {
    transcript: "",
    start_time: "",
  };
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
        const sttData = {
          text: this.state.transcript,
          startTime: this.state.start_time,
        };
        // 막둥이 로직추가
        this.props.parentFunction(sttData);
      }
      this.setState({ transcript: "" });
      recognition.start();
    };

    // 음성감지 된경우 시작시간을 등록한다
    recognition.onresult = (event) => {
      if (sound_detect_check !== true) {
        texts = "";
        this.setState({
          start_time: new Date().getTime(),
        });
        sound_detect_check = true;
      }
      let texts = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      this.setState({ transcript: texts });
    };
  }
  render() {
    console.log("STT 컴포넌트 호출");
    return (
      <div>
        <script></script>
      </div>
    );
  }
}

export default React.memo(Recognition);

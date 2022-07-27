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
        this.setState({
          start_time: new Date().getTime(),
        });
        sound_detect_check = true;
      }
      this.setState({
        transcript: Array.from(event.results)
          .map((res) => res[0].transcript)
          .join(""),
      });
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

export default React.memo(Recognition);

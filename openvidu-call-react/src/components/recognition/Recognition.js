import React, { PureComponent } from "react";
let sound_detect_check = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "ko-KR";

class Recognition extends PureComponent {
  state = {
    transcript: "",
    start_time: "",
  };

  componentDidMount() {
    recognition.start();

    // 음성인식 시작 로그 찍어야함
    recognition.onstart = () => {
      console.log("onstart 함수 ! ");
      sound_detect_check = false;
    };

    // 음성 인식 서비스의 견결이 끊겼을 때 실행된다.
    recognition.onend = () => {
      console.log(" end 함수 !!", recognition);
      if (this.state.transcript !== "") {
        const sttData = {
          text: this.state.transcript,
          startTime: this.state.start_time,
        };
        // 막둥이 로직추가
        this.props.parentFunction(sttData);
      }
      // this.transcriptResult();
      this.setState({ transcript: "" });
      recognition.start();
    };

    recognition.onresult = (event) => {
      console.log("result 함수 ");
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

  // transcriptResult = () => {
  //   //  음성 인식 서비스가 결과를 반환할 때 발생합니다.
  //   // 음성감지 된경우 시작시간을 등록한다
  //   recognition.onresult = (event) => {
  //     console.log("result 함수 ");
  //     if (sound_detect_check !== true) {
  //       this.setState({
  //         start_time: new Date().getTime(),
  //       });
  //       sound_detect_check = true;
  //     }
  //     this.setState({
  //       transcript: Array.from(event.results)
  //         .map((res) => res[0].transcript)
  //         .join(""),
  //     });
  //   };
  // };

  render() {
    console.log("음성 인식 컴포넌트 !");
    return (
      <div>
        <script></script>
      </div>
    );
  }
}

export default React.memo(Recognition);

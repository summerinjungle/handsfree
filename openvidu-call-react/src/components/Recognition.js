import React, { useEffect, useState, Component } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

class Recognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcript: "",
    };
  }

  componentDidMount() {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    // recognition.interimResults = true;
    recognition.start();
    console.log("start .....");

    recognition.onend = () => {
      console.log("onend ... ");
      recognition.start();
    };

    recognition.onstart = () => {
      this.props.parentFunction(this.state.transcript);
      console.log("onstart ...");
    };

    recognition.onresult = (event) => {
      let texts = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      console.log("sdassadadsadsadsadas", texts);
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

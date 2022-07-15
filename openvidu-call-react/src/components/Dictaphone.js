import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = ({ parentFunction, rootFunction }) => {
  SpeechRecognition.startListening({
    continuous: true,
    // interimResults: true,
    language: "ko-KR",
  });

  const childFunction = (transcript) => {
    console.log("dictaphone ! child function", transcript);
    parentFunction(transcript);
  };

  const toRootFunction = (data) => rootFunction(data);

  const commands = [
    {
      command: [
        "음소거",
        "음소거 해제",
        "마이크 켜",
        "마이크 꺼",
        "카메라 켜",
        "카메라 꺼",
        "화면 켜",
        "화면 꺼",
        "채팅 켜",
        "채팅 꺼",
        "채팅 창 켜",
        "채팅 창 꺼",
        "채팅창 켜",
        "채팅창 꺼",
      ],
      callback: (command) => {
        toRootFunction(command);
        resetTranscript();
      },
    },
  ];

  const { transcript, resetTranscript, finalTranscript } = useSpeechRecognition(
    { commands }
  );

  if (finalTranscript != "") {
    if (
      commands[0].command.filter((obj) => finalTranscript === obj).length == 0
    ) {
      childFunction(finalTranscript);
      console.log(`finalTranscript =  ${finalTranscript}`);
      resetTranscript();
    }
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    alert("음성 인식을 지원하지 않는 브라우저입니다. Chrome을 이용해주세요.");
  }

  return <div></div>;
};
export default Dictaphone;

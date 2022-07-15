import React, { useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Stt = () => {
  useEffect(() => {
    const makeNewRecogntion = () => {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
    };
  }, []);

  return <div></div>;
};

export default Stt;

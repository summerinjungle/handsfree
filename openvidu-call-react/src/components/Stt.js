import React, { useEffect, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Stt = ({ parentFunction }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    console.log("stt useEffct");
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.start();
    console.log("start .....");

    recognition.onend = () => {
      console.log("onend ... ");
      recognition.start();
    };

    recognition.onstart = () => {
      console.log("onstart ...");
      parentFunction(data);
    };

    recognition.onresult = (event) => {
      let texts = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      console.log("sdassadadsadsadsadas", texts);
      setData(texts);
    };
  }, []);

  return <div></div>;
};

export default Stt;

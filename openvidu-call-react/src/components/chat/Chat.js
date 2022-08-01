
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import "./ChatHandsFree.css";
import Star from "@material-ui/icons/Star";
import yellow from "@material-ui/core/colors/yellow";
import isWriting from "../../assets/images/isWriting.png";
import isNotWriting from "../../assets/images/isNotWriting.png";
import Balloons from "../../assets/images/Balloons.png";
import Record from "./Record";
import { getUserNameInCookie } from "../../main/cookie";

const Chat = function(localUser, rootFunction, terminate) {
  const socketRef = useRef();
  // socketRef.current = io.connect("http://localhost:5000");
  socketRef.current = io.connect("https://bongbong.me/");
  const reduxCheck = useSelector((state) => { return state; });
  const myId = getUserNameInCookie();
  const scrollRef = React.useRef();
  const [isRecog, setIsRecog] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const sessionId = "meeting" + reduxCheck.user.sessionId;
  
  // let [enterCode, setEnterCode] = useState("");
  // const enterMeeting = () => {
  //   const date = new Date();
  //   setMessage(
  //     {
  //       userId: reduxCheck.user.userName,
  //       text: enterCode,
  //       start: date.getTime(),
  //       time: new Date().getHours() + ":" + new Date().getMinutes(),
  //       star: false
  //     }
  //   )
  // };
  // const discon = () => {
  //   socketRef.current.emit("forceDisconnect", sessionId, reduxCheck.user.isPublisher);
  // }
  
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messageList]);


  useEffect(() => {
    console.log("enterRoom")
    socketRef.current.emit("enterRoom", sessionId, reduxCheck.user.isPublisher);

    socketRef.current.on("welcome", (bool) =>{
      console.log("welcome");
      setIsRecog(bool);
    });

    socketRef.current.on("serverToClient", (msg, bool) =>{
      console.log("serverToClient");
      console.log(msg.text);
      console.log(bool)
      setIsRecog(bool);

      // 기록중지, 기록시작 아닌경우
      if (!msg.text.includes("@")) {
        if (msg.star) {
          const length = messageList.length;
          setMessageList(messageList => [...messageList.slice(0, length - 1), msg])
        } else {
          setMessageList(messageList => [...messageList, msg])
        }
      }
    });

    return () => {
      console.log("forceDisconnect")
      socketRef.current.emit("forceDisconnect", sessionId, reduxCheck.user.isPublisher);
      socketRef.current.disconnect();
    }
  }, [])

  const parentFunction = (data) => {
    // console.log("parentFx",data.text)
    setMessage(
      {
        userId: reduxCheck.user.userName,
        text: data.text,
        start: data.time,
        time: data.now,
        star: false
      }
    )
  };

  useEffect(() => {
    if (message !== ""){
      socketRef.current.emit("newMessage", message, sessionId);
    } 
  },[message])

  return (
    <div className='status-container'>
      {/* <button className='attend-meeting-btn' onClick={discon}>
        연결끊기
      </button> */}
       <div className='recording'>
          <div className='writingStatus'>
            <div
            className={`mackdoong-txt ${isRecog ? "colorYellow" : "colorRed"
              }`}
            >
            </div>
            <img className='balloon' src={Balloons} />
            <div className='mackdoong-logo'>
              <img
                alt='막둥이'
                src={isRecog ? isWriting : isNotWriting}
                height={isRecog ? "90" : "80"}
                width={isRecog ? "120" : "115"}
              />
            </div>
            <div className='mackdoong-txt2'>막둥이는</div>
            {
              isRecog ? (
                <div className='mackdoong-txt-rec' style={{ marginBottom: 4 }}>
                  기록중
                </div>
                ):(
                <div className='mackdoong-txt-noRec' style={{ marginBottom: 4 }}>
                  기록쉼
                </div>
                )
            }
          </div>
        </div>
      <div id='chatContainer'>
        <div id='chatComponent'>
          <div className='wrap' ref={scrollRef}>
            {
             messageList.map((data, index) => (
              <div
                key={index}
                id='remoteUsers'
                className={
                  "message" +
                  (data.userId !== myId
                    // localUser.getConnectionId()
                    // "민성"
                    ? " left"
                    : " right")
                }
                >
                <div className='msg-detail'>
                  <div className='msg-info'>
                    <p>
                      <b>{data.userId} </b>
                      {data.time}
                    </p>
                  </div>
                  <div
                    className={`
                    ${data.userId !== myId
                        // localUser.getConnectionId()
                        // "민성"
                        ? " f-left"
                        : " f-right"
                      } ${data.star? "msg-content-star" : "msg-content"}
                    `}
                  >
                    <p className='text'>
                      {data.star? (
                        <Star
                          className='starInChat'
                          style={{ color: yellow[800] }}
                        />
                      ) : null}
                      {data.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <Record parentFunction={parentFunction} /> */}
      </div>
      {/* <div>
        <input className='attend-meeting-input-area'
          placeholder='참여코드 입력'
          onChange={(event) => setEnterCode(event.target.value)}
        ></input>
        <button className='attend-meeting-btn' onClick={enterMeeting}>
          →
        </button>
      </div> */}
    </div>
  );
}

export default Chat;
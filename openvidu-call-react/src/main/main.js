import React, { useState, useMemo } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  changeSession,
  changeDuringTime,
  changeIsPublisher,
  changeEnterTime,
  changeUserName,
} from "../store.js";
import GoogleLoginButton from "./GoogleLoginButton";
import { getTokenInCookie } from "./cookie";
import axios from "axios";
import { getUserNameInCookie } from "./cookie";
import { useSelector } from "react-redux";
import { removeTokenInCookie } from "./cookie";

const Main = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();

  let reduxCheck = useSelector((state) => {
    return state;
  });
  const date = new Date();

  useMemo(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    }
  }, [cookie]);

  async function createMeeting() {
    await axios
      .post("/api/rooms/")
      .then(function (response) {
        console.log(response.data);
        // sessionId값, 방장권한, 진행시간 0, 입장시간
        const time = date.getTime();
        dispatch(changeSession(response.data.roomId));
        dispatch(changeIsPublisher(true));
        dispatch(changeDuringTime(0));
        dispatch(changeEnterTime(time));
        dispatch(changeUserName(getUserNameInCookie()));

        const obj = {
          isPublisher: true,
          sessionId: response.data.roomId,
          duringTime: 0,
          enterTime: time,
        };
        localStorage.setItem("redux", JSON.stringify(obj));
        console.log("저장됨", obj);

        navigate("/meeting/" + response.data.roomId);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function enterMeeting() {
    await axios
      .post("/api/rooms/" + String(enterCode) + "/join")
      .then(function (response) {
        console.log(response.data);
        // 입장가능한 방일때
        if (response.data.isValidRoom) {
          const time = date.getTime();
          let duringTime =
            response.data.enteredAt - Number(response.data.createdAt);

          dispatch(changeSession(enterCode));
          dispatch(changeIsPublisher(false));
          dispatch(changeDuringTime(duringTime));
          dispatch(changeUserName(getUserNameInCookie()));
          dispatch(changeEnterTime(time));

          const obj = {
            isPublisher: false,
            sessionId: enterCode,
            duringTime: duringTime,
            enterTime: time,
          };
          localStorage.setItem("redux", JSON.stringify(obj));
          console.log("저장됨", obj);

          navigate("/meeting/" + enterCode);
        } else {
          alert("입장코드를 다시 입력해주세요");
        }
      })
      .catch(function (err) {
        console.log("실패함", err);
      });
  }

  return (
    <div className='main-bg'>
      <img className='main-logo' src={mainLogo} />
      {isLogin ? (
        <div>
          <p>
            {/* <button className='myButton'
              onClick={() => {
                createMeeting();
              }} >회의 만들기</button> */}
            <button
              className='myButton'
              onClick={() => {
                navigator.mediaDevices
                  .getUserMedia({
                    audio: true,
                    video: { width: 640, height: 360 },
                  })
                  .then((stream) => {
                    createMeeting();
                  })
                  .catch(() => {
                    alert(
                      "미디어접근이 거절되었습니다. 설정에서 승인후 입장가능 합니다."
                    );
                  });
              }}
            >
              회의 만들기
            </button>
          </p>
          <p>
            <input
              placeholder='참여코드를 입력하세요.'
              onChange={(event) => setEnterCode(event.target.value)}
            ></input>
            {/* <button className='myButton2'
              onClick={() => {
                enterCode === ""
                  ? alert("올바른 참여코드를 입력하세요")
                  : enterMeeting();
              }}> 회의 참여하기</button> */}
            <button
              className='myButton2'
              onClick={() => {
                enterCode === ""
                  ? alert("올바른 참여코드를 입력하세요")
                  : navigator.mediaDevices
                      .getUserMedia({
                        audio: true,
                        video: { width: 320, height: 180 },
                      })
                      .then((stream) => {
                        enterMeeting();
                      })
                      .catch(() => {
                        alert(
                          "미디어접근이 거절되었습니다. 설정에서 승인후 입장가능 합니다."
                        );
                      });
              }}
            >
              {" "}
              회의 참여하기
            </button>
          </p>
          <p>
            <button onClick={() => console.log(reduxCheck)}>리덕스 보기</button>
          </p>
          <p>
            <button onClick={() => console.log(getUserNameInCookie())}>
              이름 보기
            </button>
          </p>
          <p>
            <button onClick={() => navigate("/meeting")}>그냥 입장하기</button>
          </p>
          <p>
            <button
              onClick={() => {
                removeTokenInCookie();
                window.location.reload();
              }}
            >
              로그아웃
            </button>
          </p>
        </div>
      ) : (
        <div className='LogInBtnStyle'>
          <GoogleLoginButton />
        </div>
      )}
    </div>
  );
};

export default Main;

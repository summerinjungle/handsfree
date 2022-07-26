import React, { useState, useMemo } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSession, changeIsPublisher, changeUserName } from "../store.js";
import GoogleLoginButton from "./GoogleLoginButton";
import { getTokenInCookie } from "./cookie";
import axios from "axios";
import { useSelector } from "react-redux";
import { removeTokenInCookie } from "./cookie";

const Main = ({ username }) => {
  console.log("main js ");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();

  let reduxCheck = useSelector((state) => {
    return state;
  });
  useMemo(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    }
  }, [cookie]);

  const createMeeting = async () => {
    await axios
      .post("/api/rooms/")
      .then(function (response) {
        console.log(response.data);
        // sessionId값, 방장권한, 진행시간 0, 입장시간
        dispatch(changeSession(response.data.roomId));
        dispatch(changeIsPublisher(true));
        dispatch(changeUserName(username));
        const obj = {
          isPublisher: true,
          sessionId: response.data.roomId,
        };
        localStorage.setItem("redux", JSON.stringify(obj));
        console.log("저장됨", obj);

        navigate("/meeting/" + response.data.roomId);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const enterMeeting = async () => {
    if (enterCode.length === 0) {
      alert("입장 코드를 입력하세요");
      return;
    }
    await axios
      .post("/api/rooms/" + String(enterCode) + "/join")
      .then(function (response) {
        console.log("회의실 입장 버튼 =", response.data);
        // 입장가능한 방일때
        if (response.data.isValidRoom) {
          if (response.data.isEnd) {
            alert("종료된 회의입니다.");
            return;
          }

          dispatch(changeSession(enterCode));
          dispatch(changeIsPublisher(false));
          dispatch(changeUserName(username));
          const obj = {
            isPublisher: false,
            sessionId: enterCode,
          };
          localStorage.setItem("redux", JSON.stringify(obj));
          console.log("저장됨", obj);
          // navigator.mediaDevices
          //   .getUserMedia({
          //     audio: true,
          //     video: { width: 640, height: 360 },
          //   })
          //   .then((stream) => {
          //     enterMeeting();
          //   })
          //   .catch(() => {
          //     alert(
          //       "미디어 접근이 거절되었습니다. 회의중 비디오가 안나올 수 있습니다."
          //     );
          //   });
          navigate("/meeting/" + enterCode);
        } else {
          alert("입장 코드를 다시 입력해주세요");
        }
      })
      .catch(function (err) {
        console.log("실패함", err);
      });
  };

  return (
    <div className='main-bg'>
      <img className='main-logo' src={mainLogo} />
      {isLogin ? (
        <div>
          <p>
            <button
              className='myButton'
              onClick={() => {
                navigator.mediaDevices
                  .getUserMedia({
                    audio: true,
                    video: { width: 640, height: 360 },
                  })
                  .then((stream) => {
                    // console.log("입장 버튼 = >", stream);
                    createMeeting();
                  })
                  .catch(() => {
                    alert(
                      "미디어 접근이 거절되었습니다. 회의중 비디오가 안나올 수 있습니다."
                    );
                    createMeeting();
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
            <button className='myButton2' onClick={enterMeeting}>
              회의 참여하기
            </button>
          </p>
          {/* <p><button onClick={() => console.log(reduxCheck)}>리덕스 보기</button></p> */}
          {/* <p><button onClick={() => console.log(getUserNameInCookie())}>이름 보기</button></p> */}
          <p>
            <button className='logOut'
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
        <button className='asdf' onClick={() => navigate("/meeting")}>그냥 입장하기</button>
    </div>
  );
};

export default Main;

import React, { useState, useMemo } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSession, changeIsPublisher, changeUserName } from "../store.js";
import GoogleLoginButton from "./GoogleLoginButton";
import { getTokenInCookie } from "./cookie";
import axios from "axios";
import { removeTokenInCookie } from "./cookie";
import swal from "sweetalert"

const Main = ({ username }) => {
  console.log("main js ");
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();

  useMemo(() => {
    if (cookie) {
      setIsLogin(true);
    }
  }, [cookie]);

  const createMeeting = async () => {
    await axios
      .post("/api/rooms/")
      .then(function (response) {
        // sessionId값, 방장권한, 진행시간 0, 입장시간
        dispatch(changeSession(response.data.roomId));
        dispatch(changeIsPublisher(true));
        dispatch(changeUserName(username));
        const obj = {
          isPublisher: true,
          sessionId: response.data.roomId,
        };
        localStorage.setItem("redux", JSON.stringify(obj));

        navigate("/meeting/" + response.data.roomId);
      })
      .catch(function (error) {
      });
  };

  const enterMeeting = async () => {
    if (enterCode.length === 0) {
      swal("실패", "초대 코드를 입력하세요", "warning");
      return;
    }
    await axios
      .post("/api/rooms/" + String(enterCode) + "/join")
      .then(function (response) {
        // 입장가능한 방일때
        if (response.data.isValidRoom) {
          if (response.data.isEnd) {
            swal("실패", "종료된 회의 입니다.", "warning");
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
          swal("실패", "초대 코드를 다시 입력해주세요", "warning");
        }
      })
      .catch(function (err) {
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
                    createMeeting();
                  })
                  .catch(() => {
                    swal("실패", "미디어 접근이 거절되었습니다. 회의중 비디오가 안나올 수 있습니다.", "warning");
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
        {/* <button className='asdf' onClick={() => navigate("/meeting")}>그냥 입장하기</button> */}
    </div>
  );
};

export default Main;
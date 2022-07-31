import React, { useState, useMemo } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import mainCharacter from "../assets/images/mainCharacter.png";
import mainCharacterBorder from "../assets/images/mainCharacterBorder.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSession, changeIsPublisher, changeUserName } from "../store.js";
import GoogleLoginButton from "./GoogleLoginButton";
import { getTokenInCookie } from "./cookie";
import axios from "axios";
import { useSelector } from "react-redux";
import { removeTokenInCookie } from "./cookie";
import swal from "sweetalert";
import Loading from "./Loading";

const Main = ({ username }) => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        console.log("방만들기 오류", error);
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
          navigate("/meeting/" + enterCode);
        } else {
          swal("실패", "초대 코드를 다시 입력해주세요", "warning");
        }
      })
      .catch(function (err) {});
  };

  const createDebounceRoom = debouce(() => {
    createMeeting();
  });

  const enterDebounceRoom = debouce(() => {
    enterMeeting();
  });

  function debouce(cb, delay = 1000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }
  return (
 
      <>
      <div className='main-bg'>
      <div className='header-left'/>
      <img className='header-left-logo' src={mainLogo} />
      {isLogin ? (
        <>
          
          <div className='header-right-btn'>
          </div>
          <div className='logout-btn-area'>
              <button className='logout-btn'
              onClick={() => {
                removeTokenInCookie();
                window.location.reload();
              }}
            >
              로그아웃
            </button>
          </div>


           {/* <button 
              onClick={() => {
                removeTokenInCookie();
                window.location.reload();
              }}
            >
              로그아웃
            </button> */}
       
          
          {/* <div className="header">
            <button className='logout'
              onClick={() => {
                removeTokenInCookie();
                window.location.reload();
              }}
            >
              로그아웃
            </button>
          </div> */}
          <div className='main-logo-area'>
            <img className='main-logo' src={mainLogo} />
          </div>
          <div className='make-conference-btn-area'>
          <button
              className='make-conference-btn'
              onClick={() => {
                navigator.mediaDevices
                  .getUserMedia({
                    audio: true,
                    video: { width: 640, height: 360 },
                  })
                  .then((stream) => {
                    setIsLoading(true);
                    createDebounceRoom();
                  })
                  .catch(() => {
                    swal(
                      "실패",
                      "미디어 접근이 거절되었습니다. 회의중 비디오가 안나올 수 있습니다.",
                      "warning"
                    );
                    setIsLoading(true);
                    createDebounceRoom();
                  });
              }}
            >
              새 회의
          </button>
          </div>
          <div className='attend-meeting-btn-area'>
            <input className='attend-meeting-input-area'
              placeholder='참여코드 입력'
              onChange={(event) => setEnterCode(event.target.value)}
            ></input>
            <button className='attend-meeting-btn' onClick={enterMeeting}>
              →
            </button>
          </div>
          <>
           
          </>
         
        </>
      ) : (
        <>
          <div className='main-character-area '>
            <img className='main-character' src={mainCharacterBorder} />
          </div>
          <div className='main-label'> 
            <p className='main-label-txt1'>
              화상회의록 자동작성 웹서비스
            </p>
            <p className='main-label-txt2'>
              "회의록 작성은 막둥이에게 맡겨주세요"
            </p>
          </div>
          <div className='main-labe2'> 
          </div>
          <div className='login-btn-shadow'></div>
            <div className='login-btn'>
              <GoogleLoginButton className='login-btn'/>
            </div>
        </>
      )}
        {/* <button className='asdf' onClick={() => navigate("/meeting")}>그냥 입장하기</button> */} 
    </div>
    </>
  );
};

export default Main;

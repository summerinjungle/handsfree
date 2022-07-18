import React, { useState, useEffect } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSession } from "../store.js";
import GoogleLoginButton from "./GoogleLoginButton";
import { getTokenInCookie } from "./cookie";
import { axios } from "axios";
import { useSelector } from "react-redux";
import { getUserNameInCookie } from "./cookie";

function Main() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const cookie = getTokenInCookie();
  let a = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    }
  }, [cookie]);

  return (
    <div className='main-bg'>
      <img className='main-logo' src={mainLogo} />
      {isLogin ? (
        <p>
          <div>
            <p>
              <button
                onClick={() => {
                  // 새 회의 만들기
                  axios
                    .post("http://localhost:5000/api/rooms/")
                    .then((result) => {
                      console.log(result.data);
                      // sessionId값 수정 => createdAt:  “00:00:00” / isRecording : true
                      dispatch(changeSession(result.data.roomId));
                      navigate("/meeting");
                    })
                    .catch(() => {
                      console.log("실패함");
                    });
                }}
              >
                회의 만들기
              </button>
            </p>

            <p>
              <input
                placeholder='참여코드를 입력하세요'
                onChange={(event) => setEnterCode(event.target.value)}
              ></input>
              <button
                onClick={() => {
                  enterCode === ""
                    ? alert("참여코드를 입력하세요")
                    : // 기존회의 참여하기(없는 방 입장 로직X)
                      axios
                        .post(
                          "http://localhost:5000/api/rooms/" +
                            enterCode +
                            "/join"
                        )
                        .then((result) => {
                          // 입장가능
                          console.log(result.data);
                          // 입장가능한 방일때
                          if (result.data.isValidRoom) {
                            dispatch(changeSession(enterCode));
                            //
                            navigate("/meeting");
                            // 입장하기(시간받기) => 리덕스에 넣어줌
                            // 라우터 바꾸고 불러야하나?
                          } else {
                            // 입장불가능할때
                            alert("참여코드를 다시 확인해주세요");
                          }
                        })
                        .catch(() => {
                          console.log("실패함");
                        });
                }}
              >
                회의 참여하기
              </button>
            </p>

            <p>
              <button onClick={() => console.log(a)}>리덕스 보기</button>
            </p>
            <p>
              <button onClick={() => console.log(getUserNameInCookie())}>
                이름 보기
              </button>
            </p>
            <p>
              <button onClick={() => navigate("/meeting")}>
                그냥 입장하기
              </button>
            </p>
          </div>
        </p>
      ) : (
        <p className='LogInBtnStyle'>
          <GoogleLoginButton />
        </p>
      )}
    </div>
  );
}

export default Main;

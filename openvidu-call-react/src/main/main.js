import React, { useState, useEffect } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { changeSession, changeDuringTime, changeIsPublisher, changeEnterTime, changeUserName } from "../store.js"
import GoogleLoginButton from './GoogleLoginButton';
import { getTokenInCookie } from './cookie';
import axios from 'axios';
import { getUserNameInCookie } from './cookie';
import { useSelector } from "react-redux";
import { removeTokenInCookie } from './cookie';


function Main() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();
  let reduxCheck = useSelector((state) => { return state } )
  const date = new Date();

  useEffect(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    }
  }, [cookie]);


  async function createMeeting() {
    await axios.post('/api/rooms/')
    .then(function (response) {
      console.log(response.data);
      // sessionId값, 방장권한, 진행시간 0, 입장시간
      dispatch(changeSession(response.data.roomId));
      dispatch(changeIsPublisher(true));
      dispatch(changeDuringTime(0))
      dispatch(changeEnterTime(date.getTime()))
      dispatch(changeUserName(getUserNameInCookie()))
      navigate("/meeting");
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  async function enterMeeting() {
    await axios.post('/api/rooms/' + String(enterCode) + '/join')
    .then(function (response) {
      console.log(response.data);
      // 입장가능한 방일때
      if (response.data.isValidRoom) {
        dispatch(changeSession(enterCode))
        dispatch(changeIsPublisher(false));
        let duringTime = response.data.enteredAt - Number(response.data.createdAt)
        console.log(response.data.enteredAt)
        console.log(duringTime)
        console.log(Number(response.data.createdAt))
        dispatch(changeDuringTime(duringTime))
        dispatch(changeUserName(getUserNameInCookie()))
        dispatch(changeEnterTime(date.getTime()))
        navigate('/meeting');
      } 
      else {
        alert("입장코드를 다시 입력해주세요")
      }
    })
    .catch(function(err) {
      console.log("실패함", err)
    })
  }

  return (
    <div className='main-bg'>
      <img className='main-logo' src={mainLogo} />
      {isLogin ? (
        <div>
          <p>
            <button onClick={() => { createMeeting() }}>회의 만들기</button>
          </p>
          <p>
            <input placeholder='참여코드를 입력하세요' onChange={(event) => setEnterCode(event.target.value)}></input>
            <button onClick={() => { enterCode === ''? alert("참여코드를 입력하세요") : enterMeeting() }}>회의 참여하기</button> 
          </p>
          <p>
            <button onClick={() => console.log(reduxCheck) }>
              리덕스 보기
            </button>
          </p>
          <p>
            <button onClick={() => console.log(getUserNameInCookie())}>
              이름 보기
            </button>
          </p>
          <p>
            <button onClick={() => navigate('/meeting') }>
              그냥 입장하기
            </button>
          </p>
          <p>
          <button onClick={() => {removeTokenInCookie(); window.location.reload()}}>
              로그아웃
            </button>
          </p>
        </div>
      ) : (
        <p className='LogInBtnStyle'>
          <GoogleLoginButton />
        </p>
      )}
    </div>
  );
}

export default Main;

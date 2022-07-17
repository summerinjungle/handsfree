import React, { useState, useEffect } from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { changeName } from "../store.js"
import GoogleLoginButton from './GoogleLoginButton';
import OnlyLoggedInUserBtn from './OnlyLoggedInUserBtn';
import { getTokenInCookie } from './cookie';



function Main() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [enterCode, setEnterCode] = useState(""); 
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();
  useEffect(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    } 
  }, [cookie]);
  return (
    <div className='main-bg'>
      <img className='main-logo' src={ mainLogo }/>
  
      {/* 로그인화면 */}
      
        <GoogleLoginButton/>
    
      {/* 로그인 하면 보이는 것들 */}
      <div>
        <p>
          <button onClick={() => { 
              // axios.post('http://localhost:5000/api/rooms/')
              // .then((result)=>{
              //   console.log(result.data);
              //   // 리덕스 값 수정하고 실행
              //   navigate('/meeting');
              // })
              // .catch(()=>{
              //   console.log("실패함");
              //   navigate('/meeting');
              // })
              navigate('/meeting');
            }}>회의 만들기</button>
        </p>
        <p>
          <input placeholder='참여코드를 입력하세요' onChange={(event) => setEnterCode(event.target.value)}></input>
          <button onClick={() => {enterCode === ''? alert("참여코드를 입력하세요"):
            // 기존회의 참여하기(result값의 참거짓을 확인한다.)
            // axios.get('http://localhost:5000/api/rooms/' + enterCode)
            // .then((result)=>{
              // 입장가능
              // console.log(result.data);
              // if (result.data) {
                // 서버에 입장요청
                // 입장하기(시간받기) => 리덕스에 넣어줌
                // createSession(sessionId); // make랑 같은 함수 일지도?
                // VideoRoomComponent.createSession(result.data);
                // 라우터 바꾸고 불러야하나?
              // } else {
                // 입장불가
                // alert("참여코드를 다시 입력해주세요");
              // }
            // })
            // .catch(()=>{
              // console.log("실패함")
            // })
            // alert("asd");

            dispatch(changeName(enterCode))
            navigate('/meeting');
          }}>회의 참여하기</button>
        </p>
      </div>
    </div>
  );
}


export default Main;
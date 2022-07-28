import React from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";

const Anon = () => {
  return (
    <>
      <div className='main-bg'>
        <div className='anon-logo'>
          <img className='main-logo' src={mainLogo} />
          <h1>죄송합니다. 이 페이지를 사용할 수 없습니다.</h1>
        </div>
      </div>
    </>
  );
}

export default Anon;
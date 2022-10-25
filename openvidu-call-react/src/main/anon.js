import React from "react";
import "./main.css";
import mainLogo from "../assets/images/mainLogo.png";
// import Spinner from "../components/edit/Spinner";

const Anon = () => {
  return (
    <>
      <div className='main-bg'>
        <div className='anon-logo'>
          <img className='main-logo' src={mainLogo} />
          {/* <Spinner /> */}
          <h1>죄송합니다. 이 페이지를 사용할 수 없습니다.</h1>
        </div>
      </div>
    </>
  );
};

export default Anon;

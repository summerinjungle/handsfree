import React from "react";
import "./spinner.css";

const Spinner = () => {
  return (
    <>
      <div className='spinner-container' style={{ opacity: 1 }}>
        <h1>녹음 파일을 불러 오는 중 입니다....</h1>
        <div className='spinner'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      </div>
    </>
  );
};

export default Spinner;

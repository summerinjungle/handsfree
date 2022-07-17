import React from "react";
import "./leftside.css";
// import mainLogo from "../assets/images/mainLogo.png";


function LeftSide() {
  const sty = {
		textAlign: "center"
	}

  return (
    <div className='left-side-bg' style={sty}>
      <h2>
        음성기록
      </h2>
    </div>
  );
}


export default LeftSide;
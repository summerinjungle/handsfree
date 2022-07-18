import React from "react";
import "./leftside.css";
// import mainLogo from "../assets/images/mainLogo.png";

function LeftSide({ hightlight }) {
  const sty = {
    textAlign: "center",
  };
  console.log("ghhhh", hightlight);
  return (
    <div className='left-side-bg' style={sty}>
      
      <h2>음성기록</h2>

      <div>
        {/* {{ hightlight }} */}
        {hightlight &&
          hightlight.map((data, i) => (
            <div>
              <p>{data.message}</p>
              <p>{data.startTime}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default LeftSide;

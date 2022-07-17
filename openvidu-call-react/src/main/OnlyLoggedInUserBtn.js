import { getTokenInCookie } from './cookie';
import { React } from "react";


const OnlyLoggedInUserBtn = () => {
  var ret = "";
  fetch("/api/rooms", {
    method: "POST",
  }).then(response => response.json())
  .then((res) => {
    console.log(res);
    ret = getTokenInCookie();
    console.log(getTokenInCookie());
  });

  return (
    <>
      <></>
    </>
  )
};

export default OnlyLoggedInUserBtn;

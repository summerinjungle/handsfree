import { getTokenInCookie } from '../utils/cookie';
import React, {Component} from 'react';

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
    <p>
     반갑습니다!
    </p>
  );
};

export default OnlyLoggedInUserBtn;


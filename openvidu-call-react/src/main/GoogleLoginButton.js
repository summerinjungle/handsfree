import React  from "react";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"


require("dotenv").config();

const GoogleLoginButton = () => {

  const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;
  let navigate = useNavigate();
  async function onSuccess(res) {
    const code = await fetch("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        credential : res.credential
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
    .then(({success}) => {
      // console.log("success", success);
    });
    swal("성공", "로그인에 성공하였습니다.", "success");
    navigate("/")
  }

  const onError = (res) => {
    alert("로그인에 실패하였습니다");
    // console.log("err", res);
  };

  return (
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}/>
      </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
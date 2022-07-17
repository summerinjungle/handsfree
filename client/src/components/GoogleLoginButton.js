import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, {Component} from 'react';
const GoogleLoginButton = () => {
  const clientId = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID;
  
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
    // .then(({token}) => {
    //   console.log("token : ", token);
    //   localStorage.setItem('token', token);
    // })
    alert("구글 로그인에 성공하였습니다");
  }

  const onError = (res) => {
    alert("구글 로그인에 실패하였습니다");
    console.log("err", res);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;


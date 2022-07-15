import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const clientId = '66570255272-3bdt65gedmn1fia6qi9getkts2fdf6oh.apps.googleusercontent.com'
  
  async function onSuccess(res) {
    // const profile = res.getBasicProfile();
    // const userdata = {
    //   email: profile.getEmail(),
    //   image: profile.getImageUrl(),
    //   name: profile.getName(),
    // }; 
    // 로그인 성공 후 실행하기 원하는 코드 작성.
    alert("구글 로그인에 성공하였습니다");

    axios({
      method: "POST",
      url: "http://localhost:5000/api/googlelogin",
      data: {tokendId : res.credential}
    }).then(response => {
      console.log(response);
    })
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

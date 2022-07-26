import React, { useEffect, useState } from 'react';
import { getTokenInCookie, removeTokenInCookie} from './utils/cookie';
import GoogleLoginButton from './components/GoogleLoginButton';
import OnlyLoggedInUserBtn from './components/OnlyLoggedInUserBtn';
import Voicechat  from './components/chat/Voicechat';

function App() {
  //  currentUser 라는 변수를 useState 로 관리한다는 뜻이고 useState가 제공하는 핵심 기능은 추적의 기능을 사용할 수 있어 currentUser라는 변수의 내용이 변하면 자동으로 jsx가 재 렌더링 되어 변화된 변수가 화면에 반영된다. 
  //   const [currentUser, setCurrentUser] = useState({초기에 currentUser에 지정할 내용});
  const [isLogin, setIsLogin] = useState(false);
  const cookie = getTokenInCookie();
  useEffect(() => {
    if (cookie) {
      setIsLogin(true);
      // removeTokenInCookie(); //테스트를 위한 코드//
    } 
  }, [cookie]);

  return (
    <div className='App'>
      {/* {isLogin ? (
        <p>You are logged in! <OnlyLoggedInUserBtn /> </p>
      ) : (
        <p> You are not logged in!  <GoogleLoginButton /> </p>
      )}  */}
      <Voicechat />
    </div>
  )
}

export default App;

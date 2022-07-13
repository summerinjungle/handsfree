import React, { useEffect, useState} from 'react'
import GoogleLoginButton from './components/GoogleLoginButton';

function App() {

  // const [backendData, setBackendData] = useState([{}])

  // useEffect(() => {
  //   fetch("/api").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])

  // return (
  //   <div>
  //     {(typeof backendData.users == 'undefined') ? (
  //       <p>Loading...</p>
  //     ): (
  //       backendData.users.map((user, i) => (
  //         <p key={i}>{user}</p>
  //       ))
  //     )}
  //   </div>
  // )
  return (
    <div className='App'>
      <GoogleLoginButton />
    </div>
  )
}

export default App;

// 
// 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

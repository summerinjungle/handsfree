import React from "react";
import { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
const { io } = require("socket.io-client");

export default function Voicechat({userName, roomId}) {
    const [myId, setMyId] = useState('');
    const [usersPeerId, setUsersPeerId] = useState([]);
    const remoteVoiceRefs = useRef([]);
    const userAudioRef = useRef(null);
    const peerInstane = useRef(null);
    const socketRef = useRef();
    const [startChat, setStartChat] = useState(false);
    const [disable, setDisable] = React.useState(false);
    let peer = null;
  
    useEffect(()=> {
        socketRef.current = io.connect("http://43.200.3.223:5000/");
        peer = new Peer();
        peer.on('open', (myId) => {
            console.log("My Peer ID", myId)
            setMyId(myId);
        });
        
        socketRef.current.on("userJoined",  (newUser, usersPeerId) => {
            console.log("hello", newUser);
            setUsersPeerId(usersPeerId);
            console.log("user joined!!", usersPeerId);            
        })


        peer.on('call', (call) => { //전화 받을 때 
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({video: false, audio: true}, (mediaStream) => {
                // userAudioRef.current.srcObject = mediaStream;
                call.answer(mediaStream); //give your mediastream
                call.on('stream', (remoteStream) => {
                    remoteVoiceRefs.current.forEach(remoteVoiceRef=> {
                        remoteVoiceRef.srcObject = remoteStream;
                        remoteVoiceRef.play();
                    })
                });
            });
        })

        peerInstane.current = peer;
        // return () => {
        //     socketRef.current.off('all users');
        // }
    }, [])

    // console.log("myId : ", myId);


    const startVoiceChat = () => {
        console.log("hi!!!! i'm : ", myId);
        socketRef.current.emit('joinRoom', userName, myId, roomId);
        setStartChat(true);
    }

    const call = (memberRef, remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: false, audio: true}, (mediaStream) => {

            // userAudioRef.current.srcObject = mediaStream;
            // userAudioRef.current.play();

            const call = peerInstane.current.call(remotePeerId, mediaStream);
            call.on('stream', (remoteStream) => { //when other user accepts your call

                memberRef.srcObject = remoteStream;
                memberRef.play();
               
            });
          }, function(err) {
            console.log('Failed to get local stream' ,err);
          });
    }

    useEffect(() => {
        if(startChat) {
            for (let i = 0; i< usersPeerId.length; i++) {
                if(usersPeerId[i] !== myId) {
                    call(remoteVoiceRefs.current[i], usersPeerId[i]);
                }
                    
            }
        }
    }, [usersPeerId, startChat]);

    return (
        <div>
            <div>
                {startChat ? 
                <button disabled={true}>참여완료!</button>
                : 
                <button disabled={disable} onClick={() => {
                    setDisable(true);
                    startVoiceChat();
                }}>
                참여해보자!
                </button>
                }
            </div>
            <div>
            <p>hi</p>
            {usersPeerId.length ? 
                usersPeerId.map((userPeerId, idx) => {
                    if(userPeerId != myId) {
                        return(
                            <div style={{ display: 'none' }}>
                                <video ref={el => (remoteVoiceRefs.current[idx] = el)} />
                            </div>
                        )
                    } else {
                        return(
                            <div style={{ display: 'none' }}>
                                <video ref={el => (remoteVoiceRefs.current[idx] = el)} muted/>
                            </div>
                        )
                    }
                })
            :   <p>no user</p>
            }
            </div>
        </div>    
    );
}

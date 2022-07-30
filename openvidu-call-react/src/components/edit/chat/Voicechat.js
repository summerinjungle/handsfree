import React from "react";
import { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
import { Button } from "antd";
import "./Voicechat.css";

const { io } = require("socket.io-client");

export default function Voicechat({ userName, roomId }) {
    const [myId, setMyId] = useState('');
    const [usersPeerId, setUsersPeerId] = useState([]);
    const [users, setUsers] = useState([]);
    const remoteVoiceRefs = useRef([]);
    const peerInstane = useRef(null);
    const socketRef = useRef();
    const [startChat, setStartChat] = useState(false);
    const [disable, setDisable] = React.useState(false);
    let peer = null;

    useEffect(() => {
        console.log("제이름은", userName);
        socketRef.current = io.connect("https://bongbong.me/");
        // socketRef.current = io.connect("http://localhost:5000");
        peer = new Peer();
        peer.on('open', (myId) => {
            console.log("My Peer ID", myId)
            setMyId(myId);
        });

        socketRef.current.on("userJoined", (newUser, users, usersPeerId) => {
            console.log("hello", newUser);
            console.log("now in : ", users);
            console.log("now peers : ", usersPeerId);
            setUsersPeerId(usersPeerId);
            setUsers(users);
        })


        peer.on('call', (call) => { //전화 받을 때 
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({ video: false, audio: true }, (mediaStream) => {
                call.answer(mediaStream); //give your mediastream
                call.on('stream', (remoteStream) => {
                    remoteVoiceRefs.current.forEach(remoteVoiceRef => {
                        remoteVoiceRef.srcObject = remoteStream;
                        remoteVoiceRef.play();
                    })
                });
            });
        })

        peerInstane.current = peer;
    }, [])

    const startVoiceChat = () => {
        console.log("hi!!!! i'm : ", myId);
        socketRef.current.emit('joinRoom', userName, myId, roomId);
        setStartChat(true);
    }

    const call = (memberRef, remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {

            // userAudioRef.current.srcObject = mediaStream;
            // userAudioRef.current.play();

            const call = peerInstane.current.call(remotePeerId, mediaStream);
            call.on('stream', (remoteStream) => { //when other user accepts your call

                memberRef.srcObject = remoteStream;
                memberRef.play();

            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    }

    useEffect(() => {
        if (startChat) {
            for (let i = 0; i < usersPeerId.length; i++) {
                if (usersPeerId[i] !== myId) {
                    call(remoteVoiceRefs.current[i], usersPeerId[i]);
                }

            }
        }
    }, [usersPeerId, startChat]);

    return (
        <div>
            <div className="voicechat-header-wrap">
                <div className='contents-label'>보이스콜&nbsp;</div>
                {startChat ?
                    <Button
                        type='primary'
                        className='ant1-clicked'
                        shape='round'
                        disabled={true}
                    >참여중</Button>
                    :
                    <Button
                        type='primary'
                        className='ant1'
                        shape='round'
                        disabled={disable} onClick={() => {
                            setDisable(true);
                            startVoiceChat();
                        }}>참여하기</Button>
                }
            </div>
            <div className='on-the-list'>
                {usersPeerId?.length ?
                    usersPeerId.map((userPeerId, idx) => {
                        if (userPeerId != myId) {
                            return (
                                <div>
                                    <div style={{ display: 'none' }}>
                                        <video ref={el => (remoteVoiceRefs.current[idx] = el)} />
                                    </div>
                                    <Button
                                        type='primary'
                                        className='ant-people-element'
                                        shape='round'
                                    >
                                        {users[idx]}
                                    </Button>
                                </div>
                            );

                        } else {
                            return (
                                <div>
                                    <div style={{ display: 'none' }}>
                                        <video ref={el => (remoteVoiceRefs.current[idx] = el)} muted />
                                    </div>
                                    <Button
                                        type='primary'
                                        className='ant-people-element'
                                        shape='round'
                                    >
                                        {users[idx]}
                                    </Button>
                                </div>
                            );
                        }
                    })
                    :
                    <></>
                }
            </div>
        </div>
    );
}

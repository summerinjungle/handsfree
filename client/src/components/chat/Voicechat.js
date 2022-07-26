import React from "react";
import { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
const { io } = require("socket.io-client");

export default function Voicechat({roomId}) {
    const [myId, setMyId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState([]);
    const remoteVoiceRefs = useRef([]);
    const userAudioRef = useRef(null);
    const peerInstane = useRef(null);
    const socketRef = useRef();
    let peer = null;

    useEffect(()=> {
        peer = new Peer();
        
        peer.on('open', (myId) => {
            setMyId(myId);
        });
        console.log("hello!!");
        
        socketRef.current = io.connect("http://127.0.0.1:5000");
        socketRef.current.emit('msg', "hi im client");
        socketRef.current.on('msg', (data) => {
            console.log(data);
        });
        console.log("done!!");

        // socketRef.current.on('all users',  (coworkersPeerId) => {
        //     setRemotePeerIdValue(coworkersPeerId);
        // })

        // socketRef.current.on('user joined',  (coworkerPeerId) => {
        //     setRemotePeerIdValue(coworkersPeerId => [...coworkersPeerId, coworkerPeerId]);
        // })


        // peer.on('call', (call) => { //전화 받을 때 
        //     let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        //     getUserMedia({video: false, audio: true}, (mediaStream) => {
        //         userAudioRef.current.srcObject = mediaStream;
        //         call.answer(mediaStream); //give your mediastream
        //         call.on('stream', (remoteStream) => {
        //             remoteVoiceRefs.current.forEach(remoteVoiceRef=> {
        //                 remoteVoiceRef.srcObject = remoteStream;
        //                 remoteVoiceRef.play();
        //             })
        //         });
        //     });
        // })

        // peerInstane.current = peer;
        // return () => {
        //     socketRef.current.off('all users');
        // }
    }, [])


    const startVoiceChat = () => {
        socketRef.current.emit('join room', myId, roomId);
    }

    const call = (remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: false, audio: true}, (mediaStream) => {

            userAudioRef.current.srcObject = mediaStream;
            userAudioRef.current.play();

            const call = peerInstane.current.call(remotePeerId, mediaStream);
            call.on('stream', (remoteStream) => { //when other user accepts your call

                remoteVoiceRefs.current.srcObject = remoteStream;
                remoteVoiceRefs.current.play();
               
            });
          }, function(err) {
            console.log('Failed to get local stream' ,err);
          });
    }

    return (
        <div>
            {/* <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
            <button onClick={() => startVoiceChat}>Call</button>
            <p>hi</p>
            <div>
                <video ref={userAudioRef}/>
            </div>
            <div>
                <video ref={remoteVoiceRefs} />
            </div> */}
        </div>
       
    );
}

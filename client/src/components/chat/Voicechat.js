import React from "react";
import { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

export default function Voicechat() {
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const remoteVoiceRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstane = useRef(null);

    let peer = null;

    useEffect(()=> {
        peer = new Peer();
        
        peer.on('open', (id) => {
            setPeerId(id);
        });

        peer.on('call', (call) => { //전화 받을 때 
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            getUserMedia({video: true, audio: true}, (mediaStream) => {
                
                currentUserVideoRef.current.srcObject = mediaStream;
                currentUserVideoRef.current.play();
                call.answer(mediaStream); //give your mediastream
                call.on('stream', (remoteStream) => {
                    remoteVoiceRef.current.srcObject = remoteStream;
                    remoteVoiceRef.current.play();
                });
            });
        })

        peerInstane.current = peer;
        console.log("hello");
    }, [])

    console.log(peerId);

    const call = (remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: true, audio: true}, (mediaStream) => {

            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();

            const call = peerInstane.current.call(remotePeerId, mediaStream);
            call.on('stream', (remoteStream) => { //when other user accepts your call

                remoteVoiceRef.current.srcObject = remoteStream;
                remoteVoiceRef.current.play();
               
            });
          }, function(err) {
            console.log('Failed to get local stream' ,err);
          });
    }

    return (
        <div>
            <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
            <button onClick={() => call(remotePeerIdValue)}>Call</button>
            <p>hi</p>
            <div>
                <video ref={currentUserVideoRef}/>
            </div>
            <div>
                <video ref={remoteVoiceRef} />
            </div>
        </div>
       
    );
}

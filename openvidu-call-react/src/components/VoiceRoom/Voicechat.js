import React from "react";
import { useEffect, useState } from "react";
import Peer from "peerjs";

export default function Voicechat() {
    console.log("ues!!");
    const [peerId, setPeerId] = useState(null);
    const remoteVoiceRef = useRef(null);

    useEffect(()=> {
        const peer = new Peer();
        peer.on('open', (id) => {
            setPeerId(id);
        });
        peer.on('call', (call) => {
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({video: true, audio: true}, (mediaStream) => {
                call.answer(mediaStream); //give your mediastream
            });
        })
    }, [])

    const call = (remotePeerId) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video: true, audio: true}, (mediaStream) => {
            var call = peer.call(remotePeerId, mediaStream);
            
            call.on('stream', (remoteStream) => { //when other user accepts your call
                remoteVoiceRef.current.srcObject = remoteStream;
            });
          }, function(err) {
            console.log('Failed to get local stream' ,err);
          });
    }

    return (
        <div>
            <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />

            <p>hi</p>
        </div>
       
    );
}

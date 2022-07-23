import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import Peer from "simple-peer";

const Voice = ({ sessionId }) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const [stream, setStream] = useState();
  const peersRef = useRef([]);
  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setStream(stream);
        socketRef.current.srcObject = stream;
        socketRef.current.emit("join room", sessionId);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return <div></div>;
};

const mapStateToProps = (state) => {
  return {
    sessionId: state.user.sessionId,
    isPublisher: state.user.isPublisher,
  };
};

export default connect(mapStateToProps)(Voice);

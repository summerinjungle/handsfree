import React from "react";
import { useEffect } from "react";
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { getUserNameInCookie } from "../../main/cookie";

import styled from "styled-components";
import Quill from "quill";
import QuillCursors from "quill-cursors";


function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export let quillRef = null;

export function TextEditor({ sessionId }) {

  let reactQuillRef = null;
  const yDoc = new Y.Doc();
  Quill.register("modules/cursors", QuillCursors);

  //추가
  // const socketRef = useRef();

  useEffect(() => {
    console.log("Text Editor에 있는 sessionId : ", sessionId);
    attachQuillRefs();
    const provider = new WebrtcProvider(
      "http://localhost:3000/meeting/" + sessionId + "/edit",
      yDoc
    );

    // //추가
    // socketRef.current = io();

    // var x, y, prevX, prevY;
    // var intervalID = window.setInterval(function(){
      
    //   if (prevX !== x || !prevY !== y) {
    //     socket.emit('mouse_position', {mx : x, my : y});
    //   }
    //   prevX = x;
    //   prevY = y;
    // }, 500);

    const ytext = yDoc.getText(sessionId);
    
    provider.awareness.on('change', changes => {
      console.log(Array.from(provider.awareness.getStates().values()))
    });

    provider.awareness.setLocalStateField("user", {
      name: getUserNameInCookie(),
      color: getRandomColor(),
    });

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
    
  }, []);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

  const modulesRef = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
  
    ],
    cursors: {
      transformOnTextChange: true,
      hide: false,
      selectionChangeSource: null,
      transformOnTextChange: true,
    },
    history: {
      userOnly: true,
    },
  };

  return (
    <MouseBox>
      <ReactQuill
        style={{
          width: "760px",
          height: "480px",
          backgroundColor: "#E3DDD5",
        }}
        ref={(el) => {
          reactQuillRef = el;
        }}
        modules={modulesRef}
        theme={"snow"}
      />
    </MouseBox>
  );
}

export function insertText(text) {
  var range = quillRef.getSelection();
  let position = range ? range.index : 0;
  quillRef.insertText(position, text);
}

const MouseBox = styled.div`

  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
  }
  .ql-editor strong {
    font-weight: bold;
  }
  .q1-cursor {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .ql-cursor-flag {
    visibility: visible !important;
    opacity: 1 !important;
  }
  .show-flag {
  }
`;

export default TextEditor;

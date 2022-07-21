import React from 'react';
import { useState, useEffect } from 'react';
import { QuillBinding } from 'y-quill'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

const TextEditor = ({sessionId}) => {
  let quillRef = null;
  let reactQuillRef = null;
  let yDoc = new Y.Doc();
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  useEffect(() => {
    console.log("Text Editor에 있는 sessionId : ", sessionId);
    attachQuillRefs();
    let provider = new WebrtcProvider("http://localhost:3000/meeting/" + sessionId + "/edit", yDoc);
    let ytext = yDoc.getText("quill");
    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
  }, []);
  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };
  const insertText = () => {
    var range = quillRef.getSelection();
    let position = range ? range.index : 0;
    quillRef.insertText(position, "Hello, World! ");
  };
  return (
    <div>
      <ReactQuill
        ref={(el) => {
          reactQuillRef = el;
        }}
        theme={"snow"}
      />
    </div>
  );
};
export default TextEditor;

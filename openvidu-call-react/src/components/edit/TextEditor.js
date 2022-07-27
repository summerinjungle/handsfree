import React from "react";
import { useEffect } from "react";
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { getUserNameInCookie } from "../../main/cookie";

import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

export let quillRef = null;

export function TextEditor({ sessionId }) {
  let reactQuillRef = null;
  const yDoc = new Y.Doc();

  useEffect(() => {
    console.log("Text Editor에 있는 sessionId : ", sessionId);
    attachQuillRefs();
    const provider = new WebrtcProvider(
      "http://localhost:3000/meeting/" + sessionId + "/edit",
      yDoc
    );
    const ytext = yDoc.getText("quill");

    provider.awareness.setLocalStateField("user", {
      name: getUserNameInCookie(),
      color: "blue",
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
      toggleFlag: true,
    },
  };

  return (
    <div>
      <ReactQuill
        style={{
          width: "640px",
          height: "430px",
          backgroundColor: "#E3DDD5",
        }}
        ref={(el) => {
          reactQuillRef = el;
        }}
        modules={modulesRef}
        theme={"snow"}
      />
    </div>
  );
}

export function insertText(text) {
  var range = quillRef.getSelection();
  let position = range ? range.index : 0;
  quillRef.insertText(position, text);
}

export default TextEditor;

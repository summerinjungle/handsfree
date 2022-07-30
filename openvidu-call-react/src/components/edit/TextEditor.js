import React from "react";
import { useEffect } from "react";
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { getUserNameInCookie } from "../../main/cookie";
import { Button } from "antd";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { DownloadOutlined } from "@ant-design/icons";
import saveButton from "./docx";

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

    let user = Math.random().toString(36);

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

  const saveMemo = () => {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8" />`;
    let targetString = ns.serializeToString(
      document.querySelector(".ql-editor")
    );
    return korean + targetString;
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
      <div>
        <h2>
          메모장&nbsp;
          <Button
            type='primary'
            className='ant1'
            shape='round'
            icon={<DownloadOutlined />}
            onClick={() => {
              saveButton(saveMemo(), "메모");
            }}
          >
            다운로드
          </Button>
        </h2>
      </div>
      <ReactQuill
        style={{
          width: "720px",
          height: "530px",
          backgroundColor: "#E3DDD5",
          // backgroundColor: "#a9af9",
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

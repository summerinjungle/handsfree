import React from "react";
import { useState, useEffect } from "react";
// import { QuillBinding } from ‘yjs/bindings/quill.js’
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
// @@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@ //
// import Quill from 'quill”;
// import QuillCursors from 'quill-cursors”;
// @@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@ //
// Quill.register('modules/cursors”, QuillCursors);
// @@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@ //
const TextEditor = () => {
  let quillRef = null;
  let reactQuillRef = null;
  let yDoc = new Y.Doc();
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  useEffect(() => {
    attachQuillRefs();
    let provider = new WebrtcProvider("https://piousangel.shop", yDoc);
    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
    // @@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@ //
    // var toolbarOptions = [
    //   ['bold”, 'italic”, 'underline”, 'strike”], // toggled buttons
    //   ['blockquote”, 'code-block”, 'formula”],
    //   [{ header: 1 }, { header: 2 }], // custom button values
    //   [{ list: 'ordered” }, { list: 'bullet” }],
    //   [{ script: 'sub” }, { script: 'super” }], // superscript/subscript
    //   [{ indent: '-1” }, { indent: '+1" }], // outdent/indent
    //   [{ direction: 'rtl” }], // text direction
    //   [{ size: ['small”, false, 'large”, 'huge”] }], // custom dropdown
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //   [{ color: ['white”] }],
    //   ['clean”], // remove formatting button
    // ];
    // const editor = new Quill('#test”, {
    //   modules: {
    //     cursors: true,
    //     toolbar: toolbarOptions,
    //     history: {
    //       userOnly: true,
    //     },
    //   },
    //   placeholder: 'Start collaborating...',
    //   theme: 'snow”, // or ‘bubble’
    // });
    // const cursors = editor.getModule('cursors”);
    // cursors.createCursor(0, '1”, 'green”);
    // @@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@ //
    //--혜진--//
    // setDoc(yDoc);
    // setProvider(provider);
    // const ydocument = provider.get('textarea”);
    //   const type = ydocument.define('textarea”, YText);
    //   new QuillBinding(type, quillRef);
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
      <p>hello!!</p>
      <ReactQuill
        ref={(el) => {
          reactQuillRef = el;
        }}
        theme={"snow"}
      />
      <button onClick={insertText}>Insert ‘Hello World!’ in Text</button>
    </div>
  );
};
export default TextEditor;

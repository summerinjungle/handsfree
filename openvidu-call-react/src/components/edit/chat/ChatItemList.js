import React from "react";
import "../edit.css";
import ChatItem from "./ChatItem";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import saveButton from "../docx";

const ChatItemList = ({
  chatList,
  playTimeWaveSurfer,
  deleteChatItem,
  isPlay,
}) => {
  function saveSoundMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8" />`;
    let targetString = ns.serializeToString(
      document.querySelector(".contents-right")
    );
    targetString = targetString.replace("음성 기록", "<h2>음성 기록</h2>");
    targetString = targetString.replace(/▶︎/g, "");
    targetString = targetString.replace(/수정/g, "");
    targetString = targetString.replace(/다운로드/g, "");
    targetString = targetString.replace(/삭제/g, "");
    targetString = targetString.replace(/메모장에 추가/g, "");
    return korean + targetString;
  }

  return (
    <div className='contents'>
      <div className='contents-right'>
        <div className='contents-label'>&nbsp;&nbsp;&nbsp;음성 기록&nbsp;</div>
        <Button
          type='primary'
          className='antsound'
          shape='round'
          icon={<DownloadOutlined />}
          onClick={() => {
            saveButton(saveSoundMemo(), "음성 기록");
          }}
        >
          다운로드
        </Button>
        <div className='recorditems'>
          {chatList &&
            chatList.map((recordItem) => (
              <ChatItem
                recordItem={recordItem}
                playTimeWaveSurfer={playTimeWaveSurfer}
                isPlay={isPlay}
                deleteChatItem={deleteChatItem}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatItemList;

import React from "react";
import "./ChatItemList.css";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import saveButton from "../docx";
import ChatItem from "./ChatItem";

const ChatItemList = ({
  chatList,
  playTimeWaveSurfer,
  deleteChatItem,
  isPlay,
}) => {
  const saveSoundMemo = () => {
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
  };

  return (
    <div>
      <div>
        <h2>
          &nbsp;&nbsp;&nbsp;음성 기록&nbsp;{" "}
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
        </h2>
      </div>

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
  );
};

export default ChatItemList;

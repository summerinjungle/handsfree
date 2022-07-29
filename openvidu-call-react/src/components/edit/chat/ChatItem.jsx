import React from "react";
import { useRef, useState } from "react";
import markerImg from "../../../assets/images/markerImg.png";
import { insertText } from "../TextEditor";
import "./Chatitem.css";
import PostAddIcon from "@material-ui/icons/PostAdd";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";


const ChatItem = ({
  key,
  id,
  userName,
  time,
  startTime,
  isMarker,
  message,
  playTimeWaveSurfer,
  deleteChatItem,
}) => {
  const localInput = useRef();

  const [isEdit, setIsEdit] = useState(false); // 수정버튼 스위치 state
  const [localContent, setLocalContent] = useState(message); // state기본값을 content로 설정하여, 수정눌렀을때 작성했던 내용을 그대로 불러옴

  const toggleIsEdit = () => setIsEdit(!isEdit); // toggleIsEdit()이 호출이 되면 setIsEdit()이 되고 !(Not)연산을 통해 isEdit이 true면 false로, false면 true로 바꿔줌

  // 수정완료 눌렀을때
  // 해당 id값과, 새로바뀔 컨텐츠인 localContent를 전달
  const handleEdit = () => {
    toggleIsEdit(); // 수정하고 나면 수정폼은 닫아줌
  };

  const autoResizeTextarea = () => {
    let textarea = document.querySelector(".autoTextarea");

    if (textarea) {
      textarea.style.height = "auto";
      var height = textarea.scrollHeight; // 높이
      textarea.style.height = `${height + 8}px`;
    }
  };

  return (
    <div key={key} className='relative mb-20'>
      <div>
        <div className='absolute t-40'>
          {isMarker ? (
            <>
              <img src={markerImg} alt='막둥이' height='12' width='12' />
            </>
          ) : (
            <>{/* 마커 없는 경우 -> 아무것도 안 찍힘 */}</>
          )}
        </div>
      </div>
      <div className='pl-20'>
        <div>
       
          {/* <div className='inline-block mx-10'>
           
          </div> */}
        
          <div className='inline-block'>
           
            <div className='inline-block bold'>{userName}</div>
          <div className='message-time inline-block mx-10'>{time}</div>
      
      
            <PlayArrowIcon
                onClick={() => playTimeWaveSurfer(startTime)}
                className='chattime-buttons'
              />
              {
                // 수정중인 상태면 ? 수정완료,취소버튼 보이게. 수정중인 상태가 아니면 : 수정, 삭제 버튼 보이게
                isEdit ? (
              
                <CheckIcon onClick={handleEdit} className='saveChat' />
                  
                ) : (
                
                    <EditIcon
                      onClick={() => {
                        toggleIsEdit();
                        autoResizeTextarea();
                      }}
                      className='chattime-buttons'
                    />
                
                )
              }
              <DeleteOutlineIcon
                onClick={() => deleteChatItem(id)}
                className='chattime-buttons'
              /> 
              <PostAddIcon
                onClick={() => insertText(localContent)}
                className='chattime-buttons'
              />
          </div>
        </div>
        <div className='relative'>
          <div className='message'>
            {
              // 수정중인 상태면 ? 수정폼을 보여주고, 수정중인 상태가 아니면 : 작성한 컨텐츠를 보여줌

              isEdit ? (
                <>
                  <textarea
                    maxLength='1200'
                    className='autoTextarea'
                    ref={localInput}
                    value={localContent} // 수정내용 기본값 설정
                    onKeyDown={autoResizeTextarea} // keydown이되엇을때마다 autoResizeTextarea실행
                    onKeyUp={autoResizeTextarea} // keyup이되엇을때마다 autoResizeTextarea실행
                    onClick={autoResizeTextarea}
                    onChange={(e) => {
                      setLocalContent(e.target.value);
                    }}
                  />
                </>
              ) : (
                <>{localContent}</>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
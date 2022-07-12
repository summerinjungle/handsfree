import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatHandsFree = () => {
  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {/* {messageList.map((messageContent) => {
            return (
              <div
                className='message'
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='author'>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })} */}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input type='text' placeholder='채팅...' />
        <button>전송</button>
      </div>
    </div>
  );
};

export default ChatHandsFree;

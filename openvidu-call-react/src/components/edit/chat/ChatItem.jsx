import React from "react";

const ChatItem = ({ key, userName, time, message }) => {
    return (
        <div key={key} className="relative mb-20">
            <div>
                <div className="absolute t-40">
                    *
                </div>
            </div>
            <div className="pl-20">
                <div>
                    <div className="inline-block bold">
                        {userName}
                    </div>
                    <div className="inline-block mx-10" >
                        {time}
                    </div>
                    <div className="inline-block mx-10">
                        <button>재생</button>
                    </div>
                    <div className="inline-block">
                        <button>수정</button>
                        <button>삭제</button>
                        <button>메모 추가</button>
                    </div>

                </div>
                <div className="relative">
                    <div className="message">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatItem;

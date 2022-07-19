import React from "react";

const ChatItem = ({ key, userName, time, message }) => {
    return (
        <div key={key} className="relative mb-20">
            <div>
                <div className="absolute t-40">
                    북
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
                        재생
                    </div>
                    <div className="inline-block">
                        <button>수정</button>
                        <button>삭제</button>
                        <button>메모 추가</button>
                    </div>

                </div>
                <div className="relative">
                    <div className="message">
                        그거 할 때 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.그거 할 때 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.그거 할 때 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.아 늦어서 죄송합니다. 아 늦어서 죄송합니다. 아 늦어서 죄송합니다.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatItem;

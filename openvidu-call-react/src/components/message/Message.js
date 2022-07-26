import React, { PureComponent } from "react";
import "../chat/ChatComponent.css";
import Star from "@material-ui/icons/Star";
import yellow from "@material-ui/core/colors/yellow";
class Message extends PureComponent {
  render() {
    console.log("메시지 컴포넌트 =", this.props.data.message);
    return (
      <>
        <div className='message-wrap' ref={this.props.chatScroll}>
          \
          <div
            key={this.props.index}
            id='remoteUsers'
            className={
              "message" +
              (this.props.data.connectionId !==
              this.props.localUser.getConnectionId()
                ? " left"
                : " right")
            }
          >
            <div className='msg-detail'>
              <div className='msg-info'>
                <p>
                  <b>{this.props.data.nickname} </b>
                  {this.props.data.time}
                </p>
              </div>

              <div className='msg-content'>
                {/* <span className='triangle' /> */}
                <p className='text'>
                  {this.props.data.marker ? (
                    <Star style={{ color: yellow[800] }} />
                  ) : null}
                  {this.props.data.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Message;

import React, { useState } from "react";
import { Modal } from "@material-ui/core";

const ModalComponent = () => {
  let subtitle;
  const [openModal, setOpenModal] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div>
      <Modal
        isOpen={this.state.openModal}
        onAfterOpen={() => {
          subtitle.style.color = "#f00";
        }}
        onRequestClose={() => {
          this.setState({ openModal: false });
        }}
        style={customStyles}
        contentLabel='Example Modal'
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button
          onClick={() => {
            this.setState({ openModal: false });
          }}
        >
          close
        </button>
        <div>I am a modal</div>
        <form>
          <button>편집실 가기</button>
          <button>종료</button>
        </form>
      </Modal>
    </div>
  );
};

export default ModalComponent;

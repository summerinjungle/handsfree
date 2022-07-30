import React from "react";
import mainLogo from "../../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Button } from "antd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./Header.css";
const Header = () => {
  const navigate = useNavigate();

  const exitEditRoom = () => {
    swal({
      title: "나가기",
      text: "정말로 나가시겠습니까",
      icon: "warning",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/");
        window.location.reload();
      }
    });
  };

  return (
    <div className='header'>
      <span className='header-contents'>
        <img className='header-logo' src={mainLogo} />
        <Button
          className='exit'
          type='primary'
          shape='round'
          icon={<ExitToAppIcon />}
          onClick={exitEditRoom}
        >
          나가기
        </Button>
      </span>
    </div>
  );
};

export default Header;

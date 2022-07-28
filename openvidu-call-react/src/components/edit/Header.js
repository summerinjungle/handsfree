import React from "react";
import mainLogo from "../../assets/images/mainLogo.png";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='header'>
      <span className='header-contents'>
        <img className='header-logo' src={mainLogo} />
      </span>
      <div className='header-contents text-right'>
        <button
          className='exit'
          onClick={() => {
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
          }}
        >
          나가기
        </button>
      </div>
    </div>
  );
};

export default Header;

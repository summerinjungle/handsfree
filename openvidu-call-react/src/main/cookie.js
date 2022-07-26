import Cookies from "js-cookie";

const token = "token";
const name = "name";

export const getTokenInCookie = () => {
  // console.log(Cookies.get('name'));
  return Cookies.get(token);
};

export const getUserNameInCookie = () => {
  console.log("name from google! : ", Cookies.get(name));
  return Cookies.get(name);
};

//삭제예정ㅇ
export const removeTokenInCookie = () => {
  return Cookies.remove(token);
};

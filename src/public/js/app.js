// io()가 알아서 socket.io를 실행하고 있는 서버를 찾을거임
const socket = io();

// welcome id를 갖고있는 DOM을 welcome 변수에 저장
const welcome = document.getElementById("welcome");

// welcome이라는 id에서 "form"과 일치하는 element를 반환한다.
const form = welcome.querySelector("form");

const room = document.getElementById("room");


room.hidden = true;
let roomName;


function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}


function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  // 새 이벤트 new_message. 백엔드로 보낸다.
  socket.emit("new_message", input.value, roomName, ()=> {
    addMessage(`You : ${value}`);
  });
  input.value = '';
}


function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  console.log(input);
  socket.emit("nickname", input.value);
}


function showRoom(){
  welcome.hidden = true;  // welcome 태그는 숨겨지고
  room.hidden = false;    // room 태그가 보인다.
  const h3 = room.querySelector("h3");  
  h3.innerText = `room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}


function handleRoomSubmit(event){
  event.preventDefault();  // form 태그에서 submit을 누른 후 바로 새로고침되지 않도록 한다.
  const input = form.querySelector("input");  // form 태그에서 input DOM 찾기
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;  // 얘가 showroom보다 먼저 실행됨. showroom은 callback 함수이므로!!
  input.value = "";
}


socket.on("welcome", (user) => {
  addMessage(`${user} 들어옴`);
});


// form은 element로서 이벤트를 수신할 수 있는 eventTarget이다.
// submit이라는 이벤트에 대한 콜백 함수를 지정한다.
form.addEventListener("submit", handleRoomSubmit);


socket.on("bye", (left) =>{
  addMessage(`${left} 나감`);
});


socket.on("new_message", addMessage);
// io()가 알아서 socket.io를 실행하고 있는 서버를 찾을거임
const socket = io();
// welcome id를 갖고있는 DOM을 welcome 변수에 저장
const welcome = document.getElementById("welcome");
// welcome이라는 id에서 "form"과 일치하는 element를 반환한다.
const form = welcome.querySelector("form");
const room = document.getElementById("room");


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "ko-KR";


room.hidden = true;
// 방번호
let roomName;
// 메시지 내용
let texts = "";
// 소리감지체크
let sound_detect_check = false;
// 기록중지 하면 False => 안써도 동작함
let scribe = true;


// 서버로 보낼 json
let sockets =  {
  "room": "",
  "id": "",
  "talking_begin_time": 0,
  "message": "",
  "talking_end_time": 0
};


// 메시지 등록하는 함수
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}


// 닉네임 바꾸기
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  sockets["id"] = input.value;
  socket.emit("nickname", input.value);
  console.log(input.value);
}


// 룸에 들어왔음
function showRoom(){
  welcome.hidden = true;  // welcome 태그는 숨겨지고
  room.hidden = false;    // room 태그가 보인다.
  const h3 = room.querySelector("h3");  
  h3.innerText = `room ${roomName}`;
  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNicknameSubmit);
}


// 나가기 버튼 클릭
function exit_room() {
  socket.emit('forceDisconnect');
  location.reload();
}


// 입장하기버튼
function handleRoomSubmit(event){
  event.preventDefault();  // form 태그에서 submit을 누른 후 바로 새로고침되지 않도록 한다.
  const input = form.querySelector("input");  // form 태그에서 input DOM 찾기

  // 회의 시간 받기
  const date = new Date();
  meeting_start_time = date.getTime();

  socket.emit("enter_room", input.value, meeting_start_time, showRoom);
  roomName = input.value;  // 얘가 showroom보다 먼저 실행됨. showroom은 callback 함수이므로!!
  console.log(roomName);
  input.value = "";
  // 마이크를 켠다
  recognition.start();
  console.log("mike on");
}


// 음성인식 시작 로그 찍어야함
recognition.onstart = function () {
  sound_detect_check= false;
};

// 막둥이 검사하는 함수
function mak_doong(texts) {
  if (texts === "") {

  }
}

// 음성인식 감지 안되면 소켓에 종료시간과 메시지를 등록하고 초기화 => 녹음 다시 시작
recognition.onend = function () {
  const date = new Date();
  
  if (texts !== "") {
    sockets["message"] = texts;
    sockets["talking_end_time"] = date.getTime();
    sockets["room"] = roomName;

    // 여기서 소켓으로 보내야함
    // 새 이벤트 new_message. 백엔드로 보낸다.
    const h2 = room.querySelector("h2");

    // 막둥이 지능 올리기
    if (texts === "막둥아 기록 중지") {
      sockets["message"] = "기록중지@";
      h2.innerText = `기록중지`;
      socket.emit("new_message", sockets, roomName, ()=> {});
      console.log("기록중지");
    } else if (texts === "막둥아 기록 시작") {
      sockets["message"] = "기록시작@";
      h2.innerText = `기록시작`;
      socket.emit("new_message", sockets, roomName, ()=> {});
      console.log("다시시작");
    } else if (texts.includes("막둥아 별표") || texts.includes("막둥아 대표")) {
      sockets["message"] = "막둥아 별표@";
      socket.emit("new_message", sockets, roomName, ()=> {
      addMessage(`You : ${sockets["message"]}`);
      });
      console.log("별표");
    } else if (texts.includes("막둥아 종료")) {
      socket.emit('forceDisconnect');
      location.reload();
    } 
    else {
      socket.emit("new_message", sockets, roomName, ()=> {
      addMessage(`You : ${sockets["message"]}`);
      });
    }
  }
  texts = "";
  recognition.start();
};


// 음성감지 된경우 시작시간을 등록한다
recognition.onresult = function (e) {
  if (sound_detect_check !== true) {
    sockets["message"] = "";
    const date = new Date();
    sockets["talking_begin_time"] = date.getTime();
    sound_detect_check = true;
  }
  texts = Array.from(e.results)
    .map((results) => results[0].transcript)
    .join("");
};


// form은 element로서 이벤트를 수신할 수 있는 eventTarget이다.
// submit이라는 이벤트에 대한 콜백 함수를 지정한다.
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `room ${roomName} (${newCount})`;
  addMessage(`${user} 들어옴`);
});

socket.on("bye", (left, newCount) =>{
  const h3 = room.querySelector("h3");  
  h3.innerText = `room ${roomName} (${newCount})`;
  addMessage(`${left} 나감`);
});


socket.on("new_message", addMessage);


socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  // rooms 데이터로 받아온 자료들을 li에 하나씩 뿌려준 후 roomList에 넣어서 출력시킨다. 
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  })
});


socket.on("scribe_start", msg => {
  const h2 = room.querySelector("h2");
  h2.innerText = `기록시작`;
});


socket.on("scribe_end", msg => {
  const h2 = room.querySelector("h2");
  h2.innerText = `기록중지`;
});


// socket.on("meeting", (stop_time) => {
//   // alert(stop_time, restart_time, star_time);
//   // alert("d");
//   console.log(stop_time);
// });
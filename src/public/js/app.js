// btn.addEventListener("click", )
// socket => 서버로의 연결
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = {type, payload};
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log("Connected to Server");
}

// 서버 응답 받기
socket.addEventListener("open", handleOpen);


// 비동기 처리 이거를 해야 메시지가 뜬다.
// async function handleMessage(event) {
//   // const message = await event.data.text();
//   // console.log(message);
//   const li = document.createElement("li");
//   li.innerText = message.data;
//   messageList.append(li);
// }

// socket.addEventListener("message", handleMessage);

socket.addEventListener("message", (message) => {
  // console.log("New message: ", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});


socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

// setTimeout(() => {
//   socket.send("hello from the browser!");
// }, 5000)

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
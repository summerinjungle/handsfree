const roomServices = require("./services/room");
const chatServices = require("./services/chat");

/*방 100개 생성*/
async function makeRoom() {
    for(let i=0; i<1000; i++) {
        const room = roomServices.createRoom(i, "publisher", new Date().getTime().toString());
    } 
}


/* 각 방마다 1000건씩 채팅 생성 */
/* 채팅하고 10건 하고 별표 하나씩 기록중지 기록시작  */
async function makeChat() {
    for(let i=160; i<180; i++) {
        for(let j=0; j<100; j++) {
            const startTime = j * 9 + j;
            const endTime = j * 10 + j;
            chatServices.createChat(i, 1*j+1, "김개똥", "오늘은 날씨가 맑군요", startTime.toString());
            chatServices.createChat(i, 2*j+2, "오맑음", "회의를 시작해 볼까요", startTime.toString());
            chatServices.createChat(i, 3*j+3, "김개똥", "주요 안건은 시청률 50% 달성입니다", startTime.toString());
            chatServices.createChat(i, 4*j+4, "오맑음", "와 엄청나네요", startTime.toString());
            chatServices.createChat(i, 5*j+5, "김개똥", "다음해는 60%를 달성했으면 좋겠습니다", startTime.toString());
            chatServices.createChat(i, 6*j+6, "양연석", "그건 불가능합니다!", startTime.toString());
            chatServices.createChat(i, 7*j+7, "김개똥", "그렇군요", startTime.toString());
            chatServices.createChat(i, 8*j+8, "오맑음", "55%는 어떨까요?", startTime.toString());
            chatServices.createChat(i, 9*j+9, "양연석", "그건 가능할 것 같습니다", startTime.toString());
            chatServices.createChat(i, 10*j+10, "안건의", "다음 안건으로 넘어가시죠", startTime.toString());
            chatServices.createMuteTime(i, startTime, endTime);
        }
    }
}

async function markChat() {
    for(let i=0; i<100; i++) {
        for(let j=0; j<100; j++) {
            for(let k=1; k<10; k++ ) {
                chatServices.mark(i, k*j+k);
            }
        }
    }
}

async function getEditingRoomInfo() {
    for(let i=0; i<100; i++) {
        chatServices.toEditingRoom(i);
        // await chatServices.toEditingRoom(i.toString());
    }   
}

async function doTest() {
    await makeChat();
    // await markChat();
    // getEditingRoomInfo();
}

async function start() {
    console.time('query 실행 시간');
}

async function end() {
    console.timeEnd('query 실행 시간');
}


exports.test = async () => {
    console.log('=========================');
    // console.time('query 실행 시간');
    // await doTest();
    // console.timeEnd('query 실행 시간');
    start().then(await doTest()).then(end());
    console.log('=========================');
    console.log("  ");
    console.log("  ");
    console.log("  ");
    console.log("  ");
    console.log("  ");
}


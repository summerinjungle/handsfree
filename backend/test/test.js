const roomServices = require("../services/room");
const chatServices = require("../services/chat");



/*방 100개 생성*/
async function makeRoom() {
    for(let i=0; i<100; i++) {
        const room = await roomServices.createRoom(i.toString(), "publisher", new Date().getTime().toString());
    } 
}


/* 각 방마다 1000건씩 채팅 생성 */
/* 채팅하고 10건 하고 별표 하나씩 기록중지 기록시작  */
async function makeChat() {
    for(let i=0; i<100; i++) {
        for(let j=0; j<100; j++) {
            const startTime = j * 9 + j;
            const endTime = j * 10 + j;
            await chatServices.createChat(i.toString, 1*j+1, "김개똥", "오늘은 날씨가 맑군요", startTime.toString);
            await chatServices.createChat(i.toString, 2*j+2, "오맑음", "회의를 시작해 볼까요", startTime.toString);
            await chatServices.createChat(i.toString, 3*j+3, "김개똥", "주요 안건은 시청률 50% 달성입니다", startTime.toString);
            await chatServices.mark(i.toString, 3*j+3);
            await chatServices.createChat(i.toString, 4*j+4, "오맑음", "와 엄청나네요", startTime.toString);
            await chatServices.createChat(i.toString, 5*j+5, "김개똥", "다음해는 60%를 달성했으면 좋겠습니다", startTime.toString);
            await chatServices.createChat(i.toString, 6*j+6, "양연석", "그건 불가능합니다!", startTime.toString);
            await chatServices.createChat(i.toString, 7*j+7, "김개똥", "그렇군요", startTime.toString);
            await chatServices.createChat(i.toString, 8*j+8, "오맑음", "55%는 어떨까요?", startTime.toString);
            await chatServices.createChat(i.toString, 9*j+9, "양연석", "그건 가능할 것 같습니다", startTime.toString);
            await chatServices.createChat(i.toString, 10*j+10, "안건의", "다음 안건으로 넘어가시죠", startTime.toString);
            await chatServices.createMuteTime(i.toString, startTime, endTime);
        }
    }
}

async function getEditingRoomInfo() {
    for(let i=0; i<100; i++) {
        await chatServices.toEditingRoom(i.toString());
    }   
}


exports.test = async () => {
    console.time('test');
    await makeRoom().then(await makeChat()).then(await getEditingRoomInfo());
    console.timeEnd('test');
}


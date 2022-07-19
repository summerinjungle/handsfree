import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./edit.css";
import ChatItem from "./chat/ChatItem.jsx";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import Stop from "@material-ui/icons/Stop";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js";
import MarkersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";

const Wave = (roomId) => {
    const wavesurfer = useRef(null);
    const [isPlay, setIsPlay] = useState(false);
    const [volume, setVolume] = useState(1);
    const playButton = () => {
        wavesurfer.current.playPause();
        if (wavesurfer.current.isPlaying()) {
            setIsPlay(true);
        } else {
            setIsPlay(false);
        }
    };
    const stopButton = () => {
        wavesurfer.current.stop();
        setIsPlay(false);
    };

    const changeVolume = (event) => {
        setVolume(event.target.valueAsNumber);
        wavesurfer.current.setVolume(volume);
    };


    const [chatList, setChatList] = useState([]);


    useEffect(() => {
        loadAllRecord(); // 회의에서 저장된 기록들 가져오기

        wavesurfer.current = WaveSurfer.create({
            container: ".audio",
            waveColor: "#eee",
            progressColor: "red",
            barWidth: 0.05,
            plugins: [
                RegionsPlugin.create({
                    // regionsMinLength: 2,
                    // regions: [
                    //   {
                    //     id: "selected",
                    //     start: 13,
                    //     end: 156,
                    //     loop: false,
                    //     color: "hsla(400, 100%, 30%, 0.5)",
                    //   },
                    // ],
                    // dragSelection: {
                    //   slop: 5,
                    // },
                }),
                CursorPlugin.create({
                    showTime: true,
                    opacity: 1,
                    customShowTimeStyle: {
                        "background-color": "red",
                        color: "#fff",
                        padding: "6px",
                        "font-size": "15px",
                    },
                }),
                MarkersPlugin.create({
                    // markers: [
                    //   {
                    //     time: 5.5,
                    //     label: "V1",
                    //     color: "#ff990a",
                    //   },
                    //   {
                    //     time: 60,
                    //     label: "V2",
                    //     color: "#00ffcc",
                    //     position: "top",
                    //   },
                    //   {
                    //     time: 950,
                    //     label: "V2",
                    //     color: "red",
                    //     position: "bottom",
                    //   },
                    //   {
                    //     time: 120,
                    //     label: "V3",
                    //     color: "#00fdcc",
                    //     position: "top",
                    //   },
                    // ],
                }),
            ],
        });
    }, []);

    useEffect(() => {
        if (wavesurfer) {
            console.log(" ㅡㅡ ", wavesurfer.current);
            wavesurfer.current.load(
                "https://openvidu.shop/openvidu/recordings/SessionB/ownweapon.webm"
            );
        }
    }, []);

    /**
     * [GET] http://{BASE_URL}/api/rooms/{roomId}/editingroom 
     * 
     * 잡담구간, 별표표시, 음성기록에 필요한 정보들 받아와 
     * WaveSurfer에 뿌려줌
     * 
     * TODO: 아래 for 반복문 2개 함수로 분리
     */
    async function loadAllRecord() {
        await axios
            .get('/api/rooms/' + "onwlt8ng" + '/editingroom') // 테스트를 위해 roomId : onwlt8ng 넣어 놓음
            .then(function (response) {
                const {chatList, starList, recordMuteList} = response.data.editingRoom;
                setChatList(chatList);
                console.log("WWWWW", response.data.editingRoom);

                // [잡담 구간] 표시
                for (let i = 0; i < recordMuteList.length; i++) {
                    if (Object.keys(recordMuteList[i]).includes('right')) { // 'right' 키 값이 있는 경우
                        console.log("IS_RIGHT", recordMuteList[i].left, recordMuteList[i].right);
                        wavesurfer.current.regions.add({
                            start: recordMuteList[i].left,
                            end: recordMuteList[i].right,
                            color: "hsla(200, 50%, 70%, 0.3)"
                        })
                    } else {
                        console.log("NO_RIGHT", recordMuteList[i].left, recordMuteList[i].right);
                        wavesurfer.current.regions.add({ // 'right' 키 값이 있는 경우
                            start: recordMuteList[i].left,
                            end: recordMuteList[i].left + 10000,
                            color: "hsla(400, 100%, 30%, 0.5)"
                        })
                    }
                }

                // [막둥아 별표] 표시 
                console.log("wooseoing", starList);
                for (let i = 0; i < starList.length; i++) {
                    wavesurfer.current.addMarker({
                        time: starList[i].time,
                        // time: 120,
                        label: "V1",
                        color: "#ff990a",
                    });
                }


            })
            .catch(function (error) {
                console.log(error);
            })
    }


    return (
        <div id="editingroom-container">
            <div className="header">
                <div className="header-contents">
                    Logo
                </div>
                <div className="header-contents text-right">
                    <button>PDF</button>
                    <button>나가기</button>
                </div>
            </div>
            <hr className="my-0"></hr>
            <div className="contents">
                <div className="contents-left">
                    <div className="contents-label">
                        메모
                    </div>
                    <textarea className="textarea"></textarea>
                </div>
                <div className="contents-right">
                    <div className="contents-label">
                        음성 기록
                    </div>
                    <div className="recorditems">
                        {chatList &&
                            chatList.map((recordItem) => (
                                <ChatItem
                                    key={recordItem.id}
                                    userName={recordItem.userName}
                                    time={recordItem.startTime}
                                    message={recordItem.message}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='audio-container'>
                {/* <div className='track-name'>The name of the track</div> */}
                <div className='audio'></div>
                <div className='buttons'>
                    <span
                        className={"play-btn btn" + (isPlay === true ? " playing" : "")}
                        onClick={playButton}
                    >
                        <PlayArrowIcon className='fas fa-play' />
                        <PauseIcon className='fas fa-pause' />
                    </span>

                    <span className='stop-btn btn' onClick={stopButton}>
                        <Stop className='fas fa-stop' />
                    </span>

                    <span className={"mute-btn btn" + (!volume ? " muted" : "")}>
                        <VolumeUp className='fas fa-volume-up' />
                        <VolumeOff className='fas fa-volume-mute' />
                    </span>

                    <input
                        type='range'
                        min={0}
                        max={20}
                        step={1}
                        value={volume}
                        className='volume-slider'
                        onChange={changeVolume}
                        readOnly
                    />
                </div>
            </div>

        </div>
    );
};

export default Wave;

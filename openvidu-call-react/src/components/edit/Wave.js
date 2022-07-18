// import React, { Component } from "react";
// import WaveSurfer from "wavesurfer.js";
// import "./wave.css";

// class Wave extends Component {
//   state = {
//     playing: false,
//   };

//   componentDidMount() {
//     const track = document.querySelector("#track");

//     this.waveform = WaveSurfer.create({
//       barWidth: 3,
//       barRadius: 3,
//       barGap: 2,
//       barMinHeight: 1,
//       cursorWidth: 1,
//       container: "#waveform",
//       backend: "WebAudio",
//       height: 80,
//       progressColor: "#FE6E00",
//       responsive: true,
//       waveColor: "#C4C4C4",
//       cursorColor: "transparent",
//     });

//     this.waveform.load(track);
//   }

//   handlePlay = () => {
//     this.setState({ playing: !this.state.playing });
//     this.waveform.playPause();
//   };

//   render() {
//     const url =
//       "https://api.twilio.com//2010-04-01/Accounts/AC25aa00521bfac6d667f13fec086072df/Recordings/RE6d44bc34911342ce03d6ad290b66580c.mp3";

//     return (
//       <div className='wave-container'>
//         <button onClick={this.handlePlay}>
//           {!this.state.playing ? "Play" : "Pause"}
//         </button>
//         <div class='wave' />
//         <audio id='track' src={url} />
//         <div>0.52</div>
//       </div>
//     );
//   }
// }

// export default Wave;

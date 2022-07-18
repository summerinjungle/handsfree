import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import VideoRoomComponent from './components/VideoRoomComponent';
import QuillEditor from './components/QuillEditor';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  // <VideoRoomComponent />, document.getElementById('root')
  <QuillEditor />, document.getElementById('root')
);
registerServiceWorker();

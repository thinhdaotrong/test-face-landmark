import logo from './logo.svg';
import './App.css';
import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Camera from './components/Camera';

function App() {
  useEffect(() => {
    return Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models'),
    ]);
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <Camera />
      </header>
    </div>
  );
}

export default App;

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

export default function Camera() {
  const camera = useRef(null);
  const canvasRef = useRef(null);

  const [results, setResults] = useState([]);

  const detectFaces = async (image) => {
    if (!image) {
      return;
    }

    const imgSize = image.getBoundingClientRect();
    const displaySize = { width: imgSize.width, height: imgSize.height };
    if (displaySize.height === 0) {
      return;
    }

    const faces = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    return faceapi.resizeResults(faces, displaySize);
  };

  const drawResults = async (image, canvas, results, type) => {
    if (image && canvas && results) {
      const imgSize = image.getBoundingClientRect();
      const displaySize = { width: imgSize.width, height: imgSize.height };
      faceapi.matchDimensions(canvas, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      const resizedDetections = faceapi.resizeResults(results, displaySize);
      switch (type) {
        case 'landmarks':
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          break;
        case 'expressions':
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          break;
        case 'box':
          faceapi.draw.drawDetections(canvas, resizedDetections);
          break;
        case 'boxLandmarks':
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          break;
        default:
          break;
      }
    }
  };

  const getFaces = async () => {
    if (camera.current !== null) {
      const faces = await detectFaces(camera.current.video);
      await drawResults(camera.current.video, canvasRef.current, faces, 'boxLandmarks');
      setResults(faces);
    }
  };

  const clearOverlay = (canvas) => {
    canvas.current.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const ticking = setInterval(async () => {
      await getFaces();
    }, 80);
    return () => {
      clearOverlay(canvasRef);
      clearInterval(ticking);
    };
  }, []);

  return (
    <>
      <Webcam
        ref={camera}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
    </>
  );
}

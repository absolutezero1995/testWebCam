// Home.js

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Home.css'; // Импортируем стили

const Home = () => {
  const [peerConnections, setPeerConnections] = useState({});
  const socket = useRef(null);
  const videoStream = useRef(null);


  useEffect(() => {
    socket.current = io();
    
    const initializeMediaStream = async () => {
      try {
        // Запрос на использование веб-камеры
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        videoStream.current = stream;
        
        // Создаем видеоэлемент для текущего пользователя
        const myVideo = document.createElement('video');
        myVideo.srcObject = stream;
        myVideo.controls = false;
        myVideo.muted = true;
        myVideo.setAttribute('controls', 'false');
        myVideo.setAttribute('disablepictureinpicture', 'true');
        myVideo.style.width = '320px';  // Применяем стиль в JavaScript
        myVideo.style.height = '240px '; // Применяем стиль в JavaScript
        document.getElementById('myVideoContainer').appendChild(myVideo);
        
        myVideo.play().catch((error) => {
          console.error('Ошибка воспроизведения видео:', error);
        });

        socket.current.on('stream', (streamData) => {
          const { socketId, stream } = streamData;
          
          if (!peerConnections[socketId]) {
            const otherVideo = document.createElement('video');
            otherVideo.srcObject = stream;
            otherVideo.controls = false;
            otherVideo.muted = false;
            otherVideo.setAttribute('controls', 'false');
            otherVideo.setAttribute('disablepictureinpicture', 'true');
            otherVideo.style.width = '200px';  // Применяем стиль в JavaScript
            otherVideo.style.height = '140px'; // Применяем стиль в JavaScript
            document.getElementById('peerVideoContainer').appendChild(otherVideo);
            
            setPeerConnections((prevConnections) => ({
              ...prevConnections,
              [socketId]: otherVideo,
            }));
          }
        });
      } catch (error) {
        console.error('Ошибка доступа к веб-камере:', error);
      }
    };

    initializeMediaStream();
    
    
    return () => {
      socket.current.disconnect();
      
      if (videoStream.current) {
        const tracks = videoStream.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  {console.log(Object.keys)}
  return (
    <div className='home-container'>
      <div id="myVideoContainer" className="video-container"></div>

      <div id="peerVideoContainer" className="video-container">
        
        {Object.keys(peerConnections).map((socketId) => (
          <div key={socketId} className="video-square">
            {peerConnections[socketId]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

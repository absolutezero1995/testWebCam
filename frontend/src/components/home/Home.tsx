import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './Home.css';

interface StreamData {
  socketId: string;
  stream: MediaStream;
}

interface PeerConnections {
  [socketId: string]: HTMLVideoElement;
}

interface VideoWrapperProps {
  videoElement: HTMLVideoElement;
}

const VideoWrapper: React.FC<VideoWrapperProps> = ({ videoElement }) => {
  return <>{videoElement}</>;
};

const Home: React.FC = () => {
  const [peerConnections, setPeerConnections] = useState<PeerConnections>({});
  const socket = useRef<Socket | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const myVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const peerVideoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.current = io();

    const initializeMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream.current = stream;

        if (myVideoContainerRef.current) {
          const myVideo = document.createElement('video');
          myVideo.srcObject = stream;
          myVideo.controls = false;
          myVideo.muted = true;
          myVideo.setAttribute('controls', 'false');
          myVideo.setAttribute('disablepictureinpicture', 'true');
          myVideo.style.width = '320px';
          myVideo.style.height = '240px';
          myVideoContainerRef.current.appendChild(myVideo);

          myVideo.play().catch((error) => {
            console.error('Ошибка воспроизведения видео:', error);
          });
        }

        socket.current?.on('stream', (streamData: StreamData) => {
          const { socketId, stream } = streamData;

          if (!peerConnections[socketId] && peerVideoContainerRef.current) {
            const otherVideo = document.createElement('video');
            otherVideo.srcObject = stream;
            otherVideo.controls = false;
            otherVideo.muted = false;
            otherVideo.setAttribute('controls', 'false');
            otherVideo.setAttribute('disablepictureinpicture', 'true');
            otherVideo.style.width = '200px';
            otherVideo.style.height = '140px';
            peerVideoContainerRef.current.appendChild(otherVideo);

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
      socket.current?.disconnect();

      if (videoStream.current) {
        const tracks = videoStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [peerConnections]);

  return (
    <div className='home-container'>
      <div ref={myVideoContainerRef} id="myVideoContainer" className="video-container"></div>

      <div ref={peerVideoContainerRef} id="peerVideoContainer" className="video-container">
        {Object.keys(peerConnections).map((socketId) => (
          <div key={socketId} className="video-square">
            <VideoWrapper videoElement={peerConnections[socketId]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

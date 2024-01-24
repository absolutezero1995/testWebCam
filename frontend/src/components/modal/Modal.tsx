import { useState, useEffect } from 'react';
import AudioPlayer from 'react-audio-player';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    question: string;
    answer: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, question }) => {
  const [timer, setTimer] = useState<number>(30);
  const [isSongPlayed, setIsSongPlayed] = useState<boolean>(false);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (!isSongPlayed) {
      onClose();
      setIsSongPlayed(true);
      console.log('SONG HAS PLAYED COMPLETELY');
    }
  }, [timer, isSongPlayed, onClose]);

  const handlePlay = () => {
    // Добавьте свою логику, которая выполняется при начале проигрывания
  };

  const handlePause = () => {
    // Добавьте свою логику, которая выполняется при паузе
  };

  const handleEnded = () => {
    setIsSongPlayed(true);
    onClose();
    console.log('SONG HAS PLAYED COMPLETELY');
  };

  return (
    isOpen && (
      <>
        <div className="modal-overlay">
          <video autoPlay loop muted className="video-background">
            <source src="../../SvoyaIgra/neurons.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              Закрыть
            </button>
            <p>{question.question}</p>
            <p>{question.answer}</p>
            <p>{timer}</p>
            <div>
              <AudioPlayer
                src="../../public/SvoyaIgra/svoya_igra-30-sec.mp3"
                autoPlay
                controls={false}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
              />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Modal;

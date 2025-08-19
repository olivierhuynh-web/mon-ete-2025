'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';

const items = [
  {
    label: 'bonjour.wav',
    audio: '/audio/bonjour.wav',
    image: null,
    video: null,
  },
  {
    label: 'OLIVIER.JPG',
    audio: null,
    image: '/images/olivier.jpeg',
    video: null,
  },
  {
    label: 'jai_commence_une_formation.wav',
    audio: './audio/jai_commence_une_formation.wav',
    image: null,
    video: null,
  },
  {
    label: 'batiment.jpeg',
    audio: null,
    image: '/images/batiment.jpeg',
    video: null,
  },
  {
    label: 'cours.jpeg',
    audio: null,
    image: '/images/cours.jpeg',
    video: null,
  },
  {
    label: 'au_debut_je_ne_pensais_qua_lui.wav',
    audio: './audio/au_debut_je_ne_pensais_qua_lui.wav',
    image: null,
    video: null,
  },
  {
    label: 'mon_lit.jpeg',
    audio: null,
    image: '/images/mon_lit.jpeg',
    video: null,
  },
  {
    label: 'le_soir_je_rentrais_chez_moi_fatigue.wav',
    audio: './audio/le_soir_je_rentrais_chez_moi_fatigue.wav',
    image: null,
    video: null,
  },
  {
    label: 'peripherique.MP4',
    audio: null,
    image: null,
    video: '/video/peripherique.mp4', // <-- vidéo ici
  },
  {
    label: 'et_puis_a_force_de_verres.wav',
    audio: './audio/et_puis_a_force_de_verres.wav',
    image: null,
    video: null,
  },
  {
    label: 'verre.jpeg',
    audio: null,
    image: '/images/verre.jpeg',
    video: null,
  },
  {
    label: 'la_formation_est_devenue_plus_facile.wav',
    audio: './audio/la_formation_est_devenue_plus_facile.wav',
    image: null,
    video: null,
  },
  {
    label: 'affiche_horizontale.png',
    audio: null,
    image: '/images/affiche_horizontale.png',
    video: null,
  },
  {
    label: 'a_la_fin_jai_meme_eu_une_certification.wav',
    audio: './audio/a_la_fin_jai_meme_eu_une_certification.wav',
    image: null,
    video: null,
  },
  {
    label: 'istqb.jpeg',
    audio: null,
    image: null,
    video: null,
  },
  {
    label: 'je_commence_un_nouveau_contrat.wav',
    audio: './audio/je_commence_un_nouveau_contrat.wav',
    image: null,
    video: null,
  },
  {
    label: 'nouveau_lieu_de_travail.jpeg',
    audio: null,
    image: '/images/nouveau_lieu_de_travail.jpeg',
    video: null,
  },
];

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setShowImage(false);
      setShowVideo(false);
      setSelectedIndex((prevIndex) =>
        event.key === 'ArrowDown'
          ? (prevIndex + 1) % items.length
          : (prevIndex - 1 + items.length) % items.length
      );
    } else if (event.key === 'Enter') {
      setShowImage(!!items[selectedIndex].image);
      setShowVideo(!!items[selectedIndex].video);

      if (items[selectedIndex].audio && audioRef.current) {
        audioRef.current.src = items[selectedIndex].audio;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }

      if (items[selectedIndex].video && videoRef.current) {
        videoRef.current.src = items[selectedIndex].video;
        videoRef.current.play();
      } else if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(currentTime);
      setDuration(duration);
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowImage(false);
    setCurrentTime(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, isPlaying]);

  if (isMobile) {
    return (
      <div className={styles.page}>
        <div>Ce contenu n'est pas disponible sur mobile</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <h2 className={styles.container__title}>REPERTOIRE</h2>

          <div className={styles.container__items}>
            {items.map((item, index) => (
              <div
                key={index}
                className={`${styles.container__line} ${
                  index === selectedIndex
                    ? styles['container__line-selected']
                    : ''
                } ${
                  isPlaying && index === selectedIndex
                    ? styles['container__line-playing']
                    : ''
                }`}
                style={
                  index === selectedIndex && isPlaying && item.audio
                    ? {
                        background: `linear-gradient(to left, #ff0000 ${progress}%, #f0f0f0 ${progress}%)`,
                      }
                    : {}
                }
              >
                <span>{item.label}</span>
                {index === selectedIndex && item.audio && (
                  <span className={styles.container__line__time}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      {showImage && items[selectedIndex].image && (
        <img
          src={items[selectedIndex].image}
          className={
            items[selectedIndex].label === 'affiche_horizontale.png'
              ? `${styles.overlayImage} ${styles['overlayImage--horizontal']}`
              : styles.overlayImage
          }
        />
      )}
      {showVideo && items[selectedIndex].video && (
        <video
          ref={videoRef}
          src={items[selectedIndex].video}
          className={styles.overlayVideo}
          controls
          autoPlay
          onEnded={() => setShowVideo(false)}
          style={{
            maxWidth: '90vw',
            maxHeight: '80vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: '#000',
          }}
        />
      )}
      <footer className={styles.footer}></footer>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />
    </div>
  );
}

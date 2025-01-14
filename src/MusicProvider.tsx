import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext({
  playMusic: () => {},
  pauseMusic: () => {},
  setVolume: (volume: number) => {// Example: Update state or perform some action with volume
    console.log(volume); },
  volume: 0.5,
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null); // Singleton audio object
  const [volume, setVolumeState] = useState(0.5); // Default volume

  // Initialize audio object on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://typerslayer-music.s3.ap-southeast-2.amazonaws.com/Brylie+Christopher+Oxley+-+8-Bit+Sunrise.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      playMusic();
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null; // Cleanup on unmount
    };
  }, []);

  // Update volume
  const setVolume = (volume: number) => {
    setVolumeState(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Play music
  const playMusic = () => {
    audioRef.current
      ?.play()
      .catch((error) => console.error("Audio playback error: ", error));
  };

  // Pause music
  const pauseMusic = () => {
    audioRef.current?.pause();
  };


  return (
    <MusicContext.Provider value={{ playMusic: () => playMusic(), pauseMusic: () => pauseMusic(), setVolume, volume }}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook to use MusicContext
export const useMusic = () => useContext(MusicContext);

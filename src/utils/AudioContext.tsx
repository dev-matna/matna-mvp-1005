import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioContextType {
  globalMuted: boolean;
  setGlobalMuted: (muted: boolean) => void;
  toggleGlobalMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [globalMuted, setGlobalMuted] = useState(false);

  const toggleGlobalMute = () => {
    setGlobalMuted(prev => !prev);
  };

  const value = {
    globalMuted,
    setGlobalMuted,
    toggleGlobalMute
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
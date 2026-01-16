import { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '@/lib/audioEngine';

const STORAGE_KEY = 'pipino-air-stage';
const TOTAL_STAGES = 12;

export function useAirportExperience() {
  const [stage, setStage] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);

  // Save stage to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, stage.toString());
  }, [stage]);

  // Initialize audio on first user interaction
  const initAudio = useCallback(async () => {
    if (!audioInitialized) {
      const success = await audioEngine.init();
      setAudioInitialized(success);
      return success;
    }
    return true;
  }, [audioInitialized]);

  const goNext = useCallback(async () => {
    if (isTransitioning || stage >= TOTAL_STAGES - 1) return;
    
    await initAudio();
    setIsTransitioning(true);
    audioEngine.playSFX('chime');
    
    setTimeout(() => {
      setStage(prev => prev + 1);
      setIsTransitioning(false);
    }, 400);
  }, [stage, isTransitioning, initAudio]);

  const goTo = useCallback(async (targetStage: number) => {
    if (isTransitioning || targetStage < 0 || targetStage >= TOTAL_STAGES) return;
    
    await initAudio();
    setIsTransitioning(true);
    audioEngine.playSFX('beep');
    
    setTimeout(() => {
      setStage(targetStage);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning, initAudio]);

  const resetExperience = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStage(0);
  }, []);

  const toggleSFX = useCallback(() => {
    const newState = audioEngine.toggleSFX();
    setSfxEnabled(newState);
  }, []);

  const toggleAmbient = useCallback(() => {
    const newState = audioEngine.toggleAmbient();
    setAmbientEnabled(newState);
  }, []);

  const playSFX = useCallback((type: string) => {
    audioEngine.playSFX(type);
  }, []);

  const vibrate = useCallback((pattern?: number | number[]) => {
    audioEngine.vibrate(pattern);
  }, []);

  const progress = ((stage + 1) / TOTAL_STAGES) * 100;

  return {
    stage,
    progress,
    isTransitioning,
    audioInitialized,
    sfxEnabled,
    ambientEnabled,
    goNext,
    goTo,
    resetExperience,
    initAudio,
    toggleSFX,
    toggleAmbient,
    playSFX,
    vibrate,
    totalStages: TOTAL_STAGES
  };
}

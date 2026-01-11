import { useAudioPlayer } from "expo-audio";
import { useCallback } from "react";

const audioSource = require("../../assets/beep.mp3");

export default function useBeep() {
  const player = useAudioPlayer(audioSource);

  return useCallback(() => {
    player.seekTo(0);
    player.play();
  }, [player]);
}

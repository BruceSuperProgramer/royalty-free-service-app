import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearPlayerError,
  nextTrack,
  pause,
  play,
  previousTrack,
  setDuration,
  setPlayerError,
  setPlayerLoading,
  setPosition,
  stop,
} from "@/store/slices/playerSlice";
import {
  setAudioModeAsync,
  useAudioPlayerStatus,
  useAudioPlayer as useExpoAudioPlayer,
} from "expo-audio";
import { useCallback, useEffect, useRef } from "react";

export const useAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, position, duration, volume, repeatMode } =
    useAppSelector((state) => state.player);

  // Create audio player with current track (keep it alive for smoother playback)
  const player = useExpoAudioPlayer(currentTrack?.audio || null);
  const status = useAudioPlayerStatus(player);
  const lastTrackRef = useRef<string | null>(null);
  const isSeekingRef = useRef(false);

  // Configure audio session
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
      } catch (error) {
        console.error("Failed to configure audio session:", error);
      }
    };

    configureAudioSession();
  }, []);

  // Update Redux state when player status changes
  useEffect(() => {
    if (status.isLoaded) {
      // Update duration when loaded
      if (status.duration && status.duration !== duration / 1000) {
        dispatch(setDuration(status.duration * 1000)); // Convert to milliseconds
      }

      // Update position (but not while seeking to avoid conflicts)
      if (
        !isSeekingRef.current &&
        status.currentTime !== undefined &&
        Math.abs(status.currentTime * 1000 - position) > 500
      ) {
        dispatch(setPosition(status.currentTime * 1000)); // Convert to milliseconds
      }

      // Handle track end - auto advance to next track
      if (status.currentTime && status.duration) {
        const isNearEnd = status.currentTime >= status.duration - 0.1;
        if (isNearEnd && repeatMode !== "one") {
          dispatch(nextTrack());
        }
      }
    }

    // Update loading state
    if (status.isLoaded !== undefined) {
      dispatch(setPlayerLoading(!status.isLoaded));
    }

    // Handle errors
    dispatch(clearPlayerError()); // Clear any previous errors
  }, [status, dispatch, duration, position, repeatMode]);

  // Handle play/pause state synchronization
  useEffect(() => {
    if (!player || !status.isLoaded) return;

    const shouldBePlaying = isPlaying;
    const currentlyPlaying = status.playing;

    if (shouldBePlaying && !currentlyPlaying) {
      // Need to start playing
      player.play();
    } else if (!shouldBePlaying && currentlyPlaying) {
      // Need to pause
      player.pause();
    }
  }, [player, status.isLoaded, status.playing, isPlaying]);

  // Handle track changes
  useEffect(() => {
    const currentAudio = currentTrack?.audio;

    if (currentAudio && currentAudio !== lastTrackRef.current) {
      lastTrackRef.current = currentAudio;
      // Reset position when track changes
      dispatch(setPosition(0));
    }
  }, [currentTrack?.audio, dispatch]);

  // Handle repeat mode (looping)
  useEffect(() => {
    // Note: expo-audio doesn't have built-in loop support yet,
    // so we handle repeat in the status update effect above
  }, [repeatMode]);

  // Player control functions
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    try {
      if (isPlaying) {
        dispatch(pause());
      } else {
        dispatch(play());
      }
    } catch {
      dispatch(setPlayerError("Playback control error"));
    }
  }, [isPlaying, currentTrack, dispatch]);

  const seekToPosition = useCallback(
    (positionMillis: number) => {
      if (!player || !status.isLoaded) return;

      try {
        isSeekingRef.current = true;
        const positionSeconds = positionMillis / 1000;
        player.seekTo(positionSeconds);
        dispatch(setPosition(positionMillis));

        // Reset seeking flag after a short delay
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 100);
      } catch {
        dispatch(setPlayerError("Seek error"));
        isSeekingRef.current = false;
      }
    },
    [player, status.isLoaded, dispatch]
  );

  const skipToNext = useCallback(() => {
    dispatch(nextTrack());
  }, [dispatch]);

  const skipToPrevious = useCallback(() => {
    dispatch(previousTrack());
  }, [dispatch]);

  const replay = useCallback(() => {
    if (!player || !status.isLoaded) return;

    try {
      player.seekTo(0);
      dispatch(setPosition(0));
      if (!isPlaying) {
        dispatch(play());
      }
    } catch {
      dispatch(setPlayerError("Replay error"));
    }
  }, [player, status.isLoaded, isPlaying, dispatch]);

  const stopPlayback = useCallback(() => {
    if (!player) return;

    try {
      player.pause();
      player.seekTo(0);
      dispatch(stop());
    } catch {
      dispatch(setPlayerError("Stop error"));
    }
  }, [player, dispatch]);

  return {
    // State
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,

    // Controls
    togglePlayPause,
    seekToPosition,
    skipToNext,
    skipToPrevious,
    replay,
    stopPlayback,

    // Utility
    isLoaded: status.isLoaded || false,
    player,
  };
};

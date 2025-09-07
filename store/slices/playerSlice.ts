import { TrackSummary } from "@/types/music";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState } from "../types";

export interface PlayerState extends BaseState {
  // Current playback state
  currentTrack: TrackSummary | null;
  playlist: TrackSummary[];
  currentTrackIndex: number;

  // Player controls
  isPlaying: boolean;
  position: number; // Current playback position in milliseconds
  duration: number; // Total track duration in milliseconds

  // Player UI state
  isVisible: boolean;
  isMinimized: boolean;

  // Player settings
  volume: number; // 0.0 to 1.0
  repeatMode: "none" | "one" | "all";
  shuffleEnabled: boolean;
}

const initialState: PlayerState = {
  // Current playback state
  currentTrack: null,
  playlist: [],
  currentTrackIndex: -1,

  // Player controls
  isPlaying: false,
  position: 0,
  duration: 0,

  // Player UI state
  isVisible: false,
  isMinimized: true,

  // Player settings
  volume: 1.0,
  repeatMode: "none",
  shuffleEnabled: false,

  // Base state
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Playback control actions
    playTrack: (state, action: PayloadAction<TrackSummary>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.isVisible = true;
      state.position = 0;

      // Find track in current playlist or create a new playlist with just this track
      const trackIndex = state.playlist.findIndex(
        (track) => track.id === action.payload.id
      );
      if (trackIndex !== -1) {
        state.currentTrackIndex = trackIndex;
      } else {
        state.playlist = [action.payload];
        state.currentTrackIndex = 0;
      }
    },

    playPlaylist: (
      state,
      action: PayloadAction<{ tracks: TrackSummary[]; startIndex?: number }>
    ) => {
      const { tracks, startIndex = 0 } = action.payload;
      state.playlist = tracks;
      state.currentTrackIndex = startIndex;
      state.currentTrack = tracks[startIndex] || null;
      state.isPlaying = true;
      state.isVisible = true;
      state.position = 0;
    },

    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },

    play: (state) => {
      state.isPlaying = true;
    },

    pause: (state) => {
      state.isPlaying = false;
    },

    stop: (state) => {
      state.isPlaying = false;
      state.position = 0;
    },

    // Track navigation actions
    nextTrack: (state) => {
      if (state.playlist.length === 0) return;

      let nextIndex = state.currentTrackIndex + 1;

      if (state.repeatMode === "one") {
        // Keep the same track
        nextIndex = state.currentTrackIndex;
      } else if (nextIndex >= state.playlist.length) {
        if (state.repeatMode === "all") {
          nextIndex = 0; // Loop back to first track
        } else {
          // No repeat, stop at the end
          state.isPlaying = false;
          return;
        }
      }

      state.currentTrackIndex = nextIndex;
      state.currentTrack = state.playlist[nextIndex];
      state.position = 0;
    },

    previousTrack: (state) => {
      if (state.playlist.length === 0) return;

      let prevIndex = state.currentTrackIndex - 1;

      if (state.repeatMode === "one") {
        // Keep the same track
        prevIndex = state.currentTrackIndex;
      } else if (prevIndex < 0) {
        if (state.repeatMode === "all") {
          prevIndex = state.playlist.length - 1; // Loop to last track
        } else {
          prevIndex = 0; // Stay at first track
        }
      }

      state.currentTrackIndex = prevIndex;
      state.currentTrack = state.playlist[prevIndex];
      state.position = 0;
    },

    // Position and duration updates
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    seekTo: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },

    // UI state actions
    showPlayer: (state) => {
      state.isVisible = true;
    },

    hidePlayer: (state) => {
      state.isVisible = false;
    },

    togglePlayerVisibility: (state) => {
      state.isVisible = !state.isVisible;
    },

    minimizePlayer: (state) => {
      state.isMinimized = true;
    },

    expandPlayer: (state) => {
      state.isMinimized = false;
    },

    togglePlayerSize: (state) => {
      state.isMinimized = !state.isMinimized;
    },

    // Settings actions
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },

    setRepeatMode: (state, action: PayloadAction<"none" | "one" | "all">) => {
      state.repeatMode = action.payload;
    },

    toggleShuffle: (state) => {
      state.shuffleEnabled = !state.shuffleEnabled;
      // TODO: Implement shuffle logic for playlist reordering
    },

    // Error handling
    setPlayerError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearPlayerError: (state) => {
      state.error = null;
    },

    setPlayerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  playTrack,
  playPlaylist,
  togglePlayPause,
  play,
  pause,
  stop,
  nextTrack,
  previousTrack,
  setPosition,
  setDuration,
  seekTo,
  showPlayer,
  hidePlayer,
  togglePlayerVisibility,
  minimizePlayer,
  expandPlayer,
  togglePlayerSize,
  setVolume,
  setRepeatMode,
  toggleShuffle,
  setPlayerError,
  clearPlayerError,
  setPlayerLoading,
} = playerSlice.actions;

export default playerSlice.reducer;

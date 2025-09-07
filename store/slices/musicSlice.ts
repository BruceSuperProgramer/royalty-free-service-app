import { TrackFilters } from "@/types/music";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState } from "../types";

interface MusicState extends BaseState {
  // UI State
  searchQuery: string;
  isSearchActive: boolean;

  // Filter and pagination state
  filters: TrackFilters;
  currentPage: number;

  // Currently selected track for navigation
  selectedTrackId: number | null;
}

const initialState: MusicState = {
  // UI State
  searchQuery: "",
  isSearchActive: false,

  // Filter and pagination state
  filters: {
    order: "popularity_total",
    featured: true,
  },
  currentPage: 0,

  // Currently selected track
  selectedTrackId: null,

  // Base state
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
      if (!action.payload) {
        state.searchQuery = "";
      }
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.isSearchActive = false;
    },
    setFilters: (state, action: PayloadAction<Partial<TrackFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 0; // Reset to first page when filters change
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedTrackId: (state, action: PayloadAction<number | null>) => {
      state.selectedTrackId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        order: "popularity_total",
        featured: true,
      };
      state.currentPage = 0;
    },
  },
});

export const {
  setSearchQuery,
  setSearchActive,
  clearSearch,
  setFilters,
  setCurrentPage,
  setSelectedTrackId,
  resetFilters,
} = musicSlice.actions;

export default musicSlice.reducer;

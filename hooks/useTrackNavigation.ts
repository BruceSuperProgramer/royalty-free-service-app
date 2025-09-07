import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSearch,
  setSearchActive,
  setSearchQuery,
} from "@/store/slices/musicSlice";

/**
 * Hook for handling track navigation and search actions
 */
export const useTrackNavigation = () => {
  const dispatch = useAppDispatch();
  const { isSearchActive, searchQuery } = useAppSelector(
    (state) => state.music
  );

  // Ref to store the timeout ID for debouncing
  const debounceTimeoutRef = useRef<number | null>(null);

  const navigateToTrack = useCallback((trackId: number) => {
    router.push(`/track/${trackId}`);
  }, []);

  const handleToggleSearch = useCallback(() => {
    dispatch(setSearchActive(!isSearchActive));
  }, [dispatch, isSearchActive]);

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new timeout for 500ms debounce
      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(setSearchQuery(query));
      }, 700);
    },
    [dispatch]
  );

  const handleCancelSearch = useCallback(() => {
    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    dispatch(clearSearch());
  }, [dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    navigateToTrack,
    handleToggleSearch,
    handleSearchQueryChange,
    handleCancelSearch,
    isSearchActive,
    searchQuery,
  };
};

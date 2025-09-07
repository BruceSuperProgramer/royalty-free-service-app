import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MusicLibraryHeader from "@/components/music/MusicLibraryHeader";
import { TrackItem } from "@/components/music/TrackItem";
import { useTrackNavigation } from "@/hooks/useTrackNavigation";
import { useInfiniteTracks } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import type { TrackSummary } from "@/types/music";

/**
 * Main Music Library Screen
 *
 * This screen displays a list of available music tracks with a modern,
 * card-based design. Each track shows album art, basic info, and controls.
 */
const MusicListScreen = () => {
  const { filters, isSearchActive, searchQuery } = useAppSelector(
    (state) => state.music
  );
  const {
    navigateToTrack,
    handleToggleSearch,
    handleSearchQueryChange,
    handleCancelSearch,
  } = useTrackNavigation();

  // Build query parameters based on search state
  const queryParams = useMemo(() => {
    if (isSearchActive && searchQuery.trim()) {
      // For search: use search query and filters
      return {
        ...filters,
        search: searchQuery.trim(),
      };
    }
    // For browsing: use only filters
    return filters;
  }, [isSearchActive, searchQuery, filters]);

  // Single query that handles both search and browsing
  // Enable when: not searching OR (searching and has query)
  const enabled =
    !isSearchActive || (isSearchActive && searchQuery.trim().length > 0);
  const activeQuery = useInfiniteTracks(queryParams, enabled);

  // Flatten all pages of tracks into a single array
  const tracks = useMemo(() => {
    return activeQuery.data?.pages.flatMap((page) => page.tracks) ?? [];
  }, [activeQuery.data]);

  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const error = activeQuery.error;
  const hasNextPage = activeQuery.hasNextPage;
  const isFetchingNextPage = activeQuery.isFetchingNextPage;

  const renderTrackItem = ({
    item,
    index,
  }: {
    item: TrackSummary;
    index: number;
  }) => (
    <TrackItem
      track={item}
      onPress={() => navigateToTrack(item.id)}
      index={index}
    />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = useCallback(
    () => (
      <MusicLibraryHeader
        isSearchExpanded={isSearchActive}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        onToggleSearch={handleToggleSearch}
        onCancelSearch={handleCancelSearch}
      />
    ),
    [
      isSearchActive,
      searchQuery,
      handleSearchQueryChange,
      handleToggleSearch,
      handleCancelSearch,
    ]
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" />
          <ThemedText style={styles.loadingText}>
            Loading more tracks...
          </ThemedText>
        </View>
      );
    }
    if (isError && error) {
      return (
        <View style={styles.errorFooter}>
          <ThemedText style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load tracks"}
          </ThemedText>
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, isError, error]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, activeQuery]);

  const handleRefresh = useCallback(() => {
    activeQuery.refetch();
  }, [activeQuery]);

  if (isLoading && tracks.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading tracks...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isError && tracks.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load tracks"}
          </ThemedText>
          <ThemedText style={styles.retryText} onPress={handleRefresh}>
            Tap to retry
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        data={tracks}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={renderTrackItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // Pagination
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={activeQuery.isRefetching && !isFetchingNextPage}
            onRefresh={handleRefresh}
          />
        }
        // Performance optimizations for smooth scrolling
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        windowSize={10}
        updateCellsBatchingPeriod={16}
        // Accessibility
        accessibilityLabel="Music track list"
        accessibilityHint="Scrollable list of available music tracks"
      />
    </ThemedView>
  );
};

export default MusicListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorFooter: {
    alignItems: "center",
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

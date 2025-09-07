import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeInUp,
  SlideInLeft,
  ZoomIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AlbumArt } from "@/components/music/AlbumArt";
import { TrackDetailHeader } from "@/components/track/TrackDetailHeader";
import { TrackMetadata, TrackTags } from "@/components/track/TrackMetadata";
import { useTrackById } from "@/hooks/useTracks";
import { useAppDispatch } from "@/store/hooks";
import { playTrack } from "@/store/slices/playerSlice";

/**
 * Track Detail Screen
 *
 * Displays comprehensive information about a specific track including
 * album art, metadata, tags, and action buttons.
 */
const TrackDetailScreen = () => {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const trackId = parseInt(id || "0", 10);

  const { data: track, isLoading, isError, error } = useTrackById(trackId);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <TrackDetailHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading track...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isError || !track) {
    return (
      <ThemedView style={styles.container}>
        <TrackDetailHeader />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {error instanceof Error ? error.message : "Track not found"}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const handlePlayTrack = () => {
    if (track) {
      // Convert full Track to TrackSummary for the player
      const trackSummary = {
        id: track.id,
        name: track.name,
        artist_name: track.artist_name,
        album_name: track.album_name,
        duration: track.duration,
        image: track.image,
        audio: track.audio,
      };
      dispatch(playTrack(trackSummary));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TrackDetailHeader />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Track Image with zoom-in animation */}
        <Animated.View
          style={styles.imageContainer}
          entering={ZoomIn.delay(200).duration(600).springify()}
        >
          <AlbumArt
            imageUri={track.image}
            duration={track.duration}
            size="large"
            showPlayIcon={true}
            showDuration={false}
            track={{
              id: track.id,
              name: track.name,
              artist_name: track.artist_name,
              album_name: track.album_name,
              duration: track.duration,
              image: track.image,
              audio: track.audio,
            }}
            onPlayPress={handlePlayTrack}
          />
        </Animated.View>

        {/* Track Info with slide-in animation */}
        <Animated.View
          style={styles.trackInfo}
          entering={SlideInLeft.delay(400).duration(600).springify()}
        >
          <ThemedText style={styles.trackTitle}>{track.name}</ThemedText>
          <ThemedText style={styles.artistName}>{track.artist_name}</ThemedText>
          {track.album_name && (
            <ThemedText style={styles.albumName}>
              from &ldquo;{track.album_name}&rdquo;
            </ThemedText>
          )}
        </Animated.View>

        {/* Metadata with staggered entrance */}
        <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
          <TrackMetadata track={track} />
        </Animated.View>

        {/* Tags with staggered entrance */}
        <Animated.View entering={FadeInUp.delay(700).duration(600).springify()}>
          <TrackTags track={track} />
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
};

export default TrackDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  trackInfo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  artistName: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 4,
    textAlign: "center",
  },
  albumName: {
    fontSize: 16,
    opacity: 0.6,
    fontStyle: "italic",
    textAlign: "center",
  },
});

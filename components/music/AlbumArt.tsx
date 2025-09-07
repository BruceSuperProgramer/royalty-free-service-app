import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useAppSelector } from "@/store/hooks";
import { TrackSummary } from "@/types/music";
import { formatDuration } from "@/utils/formatters";

interface AlbumArtProps {
  imageUri: string;
  duration: number;
  size?: "small" | "medium" | "large";
  showPlayIcon?: boolean;
  showDuration?: boolean;
  track?: TrackSummary; // Optional track for state awareness
  onImageLoad?: () => void;
  onImageError?: () => void;
  onPlayPress?: () => void;
}

const sizeConfig = {
  small: {
    width: 50,
    height: 50,
    iconSize: 20,
    playIconSize: 20,
    borderRadius: 8,
  },
  medium: {
    width: 70,
    height: 70,
    iconSize: 28,
    playIconSize: 28,
    borderRadius: 12,
  },
  large: {
    width: 120,
    height: 120,
    iconSize: 36,
    playIconSize: 56,
    borderRadius: 16,
  },
};

export const AlbumArt = ({
  imageUri,
  duration,
  size = "medium",
  showPlayIcon = true,
  showDuration = true,
  track,
  onImageLoad,
  onImageError,
  onPlayPress,
}: AlbumArtProps) => {
  const config = sizeConfig[size];

  // Get player state for dynamic play/pause button
  const { currentTrack, isPlaying } = useAppSelector((state) => state.player);
  const isCurrentTrack = track ? currentTrack?.id === track.id : false;

  return (
    <View
      style={[styles.container, { width: config.width, height: config.height }]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.borderRadius,
          },
        ]}
        contentFit="cover"
        onLoad={onImageLoad}
        onError={onImageError}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"] as const}
        style={[styles.overlay, { borderRadius: config.borderRadius }]}
      />

      {showPlayIcon && (
        <TouchableOpacity
          style={[
            styles.playIconContainer,
            size === "large" && styles.playIconContainerLarge,
          ]}
          onPress={onPlayPress}
          activeOpacity={0.8}
          accessibilityLabel={
            isCurrentTrack && isPlaying ? "Pause track" : "Play track"
          }
          accessibilityRole="button"
        >
          <View
            style={[
              styles.playIconBackground,
              size === "large" && styles.playIconBackgroundLarge,
              isCurrentTrack && styles.playIconBackgroundActive,
            ]}
          >
            <Ionicons
              name={isCurrentTrack && isPlaying ? "pause" : "play"}
              size={size === "large" ? 28 : config.playIconSize}
              color="white"
              style={styles.playIcon}
            />
          </View>
        </TouchableOpacity>
      )}

      {showDuration && (
        <View style={styles.durationBadge}>
          <ThemedText style={styles.durationText}>
            {formatDuration(duration)}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    backgroundColor: "#f0f0f0", // Fallback color while loading
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
  },
  playIconContainerLarge: {
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  playIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  playIconBackgroundLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  playIconBackgroundActive: {
    backgroundColor: "#007AFF",
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  playIcon: {
    marginLeft: 2, // Slight offset to center the play triangle visually
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  durationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
  },
});

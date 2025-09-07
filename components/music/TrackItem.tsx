import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playTrack } from "@/store/slices/playerSlice";
import { TrackSummary } from "@/types/music";
import { AlbumArt } from "./AlbumArt";
import { TrackInfo } from "./TrackInfo";

interface TrackItemProps {
  track: TrackSummary;
  onPress: () => void;
  onMenuPress?: () => void;
  index: number;
  showPlayButton?: boolean;
}

export const TrackItem = ({
  track,
  onPress,
  onMenuPress,
  index,
  showPlayButton = true,
}: TrackItemProps) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { currentTrack, isPlaying } = useAppSelector((state) => state.player);

  const isCurrentTrack = currentTrack?.id === track.id;

  const cardColors = isDark
    ? (["rgba(40, 40, 40, 0.9)", "rgba(20, 20, 20, 0.9)"] as const)
    : (["rgba(255, 255, 255, 0.9)", "rgba(240, 240, 240, 0.9)"] as const);

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  });

  const handlePlayPress = () => {
    dispatch(playTrack(track));
  };

  return (
    <Animated.View
      entering={FadeInUp.delay((index % 20) * 50)
        .duration(600)
        .springify()
        .damping(15)
        .stiffness(100)}
    >
      <TouchableOpacity
        style={[styles.trackCard, shadowStyle]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={`Play ${track.name} by ${track.artist_name}`}
        accessibilityHint="Double tap to view track details"
      >
        <LinearGradient
          colors={cardColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AlbumArt
            imageUri={track.image}
            duration={track.duration}
            size="medium"
          />

          <TrackInfo
            title={track.name}
            artistName={track.artist_name}
            albumName={track.album_name}
            titleStyle={[
              styles.trackTitle,
              isCurrentTrack && styles.currentTrackTitle,
            ]}
            artistStyle={[
              styles.artistText,
              isCurrentTrack && styles.currentTrackText,
            ]}
            albumStyle={[
              styles.albumText,
              isCurrentTrack && styles.currentTrackText,
            ]}
          />

          {showPlayButton && (
            <View style={styles.playButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.playButton,
                  isCurrentTrack && styles.playButtonActive,
                ]}
                onPress={handlePlayPress}
                activeOpacity={0.8}
                accessibilityLabel={`Play ${track.name}`}
              >
                <Ionicons
                  name={isCurrentTrack && isPlaying ? "pause" : "play"}
                  size={20}
                  color={isCurrentTrack ? "#fff" : isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  trackCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 2, // Small margin for shadow
  },
  cardGradient: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    minHeight: 96,
    gap: 16, // Modern gap property for spacing
  },

  // Style overrides for nested components
  trackTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  artistText: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: "500",
  },
  albumText: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },

  // Current track styles
  currentTrackTitle: {
    color: "#007AFF", // Blue color for current track
  },
  currentTrackText: {
    color: "#007AFF", // Blue color for current track
  },

  // Play button styles
  playButtonContainer: {
    marginLeft: "auto",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonActive: {
    backgroundColor: "#007AFF",
  },

  // More Button
  moreButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 44, // Ensure minimum touch target for accessibility
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { togglePlayerVisibility } from "@/store/slices/playerSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const FloatingAudioPlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTrack, isVisible, position, duration, isPlaying } =
    useAppSelector((state) => state.player);

  const { togglePlayPause, seekToPosition } = useAudioPlayer();

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  if (!currentTrack || !isVisible) {
    return null;
  }

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  const handleProgressPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = screenWidth - 32; // Account for padding
    const seekPercentage = locationX / progressBarWidth;
    const seekPosition = duration * seekPercentage;
    seekToPosition(seekPosition);
  };

  const handleClose = () => {
    dispatch(togglePlayerVisibility());
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Progress Bar - Top */}
      <TouchableOpacity
        style={styles.progressBar}
        onPress={handleProgressPress}
        activeOpacity={1}
      >
        <View style={styles.progressBackground} />
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </TouchableOpacity>

      {/* Player Content */}
      <View style={styles.playerContent}>
        {/* Album Art */}
        <Image
          source={{ uri: currentTrack.image }}
          style={styles.albumArt}
          defaultSource={require("@/assets/images/icon.png")}
        />

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text
            style={[styles.trackTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {currentTrack.name}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentTrack.artist_name}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color={textColor}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={18}
              color={textColor}
              style={{ opacity: 0.6 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    height: 72,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  progressBar: {
    height: 2,
    position: "relative",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  progressBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(128,128,128,0.3)",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: "#007AFF",
  },
  playerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  artistName: {
    fontSize: 13,
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 6,
  },
});

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

interface TrackInfoProps {
  title: string;
  artistName: string;
  albumName?: string;
  showIcons?: boolean;
  layout?: "horizontal" | "vertical";
  titleStyle?: object;
  artistStyle?: object;
  albumStyle?: object;
}

export const TrackInfo = ({
  title,
  artistName,
  albumName,
  showIcons = true,
  layout = "vertical",
  titleStyle,
  artistStyle,
  albumStyle,
}: TrackInfoProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#888" : "#666";

  const containerStyle =
    layout === "horizontal"
      ? [styles.container, styles.horizontalLayout]
      : styles.container;

  return (
    <View style={containerStyle}>
      <ThemedText
        style={[styles.title, titleStyle]}
        numberOfLines={1}
        accessibilityLabel={`Track title: ${title}`}
      >
        {title}
      </ThemedText>

      <View style={styles.metadataRow}>
        {showIcons && (
          <Ionicons
            name="person"
            size={14}
            color={iconColor}
            accessibilityLabel="Artist"
          />
        )}
        <ThemedText
          style={[styles.artist, artistStyle, showIcons && styles.withIcon]}
          numberOfLines={1}
          accessibilityLabel={`Artist: ${artistName}`}
        >
          {artistName}
        </ThemedText>
      </View>

      {albumName && (
        <View style={styles.metadataRow}>
          {showIcons && (
            <Ionicons
              name="disc"
              size={14}
              color={iconColor}
              accessibilityLabel="Album"
            />
          )}
          <ThemedText
            style={[styles.album, albumStyle, showIcons && styles.withIcon]}
            numberOfLines={1}
            accessibilityLabel={`Album: ${albumName}`}
          >
            {albumName}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontalLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: "500",
  },
  album: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
  withIcon: {
    marginLeft: 6,
  },
});

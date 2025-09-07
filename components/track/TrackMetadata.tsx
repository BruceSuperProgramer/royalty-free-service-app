import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Track } from "@/types/music";
import { formatDate, formatDuration } from "@/utils/formatters";

interface MetadataItem {
  label: string;
  value: string;
}

interface TrackMetadataProps {
  track: Track;
  showAllDetails?: boolean;
}

export const TrackMetadata = ({
  track,
  showAllDetails = true,
}: TrackMetadataProps) => {
  const getMetadataItems = (): MetadataItem[] => {
    const baseItems: MetadataItem[] = [
      { label: "Duration", value: formatDuration(track.duration) },
      { label: "Release Date", value: formatDate(track.releasedate) },
      { label: "Type", value: track.musicinfo.vocalinstrumental || "Unknown" },
      {
        label: "Download Allowed",
        value: track.audiodownload_allowed ? "Yes" : "No",
      },
    ];

    if (!showAllDetails) return baseItems.slice(0, 2);

    const additionalItems: MetadataItem[] = [];

    if (track.musicinfo.speed) {
      additionalItems.push({ label: "Tempo", value: track.musicinfo.speed });
    }

    if (track.position) {
      additionalItems.push({
        label: "Track Number",
        value: track.position.toString(),
      });
    }

    return [...baseItems, ...additionalItems];
  };

  const metadataItems = getMetadataItems();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Details</ThemedText>
      {metadataItems.map((item, index) => (
        <View key={`${item.label}-${index}`} style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>{item.label}:</ThemedText>
          <ThemedText style={styles.detailValue}>{item.value}</ThemedText>
        </View>
      ))}
    </View>
  );
};

interface TrackTagsProps {
  track: Track;
  maxTagsPerCategory?: number;
}

export const TrackTags = ({
  track,
  maxTagsPerCategory = 5,
}: TrackTagsProps) => {
  const { tags } = track.musicinfo;

  if (
    !tags ||
    (!tags.genres?.length && !tags.instruments?.length && !tags.vartags?.length)
  ) {
    return null;
  }

  const renderTagGroup = (title: string, tagList: string[], key: string) => {
    if (!tagList?.length) return null;

    const displayTags = tagList.slice(0, maxTagsPerCategory);

    return (
      <View key={key} style={styles.tagGroup}>
        <ThemedText style={styles.tagGroupTitle}>{title}:</ThemedText>
        <View style={styles.tagContainer}>
          {displayTags.map((tag, index) => (
            <View key={`${key}-${tag}-${index}`} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
          {tagList.length > maxTagsPerCategory && (
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>
                +{tagList.length - maxTagsPerCategory} more
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Tags</ThemedText>
      {renderTagGroup("Genres", tags.genres, "genres")}
      {renderTagGroup("Instruments", tags.instruments, "instruments")}
      {renderTagGroup("Mood", tags.vartags, "mood")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  detailLabel: {
    fontSize: 16,
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  tagGroup: {
    marginBottom: 16,
  },
  tagGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

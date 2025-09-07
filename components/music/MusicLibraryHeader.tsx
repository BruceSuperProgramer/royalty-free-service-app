import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import SearchHeader from "./SearchHeader";

interface MusicLibraryHeaderProps {
  isSearchExpanded: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onToggleSearch: () => void;
  onCancelSearch: () => void;
  welcomeMessage?: string;
  title?: string;
  subtitle?: string;
}

const MusicLibraryHeader = ({
  isSearchExpanded,
  searchQuery,
  onSearchQueryChange,
  onToggleSearch,
  onCancelSearch,
  welcomeMessage = "Welcome back",
  title = "Music Library",
  subtitle = "Discover royalty-free music",
}: MusicLibraryHeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const searchFocusRef = useRef<{ focus: () => void }>(null);

  // Handle input focus when search is expanded
  useEffect(() => {
    if (isSearchExpanded && searchFocusRef.current) {
      searchFocusRef.current.focus();
    }
  }, [isSearchExpanded]);

  const colors = {
    background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    border: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    text: isDark ? "#FFFFFF" : "#000000",
    placeholder: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)",
    icon: isDark ? "#FFFFFF" : "#000000",
  };

  return (
    <View style={styles.headerContent}>
      {!isSearchExpanded && (
        <View style={styles.normalHeader}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <ThemedText style={styles.welcomeText}>
                {welcomeMessage}
              </ThemedText>
              <ThemedText style={styles.mainTitle}>{title}</ThemedText>
            </View>
            <TouchableOpacity
              style={[
                styles.searchButton,
                { backgroundColor: colors.background },
              ]}
              onPress={onToggleSearch}
              activeOpacity={0.7}
              accessibilityLabel="Search tracks"
              accessibilityHint="Opens search functionality"
            >
              <Ionicons name="search" size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>
      )}
      {isSearchExpanded && (
        <SearchHeader
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onCancelSearch={onCancelSearch}
          focusRef={searchFocusRef}
        />
      )}
    </View>
  );
};

export default MusicLibraryHeader;

const styles = StyleSheet.create({
  headerContent: {
    paddingHorizontal: 20,
    position: "relative",
  },
  // Normal Header Styles
  normalHeader: {
    // Remove absolute positioning for simpler layout
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "400",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  searchButton: {
    padding: 8,
    borderRadius: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

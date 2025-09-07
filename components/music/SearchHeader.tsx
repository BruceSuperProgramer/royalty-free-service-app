import { Ionicons } from "@expo/vector-icons";
import React, {
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onCancelSearch: () => void;
  focusRef?: React.RefObject<{ focus: () => void } | null>;
}

const SearchHeader = memo(
  ({
    searchQuery,
    onSearchQueryChange,
    onCancelSearch,
    focusRef,
  }: SearchHeaderProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const searchInputRef = useRef<TextInput>(null);

    const colors = useMemo(
      () => ({
        background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        border: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        text: isDark ? "#FFFFFF" : "#000000",
        placeholder: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)",
        icon: isDark ? "#FFFFFF" : "#000000",
      }),
      [isDark]
    );

    const handleClearSearch = useCallback(() => {
      onSearchQueryChange("");
      searchInputRef.current?.focus();
    }, [onSearchQueryChange]);

    const focusInput = useCallback(() => {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }, []);

    // Expose focus method via ref
    useImperativeHandle(
      focusRef,
      () => ({
        focus: focusInput,
      }),
      [focusInput]
    );

    return (
      <View style={styles.searchHeader}>
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onCancelSearch}
            accessibilityLabel="Cancel search"
            accessibilityHint="Close search and return to library"
          >
            <Ionicons name="arrow-back" size={24} color={colors.icon} />
          </TouchableOpacity>

          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={colors.icon}
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: colors.text }]}
              defaultValue={searchQuery}
              onChangeText={onSearchQueryChange}
              placeholder="Search tracks, artists, albums..."
              placeholderTextColor={colors.placeholder}
              returnKeyType="search"
              clearButtonMode="never"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search input"
              accessibilityHint="Type to search for tracks, artists, or albums"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearSearch}
                accessibilityLabel="Clear search"
                accessibilityHint="Clear the search input"
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
);

SearchHeader.displayName = "SearchHeader";

export default SearchHeader;

const styles = StyleSheet.create({
  searchHeader: {
    // Remove absolute positioning for simpler layout
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    minHeight: 24,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchResultsText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
    marginLeft: 56, // Align with search input
  },
});

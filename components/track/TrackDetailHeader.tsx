import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

interface TrackDetailHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

export const TrackDetailHeader = ({
  title = "Track Details",
  onBackPress,
}: TrackDetailHeaderProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
        accessibilityLabel="Go back"
        accessibilityHint="Returns to the previous screen"
      >
        <Ionicons name="arrow-back" size={24} color={iconColor} />
      </TouchableOpacity>

      <ThemedText style={styles.headerTitle} numberOfLines={1}>
        {title}
      </ThemedText>

      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 44, // Same width as back button for centering
  },
});

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { FloatingAudioPlayer } from "@/components/player/FloatingAudioPlayer";
import { useColorScheme } from "@/hooks/useColorScheme";
import { queryClient } from "@/lib/queryClient";
import { store } from "@/store";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  title: "Music Library",
                }}
              />
              <Stack.Screen
                name="track/[id]"
                options={{
                  headerShown: false,
                  presentation: "card",
                  title: "Track Details",
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <FloatingAudioPlayer />
            <StatusBar style="auto" />
          </View>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default RootLayout;

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { socket } from "@/utils/socket";
import { Alert } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  socket.on("connect", () => {
    socket.on("comment:create", data => {
      const localInfo = localStorage.getItem("etwl");
      if (!localInfo) return;

      const userId = JSON.parse(localInfo).id;

      if (data.data.attributes.post_by_user_id === userId && data.data.attributes.created_by_user_id !== userId) {
        Alert.alert(
          "",
          `${data.data.attributes.created_by_user_name} đã bình luận về bài viết của bạn!`,
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }
    });
  });

  useEffect(() => {
    const checkUser = async () => {
      const user = await localStorage.getItem("etwl");

      if (!user) {
        router.push("/auth/login");
      } else {
        if (pathname.includes("login") || pathname.includes("register")) {
          router.push("/");
        }
      }
    };

    if (pathname.includes("login") || pathname.includes("register")) return;
    checkUser();
  }, [pathname]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

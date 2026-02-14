import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import { createContext, useEffect, useMemo, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => {});

export const BACKGROUNDS = [
  require("../assets/backgrounds/1.jpg"),
  require("../assets/backgrounds/2.jpg"),
  require("../assets/backgrounds/3.jpg"),
  require("../assets/backgrounds/4.jpg"),
  require("../assets/backgrounds/5.jpg"),
  require("../assets/backgrounds/6.jpg"),
  require("../assets/backgrounds/7.jpg"),
  require("../assets/backgrounds/8.jpg"),
  require("../assets/backgrounds/9.jpg"),
  require("../assets/backgrounds/10.jpg"),
  require("../assets/backgrounds/11.jpg"),
  require("../assets/backgrounds/12.jpg"),
  require("../assets/backgrounds/13.jpg"),
  require("../assets/backgrounds/14.jpg"),
  require("../assets/backgrounds/15.jpg"),
  require("../assets/backgrounds/16.jpg"),
  require("../assets/backgrounds/17.jpg"),
  require("../assets/backgrounds/18.jpg"),
  require("../assets/backgrounds/19.jpg"),
  require("../assets/backgrounds/20.jpg"),
] as const;

export const THUMB_BACKGROUNDS = [
  require("../assets/backgrounds/thumbnails/1.jpg"),
  require("../assets/backgrounds/thumbnails/2.jpg"),
  require("../assets/backgrounds/thumbnails/3.jpg"),
  require("../assets/backgrounds/thumbnails/4.jpg"),
  require("../assets/backgrounds/thumbnails/5.jpg"),
  require("../assets/backgrounds/thumbnails/6.jpg"),
  require("../assets/backgrounds/thumbnails/7.jpg"),
  require("../assets/backgrounds/thumbnails/8.jpg"),
  require("../assets/backgrounds/thumbnails/9.jpg"),
  require("../assets/backgrounds/thumbnails/10.jpg"),
  require("../assets/backgrounds/thumbnails/11.jpg"),
  require("../assets/backgrounds/thumbnails/12.jpg"),
  require("../assets/backgrounds/thumbnails/13.jpg"),
  require("../assets/backgrounds/thumbnails/14.jpg"),
  require("../assets/backgrounds/thumbnails/15.jpg"),
  require("../assets/backgrounds/thumbnails/16.jpg"),
  require("../assets/backgrounds/thumbnails/17.jpg"),
  require("../assets/backgrounds/thumbnails/18.jpg"),
  require("../assets/backgrounds/thumbnails/19.jpg"),
  require("../assets/backgrounds/thumbnails/20.jpg"),
] as const;

type BackgroundContextValue = {
  index: number;
  next: () => void;
  set: (index: number) => void;
};

export const BackgroundContext = createContext<BackgroundContextValue | null>(
  null,
);

export default function Layout() {
  const [index, setIndex] = useState(
    () => Math.floor(Math.random() * BACKGROUNDS.length),
  );

  const value = useMemo<BackgroundContextValue>(
    () => ({
      index,
      next: () =>
        setIndex((prev) => {
          if (BACKGROUNDS.length <= 1) return prev;
          let nextIndex = prev;
          while (nextIndex === prev) {
            nextIndex = Math.floor(Math.random() * BACKGROUNDS.length);
          }
          return nextIndex;
        }),
      set: (i: number) => {
        if (i >= 0 && i < BACKGROUNDS.length) {
          setIndex(i);
        }
      },
    }),
    [index],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackgroundContext.Provider value={value}>
        <StatusBar style="light" />
        <ImageBackground
          source={BACKGROUNDS[index]}
          className="flex-1"
          resizeMode="cover"
        >
          <View className="flex-1 bg-black/40">
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
          </View>
        </ImageBackground>
      </BackgroundContext.Provider>
    </GestureHandlerRootView>
  );
}

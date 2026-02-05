import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import { createContext, useMemo, useState } from "react";

const BACKGROUNDS = [
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
] as const;

type BackgroundContextValue = {
  index: number;
  next: () => void;
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
    }),
    [index],
  );

  return (
    <BackgroundContext.Provider value={value}>
      <View className="flex-1">
        <StatusBar style="light" />
        <ImageBackground
          source={BACKGROUNDS[index]}
          resizeMode="cover"
          className="flex-1"
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
      </View>
    </BackgroundContext.Provider>
  );
}

import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SleepSchedule from "../components/SleepSchedule";

const SLEEP_BACKGROUND = require("../assets/backgrounds/11.jpg");

export default function SleepScheduleScreen() {
  return (
    <ImageBackground
      source={SLEEP_BACKGROUND}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 bg-black/40">
        <SafeAreaView className="flex-1 px-5">
          <SleepSchedule />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

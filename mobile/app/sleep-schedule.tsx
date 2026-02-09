import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SleepSchedule from "../components/SleepSchedule";

const SLEEP_BACKGROUND = require("../assets/backgrounds/11.jpg");

export default function SleepScheduleScreen() {
  return (
    <View className="flex-1 bg-[#071927]">
      <ImageBackground
        source={SLEEP_BACKGROUND}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1">
          <SafeAreaView className="flex-1 px-5">
            <SleepSchedule />
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

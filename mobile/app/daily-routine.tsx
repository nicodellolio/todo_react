import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyRoutine from "../components/DailyRoutine";

export default function DailyRoutineScreen() {
  return (
    <View className="flex-1 bg-[#071927]">
        <View className="flex-1">
          <SafeAreaView className="flex-1 px-5">
            <DailyRoutine />
          </SafeAreaView>
        </View>
    </View>
  );
}

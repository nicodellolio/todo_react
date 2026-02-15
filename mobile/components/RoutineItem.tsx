import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Routine } from "../types";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRef } from "react";

export default function RoutineItem({
  routine,
  onToggle,
}: {
  routine: Routine;
  onToggle: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const swipeableRef = useRef<any>(null);

  const priorityLabel =
    routine.priority === "high"
      ? "A"
      : routine.priority === "medium"
        ? "M"
        : "B";

  const priorityBgColor =
    routine.priority === "high"
      ? "bg-red-500"
      : routine.priority === "medium"
        ? "bg-yellow-400"
        : "bg-green-500";

  const priorityText =
    routine.priority === "high"
      ? "Alta"
      : routine.priority === "medium"
        ? "Media"
        : "Bassa";

  const createdAtDate = new Date(routine.createdAt);
  const createdAtFormatted = createdAtDate
    .toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    })
    .replace(
      /^([^\s]+)\s+(\d{2})\s+(\w+)/,
      (_, weekday, day, month) =>
        `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${
          month.charAt(0).toUpperCase() + month.slice(1)
        }`,
    );

  return (
    <View className="mb-2 rounded-xl overflow-hidden bg-transparent">
      <View className={`border-gray-100/90 rounded-xl mb-2 ${routine.completed ? "bg-gray-500/90" : "bg-white/90"}`}>
        <View className="flex-row items-center justify-between px-4 pt-4 flex-wrap">
          <TouchableOpacity
            onPress={() =>
              setExpandedId((prev) => (prev === routine.id ? null : routine.id))
            }
            className="flex-row items-center flex-1 mr-2"
          >
            <TouchableOpacity
              onPress={() => onToggle(routine.id)}
              className={`w-7 h-7 rounded-full border-2 mr-3 items-center justify-center ${routine.completed ? "bg-green-500 border-green-500" : "border-gray-300"}`}
            >
              {routine.completed && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text
                className={`text-xl ${routine.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
              >
                {routine.text}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <View className={`px-2 py-1 rounded-full mr-2 ${priorityBgColor}`}>
              <Text className="text-white text-xs font-bold">
                {priorityLabel}
              </Text>
            </View>
          </View>
        </View>
        {expandedId !== routine.id ? (
          <View className="border-t border-gray-300 w-[90%] mx-auto pt-2 mt-3 pb-2">
            <Text className="text-lg font-bold text-black/70">
              Durata:{" "}
              <Text className="text-md font-normal">
                {routine.duration} min
              </Text>
            </Text>
          </View>
        ) : (
          <View className="detail mt-2">
            <View className="h-[1px] bg-gray-300 mt-1 mb-4 w-[90%] mx-auto"></View>
            <View className="flex-row justify-between mb-2 px-4">
              <Text className="text-lg font-bold text-black/70">
                Priorità:{" "}
                <Text className="text-md font-normal">{priorityText}</Text>
              </Text>
              {routine.duration > 0 && (
                <Text className="text-lg font-bold text-black/70">
                  Durata:{" "}
                  <Text className="text-md font-normal">
                    {routine.duration} min
                  </Text>
                </Text>
              )}
            </View>
            <View className="bg-gray-300 rounded-b-xl pb-3">
              <Text className="px-4 mt-2 font-semibold text-sm">
                Inserito in data:{" "}
                <Text className="font-normal">{createdAtFormatted}</Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

import { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { Todo } from "../types";
import { useRouter } from "expo-router";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRef } from "react";

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onSetToday,
  onSwipeStart,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetToday: (id: string) => void;
  onSwipeStart: (ref: any) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter();
  const swipeableRef = useRef<any>(null);
  const priorityLabel =
    todo.priority === "high" ? "A" : todo.priority === "medium" ? "M" : "B";

  const priorityBgColor =
    todo.priority === "high"
      ? "bg-red-500"
      : todo.priority === "medium"
        ? "bg-yellow-400"
        : "bg-green-500";
  const priorityText =
    todo.priority === "high"
      ? "Alta"
      : todo.priority === "medium"
        ? "Media"
        : "Bassa";

  const createdAtDate = new Date(todo.createdAt);
  const now = new Date();
  const wasNotCreatedToday =
    createdAtDate.toDateString() !== now.toDateString();

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
    const createdTimeFormatted = createdAtDate.
    toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"})

  //swipe a sinistra
  const renderRightActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
  ) => {
    const style = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: (drag.value + 80) / 2 }],
        opacity: progress.value,
      };
    });
    return (
      <Reanimated.View style={style}>
        <TouchableOpacity
          onPress={() => {
            swipeableRef.current?.close();
            if (todo.completed) {
              onDelete(todo.id);
            } else {
              onToggle(todo.id);
            }
          }}
          className={`${todo.completed ? "bg-red-500" : "bg-green-500"} justify-center items-center w-20 ps-1 rounded-xl ${expandedId === todo.id ? "h-[95%]" : "h-[87%]"}`}
        >
          <Text className="text-white font-bold">
            {todo.completed ? "Elimina" : "Completa"}
          </Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };
  //swipe a destra
  const renderLeftActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
  ) => {
    const style = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: (drag.value - 80) / 2 }],
        opacity: progress.value,
      };
    });

    return (
      <Reanimated.View style={style}>
        <TouchableOpacity
          onPress={() => {
            swipeableRef.current?.close();
            if (wasNotCreatedToday) {
              onSetToday(todo.id);
            } else if (!wasNotCreatedToday && todo.completed) {
              onToggle(todo.id);
            } else {
              router.push(`/edit/${todo.id}`);
            }
          }}
          className={`bg-blue-500 justify-center items-center w-20 ps-1 ${expandedId === todo.id ? "h-[95%]" : "h-[87%]"} rounded-xl`}
        >
          <Text className="text-white font-bold">
            {wasNotCreatedToday
              ? "Aggiorna"
              : todo.completed
                ? "Ripristina"
                : "Modifica"}
          </Text>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  return (
    <View className="mb-2 rounded-xl overflow-hiddn bg-trasparent">
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={() => onSwipeStart(swipeableRef.current)}
      >
        <View
          className={`${wasNotCreatedToday ? "bg-red-500/90 border-red-400/90" : "border-gray-100/90 bg-white/90"} border-b rounded-xl mb-2`}
          >
          <View className="flex-row items-center justify-between p-4">
            <TouchableOpacity
              onPress={()=>setExpandedId(prev => (prev === todo.id ? null : todo.id))}
              className="flex-row items-center flex-1 mr-2 "
            >
              <TouchableOpacity
                onPress={()=>onToggle(todo.id)}
                className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"}`}
              >
                {todo.completed && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <Text
                  className={`text-xl ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                >
                  {todo.text}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row items-center">
              <View
                className={`px-2 py-1 rounded-full mr-2 ${priorityBgColor}`}
              >
                <Text className="text-white text-xs font-bold">
                  {priorityLabel}
                </Text>
              </View>
            </View>
          </View>
          {expandedId === todo.id && (
            <View className="detail px-4 pb-2">
              <View className="h-[1px] bg-gray-300 mt-1 mb-4"></View>
              <Text className="text-lg font-bold text-black/70">
                Priorità:{" "}
                <Text className="text-md font-normal">{priorityText}</Text>
              </Text>
              <Text className="text-lg font-bold text-black/70">
                Ora di inserimento:{" "}
                <Text className="text-md font-normal">
                  {createdTimeFormatted}
                </Text>
              </Text>
              <Text className="text-gray-400 text-sm mt-2">Fai swipe a sinistra o tocca il pallino per completare il task</Text>
            </View>
          )}
          {wasNotCreatedToday && (
            <View className="px-4 pb-3 pt-1">
              <View className="w-full h-[1px] bg-gray-200/40" />
              <Text className="text-white/90 text-sm mt-2">
                Quest'attività non è di oggi, modificala o eliminala.
              </Text>
              <Text className="text-white/90 text-gray-500 text-sm">
                Data creazione: {createdAtFormatted}
              </Text>
            </View>
          )}
        </View>
      </ReanimatedSwipeable>
    </View>
  );
}

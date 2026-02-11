import { View, Text, TouchableOpacity } from "react-native";
import { Todo } from "../types";
import { Link } from "expo-router";

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onSetToday,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetToday: (id: string) => void;
}) {
  const priorityLabel =
    todo.priority === "high" ? "A" : todo.priority === "medium" ? "M" : "B";

  const priorityBgColor =
    todo.priority === "high"
      ? "bg-red-500"
      : todo.priority === "medium"
        ? "bg-yellow-400"
        : "bg-green-500";

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

  return (
    <View
      className={`${wasNotCreatedToday ? "bg-red-500/90 border-red-400/90" : "border-gray-100/90 bg-white/90"} border-b rounded-xl mb-2`}
    >
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          className="flex-row items-center flex-1 mr-2"
        >
          <View
            className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"}`}
          >
            {todo.completed && <Text className="text-white text-xs">✓</Text>}
          </View>
          <View className="flex-1">
            <Text
              className={`text-base ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
            >
              {todo.text}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className={`px-2 py-1 rounded-full mr-2 ${priorityBgColor}`}>
            <Text className="text-white text-xs font-bold">
              {priorityLabel}
            </Text>
          </View>
          {!todo.completed ? (
            wasNotCreatedToday ? (
              <TouchableOpacity
                onPress={() => onSetToday(todo.id)}
                className="bg-white/90 rounded-full p-1 px-2"
              >
                <Text className="text-blue-500 font-medium">Passa ad oggi</Text>
              </TouchableOpacity>
            ) : (
              <Link href={`/edit/${todo.id}`} asChild>
                <TouchableOpacity className="bg-white/90 rounded-full p-1 px-2">
                  <Text className="text-blue-500 font-medium">Modifica</Text>
                </TouchableOpacity>
              </Link>
            )
          ) : (
            <TouchableOpacity
              onPress={() => onDelete(todo.id)}
              className="px-2 p-1 bg-white/90 rounded-full"
            >
              <Text className="text-red-500 font-semibold">Elimina</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {wasNotCreatedToday && (
        <View className="px-4 pb-3 pt-1">
          <View className="w-full h-[1px] bg-gray-200/40" />
          <Text
            className="text-white/90 text-sm mt-2"
          >
            Quest'attività non è di oggi, modificala o eliminala.
          </Text>
          <Text
            className="text-white/90 text-gray-500 text-sm"
          >
            Data creazione: {createdAtFormatted}
          </Text>
        </View>
      )}
    </View>
  );
}

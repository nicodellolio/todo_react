import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TodoStats as StatsType } from "../types";

export default function TodoStats({
  stats,
  filter,
  setFilter,
}: {
  stats: StatsType;
  filter: string;
  setFilter: (value: string) => void;
}) {
  const [showPriorityStats, setShowPriorityStats] = useState(false);
  return (
    <View className="py-4 bg-blue-50/90 rounded-xl mb-4 shadow-sm">
      <View className="flex-row justify-between items-stretch mb-2">
        <TouchableOpacity
          onPress={() => (filter != "all" ? setFilter("all") : setFilter(""))}
          className="items-center flex-1"
        >
          <Text className="text-2xl font-bold text-blue-600">
            {stats.total}
          </Text>
          <Text className="text-gray-500 text-md mt-[5px] uppercase font-semibold">
            Totali
          </Text>
        </TouchableOpacity>
        <View className="w-[1px] h-full bg-gray-200" />
        <TouchableOpacity
          onPress={() =>
            filter != "completed" ? setFilter("completed") : setFilter("all")
          }
          className="items-center flex-1"
        >
          <Text className="text-2xl font-bold text-green-600">
            {stats.completed}
          </Text>
          <Text className="text-gray-500 text-md mt-[5px] uppercase font-semibold">
            Completate
          </Text>
        </TouchableOpacity>
        <View className="w-[1px] h-full bg-gray-200" />
        <TouchableOpacity
          onPress={() =>
            filter != "pending" ? setFilter("pending") : setFilter("all")
          }
          className="items-center flex-1"
        >
          <Text className="text-2xl font-bold text-orange-600">
            {stats.pending}
          </Text>
          <Text className="text-gray-500 text-md mt-[5px] uppercase font-semibold">
            Attive
          </Text>
        </TouchableOpacity>
        {stats.completionRate != 0 && (
          <>
            <View className="items-center flex-1 bg-blue-100 rounded-xl pb-[5px] ml-2">
              <Text className="text-2xl font-bold text-orange-600">
                {stats.completionRate}%
              </Text>
              <Text className="text-gray-600 text-xs uppercase font-semibold">
                Completati
              </Text>
            </View>
          </>
        )}
      </View>
      <View className="h-[1px] mt-2 bg-gray-200" />
      <View className="bottom_part flex flex-row justify-center px-3 items-center">
        {showPriorityStats && (
          <TouchableOpacity onPress={() => setShowPriorityStats(false)} className="flex-row justify-between gap-4 pt-4">
            <Text className="text-xl font-semibold text-gray-400">
              Alta: {stats.highPriority}
            </Text>
            <Text className="text-xl font-semibold text-gray-400">
              Media: {stats.mediumPriority}
            </Text>
            <Text className="text-xl font-semibold text-gray-400">
              Bassa: {stats.lowPriority}
            </Text>
          </TouchableOpacity>
        )}
          {!showPriorityStats && (
            <TouchableOpacity onPress={() => setShowPriorityStats(true)}>
              <Text className="text-md text-gray-400 mt-2">Mostra dettagli</Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

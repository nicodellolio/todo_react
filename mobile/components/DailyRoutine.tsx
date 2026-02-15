import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import { Link, useFocusEffect } from "expo-router";
import {
  getRoutineItems,
  updateRoutineItem,
  checkAndResetDailyRoutines
} from "../utils/storage";
import { Routine } from "../types";
import RoutineItem from "./RoutineItem";
import * as Haptics from "expo-haptics";
import { Ionicons } from '@expo/vector-icons';

export default function DailyRoutine() {
    const [routines, setRoutines] = useState<Routine[]>([]);

    const loadRoutines = async () => {
        await checkAndResetDailyRoutines();
        const items = await getRoutineItems();
        setRoutines(items);
    };

    useFocusEffect(
        useCallback(() => {
            loadRoutines();
        }, [])
    );

    const handleToggle = async (id: string) => {
        const routine = routines.find((r) => r.id === id);
        if (routine) {
            if (!routine.completed) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            const updated = { ...routine, completed: !routine.completed };
            const newRoutines = await updateRoutineItem(updated);
            setRoutines(newRoutines);
        }
    };

    const todayDate = new Date()
        .toLocaleDateString("it-IT", {
            weekday: "long",
            day: "2-digit",
            month: "short",
        })
        .replace(
            /^([^\s]+)\s+(\d{2})\s+(\w+)/,
            (_, weekday, day, month) =>
                `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${month.charAt(0).toUpperCase() + month.slice(1)
                }`,
        );

    return (
        <View className="flex-1 mt-5">
            <View className="header mt-6 flex-row justify-between items-start">
                <View>
                    <Text className="text-white text-7xl font-extrabold">Daily Routine</Text>
                    <Text className="leading-none text-4xl font-bold text-white ms-1">
                        {todayDate}
                    </Text>
                </View>
            </View>

            <View className="flex-1 mt-10">
                {routines.length > 0 ? (
                    <View className="bg-white/10 rounded-xl mb-2 p-3">
                        <FlatList
                            data={routines}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <RoutineItem
                                    routine={item}
                                    onToggle={handleToggle}
                                />
                            )}
                        />
                    </View>
                ) : (
                    <View className="bg-white/90 rounded-xl p-6 items-center justify-center">
                        <Text className="text-gray-500 text-lg text-center mb-4">
                            Non hai ancora impostato una routine.
                        </Text>
                        <Link href="/add-routine" asChild>
                            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl">
                                <Text className="text-white font-bold text-lg">Imposta Routine</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                )}
            </View>

            {routines.length > 0 && (
                <View className="absolute bottom-10 right-0 left-0 items-center">
                     <Link href="/add-routine" asChild>
                        <TouchableOpacity className="bg-gray-800/80 px-5 py-3 rounded-full flex-row items-center">
                            <Ionicons name="settings-outline" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Configura Routine</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            )}
        </View>
    )
}

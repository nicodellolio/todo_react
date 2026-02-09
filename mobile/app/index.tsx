import { View, FlatList, Text, TouchableOpacity, Animated } from "react-native";
import { useState, useCallback, useContext, useRef, useEffect } from "react";
import { Link, useFocusEffect } from "expo-router";
import {
  getTodos,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} from "../utils/storage";
import { Todo, TodoStats as TodoStatsType } from "../types";
import TodoItem from "../components/TodoItem";
import TodoStats from "../components/TodoStats";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundContext } from "./_layout";

export default function Home() {
  //states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [showChangingBg, setShowChangingBg] = useState<boolean>(false);
  const [changingBgVisible, setChangingBgVisible] = useState<boolean>(false);
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  const background = useContext(BackgroundContext);
  const changingBgAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const todayDate = new Date()
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
  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };2

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, []),
  );

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updated = { ...todo, completed: !todo.completed };
      const newTodos = await updateTodo(updated);
      setTodos(newTodos);
    }
  };

  const handleDelete = async (id: string) => {
    const newTodos = await deleteTodo(id);
    setTodos(newTodos);
  };

  const handleSetToday = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updated: Todo = {
        ...todo,
        createdAt: new Date().toISOString(),
      };
      const newTodos = await updateTodo(updated);
      setTodos(newTodos);
    }
  };

  const handleClearCompleted = async () => {
    const newTodos = await clearCompletedTodos();
    setTodos(newTodos);
  };

  const stats: TodoStatsType = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    completionRate:
      todos.length > 0
        ? Math.round(
            (todos.filter((t) => t.completed).length / todos.length) * 100,
          )
        : 0,
    highPriority: todos.filter((t) => t.priority === "high").length,
    mediumPriority: todos.filter((t) => t.priority === "medium").length,
    lowPriority: todos.filter((t) => t.priority === "low").length,
  };

  const todosFiltered =
    filter == "pending"
      ? todos.filter((todo) => !todo.completed)
      : filter == "completed"
        ? todos.filter((todo) => todo.completed)
        : todos;

  const handleChangeBackground = () => {
    if (!background || showChangingBg || changingBgVisible) return;
    setShowChangingBg(true);
    setTimeout(() => {
      background.next();
      setShowChangingBg(false);
    }, 750);
  };

  useEffect(() => {
    if (showChangingBg) {
      if (!changingBgVisible) {
        setChangingBgVisible(true);
        changingBgAnim.setValue(0);
        Animated.timing(changingBgAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    } else if (changingBgVisible) {
      Animated.timing(changingBgAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setChangingBgVisible(false);
        }
      });
    }
  }, [showChangingBg, changingBgVisible, changingBgAnim]);

  useEffect(()=>{
    Animated.timing(menuAnim, {
      toValue: toggleMenu ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  },[toggleMenu, menuAnim])

  return (
    <SafeAreaView className="flex-1 px-5 relative" edges={["top"]}>
      <View className="pt-4 px-1 flex-row justify-between items-center bg-transparent ">
        <Text className="leading-none text-5xl font-bold text-white">
          Attività di oggi
        </Text>
        <Link href="/add" asChild>
          <TouchableOpacity className="bg-blue-600 mt-2 px-4 py-[8px] rounded-full mb-3">
            <Text className="text-white text-xl font-bold">+</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text className="leading-none text-3xl font-bold text-white ms-1">
        {todayDate}
      </Text>

      <View className="py-4 mt-3">
        <TodoStats stats={stats} filter={filter} setFilter={setFilter} />
      </View>

      <FlatList
        data={todosFiltered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onSetToday={handleSetToday}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center p-5 bg-gray-200/90 rounded-xl">
            <Text className="text-gray-600 text-xl">Nessuna attività</Text>
            <Text className="text-gray-600 text-md mt-2">
              Aggiungi una nuova attività per iniziare
            </Text>
          </View>
        }
      />

      {stats.completed > 0 && (
        <View className="absolute bottom-6 left-0 right-0 items-center">
          <TouchableOpacity
            onPress={handleClearCompleted}
            className="bg-red-500 px-6 py-3 rounded-full shadow-lg"
          >
            <Text className="text-white font-bold">Elimina completate</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="absolute bottom-10 right-5 items-end">
        <Animated.View
          style={{
            opacity: menuAnim,
            transform: [
              {
                translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View className="gap-y-2 mb-3 items-end">
            <Link onPress={()=>setToggleMenu(false)} href="/sleep-schedule" asChild>
              <TouchableOpacity className="bg-blue-200 rounded-full px-3 py-2">
                <Text className="text-4xl pb-1 px-[3px]">
                  🥱<Text className="text-[18px]"> Sleeping Schedule</Text>
                </Text>
              </TouchableOpacity>
            </Link>

            {changingBgVisible ? (
              <Animated.View
                className="items-center gap-3 flex flex-row bg-green-700 py-2 px-3 rounded-full"
                style={{
                  opacity: changingBgAnim,
                  transform: [
                    {
                      translateX: changingBgAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [60, 0],
                      }),
                    },
                    {
                      scale: changingBgAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                }}
              >
                <View
                  className="w-[30px] h-[30px] rounded-full border-2 border-transparent animate-spin"
                  style={{
                    borderTopColor: "#cecfffff",
                    borderRightColor: "#cecfffff",
                  }}
                />
                <Text className="text-2xl text-white">
                  Aggiornando lo sfondo
                </Text>
              </Animated.View>
            ) : (
              <TouchableOpacity
                className="bg-green-600 rounded-full py-[8px] px-3 w-100"
                onPress={handleChangeBackground}
              >
                <Text className="text-3xl pb-1">
                  🖼️<Text className="text-xl"> Change Background</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <TouchableOpacity
          onPress={() => setToggleMenu((prev) => !prev)}
          className="bg-blue-600/90 rounded-full px-[8px] pb-[5px] pt-[7px]"
        >
          <Animated.Text
            className="text-5xl text-white"
            style={{
              transform: [
                {
                  rotate: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
            }}
          >
            ☰
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

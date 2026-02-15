import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
} from "react-native";
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
import { Asset } from "expo-asset";
import * as Haptics from "expo-haptics";
import { BackgroundContext, BACKGROUNDS, THUMB_BACKGROUNDS } from "./_layout";

export default function Home() {
  useEffect(() => {
    Asset.loadAsync([...BACKGROUNDS, ...THUMB_BACKGROUNDS]).catch(() => {});
  }, []);
  //states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [showChangingBg, setShowChangingBg] = useState<boolean>(false);
  const [changingBgVisible, setChangingBgVisible] = useState<boolean>(false);
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [toggleBackgroundGrid, setToggleBackgroundGrid] =
    useState<boolean>(false);
  const [showTrash, setShowTrash] = useState<boolean>(false);
  const [trashDisabled, setTrashDisabled] = useState<boolean>(false);

  //overlay animation
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayAnim, {
      toValue: toggleMenu || toggleBackgroundGrid ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [toggleMenu, toggleBackgroundGrid, overlayAnim]);

  const background = useContext(BackgroundContext);
  const changingBgAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  //Ref per tenere traccia dell'ultimo swipe aperto
  const currentSwipeableRef = useRef<any>(null);

  //funzione per gestire l'apertura di un nuovo swipe
  const handleSwipeOpen = (ref: any) => {
    if (currentSwipeableRef.current && currentSwipeableRef.current !== ref) {
      currentSwipeableRef.current.close();
    }
    currentSwipeableRef.current = ref;
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
        `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${
          month.charAt(0).toUpperCase() + month.slice(1)
        }`,
    );
  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };
  2;

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, []),
  );

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      if (!todo.completed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
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
    Alert.alert("Conferma", "Vuoi eliminare tutte le attività completate?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: async () => {
          const newTodos = await clearCompletedTodos();
          setTodos(newTodos);
        },
      },
    ]);
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

  useEffect(() => {
    if (stats.completed) {
      setShowTrash(true);
    } else {
      setShowTrash(false);
    }
  }, [stats]);

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

  const handleSelectBackground = (idx: number) => {
    if (!background) return;
    background.set(idx);
    setToggleBackgroundGrid(false);
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

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: toggleMenu ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [toggleMenu, menuAnim]);

  return (
    <SafeAreaView
      className="flex-1 px-5 relative brightness-10"
      edges={["top"]}
    >
      <View className="pt-4 px-1 flex-row justify-between items-center bg-transparent ">
        <Text className="leading-none text-5xl font-bold text-white">
          Attività di oggi
        </Text>
        <Link href="/add" onPress={() => setToggleMenu(false)} asChild>
          <TouchableOpacity className="bg-blue-600 mt-2 px-4 py-[8px] rounded-full mb-3">
            <Text className="text-white text-xl font-bold">+</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Dark Overlay when menu is active */}
      <Animated.View
        pointerEvents={toggleMenu || toggleBackgroundGrid ? "auto" : "none"}
        style={{
          opacity: overlayAnim,
        }}
        className="absolute inset-0 bg-black/80 z-10 w-[200%] h-[200%] -top-20 -left-20"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={() => {
            setToggleMenu(false);
            setToggleBackgroundGrid(false);
          }}
        />
      </Animated.View>

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
            onSwipeStart={handleSwipeOpen}
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

      <View className="absolute bottom-5 right-5 items-center flex-row z-20">
        {showTrash && (
          <>
            <View
              className={`absolute items-center 
              ${toggleBackgroundGrid ? "bottom-0 left-3 opacity-20" : "bottom-20 right-0"}`}
            >
              <TouchableOpacity
                disabled={toggleBackgroundGrid}
                onPress={handleClearCompleted}
                className="py-4 rounded-full shadow-lg"
              >
                <Image
                  className="size-[46px]"
                  source={require("../assets/bin.png")}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        <Animated.View
          style={{
            opacity: menuAnim,
            transform: [
              {
                translateX: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View className="gap-x-1 me-1 flex-row mb-4">
            <View className="gap-y-2">
              <Link
                onPress={() => setToggleMenu(false)}
                href="/sleep-schedule"
                asChild
              >
                <TouchableOpacity className="bg-pink-500 rounded-full px-3 py-2">
                  <Text className="text-xl px-[3px] text-white">
                    Sleeping Schedule
                  </Text>
                </TouchableOpacity>
              </Link>

              <Link onPress={() => setToggleMenu(false)} href="/" asChild>
                <TouchableOpacity className="bg-green-700 rounded-full px-3 py-2">
                  <Text className="text-xl px-[3px] text-white">
                    Coming Soon
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View className="gap-y-2">
              <Link
                onPress={() => setToggleMenu(false)}
                href="/daily-routine"
                asChild
              >
                <TouchableOpacity className="bg-green-700 rounded-full px-3 py-2">
                  <Text className="text-xl px-[3px] text-white">
                    Daily Routine
                  </Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                className="bg-green-700 rounded-full py-2 px-3 w-100"
                onPress={() => {
                  setToggleBackgroundGrid((prev) => !prev);
                  setToggleMenu(false);
                }}
              >
                <Text className="text-xl px-[3px] text-white">Cambia Background</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <TouchableOpacity
          onPress={() => {
            if (toggleBackgroundGrid) {
              setToggleBackgroundGrid(false);
            } else {
              setToggleMenu((prev) => !prev);
            }
            //setToggleBackgroundGrid(false);
          }}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.51,
            shadowRadius: 13.16,
            elevation: 20,
          }}
          className={`bg-blue-600/90 rounded-full mb-[11px]
              ${toggleMenu || toggleBackgroundGrid ? "px-[15px] py-[10px] " : "px-[8px] pb-[5px] pt-[7px]"}`}
        >
          <Animated.Text
            className={`${toggleMenu || toggleBackgroundGrid ? "text-3xl" : "text-5xl"} text-white hamburger`}
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
            {toggleMenu || toggleBackgroundGrid ? "✕" : "☰"}
          </Animated.Text>
        </TouchableOpacity>
      </View>
      {toggleBackgroundGrid && (
        <View className="absolute bottom-20 mb-10 right-6 shadow h-[300px] w-[350px] bg-white/30 rounded-2xl pe-4 z-30">
          <FlatList
            data={THUMB_BACKGROUNDS}
            numColumns={4}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className="m-1 rounded-xl overflow-hidden"
                onPress={() => handleSelectBackground(index)}
              >
                <Image
                  source={item}
                  className="size-[75px]"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: 8 }}
            ListEmptyComponent={
              <View className="items-center justify-center p-5 bg-gray-200/90 rounded-xl">
                <Text className="text-gray-600 text-xl">
                  Non sono disponibili backgrounds
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

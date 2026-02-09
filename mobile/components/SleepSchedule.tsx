import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getSleepResults,
  saveSleepResults,
  clearSleepResults,
  getActiveSleepSession,
  saveActiveSleepSession,
  clearActiveSleepSession,
} from "../utils/storage";
import { SleepResult } from "../types";

const formatDuration = (diffMs: number) => {
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(hours)}h:${pad(minutes)}m`;
};

const formatDateLabel = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });

  const getOrdinalSuffix = (n: number) => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month}`;
};

const formatTimeLabel = (date: Date) => {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SleepSchedule() {
  const [timeSpentSleeping, setTimeSpentSleeping] = useState<null | string>(
    null,
  );
  const [sleepStart, setSleepStart] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString("it-IT"),
  );
  const [results, setResults] = useState<SleepResult[]>([]);

  const handleSleepStart = () => {
    if (!sleepStart) {
      const start = new Date();
      setCurrentTime(start.toLocaleTimeString("it-IT"));
      setSleepStart(start);
      setTimeSpentSleeping("00h:00m");
      saveActiveSleepSession({ startedAt: start.toISOString() });
    }
  };

  const handleWakeUp = () => {
    if (sleepStart) {
      const sleepEnd = new Date();
      const diffMs = sleepEnd.getTime() - sleepStart.getTime();
      const formatted = formatDuration(diffMs);
      setTimeSpentSleeping(formatted);
      const dateLabel = formatDateLabel(sleepStart);
      const result: SleepResult = {
        id: `${sleepStart.getTime()}`,
        dateLabel,
        duration: formatted,
        startTime: formatTimeLabel(sleepStart),
        endTime: formatTimeLabel(sleepEnd),
      };
      setResults((prev) => [...prev, result]);
      setSleepStart(null);
      setTimeSpentSleeping(null);
      clearActiveSleepSession();
    }
  };

  useEffect(() => {
    if (sleepStart) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("it-IT"));
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepStart]);

  useEffect(() => {
    if (!sleepStart) return;

    const update = () => {
      const diffMs = Date.now() - sleepStart.getTime();
      setTimeSpentSleeping(formatDuration(diffMs));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [sleepStart]);

  const isSleeping = sleepStart !== null;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortSleepResults = (items: SleepResult[]) =>
    [...items].sort((a, b) => Number(b.id) - Number(a.id));

  useEffect(() => {
    const restoreActiveSession = async () => {
      const active = await getActiveSleepSession();
      if (!active) return;

      const startDate = new Date(active.startedAt);
      if (Number.isNaN(startDate.getTime())) {
        await clearActiveSleepSession();
        return;
      }

      setSleepStart(startDate);
      const diffMs = Date.now() - startDate.getTime();
      setTimeSpentSleeping(formatDuration(diffMs));
    };

    restoreActiveSession();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      const storedResults = await getSleepResults();
      setResults(sortSleepResults(storedResults));
    };
    loadResults();
  }, []);

  useEffect(() => {
    const persistResults = async () => {
      await saveSleepResults(results);
    };
    persistResults();
  }, [results]);

  const deleteSleepSchedule = (id: string) => {
    Alert.alert("Conferma", "Vuoi eliminare questa sessione di sonno?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => {
          setResults((prev) => prev.filter((result) => result.id !== id));
          setExpandedId((prev) => (prev === id ? null : prev));
        },
      },
    ]);
  };

  const handleClearAllSleepResults = () => {
    if (!results.length) return;

    Alert.alert("Conferma", "Vuoi eliminare tutte le sessioni registrate?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina tutto",
        style: "destructive",
        onPress: async () => {
          await clearSleepResults();
          setResults([]);
          setExpandedId(null);
        },
      },
    ]);
  };

  const getMinutesFromDuration = (duration: string | null) => {
    if (!duration) return 0;
    const match = duration.match(/^(\d{2})h:(\d{2})m$/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  };

  const handleShowAverageSleep = () => {
    if (!results.length) return;
    const totalMinutes = results.reduce((sum, item) => {
      return sum + getMinutesFromDuration(item.duration);
    }, 0);
    const averageMinutes = Math.round(totalMinutes / results.length);
    const hours = Math.floor(averageMinutes / 60);
    const minutes = averageMinutes % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${pad(hours)}h:${pad(minutes)}m`;

    Alert.alert(
      "Media sonno",
      `Media delle ultime ${results.length} notti: ${formatted}`,
    );
  };

  return (
    <View className="flex flex-col">
      <Text className="text-[3.2rem] mx-auto font-black text-white py-4 px-2 mt-4">
        SLEEP SCHEDULE
      </Text>
      <View className="buttons w-100 flex flex-col mt-5">
        <TouchableOpacity
          disabled={isSleeping}
          className={`${isSleeping ? "bg-gray-800 py-8" : "bg-pink-400 py-16"} mx-auto w-[75%] rounded-3xl`}
          onPress={handleSleepStart}
          onLongPress={handleClearAllSleepResults}
        >
          {isSleeping ? (
            <Text className="font-bold text-[2rem] text-white/60 text-center">
              Went to sleep:
            </Text>
          ) : (
            <Text className="font-bold text-[4rem] text-white text-center">
              Okay, bye
            </Text>
          )}
          <Text className="text-[3rem] text-pink-200 font-bold text-center">
            {currentTime}
          </Text>
        </TouchableOpacity>

        {timeSpentSleeping ? (
          <Text className="text-[5rem] mx-auto font-black text-white p-4 mt-6">
            {timeSpentSleeping}
          </Text>
        ) : null}

        <TouchableOpacity
          disabled={!isSleeping}
          className={`${!isSleeping ? "bg-gray-800 py-8 opacity-40" : "bg-blue-300 py-16"} mt-6 mx-auto w-[75%] rounded-3xl`}
          onPress={handleWakeUp}
          onLongPress={handleShowAverageSleep}
        >
          <Text className="font-semibold text-[3rem] text-center">
            Shit, wake up!
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className={`bg-white/10 rounded-xl ${isSleeping && "rounded-b-[40px]"} mt-14 max-h-[25vh]`}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const minutesSlept = getMinutesFromDuration(item.duration);

            const sleepQuality =
              minutesSlept >= 450 //7 ore e mezza
                ? "text-green-500"
                : minutesSlept < 360 //6 ore
                  ? "text-orange-500"
                  : "text-white";

            return (
              <TouchableOpacity
                className="mx-auto my-2"
                onPress={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
                onLongPress={() => deleteSleepSchedule(item.id)}
              >
                <Text
                  className={`${sleepQuality} text-[22px] text-center`}
                >
                  {item.dateLabel}: {item.duration}
                </Text>
                {expandedId === item.id && item.startTime && item.endTime ? (
                  <Text className={`${sleepQuality} text-lg text-center mt-1`}>
                    {item.startTime} → {item.endTime}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text className="text-xl text-white font-semibold text-center py-4">
              No schedule registered
            </Text>
          }
          contentContainerStyle={{ paddingVertical: 16 }}
        />
        {results.length > 0 && (
          <Text className="text-md text-white/20 mt-5 ps-2 pb-[2px] text-center">
            Premi per dettaglio, mantieni per eliminare
          </Text>
        )}
      </View>
    </View>
  );
}

import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../types';
import { getRoutineItems, addRoutineItem, updateRoutineItem, deleteRoutineItem } from '../utils/storage';

export default function RoutineConfig() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [duration, setDuration] = useState<string>('');
  
  const router = useRouter();

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const items = await getRoutineItems();
    setRoutines(items);
  };

  const openModal = (routine?: Routine) => {
    if (routine) {
      setEditingRoutine(routine);
      setText(routine.text);
      setPriority(routine.priority);
      setDuration(routine.duration ? routine.duration.toString() : '');
    } else {
      setEditingRoutine(null);
      setText('');
      setPriority('medium');
      setDuration('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingRoutine(null);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Errore', 'Inserisci il nome della routine');
      return;
    }

    const durationNum = duration ? parseInt(duration) : 0;

    if (editingRoutine) {
      const updatedRoutine: Routine = {
        ...editingRoutine,
        text: text.trim(),
        priority,
        duration: durationNum,
      };
      const newRoutines = await updateRoutineItem(updatedRoutine);
      setRoutines(newRoutines);
    } else {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority,
        duration: durationNum,
      };
      const newRoutines = await addRoutineItem(newRoutine);
      setRoutines(newRoutines);
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Elimina Routine",
      "Sei sicuro di voler eliminare questa routine?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive",
          onPress: async () => {
            const newRoutines = await deleteRoutineItem(id);
            setRoutines(newRoutines);
          }
        }
      ]
    );
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <View className="bg-white/90 p-4 mb-3 rounded-xl flex-row items-center justify-between border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.text}</Text>
        <View className="flex-row mt-1">
          <View className={`px-2 py-0.5 rounded mr-2 ${
            item.priority === 'high' ? 'bg-red-100' : 
            item.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <Text className={`text-xs font-medium ${
              item.priority === 'high' ? 'text-red-700' : 
              item.priority === 'medium' ? 'text-yellow-700' : 'text-green-700'
            }`}>
              {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Bassa'}
            </Text>
          </View>
          {item.duration > 0 && (
            <View className="bg-blue-100 px-2 py-0.5 rounded">
              <Text className="text-xs font-medium text-blue-700">{item.duration} min</Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={() => openModal(item)} 
          className="p-2 bg-gray-100 rounded-full mr-2"
        >
          <Ionicons name="pencil" size={20} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)} 
          className="p-2 bg-red-50 rounded-full"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1 px-4">
        <View className="py-4 flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text className="text-white text-lg ml-1">Indietro</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Configura Routine</Text>
          <View className="w-16" /> 
        </View>

        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={renderRoutineItem}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-400 text-lg text-center">Nessuna routine configurata.</Text>
              <Text className="text-gray-500 text-sm text-center mt-2">Aggiungi le tue attività ricorrenti.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity
          onPress={() => openModal()}
          className="absolute bottom-10 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <View className="bg-white rounded-t-3xl h-[80%] p-6 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                  {editingRoutine ? 'Modifica Routine' : 'Nuova Routine'}
                </Text>
                <TouchableOpacity onPress={closeModal} className="p-2 bg-gray-100 rounded-full">
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-gray-600 text-base mb-2 font-medium">Nome attività</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 h-[50px] py-2 px-3 rounded-xl text-lg mb-6 text-gray-800"
                  placeholder="es. Leggere un libro"
                  value={text}
                  onChangeText={setText}
                  autoFocus={!editingRoutine}
                />

                <Text className="text-gray-600 text-base mb-2 font-medium">Priorità</Text>
                <View className="flex-row mb-6">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      className={`flex-1 mr-2 last:mr-0 p-3 rounded-xl border ${
                        priority === p
                          ? p === 'high' ? 'bg-red-100 border-red-500' :
                            p === 'medium' ? 'bg-yellow-100 border-yellow-500' :
                            'bg-green-100 border-green-500'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold capitalize ${
                          priority === p
                            ? p === 'high' ? 'text-red-700' :
                              p === 'medium' ? 'text-yellow-700' :
                              'text-green-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Bassa'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text className="text-gray-600 text-base mb-2 font-medium">Durata (minuti)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 h-[50px] py-2 px-3 rounded-xl text-lg mb-8 text-gray-800"
                  placeholder="es. 30"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                />

                <TouchableOpacity 
                  onPress={handleSave} 
                  className="bg-blue-600 p-4 rounded-xl items-center shadow-md mb-8"
                >
                  <Text className="text-white font-bold text-lg">Salva Routine</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

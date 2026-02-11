import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { addTodo } from '../utils/storage';
import { Todo } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTodo() {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const router = useRouter();

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Errore', 'Inserisci un’attività');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };

    await addTodo(newTodo);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 px-3">
      <View className="p-4 px-6 border-b border-gray-200 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="bg-white text-red-600 rounded-full p-2 px-3 text-sm">Annulla</Text>
        </TouchableOpacity>
        <Text className="text-5xl font-bold text-white">Nuova attività</Text>
      </View>

      <View className="p-6">
        <Text className="text-white text-lg mb-2 font-medium">Cosa bisogna fare?</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 h-[50px] py-2 px-3 pb-4 rounded-xl text-lg mb-6"
          placeholder="es. Fare la spesa"
          value={text}
          onChangeText={setText}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <Text className="text-white text-lg mb-2 font-medium">Priorità</Text>
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setPriority('low')}
            className={`flex-1 mr-2 p-3 rounded-xl border ${
              priority === 'low'
                ? 'bg-green-100 border-green-500'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                priority === 'low' ? 'text-green-700' : 'text-gray-700'
              }`}
            >
              Bassa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority('medium')}
            className={`flex-1 mr-2 p-3 rounded-xl border ${
              priority === 'medium'
                ? 'bg-yellow-100 border-yellow-500'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                priority === 'medium' ? 'text-yellow-700' : 'text-gray-700'
              }`}
            >
              Media
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority('high')}
            className={`flex-1 p-3 rounded-xl border ${
              priority === 'high'
                ? 'bg-red-100 border-red-500'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                priority === 'high' ? 'text-red-700' : 'text-gray-700'
              }`}
            >
              Alta
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSave} className="bg-blue-600 p-4 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">Crea attività</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

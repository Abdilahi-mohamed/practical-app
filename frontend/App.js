import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-200">
      <Text className="text-3xl font-bold underline text-gray-800">
        Hello, Tailwind CSS!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
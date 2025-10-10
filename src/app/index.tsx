import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Link href='/camera' className=' text-white'>
        Open Camera
      </Link>
    </View>
  );
}

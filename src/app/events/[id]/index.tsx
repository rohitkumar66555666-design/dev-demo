import { View, Text, Pressable, FlatList } from 'react-native';
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getEvent } from '../../../api/events';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router"
import AssetItem from '../../../components/AssetItem';


export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
  });

  

  if (isLoading) {
    return (
      <View className='flex-1 bg-black justify-center items-center'>
        <Text className='text-white'>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 bg-black justify-center items-center'>
        <Text className='text-white'>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-black'>
      <Stack.Screen options={{ title: event.name}} />

      <FlatList
      data={event.assets}
      renderItem={({ item }) => <AssetItem asset={item} />}
      />
      <Link href={`/events/${id}/camera`} asChild>
        <Pressable className='absolute bottom-10 right-4 flex-row items-center justify-center bg-white p-6 rounded-full'>
          <Ionicons name='camera-outline' size={40} color='black' />
        </Pressable>
      </Link>
    </View>
  );
}
export async function getEvents() {
  const { data } = await supabase.from("events").select("*").throwOnError();
  return data;
}


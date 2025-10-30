import { Text, View, Pressable } from 'react-native';
import { Tables } from '../types/database.types';
import { Link } from 'expo-router';

type Event = Tables<'events'>;

type EventListItemProps = {
  event: Event;
};

export default function EventListItem({ event }: EventListItemProps) {
  return (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable>
        <View className='bg-neutral-800 p-4 mb-2'>
          <Text className='text-white text-lg'>{event.name}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

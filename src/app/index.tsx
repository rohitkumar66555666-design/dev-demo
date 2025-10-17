import { View } from 'react-native';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  useEffect(() => {
    supabase
      .from('events')
      .select('* assests(*)')
      .then((data) => console.log(JSON.stringify(data, null, 2)));
  }, []);

  return (
    <View className='flex-1 justify-center items-center gap-4'>
      <Link href='/camera' className=' text-white'>
        Open Camera
      </Link>

      <Link href='/event' className='text-white'>
      Event Details
      </Link>
    </View>
  );
}
          
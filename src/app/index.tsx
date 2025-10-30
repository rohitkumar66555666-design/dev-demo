import { useEffect, useState } from 'react';
import { Alert, View, Text, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { supabase } from '../lib/supabase';
import { Link } from 'expo-router';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      Alert.alert('Error fetching events', error.message);
    } else {
      setEvents(data);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const addEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert('Validation', 'Event name is required.');
      return;
    }
    setAdding(true);
    const { error } = await supabase.from('events').insert([
      { name: eventName.trim(), title: eventName.trim() }
    ]);
    setAdding(false);
    if (error) {
      Alert.alert('Add Event Error', error.message);
    } else {
      setEventName('');
      fetchEvents();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 16 }}>
      {/* --- Add Event Form --- */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>Add Event</Text>
        <TextInput
          value={eventName}
          onChangeText={setEventName}
          placeholder="Event name"
          placeholderTextColor="#999"
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#333'
          }}
        />
        <Button title={adding ? 'Adding...' : 'Add Event'} onPress={addEvent} disabled={adding} />
      </View>

      {/* --- Event List --- */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/events/${item.id}`}>
            <TouchableOpacity>
              <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#333' }}>
                <Text style={{ fontSize: 18, color: 'white' }}>{item.name}</Text>
                {/* Optionally show more details */}
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ color: 'white', textAlign: 'center' }}>No events found.</Text>}
      />
    </View>
  );
}
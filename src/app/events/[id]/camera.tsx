import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase'; // Adjust path if needed
import { useLocalSearchParams } from 'expo-router';

// This function fetches the asset paths from the database
const fetchEventAssets = async (eventId: string) => {
  if (!eventId) {
    return [];
  }
  
  // Fetch all assets linked to the eventId
  const { data, error } = await supabase
    .from('assets')
    .select('asset_id') // 'asset_id' is the column with the image path
    .eq('event_id', eventId);

  if (error) {
    throw new Error(error.message);
  }

  // Now, create public URLs for each asset
  const photoPromises = data.map((asset) => {
    const { data: urlData } = supabase.storage
      .from('photo') // Your bucket name
      .getPublicUrl(asset.asset_id);
      
    return {
      id: asset.asset_id, // Use the path as a unique key for the list
      url: urlData.publicUrl
    };
  });
  
  return Promise.all(photoPromises);
};

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // useQuery to fetch and cache the list of assets
  const { data: photos, isLoading, error } = useQuery({
    queryKey: ['event-assets', id], // A unique key for this query
    queryFn: () => fetchEventAssets(id!),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading Photos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Failed to load photos: {error.message}</Text>
      </View>
    );
  }
  
  if (!photos || photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No photos have been uploaded for this event yet.</Text>
      </View>
    );
  }

  // Render the list of photos using FlatList
  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Image source={{ uri: item.url }} style={styles.image} />}
      numColumns={numColumns}
      contentContainerStyle={styles.listContainer}
    />
  );
}

// Styles for the grid display
const numColumns = 2;
const imageSize = Dimensions.get('window').width / numColumns - 1; // Subtract 1 for margin

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    // Add any styles for the FlatList container itself
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 0.5,
  },
});

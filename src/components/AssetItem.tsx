import React from 'react';
import { View, Image, StyleSheet, Text, useWindowDimensions } from 'react-native';

export default function DisplayPhotoComponent() {
  const { width } = useWindowDimensions();

  // The specific signed URL you provided
  const imageUrl = "https://supabase.com/dashboard/project/ljcxswgrxjauwxcqjgsu/storage/files/buckets/photo";

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        // The width and height are required for the image to be visible
       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    height: 400, // You can adjust the height as you like
    borderRadius: 12,
    backgroundColor: '#333', // A placeholder color while the image loads
  },
});

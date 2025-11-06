import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';

export default function ShareEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventUrl = `https://your-app.com/events/${id}`; // Replace with your deployed event URL

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Share Event with your friends</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={eventUrl}
          size={220}
          backgroundColor='white'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: { color: "white", fontSize: 18, marginBottom: 28, marginTop: -100 },
  qrContainer: { backgroundColor: "white", borderRadius: 20, padding: 16 }
});


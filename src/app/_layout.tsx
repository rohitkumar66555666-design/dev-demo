// app/_layout.tsx
import "../../global.css"
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Event',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="camera"
          options={{
            title: 'Camera',
            headerBackButtonDisplayMode: "minimal",
            headerBlurEffect: 'dark',
            headerRight: () => (
              <Link href="/" className="mr-2 ml-2">
                <Ionicons name="share-outline" size={24} color="white" />
              </Link>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

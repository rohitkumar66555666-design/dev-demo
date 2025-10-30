// app/_layout.tsx
import "../../global.css";
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '../lib/supabase';
import AuthProvider from '../provider/authprovider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'Event',
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
            name="events/[id]"
            options={{
              title: 'Event',
              headerLargeTitle: true,
              headerBackButtonDisplayMode: "minimal",
            }}
            />
            
            <Stack.Screen 
              name="events/[id]/camera"
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
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

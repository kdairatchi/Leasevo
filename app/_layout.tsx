import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/hooks/useAuth";
import { PropertiesProvider } from "@/hooks/useProperties";
import { PaymentsProvider } from "@/hooks/usePayments";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ presentation: "modal", title: "Make Payment" }} />
      <Stack.Screen name="property-details" options={{ title: "Property Details" }} />
      <Stack.Screen name="maintenance-request" options={{ presentation: "modal", title: "Maintenance Request" }} />
      <Stack.Screen name="chat" options={{ title: "Messages" }} />
      <Stack.Screen name="landlord-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="invite" options={{ presentation: 'modal', title: 'Generate Invite' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PropertiesProvider>
          <PaymentsProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </PaymentsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
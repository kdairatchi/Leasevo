import { Tabs } from "expo-router";
import { Home, CreditCard, Wrench, MessageSquare, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { theme } from "@/constants/theme";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray[500],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : theme.colors.white,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 60,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
            web: {
              boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20px)',
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(payments)"
        options={{
          title: "Payments",
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(maintenance)"
        options={{
          title: "Maintenance",
          tabBarIcon: ({ color }) => <Wrench size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(messages)"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
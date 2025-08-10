import { Stack } from 'expo-router';

export default function MaintenanceLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Maintenance' }} />
    </Stack>
  );
}
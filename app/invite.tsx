import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import * as Clipboard from 'expo-clipboard';

export default function InviteScreen() {
  const [lastCode, setLastCode] = useState<string>('');
  const baseUrl = useMemo(() => {
    return Platform.select({
      web: typeof window !== 'undefined' ? window.location.origin : 'https://landlordly.app',
      default: 'https://landlordly.app'
    }) as string;
  }, []);

  const generateCode = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setLastCode(code);
    return code;
  };

  const handleGenerate = async () => {
    const code = generateCode();
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const invitesJson = await AsyncStorage.getItem('invites');
      const invites: { code: string; used?: boolean }[] = invitesJson ? JSON.parse(invitesJson) : [];
      invites.push({ code, used: false });
      await AsyncStorage.setItem('invites', JSON.stringify(invites));
      const link = `${baseUrl}/(auth)/signup?invite=${code}`;
      await Clipboard.setStringAsync(link);
      Alert.alert('Invite Created', 'Link copied to clipboard. Send it to your tenant.');
    } catch (e) {
      Alert.alert('Error', 'Could not save invite.');
    }
  };

  const handleOpenSignup = () => {
    if (!lastCode) {
      Alert.alert('No Code', 'Generate an invite code first.');
      return;
    }
    router.push({ pathname: '/(auth)/signup', params: { invite: lastCode } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Generate Tenant Invite' }} />
      <Card style={styles.card}>
        <Text style={styles.title}>Tenant Invite Link</Text>
        <Text style={styles.subtitle}>Generate a one-time link for tenants to create an account.</Text>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{lastCode || '------'}</Text>
        </View>
        <Button title="Generate Invite" onPress={handleGenerate} size="large" style={styles.button} testID="generateInvite" />
        <Button title="Open Signup with Code" onPress={handleOpenSignup} variant="outline" size="large" />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.gray[200],
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  code: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: 4,
    color: theme.colors.primary,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
});
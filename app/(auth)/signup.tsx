import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Home, Building } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function SignupScreen() {
  const params = useLocalSearchParams<{ invite?: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState<string>(typeof params.invite === 'string' ? params.invite : '');
  const [role, setRole] = useState<'tenant' | 'landlord'>(inviteCode ? 'tenant' : 'tenant');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      if (role === 'tenant') {
        const invitesRaw = await import('react-native').then(() => null);
      }
    } catch {}

    setLoading(true);
    try {
      if (role === 'tenant') {
        if (!inviteCode) {
          Alert.alert('Invite Required', 'Tenants must use an invite link from a property manager.');
          setLoading(false);
          return;
        }
        const stored = await import('@react-native-async-storage/async-storage');
      }
    } catch {}

    try {
      if (role === 'tenant') {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const invitesJson = await AsyncStorage.getItem('invites');
        const invites: Array<{ code: string; used?: boolean }> = invitesJson ? JSON.parse(invitesJson) : [];
        const found = invites.find(i => i.code === inviteCode && !i.used);
        if (!found) {
          Alert.alert('Invalid Invite', 'Your invite link is invalid or has been used.');
          setLoading(false);
          return;
        }
        found.used = true;
        await AsyncStorage.setItem('invites', JSON.stringify(invites));
      }

      await signup(email, password, name, role);
      router.replace('/(tabs)/(home)');
    } catch {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryDark]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Landlordly today</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.roleSelector}>
                <Text style={styles.roleLabel}>I am a:</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'tenant' && styles.roleButtonActive,
                    ]}
                    onPress={() => setRole('tenant')}
                    disabled={!!inviteCode}
                  >
                    <Home size={20} color={role === 'tenant' ? theme.colors.white : theme.colors.primary} />
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === 'tenant' && styles.roleButtonTextActive,
                      ]}
                    >
                      Tenant
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'landlord' && styles.roleButtonActive,
                    ]}
                    onPress={() => setRole('landlord')}
                  >
                    <Building size={20} color={role === 'landlord' ? theme.colors.white : theme.colors.primary} />
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === 'landlord' && styles.roleButtonTextActive,
                      ]}
                    >
                      Landlord
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={20} color={theme.colors.gray[500]} />}
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={theme.colors.gray[500]} />}
              />

              {role === 'tenant' && (
                <Input
                  label="Invite Code"
                  placeholder="Paste your invite code"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  leftIcon={<User size={20} color={theme.colors.gray[500]} />}
                />
              )}

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon={<Lock size={20} color={theme.colors.gray[500]} />}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                leftIcon={<Lock size={20} color={theme.colors.gray[500]} />}
              />

              <Button
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                size="large"
                style={styles.signupButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  roleSelector: {
    marginBottom: theme.spacing.lg,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  roleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  roleButtonTextActive: {
    color: theme.colors.white,
  },
  signupButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.gray[600],
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
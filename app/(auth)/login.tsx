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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Home, Apple, Chrome } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithApple, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/(home)');
    } catch {
      Alert.alert('Error', 'Invalid credentials. Try john.landlord@example.com or sarah.tenant@example.com');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'tenant' | 'landlord') => {
    setLoading(true);
    try {
      if (role === 'landlord') {
        await login('john.landlord@example.com', 'password');
      } else {
        await login('sarah.tenant@example.com', 'password');
      }
      router.replace('/(tabs)/(home)');
    } catch {
      Alert.alert('Error', 'Failed to login');
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
              <View style={styles.logoContainer}>
                <Home size={48} color={theme.colors.white} />
              </View>
              <Text style={styles.title}>Landlordly</Text>
              <Text style={styles.subtitle}>Modern Rent Management</Text>
            </View>

            <View style={styles.formContainer}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={theme.colors.gray[500]} />}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon={<Lock size={20} color={theme.colors.gray[500]} />}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                size="large"
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.oauthRow}>
                <Button
                  title="Sign in with Apple"
                  onPress={async () => {
                    try {
                      await loginWithApple();
                      router.replace('/(tabs)/(home)');
                    } catch (e) {
                      Alert.alert('Apple Sign-In', 'Not configured. Using demo.');
                      handleDemoLogin('tenant');
                    }
                  }}
                  variant="outline"
                  size="large"
                  style={styles.oauthButton}
                  testID="appleSignIn"
                />
                <Button
                  title="Sign in with Google"
                  onPress={async () => {
                    try {
                      await loginWithGoogle();
                      router.replace('/(tabs)/(home)');
                    } catch (e) {
                      Alert.alert('Google Sign-In', 'Not configured. Using demo.');
                      handleDemoLogin('tenant');
                    }
                  }}
                  variant="outline"
                  size="large"
                  style={styles.oauthButton}
                  testID="googleSignIn"
                />
              </View>

              <View style={styles.demoButtons}>
                <Button
                  title="Demo Tenant"
                  onPress={() => handleDemoLogin('tenant')}
                  variant="outline"
                  size="medium"
                  style={styles.demoButton}
                  testID="demoTenant"
                />
                <Button
                  title="Demo Landlord"
                  onPress={() => handleDemoLogin('landlord')}
                  variant="outline"
                  size="medium"
                  style={styles.demoButton}
                  testID="demoLandlord"
                />
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don&apos;t have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                  <Text style={styles.signupLink}>Sign Up</Text>
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
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 36,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  loginButton: {
    marginBottom: theme.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.gray[500],
    fontSize: 14,
  },
  oauthRow: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  oauthButton: {
    width: '100%',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  demoButton: {
    flex: 0.48,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: theme.colors.gray[600],
    fontSize: 14,
  },
  signupLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
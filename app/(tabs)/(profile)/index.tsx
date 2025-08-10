import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User,
  Bell,
  Shield,
  CreditCard,
  FileText,
  HelpCircle,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout, switchRole } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(user?.twoFactorEnabled || false);
  const [autopay, setAutopay] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const handleSwitchRole = () => {
    Alert.alert(
      'Switch Role',
      `Switch to ${user?.role === 'tenant' ? 'Landlord' : 'Tenant'} view?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch', 
          onPress: () => {
            switchRole();
            router.replace('/(tabs)/(home)');
          }
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color={theme.colors.gray[600]} />,
          label: 'Personal Information',
          onPress: () => {},
        },
        {
          icon: <CreditCard size={20} color={theme.colors.gray[600]} />,
          label: 'Payment Methods',
          onPress: () => {},
        },
        {
          icon: <FileText size={20} color={theme.colors.gray[600]} />,
          label: 'Documents',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} color={theme.colors.gray[600]} />,
          label: 'Notifications',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: <Shield size={20} color={theme.colors.gray[600]} />,
          label: 'Two-Factor Authentication',
          toggle: true,
          value: twoFactor,
          onToggle: setTwoFactor,
        },
        ...(user?.role === 'tenant' ? [{
          icon: <CreditCard size={20} color={theme.colors.gray[600]} />,
          label: 'Autopay',
          toggle: true,
          value: autopay,
          onToggle: setAutopay,
        }] : []),
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color={theme.colors.gray[600]} />,
          label: 'Help Center',
          onPress: () => {},
        },
        {
          icon: <FileText size={20} color={theme.colors.gray[600]} />,
          label: 'Terms & Privacy',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role === 'landlord' ? 'Landlord' : 'Tenant'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {settingSections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Card style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex < section.items.length - 1 && styles.settingItemBorder,
                    ]}
                    onPress={'onPress' in item ? item.onPress : undefined}
                    disabled={'toggle' in item}
                  >
                    <View style={styles.settingLeft}>
                      {item.icon}
                      <Text style={styles.settingLabel}>{item.label}</Text>
                    </View>
                    {'toggle' in item ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ 
                          false: theme.colors.gray[300], 
                          true: theme.colors.primary 
                        }}
                      />
                    ) : (
                      <ChevronRight size={20} color={theme.colors.gray[400]} />
                    )}
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}

          <View style={styles.actions}>
            <Button
              title="Switch to Landlord View"
              onPress={handleSwitchRole}
              variant="outline"
              size="large"
              style={styles.actionButton}
            />
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="ghost"
              size="large"
              style={styles.actionButton}
              textStyle={{ color: theme.colors.error }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.full,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});
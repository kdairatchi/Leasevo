import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, Bot, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { mockUsers, mockMessages } from '@/mocks/data';

interface Conversation {
  id: string;
  user: typeof mockUsers[0];
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const isLandlord = user?.role === 'landlord';

  const conversations: Conversation[] = [
    {
      id: '1',
      user: isLandlord ? mockUsers[1] : mockUsers[0],
      lastMessage: mockMessages[mockMessages.length - 1].message,
      timestamp: mockMessages[mockMessages.length - 1].timestamp,
      unread: false,
    },
    {
      id: 'ai',
      user: {
        id: 'ai',
        name: 'AI Assistant',
        email: '',
        role: 'tenant',
        avatar: undefined,
        twoFactorEnabled: false,
        createdAt: new Date(),
      },
      lastMessage: 'How can I help you today?',
      timestamp: new Date(),
      unread: true,
    },
  ];

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push('/chat')}
    >
      <Card style={styles.conversationCard}>
        <View style={styles.avatarContainer}>
          {item.user.id === 'ai' ? (
            <View style={styles.aiAvatar}>
              <Bot size={24} color={theme.colors.primary} />
            </View>
          ) : item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        
        <ChevronRight size={20} color={theme.colors.gray[400]} />
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={theme.colors.gray[300]} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start a conversation with your {isLandlord ? 'tenants' : 'landlord'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.text.light,
  },
  lastMessage: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.light,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
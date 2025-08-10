import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, Paperclip } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/types';
import { mockMessages } from '@/mocks/data';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      receiverId: 'ai',
      message: inputText,
      timestamp: new Date(),
      read: false,
      isAI: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate AI response
    setIsTyping(true);
    
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant for a rent payment platform. Help tenants and landlords with their questions about rent, maintenance, and property management.' },
            { role: 'user', content: inputText }
          ]
        }),
      });

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        receiverId: user?.id || '1',
        message: data.completion,
        timestamp: new Date(),
        read: false,
        isAI: true,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      Alert.alert('Error', 'Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}>
        {item.isAI && (
          <View style={styles.aiIndicator}>
            <Bot size={16} color={theme.colors.primary} />
            <Text style={styles.aiLabel}>AI Assistant</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownText : styles.otherText,
          ]}>
            {item.message}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={theme.colors.gray[500]} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.gray[400]}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? theme.colors.white : theme.colors.gray[400]} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  aiLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: theme.colors.primary,
  },
  otherBubble: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  messageText: {
    fontSize: 16,
  },
  ownText: {
    color: theme.colors.white,
  },
  otherText: {
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.text.light,
    marginTop: theme.spacing.xs,
  },
  typingIndicator: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  typingText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  attachButton: {
    padding: theme.spacing.sm,
  },
  input: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    fontSize: 16,
    color: theme.colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
});
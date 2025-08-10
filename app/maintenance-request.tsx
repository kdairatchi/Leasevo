import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  AlertCircle,
  Camera,
  Image as ImageIcon
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { theme } from '@/constants/theme';
import { MaintenanceRequest } from '@/types';

export default function MaintenanceRequestScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('medium');
  const [loading, setLoading] = useState(false);

  const priorities: { value: MaintenanceRequest['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: theme.colors.gray[500] },
    { value: 'medium', label: 'Medium', color: theme.colors.primary },
    { value: 'high', label: 'High', color: theme.colors.warning },
    { value: 'emergency', label: 'Emergency', color: theme.colors.error },
  ];

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Request Submitted',
        'Your maintenance request has been submitted successfully. We\'ll get back to you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <AlertCircle size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                For emergencies, please call 911 or contact us directly at (555) 123-4567
              </Text>
            </View>
          </Card>

          <Input
            label="Issue Title *"
            placeholder="Brief description of the issue"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.section}>
            <Text style={styles.label}>Priority Level *</Text>
            <View style={styles.priorityGrid}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityButton,
                    priority === p.value && styles.priorityButtonActive,
                    priority === p.value && { backgroundColor: p.color + '20', borderColor: p.color }
                  ]}
                  onPress={() => setPriority(p.value)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === p.value && { color: p.color }
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide detailed information about the issue..."
              placeholderTextColor={theme.colors.gray[400]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Attachments</Text>
            <View style={styles.attachmentGrid}>
              <TouchableOpacity style={styles.attachmentButton}>
                <Camera size={24} color={theme.colors.gray[500]} />
                <Text style={styles.attachmentText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentButton}>
                <ImageIcon size={24} color={theme.colors.gray[500]} />
                <Text style={styles.attachmentText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Submit Request"
            onPress={handleSubmit}
            loading={loading}
            size="large"
            style={styles.submitButton}
          />
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
  content: {
    padding: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.primary + '10',
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.gray[500],
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.white,
    minHeight: 120,
  },
  attachmentGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  attachmentButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  attachmentText: {
    fontSize: 14,
    color: theme.colors.gray[500],
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});
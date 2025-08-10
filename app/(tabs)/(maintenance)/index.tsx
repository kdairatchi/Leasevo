import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { mockMaintenanceRequests } from '@/mocks/data';
import { MaintenanceRequest } from '@/types';

export default function MaintenanceScreen() {
  const { user } = useAuth();
  const isLandlord = user?.role === 'landlord';

  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'emergency':
        return theme.colors.error;
      case 'high':
        return theme.colors.warning;
      case 'medium':
        return theme.colors.primary;
      case 'low':
        return theme.colors.gray[500];
      default:
        return theme.colors.gray[500];
    }
  };

  const getStatusIcon = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} color={theme.colors.warning} />;
      case 'in_progress':
        return <Clock size={16} color={theme.colors.primary} />;
      case 'resolved':
        return <CheckCircle size={16} color={theme.colors.success} />;
      default:
        return null;
    }
  };

  const renderRequestItem = ({ item }: { item: MaintenanceRequest }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            {getStatusIcon(item.status)}
            <Text style={styles.statusText}>
              {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
            </Text>
          </View>
        </View>
        
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.requestFooter}>
          <Text style={styles.requestDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <ChevronRight size={20} color={theme.colors.gray[400]} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockMaintenanceRequests.filter(r => r.status === 'open').length}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockMaintenanceRequests.filter(r => r.status === 'in_progress').length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{mockMaintenanceRequests.filter(r => r.status === 'resolved').length}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </Card>
        </View>
      </View>

      <FlatList
        data={mockMaintenanceRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Wrench size={48} color={theme.colors.gray[300]} />
            <Text style={styles.emptyText}>No maintenance requests</Text>
            <Text style={styles.emptySubtext}>
              {isLandlord ? 'Your tenants haven\'t submitted any requests' : 'You haven\'t submitted any requests yet'}
            </Text>
          </View>
        }
      />

      {!isLandlord && (
        <View style={styles.footer}>
          <Button
            title="New Request"
            onPress={() => router.push('/maintenance-request')}
            size="large"
            style={styles.newRequestButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  requestCard: {
    marginBottom: theme.spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  requestDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestDate: {
    fontSize: 12,
    color: theme.colors.text.light,
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
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    backgroundColor: theme.colors.white,
  },
  newRequestButton: {
    width: '100%',
  },
});
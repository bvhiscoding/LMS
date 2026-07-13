import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, Chip, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { CourseCard } from '../components/CourseCard';
import { courses, statusMeta, type CourseStatus } from '../data/courses';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Courses'>;
type Filter = 'all' | CourseStatus;

const filters: { key: Filter; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: 'view-grid-outline' },
  { key: 'learning', label: statusMeta.learning.label, icon: statusMeta.learning.icon },
  { key: 'new', label: statusMeta.new.label, icon: statusMeta.new.icon },
  { key: 'done', label: statusMeta.done.label, icon: statusMeta.done.icon },
  { key: 'overdue', label: statusMeta.overdue.label, icon: statusMeta.overdue.icon },
];

export function CoursesScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const visibleCourses = useMemo(
    () => filter === 'all' ? courses : courses.filter((course) => course.status === filter),
    [filter],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <Appbar.Header mode="center-aligned" statusBarHeight={0} elevated>
        <Appbar.BackAction onPress={() => navigation.canGoBack() && navigation.goBack()} accessibilityLabel="Quay lại" />
        <Appbar.Content title="Khóa học" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="magnify" accessibilityLabel="Tìm kiếm khóa học" onPress={() => undefined} />
        <Appbar.Action icon="filter-variant" accessibilityLabel="Bộ lọc nâng cao" onPress={() => undefined} />
      </Appbar.Header>

      <View style={styles.filterArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {filters.map((item) => (
            <Chip
              key={item.key}
              icon={item.icon}
              selected={filter === item.key}
              showSelectedCheck={false}
              onPress={() => setFilter(item.key)}
              accessibilityLabel={`Lọc theo ${item.label}`}
              style={styles.filterChip}
            >
              {item.label}
            </Chip>
          ))}
        </ScrollView>
        <Divider />
      </View>

      <FlatList
        data={visibleCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.listHeader}>
            <Text variant="titleMedium" style={styles.listTitle}>
              {filter === 'all' ? 'Tất cả khóa học' : filters.find((item) => item.key === filter)?.label} ({visibleCourses.length})
            </Text>
            <Button mode="text" compact icon="sort-calendar-descending">Mới nhất</Button>
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.empty}>
            <Text variant="titleMedium">Chưa có khóa học</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>Thử chọn một trạng thái khác.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={item.id === 'web-basic' ? () => navigation.navigate('CourseDetail', { courseId: item.id }) : undefined}
          />
        )}
      />
      <AppBottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  filterArea: { backgroundColor: palette.surface },
  filterContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { minHeight: 40 },
  listContent: { padding: 16, paddingBottom: 24 },
  listHeader: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontWeight: '700' },
  empty: { paddingVertical: 64, alignItems: 'center', gap: 8 },
  emptyText: { color: palette.onSurfaceVariant },
});

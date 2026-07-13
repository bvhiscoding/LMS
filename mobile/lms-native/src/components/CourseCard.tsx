import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, Icon, IconButton, ProgressBar, Text } from 'react-native-paper';

import type { Course, CourseStatus } from '../data/courses';
import { statusMeta } from '../data/courses';
import { palette } from '../theme';

type Props = {
  course: Course;
  onPress?: () => void;
};

const statusColors: Record<CourseStatus, { background: string; foreground: string }> = {
  learning: { background: palette.primaryContainer, foreground: palette.onPrimaryContainer },
  new: { background: palette.warningContainer, foreground: palette.warning },
  done: { background: palette.successContainer, foreground: palette.success },
  overdue: { background: palette.errorContainer, foreground: palette.error },
};

export function CourseCard({ course, onPress }: Props) {
  const status = statusMeta[course.status];
  const statusColor = statusColors[course.status];
  const progressColor = course.status === 'done' ? palette.success : course.status === 'overdue' ? palette.error : palette.primary;

  return (
    <Card
      mode="elevated"
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`${course.title}, ${status.label}, tiến độ ${Math.round(course.progress * 100)} phần trăm`}
      accessibilityHint={onPress ? 'Chạm để mở chi tiết khóa học' : undefined}
      style={styles.card}
    >
      <View style={styles.row}>
        <Card.Cover source={{ uri: course.image }} style={styles.cover} accessibilityLabel={`Ảnh minh họa ${course.title}`} />
        <Card.Content style={styles.content}>
          <View style={styles.titleRow}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.title}>{course.title}</Text>
            <IconButton icon="dots-vertical" size={20} accessibilityLabel={`Tùy chọn ${course.title}`} style={styles.more} />
          </View>
          <Chip
            compact
            icon={status.icon}
            textStyle={[styles.chipText, { color: statusColor.foreground }]}
            style={[styles.chip, { backgroundColor: statusColor.background }]}
          >
            {status.label}
          </Chip>
          <View style={styles.metaRow}>
            <Avatar.Text size={24} label={course.teacherInitials} />
            <Text variant="bodySmall" numberOfLines={1} style={styles.metaText}>{course.teacher}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon source="calendar-range-outline" size={18} color={palette.onSurfaceVariant} />
            <Text variant="bodySmall" numberOfLines={1} style={styles.metaText}>{course.dates}</Text>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <ProgressBar progress={course.progress} color={progressColor} style={styles.progress} />
            </View>
            <Text variant="labelMedium" style={styles.percent}>{Math.round(course.progress * 100)}%</Text>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: palette.surface },
  row: { flexDirection: 'row', padding: 8, gap: 12 },
  cover: { width: 108, minHeight: 148, borderRadius: 10 },
  content: { flex: 1, minWidth: 0, paddingHorizontal: 0, paddingVertical: 0, gap: 7 },
  titleRow: { minHeight: 42, flexDirection: 'row', alignItems: 'flex-start' },
  title: { flex: 1, fontWeight: '700', color: palette.onSurface },
  more: { margin: -10, marginLeft: -4 },
  chip: { alignSelf: 'flex-start', height: 28 },
  chipText: { fontSize: 11, lineHeight: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { flex: 1, color: palette.onSurfaceVariant },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2, minWidth: 0 },
  progressTrack: { flex: 1, minWidth: 0 },
  progress: { height: 6, borderRadius: 3 },
  percent: { minWidth: 34, flexShrink: 0, color: palette.onSurface },
});

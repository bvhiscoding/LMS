import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  List,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { courses } from '../data/courses';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

const materialItems = [
  { title: 'Video bài giảng', description: '15 phút', icon: 'play-circle', color: '#8A2BE2', status: 'Đã xem', statusColor: palette.success },
  { title: 'Slide bài giảng', description: '20 trang', icon: 'presentation', color: '#F57C00', status: 'Mới', statusColor: palette.primary },
  { title: 'Giáo trình HTML.pdf', description: '2.5 MB', icon: 'file-pdf-box', color: '#D32F2F', status: 'Tải xuống', statusColor: palette.onSurfaceVariant },
  { title: 'Bài tập thực hành', description: 'Bài thực hành', icon: 'clipboard-text-outline', color: palette.success, status: 'Chưa nộp', statusColor: palette.error },
  { title: 'File mẫu bai-01.zip', description: '1.2 MB', icon: 'folder-zip-outline', color: '#1976D2', status: 'Tải xuống', statusColor: palette.onSurfaceVariant },
  { title: 'Kiểm tra nhanh', description: '5 câu', icon: 'help-circle', color: '#E8A700', status: 'Hoàn thành', statusColor: palette.success },
];

export function CourseDetailScreen({ navigation, route }: Props) {
  const course = courses.find((item) => item.id === route.params.courseId) ?? courses[0];
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [chapterOneOpen, setChapterOneOpen] = useState(true);
  const [chapterTwoOpen, setChapterTwoOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(true);

  const allExpanded = chapterOneOpen && chapterTwoOpen;
  const toggleAll = () => {
    const next = !allExpanded;
    setChapterOneOpen(next);
    setChapterTwoOpen(next);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <Appbar.Header mode="center-aligned" statusBarHeight={0} elevated>
        <Appbar.BackAction onPress={navigation.goBack} accessibilityLabel="Quay lại danh sách khóa học" />
        <Appbar.Content title="Chi tiết khóa học" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="share-variant-outline" accessibilityLabel="Chia sẻ khóa học" onPress={() => undefined} />
        <Appbar.Action
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          accessibilityLabel={bookmarked ? 'Bỏ lưu khóa học' : 'Lưu khóa học'}
          accessibilityState={{ selected: bookmarked }}
          onPress={() => setBookmarked((value) => !value)}
        />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card mode="elevated" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <Card.Cover source={{ uri: course.image }} style={styles.heroCover} accessibilityLabel={`Ảnh minh họa ${course.title}`} />
            <Card.Content style={styles.heroContent}>
              <Text variant="titleLarge" style={styles.heroTitle}>{course.title}</Text>
              <Chip compact icon="book-open-page-variant-outline" style={styles.statusChip}>Đang học</Chip>
              <View style={styles.inlineMeta}>
                <Avatar.Text size={28} label={course.teacherInitials} />
                <Text variant="bodyMedium" style={styles.flexText}>{course.teacher}</Text>
              </View>
              <View style={styles.inlineMeta}>
                <Icon source="calendar-range-outline" size={20} color={palette.onSurfaceVariant} />
                <Text variant="bodySmall" style={styles.flexText}>{course.dates}</Text>
              </View>
            </Card.Content>
          </View>
          <Card.Content style={styles.progressContent}>
            <View style={styles.progressRow}>
              <ProgressBar progress={course.progress} style={styles.progress} />
              <Text variant="labelLarge">65%</Text>
            </View>
            <View style={styles.completionRow}>
              <Icon source="target" size={22} color={palette.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.flexText}>
                Điều kiện hoàn thành: Hoàn thành 100% nội dung bắt buộc và nộp đầy đủ bài tập.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card mode="contained" style={styles.sectionCard}>
          <Card.Title
            title="Mục tiêu khóa học"
            titleVariant="titleMedium"
            titleStyle={styles.sectionTitle}
            left={(props) => <Avatar.Icon {...props} icon="target" size={40} />}
          />
          <Card.Content style={styles.goals}>
            {['Nắm vững HTML, CSS, JavaScript cơ bản', 'Biết xây dựng giao diện web đơn giản', 'Hiểu quy trình phát triển web cơ bản'].map((goal) => (
              <View key={goal} style={styles.goalRow}>
                <Icon source="check-circle" size={20} color={palette.primary} />
                <Text variant="bodyMedium" style={styles.flexText}>{goal}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Surface mode="flat" elevation={1} style={styles.facts}>
          <View style={styles.factItem}>
            <Avatar.Icon size={40} icon="account-tie-outline" />
            <Text variant="labelSmall" style={styles.muted}>Giảng viên</Text>
            <Text variant="bodySmall" numberOfLines={1}>Nguyễn Văn A</Text>
          </View>
          <Divider style={styles.factDivider} />
          <View style={styles.factItem}>
            <Avatar.Icon size={40} icon="calendar-range" />
            <Text variant="labelSmall" style={styles.muted}>Thời gian học</Text>
            <Text variant="bodySmall" numberOfLines={1}>01/05 - 30/06</Text>
          </View>
          <Divider style={styles.factDivider} />
          <View style={styles.factItem}>
            <Avatar.Icon size={40} icon="chart-donut" />
            <Text variant="labelSmall" style={styles.muted}>Tiến độ</Text>
            <Text variant="bodySmall">65%</Text>
          </View>
        </Surface>

        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          density="small"
          style={styles.tabs}
          buttons={[
            { value: 'content', label: 'Nội dung', icon: 'format-list-bulleted' },
            { value: 'tasks', label: 'Bài tập', icon: 'clipboard-text-outline' },
            { value: 'discussion', label: 'Thảo luận', icon: 'message-text-outline' },
            { value: 'result', label: 'Kết quả', icon: 'chart-box-outline' },
          ]}
        />

        <View style={styles.curriculumHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Danh sách chương và bài học</Text>
          <Button mode="text" compact icon={allExpanded ? 'chevron-up' : 'chevron-down'} onPress={toggleAll}>
            {allExpanded ? 'Thu gọn' : 'Mở rộng tất cả'}
          </Button>
        </View>

        <Card mode="contained" style={styles.accordionCard}>
          <List.Accordion
            title="Chương 1: Giới thiệu HTML"
            description="3 bài học • Hoàn thành 100%"
            left={(props) => <List.Icon {...props} icon="numeric-1-box-outline" />}
            expanded={chapterOneOpen}
            onPress={() => setChapterOneOpen((value) => !value)}
            accessibilityLabel="Chương 1: Giới thiệu HTML, hoàn thành 100 phần trăm"
          >
            <List.Accordion
              title="Bài 1: HTML là gì?"
              description="6 học liệu"
              left={(props) => <List.Icon {...props} icon="check-circle" color={palette.success} />}
              expanded={lessonOpen}
              onPress={() => setLessonOpen((value) => !value)}
            >
              {materialItems.map((item) => (
                <List.Item
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  titleNumberOfLines={1}
                  left={(props) => <List.Icon {...props} icon={item.icon} color={item.color} />}
                  right={() => <Text variant="labelSmall" style={[styles.materialStatus, { color: item.statusColor }]}>{item.status}</Text>}
                  onPress={() => undefined}
                  accessibilityLabel={`${item.title}, ${item.description}, ${item.status}`}
                />
              ))}
            </List.Accordion>
            <List.Item
              title="Bài 2: Cấu trúc trang HTML"
              description="5 học liệu"
              left={(props) => <List.Icon {...props} icon="numeric-2-circle-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => undefined}
            />
          </List.Accordion>
        </Card>

        <Card mode="contained" style={styles.accordionCard}>
          <List.Accordion
            title="Chương 2: CSS cơ bản"
            description="4 bài học • Hoàn thành 0%"
            left={(props) => <List.Icon {...props} icon="numeric-2-box-outline" />}
            expanded={chapterTwoOpen}
            onPress={() => setChapterTwoOpen((value) => !value)}
          >
            <List.Item
              title="Bài học đang khóa"
              description="Hoàn thành Chương 1 để tiếp tục"
              left={(props) => <List.Icon {...props} icon="lock-outline" />}
            />
          </List.Accordion>
        </Card>
      </ScrollView>

      <Surface elevation={2} style={styles.actionArea}>
        <Button mode="contained" icon="play" contentStyle={styles.continueButton} onPress={() => undefined}>
          Tiếp tục học
        </Button>
      </Surface>
      <AppBottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 12 },
  heroCard: { backgroundColor: palette.surface },
  heroRow: { flexDirection: 'row', padding: 12, gap: 12 },
  heroCover: { width: 124, minHeight: 148, borderRadius: 10 },
  heroContent: { flex: 1, paddingHorizontal: 0, paddingVertical: 0, gap: 9 },
  heroTitle: { fontWeight: '700', color: palette.onSurface },
  statusChip: { alignSelf: 'flex-start', backgroundColor: palette.primaryContainer },
  inlineMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flexText: { flex: 1 },
  progressContent: { paddingTop: 0, paddingBottom: 14, gap: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progress: { flex: 1, height: 7, borderRadius: 4 },
  completionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  sectionCard: { backgroundColor: palette.surface },
  sectionTitle: { fontWeight: '700' },
  goals: { paddingBottom: 16, gap: 10 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  facts: { minHeight: 112, paddingVertical: 12, paddingHorizontal: 4, borderRadius: 12, flexDirection: 'row', backgroundColor: palette.surface },
  factItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
  factDivider: { width: 1, height: '75%', alignSelf: 'center' },
  muted: { color: palette.onSurfaceVariant },
  tabs: { marginTop: 2 },
  curriculumHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  accordionCard: { overflow: 'hidden', backgroundColor: palette.surface },
  materialStatus: { alignSelf: 'center', marginRight: 8 },
  actionArea: { padding: 12, backgroundColor: palette.surface },
  continueButton: { minHeight: 48 },
});

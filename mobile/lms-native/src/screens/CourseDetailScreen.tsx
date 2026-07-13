import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
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
import { AppTopBar } from '../components/AppTopBar';
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
];

function ExamCurriculumItem({ title, description, status, color, onPress }: { title: string; description: string; status: string; color: string; onPress: () => void }) {
  return (
    <Card mode="outlined" onPress={onPress} style={styles.examCurriculumCard}>
      <Card.Content style={styles.examCurriculumContent}>
        <View style={[styles.examCurriculumIcon, { backgroundColor: `${color}18` }]}>
          <Icon source="clipboard-list" size={26} color={color} />
        </View>
        <View style={styles.examCurriculumText}>
          <Text variant="titleSmall" style={styles.sectionTitle}>{title}</Text>
          <Text variant="bodySmall" style={styles.muted}>{description}</Text>
        </View>
        <Chip compact textStyle={{ color }} style={styles.examStatus}>{status}</Chip>
        <Icon source="chevron-right" size={18} color={palette.onSurfaceVariant} />
      </Card.Content>
    </Card>
  );
}

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
      <AppTopBar
        title="Chi tiết khóa học"
        onBack={navigation.goBack}
        backLabel="Quay lại danh sách khóa học"
        actions={[
          { icon: 'share-variant-outline', accessibilityLabel: 'Chia sẻ khóa học', onPress: () => undefined },
          {
            icon: bookmarked ? 'bookmark' : 'bookmark-outline',
            accessibilityLabel: bookmarked ? 'Bỏ lưu khóa học' : 'Lưu khóa học',
            accessibilityState: { selected: bookmarked },
            onPress: () => setBookmarked((value) => !value),
          },
        ]}
      />

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
              <View style={styles.progressTrack}>
                <ProgressBar progress={course.progress} style={styles.progress} />
              </View>
              <Text variant="labelLarge" style={styles.percent}>{Math.round(course.progress * 100)}%</Text>
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
          onValueChange={(value) => {
            if (value === 'discussion') navigation.navigate('Discussion');
            else setActiveTab(value);
          }}
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
                  onPress={() => {
                    if (item.title === 'Bài tập thực hành') {
                      navigation.navigate('AssignmentDetail', { assignmentId: 'html-basic-practice' });
                    } else if (item.title === 'Slide bài giảng' || item.title.endsWith('.pdf')) {
                      navigation.navigate('DocumentViewer', { title: item.title });
                    }
                  }}
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
            <List.Item
              title="Kiểm tra nhanh cuối Chương 1"
              description="5 câu • 10 phút"
              left={(props) => <List.Icon {...props} icon="help-circle" color="#E8A700" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('ExamDetail', { examId: 'quiz-chapter-1' })}
            />
          </List.Accordion>
        </Card>

        <ExamCurriculumItem
          title="Bài thi Giữa kỳ"
          description="HTML & CSS • 40 câu • 60 phút"
          status="Sắp bắt đầu"
          color={palette.primary}
          onPress={() => navigation.navigate('ExamDetail', { examId: 'midterm-web' })}
        />

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
            <List.Item
              title="Kiểm tra nhanh cuối Chương 2"
              description="5 câu • 10 phút"
              left={(props) => <List.Icon {...props} icon="help-circle" color="#E8A700" />}
              right={(props) => <List.Icon {...props} icon="lock-outline" />}
              onPress={() => navigation.navigate('ExamDetail', { examId: 'quiz-chapter-2' })}
            />
          </List.Accordion>
        </Card>

        <ExamCurriculumItem
          title="Bài thi Cuối kỳ"
          description="HTML, CSS & JavaScript • 50 câu • 90 phút"
          status="Chưa mở"
          color="#8A2BE2"
          onPress={() => navigation.navigate('ExamDetail', { examId: 'final-web' })}
        />
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
  headerTitle: { fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 12 },
  heroCard: { backgroundColor: palette.surface },
  heroRow: { flexDirection: 'row', padding: 12, gap: 12 },
  heroCover: { width: 124, minHeight: 148, borderRadius: 10 },
  heroContent: { flex: 1, minWidth: 0, paddingHorizontal: 0, paddingVertical: 0, gap: 9 },
  heroTitle: { fontWeight: '600', color: palette.onSurface },
  statusChip: { alignSelf: 'flex-start', backgroundColor: palette.primaryContainer },
  inlineMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flexText: { flex: 1 },
  progressContent: { paddingTop: 0, paddingBottom: 14, gap: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  progressTrack: { flex: 1, minWidth: 0 },
  progress: { height: 7, borderRadius: 4 },
  percent: { minWidth: 34, flexShrink: 0 },
  completionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  sectionCard: { backgroundColor: palette.surface },
  sectionTitle: { fontWeight: '600' },
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
  examCurriculumCard: { backgroundColor: palette.surface },
  examCurriculumContent: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  examCurriculumIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  examCurriculumText: { flex: 1, minWidth: 0, gap: 3 },
  examStatus: { backgroundColor: palette.primaryContainer },
});

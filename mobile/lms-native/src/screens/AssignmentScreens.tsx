import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Chip, Icon, Snackbar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { courses } from '../data/courses';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type DetailProps = NativeStackScreenProps<RootStackParamList, 'AssignmentDetail'>;
type ResultProps = NativeStackScreenProps<RootStackParamList, 'AssignmentResult'>;

const requirements = [
  'Tạo tiêu đề trang hiển thị nội dung “Trang web của bạn”.',
  'Thêm một tiêu đề cấp 1 với nội dung “Xin chào!”.',
  'Thêm một đoạn văn giới thiệu bản thân.',
  'Chèn một ảnh bất kỳ từ Internet với kích thước phù hợp.',
  'Thêm một liên kết đến trang Google mở trong tab mới.',
  'Đảm bảo mã HTML hợp lệ và được căn lề, trình bày rõ ràng.',
];

const guideFiles = [
  { name: 'Huong-dan-bai-tap.pdf', type: 'PDF', size: '1.8 MB', color: '#ED1C24' },
  { name: 'Mau-bai-lam.zip', type: 'ZIP', size: '850 KB', color: '#7B35E8' },
  { name: 'Slide_HTML_co_ban.pdf', type: 'PDF', size: '2.5 MB', color: '#ED1C24' },
];

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <Card mode="elevated" style={styles.sectionCard}>
      <Card.Content style={styles.sectionContent}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionIcon}><Icon source={icon} size={20} color="#FFFFFF" /></View>
          <Text variant="titleLarge" style={styles.titleWeight}>{title}</Text>
        </View>
        {children}
      </Card.Content>
    </Card>
  );
}

function FileRow({ name, type, size, color, onPress }: { name: string; type: string; size: string; color: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress} style={styles.fileRow}>
      <View style={[styles.fileBadge, { backgroundColor: color }]}><Text variant="labelSmall" style={styles.fileBadgeText}>{type}</Text></View>
      <Text variant="bodyMedium" numberOfLines={1} style={styles.fileName}>{name}</Text>
      <Text variant="bodySmall" style={styles.fileType}>{type}</Text>
      <Text variant="bodySmall" style={styles.fileSize}>{size}</Text>
      <Pressable accessibilityRole="button" style={styles.downloadButton}><Icon source="download" size={20} color="#071047" /></Pressable>
    </Pressable>
  );
}

function InfoMetric({ icon, label, value, color = '#071047' }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <View style={styles.infoMetric}>
      <Icon source={icon} size={25} color={color} />
      <View style={styles.infoMetricText}>
        <Text variant="bodySmall" style={styles.muted}>{label}</Text>
        <Text variant="bodyMedium" style={{ color }}>{value}</Text>
      </View>
    </View>
  );
}

export function AssignmentDetailScreen({ navigation, route }: DetailProps) {
  const course = courses[0];
  const [selectedFile, setSelectedFile] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Chi tiết bài tập"
        onBack={navigation.goBack}
        actions={[
          { icon: 'share-variant-outline', onPress: () => undefined, accessibilityLabel: 'Chia sẻ bài tập' },
          { icon: 'dots-vertical', onPress: () => undefined, accessibilityLabel: 'Tùy chọn bài tập' },
        ]}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card mode="outlined" style={styles.heroCard}>
          <Card.Content style={styles.heroContent}>
            <Card.Cover source={{ uri: course.image }} style={styles.heroImage} />
            <View style={styles.heroMain}>
              <Text variant="headlineSmall" style={styles.heroTitle}>Bài tập thực hành HTML cơ bản</Text>
              <View style={styles.courseLine}><Icon source="graduation-cap" size={20} color="#071047" /><Text variant="bodyMedium">Khóa học: Lập trình Web cơ bản</Text></View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStats}>
                <InfoMetric icon="calendar-outline" label="Hạn nộp" value="18:00, 25/07/2026" />
                <InfoMetric icon="star" label="Điểm tối đa" value="10 điểm" />
                <InfoMetric icon="circle-exclamation" label="Trạng thái" value="Chưa nộp" color={palette.error} />
                <InfoMetric icon="repeat" label="Số lần nộp" value="1 lần" />
              </View>
            </View>
          </Card.Content>
        </Card>

        <SectionCard icon="file-document-outline" title="1. Nội dung yêu cầu">
          <Text variant="bodyMedium" style={styles.description}>Tạo một trang HTML đơn giản theo yêu cầu dưới đây và nộp file mã nguồn (HTML) hoặc file nén (ZIP).</Text>
          <View style={styles.requirements}>
            {requirements.map((item) => <View key={item} style={styles.requirementRow}><View style={styles.bullet} /><Text variant="bodyMedium" style={styles.requirementText}>{item}</Text></View>)}
          </View>
        </SectionCard>

        <SectionCard icon="file-document-outline" title="2. Tài liệu hướng dẫn">
          <View style={styles.fileList}>{guideFiles.map((file) => <FileRow key={file.name} {...file} onPress={file.type === 'PDF' ? () => navigation.navigate('DocumentViewer', { title: file.name }) : undefined} />)}</View>
        </SectionCard>

        <SectionCard icon="information-outline" title="3. Thông tin bài tập">
          <View style={styles.metricGrid}>
            <InfoMetric icon="circle-exclamation" label="Trạng thái" value="Chưa nộp" color={palette.error} />
            <InfoMetric icon="calendar-outline" label="Ngày giao" value="20/07/2026" />
            <InfoMetric icon="star" label="Điểm tối đa" value="10 điểm" />
            <InfoMetric icon="repeat" label="Số lần đã nộp" value="0/1" />
          </View>
        </SectionCard>

        <SectionCard icon="cloud-upload-outline" title="4. Tải bài làm lên">
          <Pressable accessibilityRole="button" onPress={() => setSelectedFile(true)} style={styles.uploadBox}>
            <Icon source={selectedFile ? 'check-circle' : 'cloud-upload-outline'} size={38} color={selectedFile ? palette.success : palette.primary} />
            <Text variant="bodyMedium" style={styles.uploadTitle}>{selectedFile ? 'bai-lam-html.zip đã được chọn' : 'Kéo thả file vào đây hoặc chọn file để tải lên'}</Text>
            <Text variant="bodySmall" style={styles.muted}>Hỗ trợ: .html, .htm, .zip (Tối đa 50 MB)</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>

      <Surface elevation={3} style={styles.actionDock}>
        <Button mode="outlined" icon="content-save-outline" onPress={() => setMessage('Đã lưu bản nháp.')} style={styles.actionButton} contentStyle={styles.actionContent}>Lưu nháp</Button>
        <Button mode="contained" icon="send" disabled={!selectedFile} onPress={() => navigation.navigate('AssignmentResult', { assignmentId: route.params.assignmentId })} style={styles.actionButton} contentStyle={styles.actionContent}>Nộp bài</Button>
      </Surface>
      <AppBottomBar activeKey="courses" />
      <Snackbar visible={Boolean(message)} onDismiss={() => setMessage('')} duration={2200}>{message}</Snackbar>
    </SafeAreaView>
  );
}

export function AssignmentResultScreen({ navigation }: ResultProps) {
  const course = courses[0];
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Kết quả bài tập"
        onBack={navigation.goBack}
        actions={[
          { icon: 'share-variant-outline', onPress: () => undefined, accessibilityLabel: 'Chia sẻ kết quả bài tập' },
          { icon: 'dots-vertical', onPress: () => undefined, accessibilityLabel: 'Tùy chọn kết quả bài tập' },
        ]}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card mode="outlined" style={styles.heroCard}>
          <Card.Content style={styles.heroContent}>
            <Card.Cover source={{ uri: course.image }} style={styles.heroImage} />
            <View style={styles.heroMain}>
              <Text variant="headlineSmall" style={styles.heroTitle}>Bài tập thực hành HTML cơ bản</Text>
              <View style={styles.courseLine}><Icon source="graduation-cap" size={20} color="#071047" /><Text variant="bodyMedium">Khóa học: Lập trình Web cơ bản</Text></View>
              <View style={styles.resultMeta}><Chip compact icon="check-circle" textStyle={{ color: palette.success }} style={styles.gradedChip}>Đã chấm</Chip><Icon source="calendar-outline" size={18} color="#071047" /><Text variant="bodySmall">Đã nộp lúc 17:35, 24/07/2026</Text></View>
              <View style={styles.scoreLine}><Text style={styles.score}>8.5</Text><Text variant="titleLarge">/ 10 điểm</Text><View style={styles.scoreDivider} /><Icon source="repeat" size={22} color="#071047" /><Text variant="bodyMedium">Lần nộp: 1/2</Text></View>
            </View>
          </Card.Content>
        </Card>

        <SectionCard icon="file-document-outline" title="1. Bài đã nộp">
          <View style={styles.fileList}><FileRow name="bai-lam-html.zip" type="ZIP" size="1.6 MB" color="#7B35E8" /><FileRow name="index.html" type="HTML" size="120 KB" color="#FF6B00" /></View>
        </SectionCard>

        <SectionCard icon="message-text-outline" title="2. Nhận xét của giáo viên">
          <View style={styles.teacherRow}>
            <Avatar.Image size={66} source={{ uri: 'https://i.pravatar.cc/160?img=12' }} />
            <View style={styles.teacherText}><Text variant="titleLarge" style={styles.titleWeight}>Thầy Nguyễn Văn A</Text><Chip compact icon="star" style={styles.feedbackChip}>Phản hồi chính</Chip></View>
          </View>
          <Text variant="bodyMedium" style={styles.teacherComment}>Bài làm có cấu trúc rõ ràng, bố cục hợp lý và trình bày đẹp mắt. Em đã sử dụng đúng các thẻ HTML cơ bản và định dạng tốt. Để bài hoàn thiện hơn, em nên chú ý sử dụng các thẻ semantic và tối ưu giao diện responsive trên các thiết bị khác nhau.</Text>
        </SectionCard>

        <SectionCard icon="paperclip" title="3. Tệp giáo viên phản hồi">
          <View style={styles.fileList}><FileRow name="nhan-xet-bai-tap.pdf" type="PDF" size="650 KB" color="#ED1C24" onPress={() => navigation.navigate('DocumentViewer', { title: 'nhan-xet-bai-tap.pdf' })} /><FileRow name="mau-sua-loi.zip" type="ZIP" size="980 KB" color="#7B35E8" /></View>
        </SectionCard>

        <SectionCard icon="information-outline" title="4. Thông tin kết quả">
          <View style={styles.metricGrid}>
            <InfoMetric icon="check-circle-outline" label="Trạng thái" value="Đạt" color={palette.success} />
            <InfoMetric icon="star" label="Điểm số" value="8.5/10" color={palette.primary} />
            <InfoMetric icon="calendar-outline" label="Hạn nộp" value="25/07/2026" />
            <InfoMetric icon="repeat" label="Lần nộp còn lại" value="1" />
          </View>
        </SectionCard>
        <View style={styles.notice}><Icon source="information-outline" size={21} color={palette.primary} /><Text variant="bodySmall" style={styles.noticeText}>Bạn vẫn có thể nộp lại trước hạn nếu muốn cải thiện kết quả.</Text></View>
      </ScrollView>
      <Surface elevation={3} style={styles.actionDock}>
        <Button mode="outlined" icon="file-document-outline" onPress={() => undefined} style={styles.actionButton} contentStyle={styles.actionContent}>Xem bài đã nộp</Button>
        <Button mode="contained" icon="send" onPress={navigation.goBack} style={styles.actionButton} contentStyle={styles.actionContent}>Nộp lại</Button>
      </Surface>
      <AppBottomBar activeKey="courses" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.surface },
  headerTitle: { color: '#071047', fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 18, gap: 12 },
  heroCard: { borderColor: '#DDE4F0', backgroundColor: palette.surface },
  heroContent: { flexDirection: 'row', gap: 14 },
  heroImage: { width: 118, minHeight: 130, borderRadius: 10 },
  heroMain: { flex: 1, minWidth: 0, gap: 10 },
  heroTitle: { color: '#071047', fontWeight: '700', lineHeight: 30 },
  courseLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heroDivider: { height: 1, backgroundColor: palette.outlineVariant },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sectionCard: { backgroundColor: palette.surface },
  sectionContent: { gap: 12, paddingVertical: 14 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.primary },
  titleWeight: { color: '#071047', fontWeight: '600' },
  description: { color: '#172454', lineHeight: 22 },
  requirements: { gap: 7 },
  requirementRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 6, height: 6, marginTop: 8, borderRadius: 3, backgroundColor: palette.primary },
  requirementText: { flex: 1, color: '#172454', lineHeight: 21 },
  fileList: { overflow: 'hidden', borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10 },
  fileRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  fileBadge: { width: 34, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 5 },
  fileBadgeText: { color: '#FFFFFF', fontWeight: '600' },
  fileName: { flex: 1, minWidth: 0, color: '#172454' },
  fileType: { width: 42, textAlign: 'center', color: '#172454' },
  fileSize: { width: 52, color: '#172454' },
  downloadButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  infoMetric: { flexGrow: 1, minWidth: '22%', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 9 },
  infoMetricText: { gap: 3 },
  muted: { color: palette.onSurfaceVariant },
  uploadBox: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.primary, borderRadius: 10 },
  uploadTitle: { textAlign: 'center', color: '#172454' },
  actionDock: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: palette.surface },
  actionButton: { flex: 1, borderRadius: 9 },
  actionContent: { minHeight: 48 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  gradedChip: { backgroundColor: palette.successContainer },
  scoreLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  score: { color: palette.primary, fontSize: 34, lineHeight: 40, fontWeight: '700' },
  scoreDivider: { width: 1, height: 34, marginHorizontal: 8, backgroundColor: palette.outlineVariant },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  teacherText: { flex: 1, alignItems: 'flex-start', gap: 7 },
  feedbackChip: { backgroundColor: palette.primaryContainer },
  teacherComment: { marginLeft: 80, color: '#172454', lineHeight: 23 },
  notice: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: '#BCD5FF', borderRadius: 10, backgroundColor: '#F2F7FF' },
  noticeText: { flex: 1, color: '#172454' },
});

import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  Icon,
  IconButton,
  Searchbar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTopBar } from '../components/AppTopBar';

import { AppBottomBar } from '../components/AppBottomBar';
import { discussions as seedDiscussions, type Discussion } from '../data/discussions';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Discussion'>;
type DiscussionFilter = 'all' | 'pinned' | 'unanswered';

const kindMeta = {
  pinned: { icon: 'pin', color: palette.primary, background: '#EDF4FF' },
  question: { icon: 'help-circle-outline', color: '#F17400', background: '#FFF1E7' },
  assignment: { icon: 'file-document-outline', color: palette.success, background: palette.successContainer },
  announcement: { icon: 'bullhorn-outline', color: palette.primary, background: '#EDF4FF' },
} as const;

const badgeMeta = {
  Ghim: { color: palette.primary, background: palette.primaryContainer },
  'Chưa trả lời': { color: '#E75D00', background: '#FFF1E7' },
  Mới: { color: palette.success, background: palette.successContainer },
} as const;

function DiscussionCard({ item, onPress }: { item: Discussion; onPress: () => void }) {
  const kind = kindMeta[item.kind];

  return (
    <Card mode="elevated" onPress={onPress} style={styles.discussionCard}>
      <Card.Content style={styles.cardContent}>
        <View style={[styles.kindIcon, { backgroundColor: kind.background }]}>
          <Icon source={kind.icon} size={27} color={kind.color} />
        </View>
        <View style={styles.cardMain}>
          <View style={styles.cardTitleRow}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
            {item.badge ? (
              <Text
                variant="labelMedium"
                style={[styles.cardBadge, { color: badgeMeta[item.badge].color, backgroundColor: badgeMeta[item.badge].background }]}
              >
                {item.badge}
              </Text>
            ) : null}
          </View>
          <Text variant="bodyMedium" numberOfLines={1} style={styles.lesson}>{item.lesson}</Text>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.excerpt}>{item.excerpt}</Text>
          <View style={styles.cardFooter}>
            <Avatar.Image size={28} source={{ uri: item.avatar }} />
            <Text variant="bodySmall" numberOfLines={1} style={styles.author}>{item.author}</Text>
            <Text style={styles.dot}>•</Text>
            <Text variant="bodySmall" style={styles.time}>{item.time}</Text>
            <View style={styles.replyCount}>
              <Icon source="message-outline" size={18} color={palette.primary} />
              <Text variant="labelMedium" style={styles.replyText}>{item.replyCount} phản hồi</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

type CreateQuestionModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, content: string) => void;
};

function CreateQuestionModal({ visible, onDismiss, onSubmit }: CreateQuestionModalProps) {
  const [title, setTitle] = useState('Em chưa hiểu phần vòng lặp for trong JavaScript');
  const [content, setContent] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(title.trim(), content.trim());
    setTitle('');
    setContent('');
    setPreviewing(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss} statusBarTranslucent={false}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.modalSafeArea}>
        <AppTopBar
          title="Tạo câu hỏi"
          subtitle="MH24 – Thảo luận & Hỏi đáp"
          onBack={onDismiss}
          backLabel="Đóng tạo câu hỏi"
          backgroundColor={palette.primary}
          foregroundColor="#FFFFFF"
          rightContentWidth={92}
          rightContent={(
            <Button mode="text" textColor="#FFFFFF" compact onPress={() => setPreviewing((value) => !value)}>
              {previewing ? 'Chỉnh sửa' : 'Xem trước'}
            </Button>
          )}
        />

        <KeyboardAvoidingView style={styles.modalBody} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {previewing ? (
            <ScrollView contentContainerStyle={styles.previewContent} keyboardShouldPersistTaps="handled">
              <Text variant="labelLarge" style={styles.previewLabel}>Bản xem trước</Text>
              <Card mode="outlined" style={styles.previewCard}>
                <Card.Content style={styles.previewCardContent}>
                  <View style={styles.previewAuthor}>
                    <Avatar.Text size={40} label="BA" />
                    <View>
                      <Text variant="titleSmall" style={styles.semibold}>Phạm Bảo Ngọc</Text>
                      <Text variant="bodySmall" style={styles.muted}>Vừa xong • Học viên</Text>
                    </View>
                  </View>
                  <Text variant="titleLarge" style={styles.previewQuestionTitle}>{title || 'Tiêu đề câu hỏi'}</Text>
                  <Text variant="bodyLarge" style={styles.previewQuestionBody}>{content || 'Nội dung câu hỏi sẽ xuất hiện tại đây.'}</Text>
                  <Chip compact style={styles.previewTag}>JavaScript</Chip>
                </Card.Content>
              </Card>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
              <Text variant="titleSmall" style={styles.fieldLabel}>Khóa học <Text style={styles.required}>*</Text></Text>
              <Pressable accessibilityRole="button" style={styles.selectField}>
                <Icon source="book-open-page-variant-outline" size={25} color={palette.primary} />
                <Text variant="bodyLarge" style={styles.selectText}>Lập trình Web cơ bản</Text>
                <Icon source="chevron-down" size={24} color={palette.onSurfaceVariant} />
              </Pressable>

              <Text variant="titleSmall" style={styles.fieldLabel}>Bài học liên quan <Text style={styles.required}>*</Text></Text>
              <Pressable accessibilityRole="button" style={styles.selectField}>
                <Icon source="file-document-outline" size={25} color={palette.primary} />
                <Text variant="bodyLarge" style={styles.selectText}>Bài 5: JavaScript cơ bản</Text>
                <Icon source="chevron-down" size={24} color={palette.onSurfaceVariant} />
              </Pressable>

              <Text variant="titleSmall" style={styles.fieldLabel}>Tiêu đề <Text style={styles.required}>*</Text></Text>
              <TextInput
                mode="outlined"
                value={title}
                maxLength={150}
                onChangeText={setTitle}
                outlineStyle={styles.inputOutline}
                style={styles.singleInput}
              />
              <Text variant="bodySmall" style={styles.counter}>{title.length}/150</Text>

              <Text variant="titleSmall" style={styles.fieldLabel}>Nội dung <Text style={styles.required}>*</Text></Text>
              <TextInput
                mode="outlined"
                value={content}
                maxLength={2000}
                multiline
                numberOfLines={6}
                onChangeText={setContent}
                placeholder={'Mô tả chi tiết câu hỏi của bạn. Cung cấp bối cảnh, ví dụ, hoặc những điều bạn chưa hiểu...\n(Trong nội dung có thể sử dụng định dạng, code, liên kết...)'}
                outlineStyle={styles.inputOutline}
                style={styles.contentInput}
              />
              <Text variant="bodySmall" style={styles.counter}>{content.length}/2000</Text>

              <Text variant="titleSmall" style={styles.fieldLabel}>Tệp đính kèm</Text>
              <Pressable accessibilityRole="button" style={styles.uploadBox}>
                <Icon source="cloud-upload-outline" size={42} color={palette.primary} />
                <View style={styles.uploadTextWrap}>
                  <Text variant="bodyMedium"><Text style={styles.uploadLink}>Tải tệp lên</Text> hoặc kéo thả vào đây</Text>
                  <Text variant="bodySmall" style={styles.muted}>Hỗ trợ: JPG, PNG, PDF, DOCX, TXT (tối đa 10MB/tệp)</Text>
                </View>
              </Pressable>

              <Surface elevation={1} style={styles.attachmentRow}>
                <View style={styles.codeThumb}><Icon source="code-tags" size={30} color="#50C3FF" /></View>
                <View style={styles.attachmentText}>
                  <Text variant="bodyLarge">code-example.png</Text>
                  <Text variant="bodyMedium" style={styles.muted}>324 KB • PNG</Text>
                </View>
                <IconButton icon="close" size={22} style={styles.removeButton} accessibilityLabel="Xóa tệp code-example.png" />
              </Surface>
              <Surface elevation={1} style={styles.attachmentRow}>
                <View style={styles.pdfThumb}><Text variant="titleMedium" style={styles.pdfText}>PDF</Text></View>
                <View style={styles.attachmentText}>
                  <Text variant="bodyLarge">Sticky-position hướng dẫn.pdf</Text>
                  <Text variant="bodyMedium" style={styles.muted}>1.2 MB • PDF</Text>
                </View>
                <IconButton icon="close" size={22} style={styles.removeButton} accessibilityLabel="Xóa tệp hướng dẫn" />
              </Surface>

              <Button
                mode="contained"
                icon="send-outline"
                disabled={!canSubmit}
                onPress={submit}
                contentStyle={styles.submitContent}
                style={styles.submitButton}
              >
                Gửi câu hỏi
              </Button>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
        <AppBottomBar activeKey="discussion" onBeforeNavigate={onDismiss} />
      </SafeAreaView>
    </Modal>
  );
}

export function DiscussionScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<DiscussionFilter>('all');
  const [createVisible, setCreateVisible] = useState(false);
  const [items, setItems] = useState(seedDiscussions);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return items.filter((item) => {
      const matchesQuery = !normalizedQuery || `${item.title} ${item.excerpt} ${item.author}`.toLocaleLowerCase('vi').includes(normalizedQuery);
      const matchesFilter = filter === 'all'
        || (filter === 'pinned' && item.badge === 'Ghim')
        || (filter === 'unanswered' && item.badge === 'Chưa trả lời');
      return matchesQuery && matchesFilter;
    });
  }, [filter, items, query]);

  const addQuestion = (title: string, content: string) => {
    const newQuestion: Discussion = {
      id: `question-${Date.now()}`,
      title,
      lesson: 'Lập trình Web cơ bản – Bài 5: JavaScript cơ bản',
      excerpt: content,
      body: content,
      author: 'Phạm Bảo Ngọc',
      avatar: 'https://i.pravatar.cc/160?img=32',
      time: 'Vừa xong',
      replyCount: 0,
      likeCount: 0,
      kind: 'question',
      badge: 'Chưa trả lời',
      tags: ['JavaScript'],
    };
    setItems((current) => [newQuestion, ...current]);
    setFilter('all');
    setQuery('');
    setCreateVisible(false);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Thảo luận"
        onBack={() => navigation.canGoBack() && navigation.goBack()}
        backgroundColor={palette.primary}
        foregroundColor="#FFFFFF"
      />

      <View style={styles.screenBody}>
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={(
            <View>
              <Searchbar
                placeholder="Tìm kiếm chủ đề, câu hỏi..."
                value={query}
                onChangeText={setQuery}
                style={styles.search}
                inputStyle={styles.searchInput}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                <Chip selected={filter === 'all'} showSelectedCheck={false} onPress={() => setFilter('all')} style={styles.filterChip}>Tất cả</Chip>
                <Chip icon="pin" selected={filter === 'pinned'} showSelectedCheck={false} onPress={() => setFilter('pinned')} style={styles.filterChip}>Được ghim</Chip>
                <Chip icon="help-circle-outline" selected={filter === 'unanswered'} showSelectedCheck={false} onPress={() => setFilter('unanswered')} style={styles.filterChip}>Chưa trả lời</Chip>
                <Chip icon="clock-outline" showSelectedCheck={false} onPress={() => undefined} style={styles.filterChip}>Mới nhất</Chip>
              </ScrollView>
              <Text variant="titleLarge" style={styles.sectionHeading}>Chủ đề lớp học</Text>
            </View>
          )}
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              <Icon source="message-search-outline" size={48} color={palette.onSurfaceVariant} />
              <Text variant="titleMedium">Không tìm thấy thảo luận</Text>
              <Text variant="bodyMedium" style={styles.muted}>Thử đổi từ khóa hoặc bộ lọc.</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.cardGap} />}
          renderItem={({ item }) => (
            <DiscussionCard item={item} onPress={() => navigation.navigate('DiscussionDetail', { discussionId: item.id, discussion: item })} />
          )}
        />
        <FAB
          icon="plus"
          label="Tạo câu hỏi"
          color="#FFFFFF"
          onPress={() => setCreateVisible(true)}
          style={styles.createFab}
          accessibilityLabel="Tạo câu hỏi thảo luận"
        />
      </View>
      <AppBottomBar activeKey="discussion" />

      <CreateQuestionModal visible={createVisible} onDismiss={() => setCreateVisible(false)} onSubmit={addQuestion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.primary },
  blueHeader: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, backgroundColor: palette.primary },
  headerText: { flex: 1, alignItems: 'center' },
  headerSide: { width: 48, height: 48 },
  headerTitle: { color: '#FFFFFF', fontWeight: '700' },
  screenBody: { flex: 1, backgroundColor: palette.background },
  listContent: { padding: 16, paddingBottom: 100 },
  search: { borderRadius: 12, borderWidth: 1, borderColor: palette.outlineVariant, backgroundColor: palette.surface, elevation: 0 },
  searchInput: { minHeight: 46 },
  filters: { paddingVertical: 14, gap: 8 },
  filterChip: { minHeight: 40, borderWidth: 1, borderColor: palette.outlineVariant, backgroundColor: palette.surface },
  sectionHeading: { marginBottom: 12, fontWeight: '700' },
  discussionCard: { backgroundColor: palette.surface, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, gap: 12 },
  kindIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardMain: { flex: 1, minWidth: 0 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  cardTitle: { flex: 1, color: palette.onSurface, fontWeight: '700', lineHeight: 22 },
  cardBadge: { flexShrink: 0, overflow: 'hidden', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  lesson: { color: palette.onSurfaceVariant, marginTop: 4 },
  excerpt: { color: '#47516A', marginTop: 4, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', minWidth: 0, marginTop: 9 },
  author: { maxWidth: 122, flexShrink: 1, marginLeft: 7, color: palette.onSurface },
  dot: { marginHorizontal: 7, color: palette.onSurfaceVariant },
  time: { flexShrink: 1, color: palette.onSurfaceVariant },
  replyCount: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 8 },
  replyText: { color: palette.primary },
  cardGap: { height: 12 },
  createFab: { position: 'absolute', right: 18, bottom: 18, backgroundColor: palette.primary },
  emptyState: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  muted: { color: palette.onSurfaceVariant },
  modalSafeArea: { flex: 1, backgroundColor: palette.primary },
  createHeader: { minHeight: 82, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, backgroundColor: palette.primary },
  createHeaderText: { flex: 1, alignItems: 'center' },
  createTitle: { color: '#FFFFFF', fontWeight: '700' },
  createSubtitle: { color: '#FFFFFF', marginTop: 1 },
  modalBody: { flex: 1, backgroundColor: palette.background },
  formContent: { padding: 16, paddingBottom: 28 },
  fieldLabel: { marginTop: 10, marginBottom: 7, color: palette.onSurface },
  required: { color: palette.error },
  selectField: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10, backgroundColor: palette.surface },
  selectText: { flex: 1 },
  inputOutline: { borderRadius: 10 },
  singleInput: { backgroundColor: palette.surface },
  contentInput: { minHeight: 150, backgroundColor: palette.surface, textAlignVertical: 'top' },
  counter: { alignSelf: 'flex-end', marginTop: 5, color: palette.onSurfaceVariant },
  uploadBox: { minHeight: 92, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#83AFFF', borderRadius: 10, backgroundColor: palette.surface },
  uploadTextWrap: { flexShrink: 1, gap: 4 },
  uploadLink: { color: palette.primary, fontWeight: '700' },
  attachmentRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: palette.surface },
  codeThumb: { width: 64, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101A29' },
  pdfThumb: { width: 44, height: 50, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ED2E38' },
  pdfText: { color: '#FFFFFF', fontWeight: '700' },
  attachmentText: { flex: 1, minWidth: 0, gap: 3 },
  removeButton: { backgroundColor: palette.surfaceVariant },
  submitButton: { marginTop: 18, borderRadius: 10 },
  submitContent: { minHeight: 52 },
  previewContent: { padding: 16 },
  previewLabel: { marginBottom: 10, color: palette.onSurfaceVariant },
  previewCard: { backgroundColor: palette.surface },
  previewCardContent: { gap: 16 },
  previewAuthor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewQuestionTitle: { fontWeight: '700' },
  previewQuestionBody: { lineHeight: 25 },
  previewTag: { alignSelf: 'flex-start', backgroundColor: palette.primaryContainer },
  semibold: { fontWeight: '700' },
});

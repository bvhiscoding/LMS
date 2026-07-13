import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
  Icon,
  IconButton,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { discussions } from '../data/discussions';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DiscussionDetail'>;

type Reply = {
  id: string;
  author: string;
  role?: 'Giảng viên';
  avatar: string;
  time: string;
  content: string;
  likes: number;
};

const initialReplies: Reply[] = [
  {
    id: 'teacher-reply',
    author: 'Trần Thị B (Giảng viên)',
    role: 'Giảng viên',
    avatar: 'https://i.pravatar.cc/160?img=47',
    time: '14/06/2025 • 11:15',
    content: 'Chào bạn,\nKhi thẻ cha có overflow khác visible (ví dụ: auto, scroll, hidden), phần tử sticky sẽ bị giới hạn trong phạm vi cuộn của thẻ cha. Nó vẫn hoạt động bình thường nhưng chỉ sticky trong vùng scroll của cha thôi nhé.',
    likes: 8,
  },
  {
    id: 'student-reply-one',
    author: 'Lê Minh C',
    avatar: 'https://i.pravatar.cc/160?img=11',
    time: '14/06/2025 • 11:40',
    content: 'Cảm ơn thầy, vậy nếu cha là body thì sticky sẽ theo viewport ạ?',
    likes: 1,
  },
  {
    id: 'student-reply-two',
    author: 'Phạm Thị D',
    avatar: 'https://i.pravatar.cc/160?img=32',
    time: '14/06/2025 • 12:05',
    content: 'Rất hữu ích, em cũng đang gặp vấn đề tương tự. Cảm ơn thầy!',
    likes: 0,
  },
];

function ReplyItem({ reply }: { reply: Reply }) {
  const isTeacher = reply.role === 'Giảng viên';

  return (
    <View style={[styles.replyItem, isTeacher && styles.teacherReply]}>
      <View style={styles.replyHeader}>
        <Avatar.Image size={42} source={{ uri: reply.avatar }} />
        <View style={styles.replyAuthorWrap}>
          <View style={styles.nameRow}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.replyName}>{reply.author}</Text>
            {isTeacher ? <Text variant="labelSmall" style={styles.teacherBadge}>Giảng viên</Text> : null}
          </View>
          <Text variant="bodySmall" style={styles.muted}>{reply.time}</Text>
        </View>
        <IconButton icon="dots-horizontal" size={20} style={styles.moreButton} onPress={() => undefined} accessibilityLabel={`Tùy chọn phản hồi của ${reply.author}`} />
      </View>
      <Text variant="bodyLarge" style={styles.replyBody}>{reply.content}</Text>
      <View style={styles.replyActions}>
        <Button mode="text" compact icon="thumb-up-outline" textColor={palette.onSurfaceVariant}>{reply.likes}</Button>
        <Button mode="text" compact textColor={palette.onSurfaceVariant}>Trả lời</Button>
      </View>
    </View>
  );
}

export function DiscussionDetailScreen({ navigation, route }: Props) {
  const discussion = route.params.discussion
    ?? discussions.find((item) => item.id === route.params.discussionId)
    ?? discussions[0];
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(initialReplies);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const sendReply = () => {
    const content = replyText.trim();
    if (!content) return;
    setReplies((current) => [
      ...current,
      {
        id: `reply-${Date.now()}`,
        author: 'Phạm Bảo Ngọc',
        avatar: 'https://i.pravatar.cc/160?img=32',
        time: 'Vừa xong',
        content,
        likes: 0,
      },
    ]);
    setReplyText('');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Chi tiết thảo luận"
        onBack={navigation.goBack}
        backLabel="Quay lại danh sách thảo luận"
        actions={[{ icon: 'dots-horizontal', onPress: () => undefined, accessibilityLabel: 'Tùy chọn thảo luận' }]}
      />

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.authorHeader}>
            <Avatar.Image size={48} source={{ uri: discussion.avatar }} />
            <View style={styles.authorInfo}>
              <Text variant="titleMedium" style={styles.authorName}>{discussion.author}</Text>
              <Text variant="bodyMedium" style={styles.muted}>14/06/2025 • 10:30</Text>
            </View>
            <Chip compact style={styles.studentChip}>Học viên</Chip>
          </View>

          <Text variant="headlineSmall" style={styles.questionTitle}>{discussion.title}</Text>
          <Text variant="bodyLarge" style={styles.questionBody}>{discussion.body}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attachments}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80' }}
              style={styles.attachmentImage}
              accessibilityLabel="Ảnh đoạn mã minh họa"
            />
            <View style={styles.stickyDiagram}>
              <Text variant="labelMedium" style={styles.diagramTitle}>position: sticky</Text>
              <View style={styles.diagramColumns}>
                <View style={styles.diagramColumn}><View style={styles.diagramSticky} /></View>
                <View style={styles.diagramColumn}><View style={styles.diagramBlock} /></View>
              </View>
            </View>
            <Surface mode="flat" style={styles.pdfAttachment}>
              <View style={styles.pdfIcon}><Text variant="labelLarge" style={styles.pdfLabel}>PDF</Text></View>
              <View style={styles.pdfInfo}>
                <Text variant="bodyMedium" numberOfLines={2}>Sticky-position hướng dẫn.pdf</Text>
                <Text variant="bodySmall" style={styles.muted}>1.2 MB</Text>
              </View>
            </Surface>
          </ScrollView>

          <View style={styles.tags}>
            {discussion.tags.map((tag) => <Chip key={tag} compact style={styles.tag}>{tag}</Chip>)}
          </View>

          <Divider style={styles.divider} />
          <View style={styles.engagementRow}>
            <Button
              mode="text"
              compact
              icon={liked ? 'thumb-up' : 'thumb-up-outline'}
              textColor={liked ? palette.primary : palette.onSurfaceVariant}
              onPress={() => setLiked((value) => !value)}
            >
              {discussion.likeCount + (liked ? 1 : 0)}
            </Button>
            <Button mode="text" compact icon="message-outline" textColor={palette.onSurfaceVariant}>{replies.length}</Button>
            <IconButton
              icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
              iconColor={bookmarked ? palette.primary : palette.onSurfaceVariant}
              style={styles.bookmark}
              onPress={() => setBookmarked((value) => !value)}
              accessibilityLabel={bookmarked ? 'Bỏ lưu thảo luận' : 'Lưu thảo luận'}
            />
          </View>
          <Divider style={styles.divider} />

          <View style={styles.answersHeader}>
            <Text variant="titleLarge" style={styles.answersTitle}>{replies.length} câu trả lời</Text>
            <Button mode="text" compact icon="sort-variant" textColor={palette.onSurfaceVariant}>Sắp xếp: Mới nhất</Button>
          </View>

          {replies.map((reply, index) => (
            <View key={reply.id}>
              <ReplyItem reply={reply} />
              {index < replies.length - 1 ? <Divider style={styles.replyDivider} /> : null}
            </View>
          ))}
        </ScrollView>

        <Surface elevation={2} style={styles.composerArea}>
          <View style={styles.composer}>
            <TextInput
              mode="flat"
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Viết trả lời... (@ để gắn thẻ)"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={styles.replyInput}
              onSubmitEditing={sendReply}
            />
            <IconButton icon="at" size={19} iconColor="#40566F" style={styles.composerIcon} onPress={() => setReplyText((value) => `${value}@`)} accessibilityLabel="Gắn thẻ thành viên" />
            <IconButton icon="paperclip" size={19} iconColor="#40566F" style={styles.composerIcon} onPress={() => undefined} accessibilityLabel="Đính kèm tệp" />
            <IconButton
              icon="send"
              size={19}
              iconColor="#FFFFFF"
              containerColor={palette.primary}
              style={styles.sendButton}
              onPress={sendReply}
              accessibilityLabel="Gửi câu trả lời"
            />
          </View>
        </Surface>
      </KeyboardAvoidingView>
      <AppBottomBar activeKey="discussion" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.surface },
  header: { minHeight: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, backgroundColor: palette.surface },
  headerTitle: { fontWeight: '700' },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 28, backgroundColor: palette.surface },
  authorHeader: { flexDirection: 'row', alignItems: 'center' },
  authorInfo: { flex: 1, minWidth: 0, marginLeft: 10 },
  authorName: { fontWeight: '700' },
  muted: { color: palette.onSurfaceVariant },
  studentChip: { backgroundColor: palette.primaryContainer },
  questionTitle: { marginTop: 18, fontWeight: '700', lineHeight: 31 },
  questionBody: { marginTop: 10, color: palette.onSurface, lineHeight: 27 },
  attachments: { gap: 10, paddingTop: 16 },
  attachmentImage: { width: 144, height: 92, borderRadius: 10, backgroundColor: palette.surfaceVariant },
  stickyDiagram: { width: 154, height: 92, padding: 10, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10, backgroundColor: palette.surface },
  diagramTitle: { color: palette.onSurfaceVariant },
  diagramColumns: { flex: 1, flexDirection: 'row', gap: 8, marginTop: 6 },
  diagramColumn: { flex: 1, borderWidth: 1, borderColor: '#B8D7E8', backgroundColor: '#EFF9FD' },
  diagramSticky: { height: 18, marginTop: 13, backgroundColor: '#6DD3EA' },
  diagramBlock: { height: 18, marginTop: 29, backgroundColor: '#DDEEF5' },
  pdfAttachment: { width: 178, height: 92, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10, backgroundColor: palette.surface },
  pdfIcon: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#EF3838' },
  pdfLabel: { color: '#FFFFFF', fontWeight: '700' },
  pdfInfo: { flex: 1, minWidth: 0, gap: 3 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tag: { backgroundColor: palette.primaryContainer },
  divider: { marginTop: 14 },
  engagementRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center' },
  bookmark: { marginLeft: 'auto' },
  answersHeader: { minHeight: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  answersTitle: { fontWeight: '700' },
  replyItem: { paddingVertical: 15, paddingHorizontal: 6 },
  teacherReply: { padding: 14, borderWidth: 1, borderColor: '#D5E5FF', borderRadius: 12, backgroundColor: '#F5F8FF' },
  replyHeader: { flexDirection: 'row', alignItems: 'center' },
  replyAuthorWrap: { flex: 1, minWidth: 0, marginLeft: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  replyName: { flexShrink: 1, fontWeight: '700' },
  teacherBadge: { flexShrink: 0, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#CFE0FF', borderRadius: 8, color: palette.primary, backgroundColor: palette.surface },
  moreButton: { marginRight: -8 },
  replyBody: { marginTop: 12, lineHeight: 26 },
  replyActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  replyDivider: { marginVertical: 2 },
  composerArea: { padding: 10, backgroundColor: palette.surface },
  composer: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingLeft: 3, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 12, overflow: 'hidden', backgroundColor: palette.surface },
  replyInput: { flex: 1, minWidth: 0, height: 48, backgroundColor: palette.surface },
  composerIcon: { width: 36, height: 36, margin: 0 },
  sendButton: { width: 36, height: 36, marginHorizontal: 4 },
});

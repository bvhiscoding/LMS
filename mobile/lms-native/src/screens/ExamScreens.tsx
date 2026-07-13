import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, Chip, Icon, IconButton, ProgressBar, Snackbar, Surface, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { getExam, getExamQuestions } from '../data/exams';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type DetailProps = NativeStackScreenProps<RootStackParamList, 'ExamDetail'>;
type TakingProps = NativeStackScreenProps<RootStackParamList, 'ExamTaking'>;
type ResultProps = NativeStackScreenProps<RootStackParamList, 'ExamResult'>;

function ExamMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Icon source={icon} size={22} color="#08124F" />
      <Text variant="bodySmall" style={styles.metricLabel}>{label}</Text>
      <Text variant="bodyMedium" style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function InfoSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <Card mode="elevated" style={styles.infoCard}>
      <Card.Content style={styles.infoContent}>
        <View style={styles.infoIcon}><Icon source={icon} size={28} color={palette.primary} /></View>
        <View style={styles.infoBody}>
          <Text variant="titleLarge" style={styles.bold}>{title}</Text>
          {children}
        </View>
      </Card.Content>
    </Card>
  );
}

export function ExamDetailScreen({ navigation, route }: DetailProps) {
  const exam = getExam(route.params.examId);
  const [roomCode, setRoomCode] = useState('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Chi tiết bài thi"
        onBack={navigation.goBack}
        actions={[
          { icon: 'share-variant-outline', onPress: () => undefined, accessibilityLabel: 'Chia sẻ bài thi' },
          { icon: 'dots-vertical', onPress: () => undefined, accessibilityLabel: 'Tùy chọn bài thi' },
        ]}
      />

      <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
        <Card mode="outlined" style={styles.examHero}>
          <Card.Content>
            <View style={styles.examHeroTop}>
              <View style={styles.examIllustration}>
                <Icon source="code-tags" size={46} color={palette.primary} />
                <View style={styles.graduationBadge}><Icon source="graduation-cap" size={22} color="#FFFFFF" /></View>
              </View>
              <View style={styles.examHeroText}>
                <Text variant="headlineSmall" style={styles.heroExamTitle}>{exam.title}</Text>
                <Text variant="titleMedium" style={styles.muted}>{exam.subject}</Text>
                <Chip compact icon="clock-outline" style={styles.statusChip}>{exam.status}</Chip>
              </View>
            </View>
            <View style={styles.metricsRow}>
              <ExamMetric icon="calendar-outline" label="Thời gian bắt đầu" value={exam.startTime} />
              <ExamMetric icon="clock-outline" label="Thời lượng" value={`${exam.durationMinutes} phút`} />
              <ExamMetric icon="clipboard-list" label="Số câu hỏi" value={`${exam.questionCount} câu`} />
              <ExamMetric icon="repeat" label="Số lần làm" value={exam.attempts} />
            </View>
          </Card.Content>
        </Card>

        <InfoSection icon="file-document-outline" title="1. Quy định thi">
          {['Không thoát ứng dụng khi đang làm bài.', 'Không làm mới màn hình hoặc sử dụng phím điều hướng.', 'Bài thi sẽ tự động nộp khi hết thời gian.', 'Cần hoàn thành bài thi trong thời gian quy định.', 'Mọi hành vi gian lận sẽ bị xử lý theo quy định của hệ thống.'].map((rule) => (
            <View key={rule} style={styles.ruleRow}><Text style={styles.ruleBullet}>•</Text><Text variant="bodyMedium" style={styles.ruleText}>{rule}</Text></View>
          ))}
        </InfoSection>

        <InfoSection icon="clipboard-check" title="2. Điều kiện tham gia">
          <View style={styles.conditionRow}>
            <Icon source="check-circle-outline" size={24} color={palette.success} />
            <Text variant="bodyMedium" style={styles.conditionText}>Đã hoàn thành 100% nội dung bắt buộc</Text>
            <Chip compact textStyle={{ color: palette.success }} style={styles.passChip}>Đạt</Chip>
          </View>
        </InfoSection>

        <InfoSection icon="key" title="3. Mã phòng thi">
          <TextInput
            mode="outlined"
            value={roomCode}
            onChangeText={setRoomCode}
            placeholder="Nhập mã phòng thi"
            right={<TextInput.Icon icon="qrcode" />}
            style={styles.roomInput}
          />
        </InfoSection>

        <View style={styles.notice}>
          <Icon source="information-outline" size={22} color={palette.primary} />
          <Text variant="bodySmall" style={styles.noticeText}>Vui lòng kiểm tra đầy đủ điều kiện trước khi bắt đầu.</Text>
        </View>
        <Button mode="contained" icon="play" onPress={() => navigation.navigate('ExamTaking', { examId: exam.id })} contentStyle={styles.startButtonContent} style={styles.startButton}>
          Bắt đầu làm bài
        </Button>
      </ScrollView>
      <AppBottomBar activeKey="courses" />
    </SafeAreaView>
  );
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

export function ExamTakingScreen({ navigation, route }: TakingProps) {
  const exam = getExam(route.params.examId);
  const questions = useMemo(() => getExamQuestions(exam.id), [exam.id]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [remainingSeconds, setRemainingSeconds] = useState(exam.durationMinutes * 60);
  const [message, setMessage] = useState('');
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const timer = setInterval(() => setRemainingSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleBookmark = () => {
    setBookmarked((current) => {
      const next = new Set(current);
      if (next.has(question.id)) next.delete(question.id); else next.add(question.id);
      return next;
    });
  };

  const goNext = () => {
    if (answers[question.id] === undefined) {
      setMessage('Hãy chọn một đáp án trước khi sang câu tiếp theo.');
      return;
    }
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
  };

  const submit = () => {
    const correct = questions.reduce((total, item) => total + (answers[item.id] === item.correctIndex ? 1 : 0), 0);
    navigation.navigate('ExamResult', { examId: exam.id, answered: answeredCount, bookmarked: bookmarked.size, correct });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.takingSafeArea}>
      <AppTopBar title="Làm bài thi" onBack={navigation.goBack} backgroundColor={palette.primary} foregroundColor="#FFFFFF" />
      <ScrollView style={styles.takingScroll} contentContainerStyle={styles.takingContent} showsVerticalScrollIndicator={false}>
        <View style={styles.examProgressHeader}>
          <View style={styles.examProgressText}>
            <Text variant="titleLarge" style={styles.bold}>{exam.title}</Text>
            <Text variant="titleMedium">Câu <Text style={styles.primaryBold}>{question.id}</Text>/{questions.length}</Text>
          </View>
          <View style={styles.timerPill}><Icon source="clock-outline" size={24} color={palette.primary} /><Text variant="titleLarge" style={styles.primaryBold}>{formatTime(remainingSeconds)}</Text></View>
        </View>
        <View style={styles.questionProgressTrack}>
          <ProgressBar progress={(currentIndex + 1) / questions.length} style={styles.questionProgress} />
        </View>

        <Card mode="elevated" style={styles.questionCard}>
          <Card.Content style={styles.questionContent}>
            <View style={styles.questionNumberRow}>
              <Text variant="titleLarge" style={styles.primaryBold}>Câu {question.id}.</Text>
              <IconButton icon={bookmarked.has(question.id) ? 'bookmark' : 'bookmark-outline'} iconColor={bookmarked.has(question.id) ? '#FF6B00' : palette.primary} onPress={toggleBookmark} />
            </View>
            <Text variant="headlineSmall" style={styles.questionPrompt}>{question.prompt}</Text>
            <View style={styles.answerList}>
              {question.answers.map((answer, answerIndex) => {
                const selected = answers[question.id] === answerIndex;
                return (
                  <Pressable key={answer} onPress={() => setAnswers((current) => ({ ...current, [question.id]: answerIndex }))} style={[styles.answerOption, selected && styles.answerOptionSelected]}>
                    <View style={styles.answerLetter}><Text variant="titleMedium" style={styles.primaryBold}>{String.fromCharCode(65 + answerIndex)}</Text></View>
                    <Text variant="titleMedium" style={styles.answerText}>{answer}</Text>
                    <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.autosave}><Icon source="check-circle-outline" size={20} color={palette.primary} /><Text variant="bodySmall" style={styles.muted}>Đáp án sẽ được tự động lưu</Text></View>
          </Card.Content>
        </Card>

        <View style={styles.questionActions}>
          <Button mode="outlined" icon="chevron-left" disabled={currentIndex === 0} onPress={() => setCurrentIndex((index) => Math.max(0, index - 1))} style={styles.questionAction} contentStyle={styles.questionActionContent}>Câu trước</Button>
          {currentIndex === questions.length - 1 ? (
            <Button mode="contained" icon="send" onPress={submit} style={styles.questionAction} contentStyle={styles.questionActionContent}>Nộp bài</Button>
          ) : (
            <Button mode="contained" icon="chevron-right" onPress={goNext} style={styles.questionAction} contentStyle={styles.questionActionContent}>Câu tiếp theo</Button>
          )}
        </View>

        <Card mode="elevated" style={styles.navigatorCard}>
          <Card.Content>
            <View style={styles.numberGrid}>
              {questions.map((item, index) => {
                const answered = answers[item.id] !== undefined;
                const active = index === currentIndex;
                return (
                  <Pressable key={item.id} onPress={() => setCurrentIndex(index)} style={[styles.questionNumber, answered && styles.questionNumberAnswered, active && styles.questionNumberActive]}>
                    <Text variant="labelMedium" style={active ? styles.questionNumberActiveText : answered ? styles.questionNumberAnsweredText : undefined}>{item.id}</Text>
                    {bookmarked.has(item.id) ? <View style={styles.bookmarkMarker}><Icon source="bookmark" size={9} color="#FF6B00" /></View> : null}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: palette.success }]} /><Text variant="bodySmall">Đã trả lời</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: palette.primary }]} /><Text variant="bodySmall">Đang làm</Text></View>
              <View style={styles.legendItem}><Icon source="bookmark" size={14} color="#FF6B00" /><Text variant="bodySmall">Xem lại</Text></View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      <Surface elevation={3} style={styles.submitDock}>
        <Button mode="contained" icon="send" onPress={submit} style={styles.submitDockButton} contentStyle={styles.submitDockContent}>
          Nộp bài ({answeredCount}/{questions.length})
        </Button>
      </Surface>
      <Snackbar visible={Boolean(message)} onDismiss={() => setMessage('')} duration={2300}>{message}</Snackbar>
    </SafeAreaView>
  );
}

function SummaryRow({ icon, color, label, value }: { icon: string; color: string; label: string; value: number }) {
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryIcon, { backgroundColor: `${color}14` }]}><Icon source={icon} size={23} color={color} /></View>
      <Text variant="titleMedium" style={styles.summaryLabel}>{label}</Text>
      <View style={styles.dashes} />
      <Text variant="titleMedium">{value}</Text>
    </View>
  );
}

export function ExamResultScreen({ navigation, route }: ResultProps) {
  const exam = getExam(route.params.examId);
  const unanswered = exam.questionCount - route.params.answered;
  const incorrect = route.params.answered - route.params.correct;
  const score = Math.round((route.params.correct / exam.questionCount) * 100) / 10;
  const passed = score >= 5;
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.resultSafeArea}>
        <AppTopBar title="Kết quả bài thi" backgroundColor={palette.primary} foregroundColor="#FFFFFF" />
        <ScrollView contentContainerStyle={styles.scoreContent} showsVerticalScrollIndicator={false}>
          <Card mode="elevated" style={styles.scoreHeroCard}>
            <Card.Content style={styles.scoreHeroContent}>
              <View style={[styles.resultBadge, { backgroundColor: passed ? '#E6F8EB' : '#FFF0E8' }]}>
                <Icon source={passed ? 'trophy' : 'circle-exclamation'} size={42} color={passed ? palette.success : '#E36A19'} />
              </View>
              <Text variant="headlineSmall" style={styles.bold}>{passed ? 'Chúc mừng, bạn đã đạt!' : 'Bạn chưa đạt yêu cầu'}</Text>
              <Text variant="bodyLarge" style={styles.scoreSubtitle}>{exam.title}</Text>
              <View style={[styles.scoreRing, { borderColor: passed ? palette.success : '#E36A19' }]}>
                <Text style={[styles.scoreNumber, { color: passed ? palette.success : '#E36A19' }]}>{score}</Text>
                <Text variant="bodyMedium" style={styles.muted}>/ 10 điểm</Text>
              </View>
              <Chip compact icon={passed ? 'check-circle' : 'circle-exclamation'} textStyle={{ color: passed ? palette.success : '#E36A19' }} style={passed ? styles.passedChip : styles.failedChip}>
                {passed ? 'Đạt' : 'Chưa đạt'}
              </Chip>
            </Card.Content>
          </Card>

          <Text variant="titleLarge" style={styles.resultSectionTitle}>Chi tiết kết quả</Text>
          <View style={styles.scoreStats}>
            <View style={[styles.scoreStat, styles.correctStat]}><Icon source="check" size={25} color={palette.success} /><Text variant="headlineSmall" style={styles.bold}>{route.params.correct}</Text><Text variant="bodySmall" style={styles.muted}>Câu đúng</Text></View>
            <View style={[styles.scoreStat, styles.incorrectStat]}><Icon source="close" size={25} color={palette.error} /><Text variant="headlineSmall" style={styles.bold}>{incorrect}</Text><Text variant="bodySmall" style={styles.muted}>Câu sai</Text></View>
            <View style={[styles.scoreStat, styles.emptyStat]}><Icon source="circle-outline" size={25} color="#E38A17" /><Text variant="headlineSmall" style={styles.bold}>{unanswered}</Text><Text variant="bodySmall" style={styles.muted}>Bỏ trống</Text></View>
          </View>

          <Card mode="outlined" style={styles.feedbackCard}>
            <Card.Content style={styles.feedbackContent}>
              <Icon source="chart-line" size={28} color={palette.primary} />
              <View style={styles.feedbackText}>
                <Text variant="titleMedium" style={styles.bold}>Nhận xét bài làm</Text>
                <Text variant="bodyMedium" style={styles.muted}>{passed ? 'Bạn đã nắm khá tốt kiến thức HTML và CSS. Hãy xem lại các câu sai để củng cố thêm.' : 'Bạn nên ôn lại nội dung khóa học và xem kỹ các câu trả lời sai trước lần làm tiếp theo.'}</Text>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.scoreActions}>
            <Button mode="outlined" icon="eye" onPress={navigation.goBack} style={styles.scoreAction} contentStyle={styles.confirmButtonContent}>Xem lại bài làm</Button>
            <Button mode="contained" icon="book-open" onPress={() => navigation.navigate('Courses')} style={styles.scoreAction} contentStyle={styles.confirmButtonContent}>Về khóa học</Button>
          </View>
        </ScrollView>
        <AppBottomBar activeKey="courses" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.resultSafeArea}>
      <AppTopBar title="Xác nhận nộp bài" onBack={navigation.goBack} backgroundColor={palette.primary} foregroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
        <Card mode="elevated" style={styles.resultHero}>
          <Card.Content style={styles.resultHeroContent}>
            <View style={styles.resultHeroIcon}><Icon source="file-document-outline" size={38} color={palette.primary} /></View>
            <View style={styles.resultHeroText}>
              <Text variant="headlineSmall" style={styles.heroExamTitle}>{exam.title}</Text>
              <View style={styles.durationLine}><Icon source="clock-outline" size={22} color={palette.onSurfaceVariant} /><Text variant="titleMedium" style={styles.muted}>Thời gian làm bài: {exam.durationMinutes} phút</Text></View>
            </View>
            <View style={styles.resultQuestionCount}><Text variant="titleMedium">Câu <Text style={styles.primaryBold}>{route.params.answered}</Text>/{exam.questionCount}</Text></View>
          </Card.Content>
        </Card>

        <Text variant="headlineSmall" style={styles.resultSectionTitle}>Tổng quan bài làm</Text>
        <Card mode="outlined" style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <SummaryRow icon="format-list-bulleted" color={palette.primary} label="Tổng số câu" value={exam.questionCount} />
            <SummaryRow icon="check" color={palette.success} label="Đã làm" value={route.params.answered} />
            <SummaryRow icon="circle-outline" color="#FF7A00" label="Chưa làm" value={unanswered} />
            <SummaryRow icon="bookmark-outline" color="#7B2CE2" label="Đánh dấu xem lại" value={route.params.bookmarked} />
          </Card.Content>
        </Card>

        <View style={styles.warningBox}>
          <View style={styles.warningIcon}><Icon source="triangle-exclamation" size={30} color="#FF8A00" /></View>
          <View style={styles.warningText}><Text variant="titleMedium" style={styles.bold}>{unanswered > 0 ? `Bạn vẫn còn ${unanswered} câu chưa trả lời.` : 'Bạn đã trả lời tất cả câu hỏi.'}</Text><Text variant="bodyLarge" style={styles.muted}>Sau khi nộp bài, bạn sẽ không thể chỉnh sửa đáp án.</Text></View>
        </View>

        <Text variant="titleLarge" style={styles.confirmQuestion}>Bạn có chắc chắn muốn nộp bài thi không?</Text>
        <View style={styles.confirmActions}>
          <Button mode="outlined" onPress={navigation.goBack} style={styles.confirmButton} contentStyle={styles.confirmButtonContent}>Quay lại làm bài</Button>
          <Button mode="contained" onPress={() => setSubmitted(true)} style={styles.confirmButton} contentStyle={styles.confirmButtonContent}>Xác nhận nộp bài</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  whiteHeader: { backgroundColor: palette.surface },
  headerTitle: { color: '#08124F', fontWeight: '700' },
  detailScroll: { flex: 1 },
  detailContent: { padding: 14, paddingBottom: 18, gap: 12 },
  examHero: { borderColor: '#CFE0FF', backgroundColor: palette.surface },
  examHeroTop: { flexDirection: 'row', gap: 16, paddingVertical: 8 },
  examIllustration: { width: 118, minHeight: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#EAF2FF' },
  graduationBadge: { position: 'absolute', right: 8, bottom: 8, width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: palette.primary },
  examHeroText: { flex: 1, minWidth: 0, gap: 6 },
  heroExamTitle: { color: '#071047', fontWeight: '700', lineHeight: 31 },
  muted: { color: palette.onSurfaceVariant },
  statusChip: { alignSelf: 'flex-start', backgroundColor: palette.primaryContainer },
  metricsRow: { flexDirection: 'row', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.outlineVariant },
  metric: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: palette.outlineVariant },
  metricLabel: { textAlign: 'center', color: '#33406F' },
  metricValue: { textAlign: 'center', color: '#071047' },
  infoCard: { backgroundColor: palette.surface },
  infoContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 16 },
  infoIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#EDF3FF' },
  infoBody: { flex: 1, minWidth: 0, gap: 8 },
  bold: { color: palette.onSurface, fontWeight: '600' },
  ruleRow: { flexDirection: 'row', gap: 8 },
  ruleBullet: { color: '#071047' },
  ruleText: { flex: 1, color: '#1C2A62', lineHeight: 21 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  conditionText: { flex: 1, color: '#1C2A62' },
  passChip: { backgroundColor: palette.successContainer },
  roomInput: { backgroundColor: palette.surface },
  notice: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#C5D9FF', borderRadius: 10, backgroundColor: '#F4F8FF' },
  noticeText: { flexShrink: 1, color: palette.primary },
  startButton: { borderRadius: 9 },
  startButtonContent: { minHeight: 52 },
  takingSafeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  blueHeader: { minHeight: 68, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0868E8' },
  blueHeaderTitle: { flex: 1, textAlign: 'center', color: '#FFFFFF', fontWeight: '600' },
  headerPlaceholder: { width: 48 },
  takingScroll: { flex: 1 },
  takingContent: { padding: 16, paddingBottom: 28, gap: 16 },
  examProgressHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examProgressText: { flex: 1, gap: 8 },
  primaryBold: { color: palette.primary, fontWeight: '600' },
  timerPill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: '#BDD4FF', borderRadius: 14, backgroundColor: '#F4F8FF' },
  questionProgressTrack: { width: '100%', height: 6, overflow: 'hidden', borderRadius: 3 },
  questionProgress: { height: 6, borderRadius: 3 },
  questionCard: { backgroundColor: palette.surface },
  questionContent: { gap: 18, paddingVertical: 18 },
  questionNumberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questionPrompt: { fontWeight: '600', lineHeight: 32 },
  answerList: { gap: 11 },
  answerOption: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10 },
  answerOptionSelected: { borderColor: palette.primary, backgroundColor: '#F6F9FF' },
  answerLetter: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#EAF2FF' },
  answerText: { flex: 1 },
  radio: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#C8CDD7', borderRadius: 13 },
  radioSelected: { borderColor: palette.primary },
  radioDot: { width: 15, height: 15, borderRadius: 8, backgroundColor: palette.primary },
  autosave: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionActions: { flexDirection: 'row', gap: 12 },
  questionAction: { flex: 1, borderRadius: 9 },
  questionActionContent: { minHeight: 52 },
  navigatorCard: { backgroundColor: palette.surface },
  numberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  questionNumber: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D9DEE8', borderRadius: 18, backgroundColor: '#FFFFFF' },
  questionNumberAnswered: { borderColor: '#A8E0B4', backgroundColor: '#DFF6E4' },
  questionNumberActive: { borderColor: palette.primary, backgroundColor: '#E5EFFF' },
  questionNumberAnsweredText: { color: palette.success },
  questionNumberActiveText: { color: palette.primary, fontWeight: '600' },
  bookmarkMarker: { position: 'absolute', top: -5, right: -2 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  submitDock: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: palette.surface },
  submitDockButton: { borderRadius: 9 },
  submitDockContent: { minHeight: 48 },
  resultSafeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  resultContent: { padding: 20, gap: 18 },
  resultHero: { backgroundColor: palette.surface },
  resultHeroContent: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16, paddingVertical: 22 },
  resultHeroIcon: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 35, backgroundColor: '#EDF4FF' },
  resultHeroText: { flex: 1, minWidth: 200, gap: 12 },
  durationLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultQuestionCount: { width: '100%', paddingTop: 14, borderTopWidth: 1, borderTopColor: palette.outlineVariant },
  resultSectionTitle: { fontWeight: '700' },
  summaryCard: { backgroundColor: palette.surface },
  summaryContent: { gap: 14, paddingVertical: 18 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  summaryLabel: { minWidth: 130 },
  dashes: { flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: '#C8D1E1' },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderWidth: 1, borderColor: '#FFB44D', borderRadius: 12, backgroundColor: '#FFF9EF' },
  warningIcon: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, backgroundColor: '#FFE9BF' },
  warningText: { flex: 1, gap: 7 },
  confirmQuestion: { fontWeight: '700' },
  confirmActions: { flexDirection: 'row', gap: 12 },
  confirmButton: { flex: 1, borderRadius: 9 },
  confirmButtonContent: { minHeight: 54 },
  scoreContent: { padding: 18, paddingBottom: 28, gap: 16 },
  scoreHeroCard: { backgroundColor: palette.surface },
  scoreHeroContent: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  resultBadge: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 38 },
  scoreSubtitle: { textAlign: 'center', color: palette.onSurfaceVariant },
  scoreRing: { width: 142, height: 142, alignItems: 'center', justifyContent: 'center', marginVertical: 8, borderWidth: 9, borderRadius: 71, backgroundColor: '#FFFFFF' },
  scoreNumber: { fontSize: 43, lineHeight: 50, fontWeight: '700' },
  passedChip: { backgroundColor: palette.successContainer },
  failedChip: { backgroundColor: '#FFF0E8' },
  scoreStats: { flexDirection: 'row', gap: 10 },
  scoreStat: { flex: 1, minHeight: 112, alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 12, backgroundColor: palette.surface },
  correctStat: { borderColor: '#B9E8C4' },
  incorrectStat: { borderColor: '#F2C3C8' },
  emptyStat: { borderColor: '#F3D7A8' },
  feedbackCard: { backgroundColor: '#F6F9FF', borderColor: '#C8DAFF' },
  feedbackContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  feedbackText: { flex: 1, gap: 6 },
  scoreActions: { flexDirection: 'row', gap: 12 },
  scoreAction: { flex: 1, borderRadius: 9 },
});

import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Divider, Icon, ProgressBar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { CompetencyRadar } from '../components/RankingCharts';
import { getRankedStudent } from '../data/rankings';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CompetencyDetail'>;

const metrics = [
  { icon: 'file-pen', label: 'Điểm bài tập', weight: '20%', score: 88, suffix: '/100', color: '#145BE8', background: '#EAF2FF' },
  { icon: 'clipboard-check', label: 'Điểm kiểm tra', weight: '20%', score: 82, suffix: '/100', color: palette.success, background: palette.successContainer },
  { icon: 'graduation-cap', label: 'Điểm thi', weight: '30%', score: 90, suffix: '/100', color: '#804CE5', background: '#F0E8FF' },
  { icon: 'book-open', label: 'Tỷ lệ hoàn thành khóa học', weight: '15%', score: 78, suffix: '%', color: '#F27918', background: '#FFF1E3' },
  { icon: 'calendar-check', label: 'Điểm chuyên cần', weight: '10%', score: 95, suffix: '/100', color: '#0A8E94', background: '#E4F8F7' },
  { icon: 'comments', label: 'Điểm tương tác', weight: '5%', score: 70, suffix: '/100', color: '#F27918', background: '#FFF1E3' },
];

export function CompetencyDetailScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const student = getRankedStudent(route.params.studentId);
  const radarWidth = Math.max(145, Math.min(210, width * 0.46));

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Chi tiết năng lực"
        onBack={navigation.goBack}
        actions={[{ icon: 'share-variant-outline', onPress: () => undefined, accessibilityLabel: 'Chia sẻ chi tiết năng lực' }]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface elevation={3} style={styles.hero}>
          <Avatar.Icon size={74} icon="medal" color="#FFFFFF" style={styles.heroMedal} />
          <View style={styles.heroMain}>
            <Text variant="bodyMedium" style={styles.heroText}>Họ tên: <Text style={styles.heroBold}>{student.name}</Text></Text>
            <Text variant="bodyMedium" style={styles.heroText}>Điểm năng lực tổng hợp</Text>
            <Text style={styles.heroScore}>{student.score} <Text style={styles.heroScoreUnit}>điểm</Text></Text>
            <Text variant="labelMedium" style={styles.topBadge}>🏆 Top {student.rank}/350</Text>
          </View>
          <Divider style={styles.heroVertical} />
          <View style={styles.heroSide}>
            <View style={styles.heroSideRow}><Text style={styles.heroText}>Cấp độ hiện tại</Text><Text style={styles.levelBadge}>Cấp {student.level}</Text></View>
            <Divider style={styles.heroSideDivider} />
            <View style={styles.heroSideRow}><Text style={styles.heroText}>Trung bình đơn vị</Text><Text style={styles.heroBold}>810</Text></View>
            <Divider style={styles.heroSideDivider} />
            <Text variant="bodySmall" style={styles.aboveAverage}>▲ Cao hơn trung bình +55 điểm</Text>
          </View>
        </Surface>

        <Card mode="elevated" style={styles.breakdownCard}>
          <Card.Content>
            <View style={styles.cardHeading}><Icon source="chart-line" size={24} color={palette.primary} /><Text variant="titleLarge" style={styles.sectionTitle}>Cách hình thành điểm năng lực</Text><Icon source="information-outline" size={20} color={palette.onSurfaceVariant} /></View>
            <View style={styles.breakdownBody}>
              <View style={styles.radarWrap}>
                <CompetencyRadar width={radarWidth} height={210} />
                <View style={styles.legend}>
                  <View style={styles.legendItem}><View style={styles.legendBlue} /><Text variant="bodySmall" style={styles.muted}>Cá nhân</Text></View>
                  <View style={styles.legendItem}><View style={styles.legendPurple} /><Text variant="bodySmall" style={styles.muted}>Trung bình đơn vị</Text></View>
                </View>
              </View>
              <View style={styles.metrics}>
                {metrics.map((metric) => (
                  <View key={metric.label} style={styles.metricRow}>
                    <View style={[styles.metricIcon, { backgroundColor: metric.background }]}><Icon source={metric.icon} size={18} color={metric.color} /></View>
                    <View style={styles.metricMain}>
                      <View style={styles.metricLabelRow}>
                        <Text variant="bodySmall" numberOfLines={1} style={styles.metricLabel}>{metric.label} <Text style={styles.metricWeight}>({metric.weight})</Text></Text>
                        <Text variant="labelMedium" style={styles.metricScore}>{metric.score}{metric.suffix}</Text>
                      </View>
                      <ProgressBar progress={metric.score / 100} color={metric.color} style={styles.metricProgress} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.insightRow}>
          <Card mode="outlined" style={[styles.insightCard, styles.strengthCard]}>
            <Card.Content style={styles.insightContent}>
              <View style={styles.insightHeading}><Icon source="star" size={20} color={palette.success} /><Text variant="titleMedium" style={[styles.sectionTitle, styles.green]}>Điểm mạnh</Text></View>
              {['Chuyên cần rất tốt', 'Điểm thi cao', 'Hoàn thành bài tập đúng hạn'].map((item) => (
                <View key={item} style={styles.insightItem}><Icon source="circle-check" size={15} color={palette.success} /><Text variant="bodySmall" style={styles.insightText}>{item}</Text></View>
              ))}
            </Card.Content>
          </Card>
          <Card mode="outlined" style={[styles.insightCard, styles.improveCard]}>
            <Card.Content style={styles.insightContent}>
              <View style={styles.insightHeading}><Icon source="chart-line" size={20} color="#F26B13" /><Text variant="titleMedium" style={[styles.sectionTitle, styles.orange]}>Nội dung cần cải thiện</Text></View>
              {['Tăng tương tác trong thảo luận', 'Hoàn thành thêm học phần còn dở', 'Cải thiện điểm kiểm tra định kỳ'].map((item) => (
                <View key={item} style={styles.insightItem}><Icon source="circle-exclamation" size={15} color="#F26B13" /><Text variant="bodySmall" style={styles.insightText}>{item}</Text></View>
              ))}
            </Card.Content>
          </Card>
        </View>

        <Card mode="elevated" style={styles.recommendCard}>
          <View style={styles.recommendHeader}><View style={styles.cardHeading}><Icon source="lightbulb" size={22} color={palette.primary} /><Text variant="titleLarge" style={styles.sectionTitle}>Đề xuất cho bạn</Text></View><Button compact mode="text">Xem tất cả</Button></View>
          <Card.Content style={styles.recommendRow}>
            <View style={styles.courseSuggestion}>
              <View style={[styles.suggestionVisual, { backgroundColor: '#EAF2FF' }]}><Icon source="people-group" size={34} color={palette.primary} /></View>
              <View style={styles.suggestionText}><Text variant="titleSmall" numberOfLines={2} style={styles.sectionTitle}>Kỹ năng thuyết trình & làm việc nhóm</Text><Text variant="bodySmall" numberOfLines={2} style={styles.muted}>Giúp tăng điểm tương tác và làm việc nhóm hiệu quả</Text></View>
            </View>
            <View style={styles.courseSuggestion}>
              <View style={[styles.suggestionVisual, { backgroundColor: '#171F3E' }]}><Icon source="code" size={34} color="#FFB328" /></View>
              <View style={styles.suggestionText}><Text variant="titleSmall" numberOfLines={2} style={styles.sectionTitle}>JavaScript nâng cao – Bài kiểm tra thực hành</Text><Text variant="bodySmall" numberOfLines={2} style={styles.muted}>Nâng cao kỹ năng lập trình và cải thiện điểm kiểm tra</Text></View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button mode="contained" icon="chart-line" style={styles.actionButton} contentStyle={styles.actionContent} onPress={() => navigation.navigate('RankingHistory', { studentId: student.id })}>Xem lịch sử xếp hạng</Button>
          <Button mode="outlined" icon="trophy" style={styles.actionButton} contentStyle={styles.actionContent} onPress={() => navigation.navigate('Leaderboard')}>Xem bảng xếp hạng</Button>
        </View>
      </ScrollView>
      <AppBottomBar activeKey="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  content: { padding: 14, paddingBottom: 24 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, backgroundColor: '#0D5BE7' },
  heroMedal: { backgroundColor: '#5B8EF2', borderWidth: 2, borderColor: '#BFD6FF' },
  heroMain: { flex: 1.25, minWidth: 0, gap: 4 },
  heroText: { color: '#EAF2FF' },
  heroBold: { color: '#FFFFFF', fontWeight: '700' },
  heroScore: { color: '#FFFFFF', fontSize: 35, fontWeight: '800' },
  heroScoreUnit: { fontSize: 20 },
  topBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#9DBDFF', borderRadius: 12, color: '#FFFFFF' },
  heroVertical: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,.35)' },
  heroSide: { flex: 1, minWidth: 0, gap: 8 },
  heroSideRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden', borderRadius: 6, color: '#FFFFFF', backgroundColor: '#8059E9' },
  heroSideDivider: { backgroundColor: 'rgba(255,255,255,.25)' },
  aboveAverage: { color: '#76F07E' },
  breakdownCard: { marginTop: 14, borderRadius: 14, backgroundColor: palette.surface },
  cardHeading: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontWeight: '700', color: '#102E7A' },
  breakdownBody: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  radarWrap: { alignItems: 'center' },
  legend: { flexDirection: 'row', gap: 14, marginTop: -4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendBlue: { width: 24, height: 3, backgroundColor: palette.primary },
  legendPurple: { width: 24, height: 2, borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#9C7CFF' },
  muted: { color: palette.onSurfaceVariant },
  metrics: { flex: 1, minWidth: 0, gap: 10, paddingLeft: 8 },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  metricMain: { flex: 1, minWidth: 0 },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricLabel: { flex: 1, minWidth: 0, color: '#102E7A' },
  metricWeight: { color: '#6475A6' },
  metricScore: { color: '#102E7A', fontWeight: '700' },
  metricProgress: { height: 6, borderRadius: 3, marginTop: 5 },
  insightRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  insightCard: { flex: 1, borderRadius: 12 },
  strengthCard: { borderColor: '#BEE3CB', backgroundColor: '#F7FCF8' },
  improveCard: { borderColor: '#F5D0B5', backgroundColor: '#FFF9F4' },
  insightContent: { paddingHorizontal: 12, paddingVertical: 12 },
  insightHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  insightItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 7 },
  insightText: { flex: 1, minWidth: 0, lineHeight: 18, color: '#183680' },
  green: { color: '#11833A' },
  orange: { color: '#B44B0B' },
  recommendCard: { marginTop: 14, borderRadius: 14, backgroundColor: palette.surface },
  recommendHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12 },
  recommendRow: { flexDirection: 'row', gap: 10, paddingTop: 10 },
  courseSuggestion: { flex: 1, minWidth: 0, flexDirection: 'row', gap: 9, padding: 9, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 10 },
  suggestionVisual: { width: 64, minHeight: 74, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  suggestionText: { flex: 1, minWidth: 0, gap: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionButton: { flex: 1, borderRadius: 9 },
  actionContent: { minHeight: 48 },
});

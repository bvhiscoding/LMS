import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Divider, Icon, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { RankingLineChart, ScoreBarChart } from '../components/RankingCharts';
import { getRankedStudent } from '../data/rankings';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RankingHistory'>;

const rankChanges = [
  { icon: 'calendar', label: 'Tuần này', value: '+3 bậc' },
  { icon: 'calendar', label: 'Tháng này', value: '+5 bậc' },
  { icon: 'graduation-cap', label: 'Học kỳ này', value: '+8 bậc' },
  { icon: 'award', label: 'Từ đầu năm', value: '+12 bậc' },
];

const activities = [
  { icon: 'book-open', title: 'Hoàn thành khóa học “Lập trình Web nâng cao”', date: '25/05/2025', points: '+40 điểm', rank: '↑ 3 bậc', color: palette.success, background: palette.successContainer },
  { icon: 'medal', title: 'Nhận huy hiệu “Học viên tích cực”', date: '24/05/2025', points: '+20 điểm', rank: '', color: '#F2A311', background: '#FFF3DC' },
  { icon: 'clipboard-list', title: 'Đạt 9.0 điểm bài thi cuối khóa', date: '22/05/2025', points: '+25 điểm', rank: '↑ 2 bậc', color: '#8251E6', background: '#F0E8FF' },
  { icon: 'clipboard-check', title: 'Hoàn thành bài tập đúng hạn', date: '20/05/2025', points: '+10 điểm', rank: '', color: palette.primary, background: palette.primaryContainer },
];

const achievements = [
  { icon: 'user-check', title: 'Học viên tích cực', date: '24/05/2025', color: palette.success, background: palette.successContainer },
  { icon: 'calendar-check', title: 'Hoàn thành đúng hạn', date: '20/05/2025', color: palette.primary, background: palette.primaryContainer },
  { icon: 'chart-line', title: 'Top tiến bộ', date: '18/05/2025', color: '#8251E6', background: '#F0E8FF' },
  { icon: 'trophy', title: 'Điểm thi xuất sắc', date: '22/05/2025', color: '#F27918', background: '#FFF1E3' },
];

export function RankingHistoryScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const student = getRankedStudent(route.params.studentId);
  const chartWidth = Math.max(150, (width - 54) / 2);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Lịch sử xếp hạng"
        onBack={navigation.goBack}
        backLabel="Quay lại chi tiết năng lực"
        actions={[{ icon: 'share-variant-outline', onPress: () => undefined, accessibilityLabel: 'Chia sẻ lịch sử xếp hạng' }]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface elevation={3} style={styles.hero}>
          <Avatar.Image size={76} source={{ uri: student.avatar }} style={styles.heroAvatar} />
          <View style={styles.heroIdentity}>
            <Text variant="bodyMedium" style={styles.heroText}>Họ tên: <Text style={styles.heroBold}>{student.name}</Text></Text>
            <Text variant="bodySmall" style={styles.heroText}>Hạng hiện tại</Text>
            <Text style={styles.heroRank}>{student.rank}<Text style={styles.heroRankTotal}>/350</Text></Text>
            <Text variant="labelMedium" style={styles.topBadge}>🏆 Top {student.rank}/350</Text>
          </View>
          <Divider style={styles.heroDivider} />
          <View style={styles.heroStat}><Text variant="bodyMedium" style={styles.heroText}>Thay đổi gần nhất</Text><Text variant="titleLarge" style={styles.heroGreen}>▲ tăng 3 bậc</Text><Text variant="bodySmall" style={styles.heroText}>Cập nhật: 26/05/2025</Text></View>
          <Divider style={styles.heroDivider} />
          <View style={styles.heroStat}><Text variant="bodyMedium" style={styles.heroText}>Điểm năng lực hiện tại</Text><Text style={styles.heroScore}>{student.score} <Text style={styles.heroScoreUnit}>điểm</Text></Text></View>
        </Surface>

        <View style={styles.chartRow}>
          <Card mode="elevated" style={styles.chartCard}>
            <View style={styles.cardClip}>
              <View style={styles.chartHeader}><View style={styles.titleWithIcon}><Icon source="chart-line" size={19} color={palette.primary} /><Text variant="titleSmall" style={styles.sectionTitle}>Biểu đồ thay đổi thứ hạng</Text></View><Text variant="labelSmall" style={styles.periodBadge}>Tuần</Text></View>
              <RankingLineChart width={chartWidth - 12} height={180} />
              <Text variant="bodySmall" style={styles.chartNote}>Thứ hạng càng thấp càng tốt</Text>
            </View>
          </Card>
          <Card mode="elevated" style={styles.chartCard}>
            <View style={styles.cardClip}>
              <View style={styles.chartHeader}><View style={styles.titleWithIcon}><Icon source="chart-column" size={19} color={palette.primary} /><Text variant="titleSmall" style={styles.sectionTitle}>Điểm năng lực theo thời gian</Text></View><Text variant="labelSmall" style={styles.periodBadge}>Tuần</Text></View>
              <ScoreBarChart width={chartWidth - 12} height={180} />
            </View>
          </Card>
        </View>

        <View style={styles.detailRow}>
          <Card mode="elevated" style={styles.detailCard}>
            <View style={styles.cardClip}>
              <View style={styles.detailHeader}><Icon source="arrow-trend-up" size={20} color={palette.primary} /><Text variant="titleMedium" style={styles.sectionTitle}>Lịch sử tăng / giảm thứ hạng</Text></View>
              <Divider />
              {rankChanges.map((item, index) => (
                <View key={item.label}>
                  <View style={styles.rankChangeRow}>
                    <View style={styles.smallIcon}><Icon source={item.icon} size={17} color={palette.primary} /></View>
                    <Text variant="bodyMedium" style={styles.flexText}>{item.label}</Text>
                    <Text variant="bodyMedium" style={styles.positive}>▲ {item.value}</Text>
                  </View>
                  {index < rankChanges.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </View>
          </Card>

          <Card mode="elevated" style={styles.detailCard}>
            <View style={styles.cardClip}>
              <View style={styles.detailHeader}><Icon source="clock-outline" size={20} color={palette.primary} /><Text variant="titleMedium" style={styles.sectionTitle}>Hoạt động làm thay đổi điểm</Text></View>
              <Divider />
              {activities.map((item) => (
                <View key={item.title} style={styles.activityRow}>
                  <View style={[styles.activityIcon, { backgroundColor: item.background }]}><Icon source={item.icon} size={17} color={item.color} /></View>
                  <View style={styles.activityText}><Text variant="bodySmall" numberOfLines={2} style={styles.activityTitle}>{item.title}</Text><Text variant="labelSmall" style={styles.muted}>{item.date}</Text></View>
                  <View style={styles.activityPoints}><Text variant="labelMedium" style={styles.blue}>{item.points}</Text>{item.rank ? <Text variant="labelSmall" style={styles.positive}>{item.rank}</Text> : null}</View>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <Card mode="elevated" style={styles.achievementCard}>
          <View style={styles.detailHeader}><Icon source="trophy" size={20} color={palette.primary} /><Text variant="titleMedium" style={styles.sectionTitle}>Thành tích & huy hiệu</Text></View>
          <Card.Content style={styles.achievementRow}>
            {achievements.map((item) => (
              <View key={item.title} style={[styles.achievement, { borderColor: item.color }]}>
                <Avatar.Icon size={46} icon={item.icon} color="#FFFFFF" style={{ backgroundColor: item.color }} />
                <Text variant="labelMedium" numberOfLines={2} style={styles.achievementTitle}>{item.title}</Text>
                <Text variant="labelSmall" style={styles.muted}>Đạt ngày {item.date}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button mode="outlined" icon="shield" style={styles.actionButton} contentStyle={styles.actionContent} onPress={() => navigation.navigate('CompetencyDetail', { studentId: student.id })}>Chi tiết năng lực</Button>
          <Button mode="contained" icon="trophy" style={styles.actionButton} contentStyle={styles.actionContent} onPress={() => navigation.navigate('Leaderboard')}>Bảng xếp hạng</Button>
        </View>
      </ScrollView>
      <AppBottomBar activeKey="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  content: { padding: 12, paddingBottom: 22 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, backgroundColor: '#0B5DE9' },
  heroAvatar: { borderWidth: 2, borderColor: '#FFFFFF' },
  heroIdentity: { flex: 1, minWidth: 0, gap: 3 },
  heroText: { color: '#EAF2FF' },
  heroBold: { color: '#FFFFFF', fontWeight: '700' },
  heroRank: { color: '#FFFFFF', fontSize: 34, fontWeight: '800' },
  heroRankTotal: { fontSize: 20 },
  topBadge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#A8C5FF', borderRadius: 11, color: '#FFFFFF' },
  heroDivider: { width: 1, height: '76%', backgroundColor: 'rgba(255,255,255,.35)' },
  heroStat: { flex: 1, minWidth: 0, alignItems: 'center', gap: 7 },
  heroGreen: { color: '#5AE568', fontWeight: '700', textAlign: 'center' },
  heroScore: { color: '#FFFFFF', fontSize: 29, fontWeight: '800', textAlign: 'center' },
  heroScoreUnit: { fontSize: 17 },
  chartRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chartCard: { flex: 1, minWidth: 0, borderRadius: 13, backgroundColor: palette.surface },
  cardClip: { overflow: 'hidden', borderRadius: 13 },
  chartHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, paddingHorizontal: 10 },
  titleWithIcon: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { flexShrink: 1, fontWeight: '700', color: '#102E7A' },
  periodBadge: { paddingHorizontal: 9, paddingVertical: 4, overflow: 'hidden', borderRadius: 10, color: '#FFFFFF', backgroundColor: palette.primary },
  chartNote: { paddingBottom: 10, color: palette.onSurfaceVariant, textAlign: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10, marginTop: 12 },
  detailCard: { flex: 1, minWidth: 0, borderRadius: 13, backgroundColor: palette.surface },
  detailHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  rankChangeRow: { minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10 },
  smallIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: palette.primaryContainer },
  flexText: { flex: 1, minWidth: 0 },
  positive: { color: palette.success },
  activityRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8 },
  activityIcon: { width: 32, height: 32, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  activityText: { flex: 1, minWidth: 0 },
  activityTitle: { color: '#102E7A', lineHeight: 16 },
  activityPoints: { flexShrink: 0, alignItems: 'flex-end' },
  muted: { color: palette.onSurfaceVariant },
  blue: { color: palette.primary, fontWeight: '700' },
  achievementCard: { marginTop: 12, borderRadius: 13, backgroundColor: palette.surface },
  achievementRow: { flexDirection: 'row', gap: 9, paddingTop: 4 },
  achievement: { flex: 1, minWidth: 0, alignItems: 'center', gap: 5, padding: 8, borderWidth: 1, borderRadius: 11 },
  achievementTitle: { color: '#102E7A', fontWeight: '700', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionButton: { flex: 1, borderRadius: 9 },
  actionContent: { minHeight: 48 },
});

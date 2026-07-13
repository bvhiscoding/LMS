import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Card, Divider, Icon, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { currentStudent, rankedStudents, type RankedStudent } from '../data/rankings';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

const filters = [
  { icon: 'building', label: 'Toàn đơn vị', color: palette.primary },
  { icon: 'school', label: 'Khoa CNTT', color: '#8A4EF5' },
  { icon: 'users', label: 'K65 CNTT', color: palette.success },
  { icon: 'book-open-page-variant', label: 'Lập trình Web nâng cao', color: '#F47A19' },
  { icon: 'calendar', label: 'Tháng 5', color: palette.primary },
  { icon: 'book', label: 'Học kỳ II', color: '#8A4EF5' },
  { icon: 'graduation-cap', label: 'Năm học 2024–2025', color: palette.primary },
];

function RankCell({ rank }: { rank: number }) {
  if (rank > 3) return <Text variant="titleMedium" style={styles.rankText}>{rank}</Text>;
  const colors = rank === 1 ? ['#F2A900', '#FFF0A8'] : rank === 2 ? ['#9BA7BA', '#E5EAF2'] : ['#C86D3D', '#F6C2A4'];
  return (
    <View style={[styles.medal, { backgroundColor: colors[0], borderColor: colors[1] }]}>
      <Text style={styles.medalText}>{rank}</Text>
    </View>
  );
}

function StudentRow({ student, onPress }: { student: RankedStudent; onPress: () => void }) {
  const isCurrent = student.id === currentStudent.id;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Xem năng lực của ${student.name}`}>
      <View style={[styles.studentRow, isCurrent && styles.currentStudentRow]}>
        <View style={[styles.rankColumn, isCurrent && styles.currentRankColumn]}><RankCell rank={student.rank} /></View>
        <Avatar.Image size={42} source={{ uri: student.avatar }} />
        <View style={styles.studentInfo}>
          <Text variant="titleSmall" numberOfLines={1} style={[styles.studentName, isCurrent && styles.currentName]}>{isCurrent ? `Bạn (${student.name})` : student.name}</Text>
          <Text variant="bodySmall" style={styles.muted}>{student.cohort}</Text>
        </View>
        <Text variant="titleMedium" style={styles.score}>{student.score.toLocaleString('vi-VN')}</Text>
        <Text variant="labelMedium" style={styles.level}>Cấp {student.level}</Text>
        <Text variant="bodyMedium" style={[styles.trend, student.trend > 0 ? styles.up : student.trend < 0 ? styles.down : styles.muted]}>
          {student.trend > 0 ? `▲ ${student.trend}` : student.trend < 0 ? `▼ ${Math.abs(student.trend)}` : '–'}
        </Text>
      </View>
    </Pressable>
  );
}

export function LeaderboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Bảng xếp hạng"
        onBack={navigation.goBack}
        backLabel="Quay lại tổng quan xếp hạng"
        actions={[{ icon: 'sliders', onPress: () => undefined, accessibilityLabel: 'Bộ lọc bảng xếp hạng' }]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface elevation={1} style={styles.filterPanel}>
          <View style={styles.filterGrid}>
            {filters.map((filter) => (
              <Pressable key={filter.label} style={styles.filterField} accessibilityRole="button">
                <Icon source={filter.icon} size={19} color={filter.color} />
                <Text variant="bodyMedium" numberOfLines={1} style={styles.filterText}>{filter.label}</Text>
                <Icon source="chevron-down" size={16} color="#173C91" />
              </Pressable>
            ))}
          </View>
        </Surface>

        <Card mode="elevated" style={styles.tableCard}>
          <View style={styles.tableCardClip}>
            <View style={styles.tableTitleBar}>
              <View style={styles.tableTitle}><Icon source="users" size={23} color={palette.primary} /><Text variant="titleLarge" style={styles.semibold}>350 sinh viên</Text></View>
              <Text variant="bodySmall" style={styles.muted}>Cập nhật: Hôm nay, 09:30</Text>
            </View>
            <Divider />
            <View style={styles.tableHeader}>
              <Text style={styles.headerRank}>Hạng</Text>
              <Text style={styles.headerStudent}>Sinh viên</Text>
              <Text style={styles.headerScore}>Điểm</Text>
              <Text style={styles.headerLevel}>Cấp độ</Text>
              <Text style={styles.headerTrend}>Tăng/Giảm</Text>
            </View>
            <Divider />
            {rankedStudents.map((student, index) => (
              <View key={student.id}>
                <StudentRow student={student} onPress={() => navigation.navigate('CompetencyDetail', { studentId: student.id })} />
                {index < rankedStudents.length - 1 ? <Divider style={styles.rowDivider} /> : null}
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.note}>
          <Icon source="information-outline" size={18} color={palette.onSurfaceVariant} />
          <Text variant="bodySmall" style={styles.muted}>Xếp hạng được tính dựa trên điểm năng lực trong khoảng thời gian đã chọn.</Text>
        </View>
      </ScrollView>
      <AppBottomBar activeKey="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  content: { padding: 14, paddingBottom: 22 },
  filterPanel: { padding: 10, borderRadius: 14, backgroundColor: palette.surface },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterField: { minWidth: '30%', flexGrow: 1, flexBasis: 105, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#D7E2F4', borderRadius: 9 },
  filterText: { flex: 1, minWidth: 0, color: '#102E7A' },
  tableCard: { marginTop: 14, borderRadius: 14, backgroundColor: palette.surface },
  tableCardClip: { overflow: 'hidden', borderRadius: 14 },
  tableTitleBar: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 12, backgroundColor: '#F5F9FF' },
  tableTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  semibold: { fontWeight: '700' },
  muted: { color: palette.onSurfaceVariant },
  tableHeader: { height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7 },
  headerRank: { width: 43, textAlign: 'center', color: palette.onSurfaceVariant, fontSize: 11 },
  headerStudent: { flex: 1, color: palette.onSurfaceVariant, fontSize: 11 },
  headerScore: { width: 48, textAlign: 'center', color: palette.onSurfaceVariant, fontSize: 11 },
  headerLevel: { width: 48, textAlign: 'center', color: palette.onSurfaceVariant, fontSize: 11 },
  headerTrend: { width: 55, textAlign: 'center', color: palette.onSurfaceVariant, fontSize: 10 },
  studentRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 7 },
  currentStudentRow: { margin: 2, borderWidth: 1.5, borderColor: palette.primary, borderRadius: 10, backgroundColor: '#F0F5FF' },
  rankColumn: { width: 36, alignItems: 'center' },
  currentRankColumn: { alignSelf: 'stretch', justifyContent: 'center', marginLeft: -8, backgroundColor: palette.primary },
  rankText: { color: '#0B2C82' },
  medal: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderRadius: 16 },
  medalText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  studentInfo: { flex: 1, minWidth: 0 },
  studentName: { color: '#12347B', fontWeight: '600' },
  currentName: { color: palette.primary, fontWeight: '800' },
  score: { width: 48, color: palette.primary, textAlign: 'center', fontWeight: '700' },
  level: { width: 48, overflow: 'hidden', paddingVertical: 4, borderRadius: 7, color: '#8750E6', textAlign: 'center', backgroundColor: '#F0E8FF' },
  trend: { width: 55, textAlign: 'center' },
  up: { color: palette.success },
  down: { color: palette.error },
  rowDivider: { marginLeft: 50 },
  note: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 14, paddingHorizontal: 8 },
});

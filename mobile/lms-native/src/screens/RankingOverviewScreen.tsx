import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Divider, Icon, ProgressBar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { currentStudent, nearbyStudents, podiumStudents } from '../data/rankings';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RankingOverview'>;

const podiumColors = {
  1: { border: '#F4BD2E', background: '#FFF7D5', badge: '#F3AF15' },
  2: { border: '#CAD2E3', background: '#F6F8FC', badge: '#AAB4C7' },
  3: { border: '#EAB79F', background: '#FFF3ED', badge: '#D98555' },
} as const;

export function RankingOverviewScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Xếp hạng năng lực"
        subtitle="Tổng quan thành tích học tập"
        onBack={navigation.goBack}
        backLabel="Quay lại trang cá nhân"
        actions={[{ icon: 'help-circle-outline', onPress: () => undefined, accessibilityLabel: 'Trợ giúp xếp hạng' }]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface elevation={3} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text variant="bodyLarge" style={styles.heroLabel}>Thứ hạng hiện tại</Text>
              <Text style={styles.heroRank}>12<Text style={styles.heroRankTotal}>/350</Text></Text>
            </View>
            <Avatar.Icon size={74} icon="crown" style={styles.crown} color="#FFFFFF" />
          </View>
          <Divider style={styles.heroDivider} />
          <View style={styles.heroStats}>
            {[
              ['star', 'Điểm năng lực', '1.280'],
              ['shield', 'Cấp độ hiện tại', 'Level 8'],
              ['award', 'XP tích lũy', '8.450 XP'],
              ['gift', 'Điểm đổi quà', '320 điểm'],
            ].map(([icon, label, value]) => (
              <View key={label} style={styles.heroStat}>
                <Icon source={icon} size={20} color="#FFFFFF" />
                <Text variant="labelSmall" style={styles.heroStatLabel}>{label}</Text>
                <Text variant="titleMedium" numberOfLines={1} style={styles.heroStatValue}>{value}</Text>
              </View>
            ))}
          </View>
        </Surface>

        <Card mode="elevated" style={styles.gapCard}>
          <Card.Content style={styles.gapContent}>
            <View style={styles.changeBlock}>
              <Text variant="bodyMedium">Thay đổi thứ hạng</Text>
              <View style={styles.changeRow}><Icon source="arrow-up" size={28} color={palette.success} /><Text style={styles.changeValue}>+3</Text></View>
              <Text variant="bodySmall" style={styles.muted}>So với tuần trước</Text>
            </View>
            <Divider style={styles.verticalDivider} />
            <View style={styles.nextRank}>
              <Text variant="bodyMedium">Khoảng cách tới hạng tiếp theo</Text>
              <Text variant="bodyLarge" style={styles.nextText}>Còn <Text style={styles.blueBold}>45 điểm</Text> để lên hạng 11</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}><ProgressBar progress={0.75} style={styles.progress} /></View>
                <Text style={styles.blueBold}>75%</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}><Icon source="trophy" size={22} color="#F4A700" /><Text variant="titleLarge" style={styles.sectionTitle}>Top 3 học viên</Text></View>
          <Button mode="text" compact icon="chevron-right" contentStyle={styles.rowReverse} onPress={() => navigation.navigate('Leaderboard')}>Xem tất cả</Button>
        </View>
        <View style={styles.podiumRow}>
          {podiumStudents.map((student) => {
            const colors = podiumColors[student.rank as 1 | 2 | 3];
            return (
              <Pressable key={student.id} style={[styles.podiumCard, { borderColor: colors.border, backgroundColor: colors.background }, student.rank === 1 && styles.firstPlace]} onPress={() => navigation.navigate('CompetencyDetail', { studentId: currentStudent.id })}>
                <View style={[styles.rankBadge, { backgroundColor: colors.badge }]}><Text style={styles.rankBadgeText}>{student.rank}</Text></View>
                <Avatar.Image size={58} source={{ uri: student.avatar }} style={styles.podiumAvatar} />
                <Text variant="titleSmall" numberOfLines={1} style={styles.podiumName}>{student.name}</Text>
                <Text variant="titleSmall" style={styles.podiumScore}>{student.score.toLocaleString('vi-VN')} XP</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}><Icon source="users" size={22} color={palette.primary} /><Text variant="titleLarge" style={styles.sectionTitle}>Xếp hạng gần bạn</Text></View>
          <Text variant="bodySmall" style={styles.muted}>Cập nhật 5 phút trước</Text>
        </View>
        <Card mode="elevated" style={styles.nearbyCard}>
          <View style={styles.nearbyCardClip}>
            {nearbyStudents.map((student, index) => {
              const isCurrent = student.id === currentStudent.id;
              return (
                <Pressable key={student.id} onPress={() => navigation.navigate('CompetencyDetail', { studentId: student.id })}>
                  <View style={[styles.nearbyRow, isCurrent && styles.currentRow]}>
                    <Text variant="titleMedium" style={[styles.nearbyRank, isCurrent && styles.currentText]}>{student.rank}</Text>
                    <Avatar.Image size={34} source={{ uri: student.avatar }} />
                    <Text variant="bodyMedium" numberOfLines={1} style={[styles.nearbyName, isCurrent && styles.currentText]}>{isCurrent ? `Bạn (${student.name})` : student.name}</Text>
                    {isCurrent ? <Text variant="labelSmall" style={styles.youBadge}>Bạn</Text> : null}
                    <Text variant="titleSmall" style={styles.nearbyScore}>{student.score.toLocaleString('vi-VN')} XP</Text>
                  </View>
                  {index < nearbyStudents.length - 1 ? <Divider /> : null}
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Button mode="contained" icon="trophy" contentStyle={styles.actionContent} style={styles.primaryAction} onPress={() => navigation.navigate('Leaderboard')}>Xem toàn bộ bảng xếp hạng</Button>
        <Button mode="outlined" icon="chart-line" contentStyle={styles.actionContent} style={styles.secondaryAction} onPress={() => navigation.navigate('CompetencyDetail', { studentId: currentStudent.id })}>Xem chi tiết năng lực</Button>
      </ScrollView>
      <AppBottomBar activeKey="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  content: { padding: 16, paddingBottom: 28 },
  hero: { padding: 18, borderRadius: 16, backgroundColor: '#244CE8' },
  heroTop: { minHeight: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLabel: { color: '#DDE6FF' },
  heroRank: { marginTop: 3, color: '#FFFFFF', fontSize: 46, lineHeight: 54, fontWeight: '800' },
  heroRankTotal: { fontSize: 25, fontWeight: '700', color: '#CAD8FF' },
  crown: { borderWidth: 3, borderColor: 'rgba(255,255,255,.55)', backgroundColor: '#7544D8' },
  heroDivider: { backgroundColor: 'rgba(255,255,255,.28)' },
  heroStats: { flexDirection: 'row', paddingTop: 14 },
  heroStat: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: 3, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,.2)' },
  heroStatLabel: { marginTop: 5, color: '#E1E7FF', textAlign: 'center' },
  heroStatValue: { marginTop: 4, color: '#FFFFFF', fontWeight: '700', textAlign: 'center' },
  gapCard: { marginTop: 14, borderRadius: 14, backgroundColor: palette.surface },
  gapContent: { flexDirection: 'row', alignItems: 'stretch', paddingVertical: 16 },
  changeBlock: { width: 115, gap: 5 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeValue: { color: palette.success, fontSize: 30, fontWeight: '800' },
  verticalDivider: { width: 1, height: '100%', marginHorizontal: 14 },
  nextRank: { flex: 1, minWidth: 0, gap: 8 },
  nextText: { lineHeight: 24 },
  blueBold: { color: palette.primary, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: { flex: 1, minWidth: 0 },
  progress: { height: 8, borderRadius: 4 },
  muted: { color: palette.onSurfaceVariant },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 22, marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontWeight: '700' },
  rowReverse: { flexDirection: 'row-reverse' },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  podiumCard: { flex: 1, minWidth: 0, alignItems: 'center', padding: 10, borderWidth: 1.5, borderRadius: 13 },
  firstPlace: { paddingTop: 16, paddingBottom: 14 },
  rankBadge: { position: 'absolute', top: -11, left: 10, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  rankBadgeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  podiumAvatar: { marginTop: 6, borderWidth: 2, borderColor: '#FFFFFF' },
  podiumName: { marginTop: 8, fontWeight: '700' },
  podiumScore: { marginTop: 3, color: palette.primary, fontWeight: '700' },
  nearbyCard: { borderRadius: 13, backgroundColor: palette.surface },
  nearbyCardClip: { overflow: 'hidden', borderRadius: 13 },
  nearbyRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12 },
  currentRow: { marginHorizontal: 2, borderWidth: 1, borderColor: '#7DA3FF', borderRadius: 10, backgroundColor: '#EDF3FF' },
  nearbyRank: { width: 24, textAlign: 'center' },
  nearbyName: { flex: 1, minWidth: 0 },
  nearbyScore: { color: palette.primary, fontWeight: '700' },
  currentText: { color: '#244CE8', fontWeight: '700' },
  youBadge: { paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', borderRadius: 7, color: '#FFFFFF', backgroundColor: '#7A8CF4' },
  actionContent: { minHeight: 50 },
  primaryAction: { marginTop: 20, borderRadius: 10 },
  secondaryAction: { marginTop: 10, borderRadius: 10 },
});

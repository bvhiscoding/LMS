import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, IconButton, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { getScheduleEvent, type ScheduleKind } from '../data/schedule';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleDetail'>;

const kindMeta: Record<ScheduleKind, { color: string; icon: string; label: string }> = {
  online: { color: '#0870F9', icon: 'video', label: 'Học online' },
  offline: { color: '#4DBB63', icon: 'account-group', label: 'Học trực tiếp' },
  exam: { color: '#9D4EDD', icon: 'calendar-check', label: 'Lịch thi' },
  assignment: { color: '#FF9818', icon: 'clipboard-text-outline', label: 'Hạn nộp bài' },
  deadline: { color: '#F26D73', icon: 'clock-outline', label: 'Thời hạn khóa học' },
};

function DetailItem({ icon, color, label, children }: { icon: string; color: string; label: string; children: React.ReactNode }) {
  return (
    <View style={styles.detailItem}>
      <Icon source={icon} size={30} color={color} />
      <View style={styles.detailText}>
        <Text variant="bodyMedium" style={styles.label}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

export function ScheduleDetailScreen({ navigation, route }: Props) {
  const event = getScheduleEvent(route.params.eventId);
  const meta = kindMeta[event.kind];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.dimBackground}>
        <View style={styles.ghostHeader}>
          <Icon source="arrow-left" size={25} color="#1A2130" />
          <Text variant="headlineSmall" style={styles.ghostTitle}>Lịch học</Text>
          <Icon source="plus" size={27} color="#1A2130" />
        </View>
        <View style={styles.ghostCard} />
        <View style={styles.ghostCardSmall} />
      </View>

      <Surface elevation={5} style={styles.sheet}>
        <View style={styles.sheetClip}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={styles.headerSpacer} />
            <Text variant="headlineSmall" style={styles.sheetTitle}>Chi tiết lịch</Text>
            <IconButton icon="close" size={27} onPress={() => navigation.goBack()} accessibilityLabel="Đóng chi tiết lịch" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.eventHeading}>
            <View style={[styles.largeIcon, { backgroundColor: meta.color }]}>
              <Icon source={meta.icon} size={38} color="#FFFFFF" />
            </View>
            <View style={styles.headingText}>
              <Text variant="labelLarge" style={[styles.kindPill, { color: meta.color }]}>{meta.label}</Text>
              <Text variant="headlineSmall" style={styles.eventTitle}>{event.title}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <DetailItem icon="clock-outline" color="#9D5CE4" label="Thời gian">
            <Text variant="titleMedium">{event.start}{event.end ? ` – ${event.end}` : ''}{event.duration ? ` (${event.duration})` : ''}</Text>
            <Text variant="titleMedium">{event.dateLabel}</Text>
          </DetailItem>

          {event.location ? (
            <DetailItem icon="map-marker-outline" color={palette.primary} label="Địa điểm">
              <Text variant="titleMedium">{event.location}</Text>
              {event.meetingUrl ? (
                <Pressable accessibilityRole="link" onPress={() => Linking.openURL(event.meetingUrl!)}>
                  <Text variant="titleMedium" style={styles.link}>{event.meetingUrl}</Text>
                </Pressable>
              ) : null}
            </DetailItem>
          ) : null}

          {event.instructor ? (
            <DetailItem icon="account-outline" color="#43AF57" label="Giảng viên">
              <Text variant="titleMedium" style={styles.semibold}>{event.instructor}</Text>
            </DetailItem>
          ) : null}

          {event.course ? (
            <DetailItem icon="book-open" color="#A45BDD" label="Khóa học">
              <Text variant="titleMedium" style={styles.semibold}>{event.course}</Text>
            </DetailItem>
          ) : null}

          {event.kind === 'online' && event.meetingUrl ? (
            <Button mode="contained" icon="video" onPress={() => Linking.openURL(event.meetingUrl!)} style={styles.primaryButton} contentStyle={styles.buttonContent}>
              Tham gia lớp online
            </Button>
          ) : null}
          <Button mode="outlined" icon="calendar-plus" onPress={() => undefined} style={styles.secondaryButton} contentStyle={styles.buttonContent}>
            Thêm vào lịch điện thoại
          </Button>
          </ScrollView>
        </View>
      </Surface>
      <AppBottomBar activeKey="calendar" onBeforeNavigate={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#D9DCE1' },
  dimBackground: { ...StyleSheet.absoluteFillObject, paddingTop: 42, paddingHorizontal: 18, backgroundColor: 'rgba(26, 31, 39, 0.42)' },
  ghostHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: 0.72 },
  ghostTitle: { fontWeight: '700' },
  ghostCard: { height: 134, marginTop: 90, borderRadius: 10, backgroundColor: '#C4D2E6', opacity: 0.7 },
  ghostCardSmall: { height: 96, marginTop: 20, borderRadius: 10, backgroundColor: '#C5D8C7', opacity: 0.62 },
  sheet: { flex: 1, marginTop: 116, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: palette.surface },
  sheetClip: { flex: 1, overflow: 'hidden', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  handle: { width: 54, height: 5, alignSelf: 'center', marginTop: 12, borderRadius: 3, backgroundColor: '#D8DBE2' },
  sheetHeader: { minHeight: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  headerSpacer: { width: 48 },
  sheetTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  sheetContent: { paddingBottom: 20 },
  eventHeading: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 24, paddingVertical: 16 },
  largeIcon: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  headingText: { flex: 1, minWidth: 0, gap: 10 },
  kindPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, overflow: 'hidden', borderRadius: 14, backgroundColor: '#EEF5FF' },
  eventTitle: { fontWeight: '700', lineHeight: 30 },
  divider: { height: 1, backgroundColor: palette.outlineVariant },
  detailItem: { minHeight: 104, flexDirection: 'row', alignItems: 'flex-start', gap: 20, marginHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  detailText: { flex: 1, minWidth: 0, gap: 6 },
  label: { color: palette.onSurfaceVariant },
  link: { color: palette.primary },
  semibold: { fontWeight: '600' },
  primaryButton: { marginHorizontal: 24, marginTop: 22, borderRadius: 10 },
  secondaryButton: { marginHorizontal: 24, marginTop: 12, borderRadius: 10 },
  buttonContent: { minHeight: 54 },
});

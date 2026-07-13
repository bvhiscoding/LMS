import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, IconButton, Snackbar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { scheduleEvents, type ScheduleEvent, type ScheduleKind } from '../data/schedule';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;
type ViewMode = 'Ngày' | 'Tuần' | 'Tháng';

const kindStyle: Record<ScheduleKind, { color: string; background: string; icon: string; label: string }> = {
  online: { color: '#0870F9', background: '#EAF3FF', icon: 'video', label: 'Học online' },
  offline: { color: '#4DBB63', background: '#EFF9EF', icon: 'account-group', label: 'Học trực tiếp' },
  exam: { color: '#9D4EDD', background: '#F5ECFC', icon: 'calendar-check', label: 'Lịch thi' },
  assignment: { color: '#FF9818', background: '#FFF5E5', icon: 'clipboard-text-outline', label: 'Hạn nộp bài' },
  deadline: { color: '#F26D73', background: '#FFF0F0', icon: 'clock-outline', label: 'Thời hạn khóa học' },
};

const hourLabels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const weekDays = [
  { label: 'T2', day: 23 },
  { label: 'T3', day: 24 },
  { label: 'T4', day: 25 },
  { label: 'T5', day: 26 },
  { label: 'T6', day: 27 },
  { label: 'T7', day: 28 },
  { label: 'CN', day: 29 },
];

const weekEventSlots = [
  { event: scheduleEvents[1], dayIndex: 0, top: 94, height: 66 },
  { event: scheduleEvents[3], dayIndex: 1, top: 318, height: 70 },
  { event: scheduleEvents[2], dayIndex: 2, top: 230, height: 70 },
  { event: scheduleEvents[0], dayIndex: 3, top: 50, height: 72 },
  { event: scheduleEvents[1], dayIndex: 3, top: 142, height: 70 },
  { event: scheduleEvents[3], dayIndex: 3, top: 362, height: 70 },
  { event: scheduleEvents[0], dayIndex: 4, top: 94, height: 66 },
  { event: scheduleEvents[2], dayIndex: 5, top: 274, height: 70 },
];

const monthCells = [
  ...[26, 27, 28, 29, 30, 31].map((day) => ({ day, outside: true })),
  ...Array.from({ length: 30 }, (_, index) => ({ day: index + 1, outside: false })),
  ...[1, 2, 3, 4, 5, 6].map((day) => ({ day, outside: true })),
];

const monthEventKinds: Partial<Record<number, ScheduleKind[]>> = {
  2: ['online'], 4: ['assignment'], 6: ['offline'], 9: ['online', 'assignment'],
  11: ['offline'], 13: ['exam'], 16: ['online'], 18: ['assignment'], 20: ['offline'],
  23: ['online'], 24: ['exam'], 25: ['assignment'], 26: ['online', 'offline', 'exam'],
  27: ['online'], 28: ['assignment'], 30: ['deadline'],
};

function TimelineCard({ event, onPress }: { event: ScheduleEvent; onPress: () => void }) {
  const meta = kindStyle[event.kind];
  const positions: Record<string, { top: number; height: number }> = {
    '08:30': { top: 30, height: 82 },
    '10:30': { top: 126, height: 82 },
    '13:30': { top: 238, height: 82 },
    '15:30': { top: 334, height: 82 },
    '17:00': { top: 426, height: 52 },
  };
  const position = positions[event.start];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.timelineEvent, { top: position.top, height: position.height, backgroundColor: meta.background }]}
    >
      <Icon source={meta.icon} size={25} color={meta.color} />
      <View style={styles.timelineEventText}>
        {event.end ? <Text variant="bodySmall" style={styles.eventTime}>{event.start} – {event.end}</Text> : null}
        <Text variant={event.kind === 'deadline' ? 'bodyMedium' : 'titleSmall'} numberOfLines={1} style={styles.eventTitle}>{event.title}</Text>
        {event.kind !== 'deadline' ? <Text variant="bodySmall" numberOfLines={1} style={styles.eventSubtitle}>{event.subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

function EventRow({ event, onPress }: { event: ScheduleEvent; onPress: () => void }) {
  const meta = kindStyle[event.kind];
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.eventRow}>
      <View style={styles.rowIcon}>
        <Icon source={meta.icon} size={24} color={meta.color} />
      </View>
      <View style={styles.rowTime}>
        <Text variant="bodyMedium">{event.start}</Text>
        {event.end ? <Text variant="bodyMedium" style={styles.muted}>{event.end}</Text> : null}
      </View>
      <View style={[styles.rowAccent, { backgroundColor: meta.color }]} />
      <View style={styles.rowText}>
        <Text variant="titleSmall" numberOfLines={1} style={styles.eventTitle}>{event.title}</Text>
        {event.kind !== 'deadline' ? <Text variant="bodySmall" numberOfLines={1} style={styles.eventSubtitle}>{event.subtitle}</Text> : null}
      </View>
      <Icon source="chevron-right" size={18} color="#8A93A3" />
    </Pressable>
  );
}

function WeekCalendar({ events, onOpen }: { events: ScheduleEvent[]; onOpen: (event: ScheduleEvent) => void }) {
  const allowedKinds = new Set(events.map((event) => event.kind));
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroller}>
      <View style={styles.weekCanvas}>
        <View style={styles.weekHeaderRow}>
          <View style={styles.weekTimeHeader} />
          {weekDays.map((item) => (
            <View key={item.day} style={[styles.weekDayHeader, item.day === 26 && styles.weekDayHeaderActive]}>
              <Text variant="labelMedium" style={item.day === 26 ? styles.weekDayTextActive : styles.weekDayText}>{item.label}</Text>
              <View style={[styles.weekDayNumber, item.day === 26 && styles.weekDayNumberActive]}>
                <Text variant="titleSmall" style={item.day === 26 ? styles.weekDayNumberTextActive : styles.weekDayNumberText}>{item.day}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.weekGrid}>
          <View style={styles.weekTimeColumn}>
            {hourLabels.map((hour) => <Text key={hour} variant="bodySmall" style={styles.weekHour}>{hour}</Text>)}
          </View>
          {weekDays.map((day, dayIndex) => (
            <View key={day.day} style={[styles.weekColumn, day.day === 26 && styles.weekColumnActive]}>
              {hourLabels.map((hour) => <View key={hour} style={styles.weekHourLine} />)}
              {weekEventSlots.filter((slot) => slot.dayIndex === dayIndex && allowedKinds.has(slot.event.kind)).map((slot, index) => {
                const meta = kindStyle[slot.event.kind];
                return (
                  <Pressable
                    key={`${slot.event.id}-${index}`}
                    onPress={() => onOpen(slot.event)}
                    style={[styles.weekEvent, { top: slot.top, height: slot.height, backgroundColor: meta.background }]}
                  >
                    <Text variant="labelSmall" style={{ color: meta.color }}>{slot.event.start}</Text>
                    <Text variant="labelSmall" numberOfLines={2} style={styles.weekEventTitle}>{slot.event.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function MonthCalendar({ selectedDay, events, onSelectDay, onOpen }: {
  selectedDay: number;
  events: ScheduleEvent[];
  onSelectDay: (day: number) => void;
  onOpen: (event: ScheduleEvent) => void;
}) {
  const allowedKinds = new Set(events.map((event) => event.kind));
  return (
    <View style={styles.monthCalendar}>
      <View style={styles.monthWeekHeader}>
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <Text key={day} variant="labelMedium" style={styles.monthWeekday}>{day}</Text>)}
      </View>
      <View style={styles.monthGrid}>
        {monthCells.map((cell, index) => {
          const kinds = cell.outside ? [] : (monthEventKinds[cell.day] ?? []).filter((kind) => allowedKinds.has(kind));
          const selected = !cell.outside && cell.day === selectedDay;
          return (
            <Pressable
              key={`${cell.outside ? 'outside' : 'june'}-${cell.day}-${index}`}
              onPress={() => !cell.outside && onSelectDay(cell.day)}
              onLongPress={() => selected && kinds.length > 0 && onOpen(events.find((event) => event.kind === kinds[0]) ?? scheduleEvents[0])}
              style={[styles.monthCell, selected && styles.monthCellSelected]}
            >
              <View style={[styles.monthDayCircle, selected && styles.monthDayCircleSelected]}>
                <Text variant="bodyMedium" style={[styles.monthDayText, cell.outside && styles.monthOutsideText, selected && styles.monthSelectedText]}>{cell.day}</Text>
              </View>
              <View style={styles.monthDots}>
                {kinds.slice(0, 3).map((kind, dotIndex) => <View key={`${kind}-${dotIndex}`} style={[styles.monthDot, { backgroundColor: kindStyle[kind].color }]} />)}
              </View>
              {selected && kinds.length > 0 ? <Text variant="labelSmall" numberOfLines={1} style={styles.monthEventLabel}>Có {kinds.length} sự kiện</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ScheduleScreen({ navigation }: Props) {
  const [mode, setMode] = useState<ViewMode>('Ngày');
  const [dateOffset, setDateOffset] = useState(0);
  const [examOnly, setExamOnly] = useState(false);
  const [selectedMonthDay, setSelectedMonthDay] = useState(26);
  const [message, setMessage] = useState('');
  const events = useMemo(() => examOnly ? scheduleEvents.filter((event) => event.kind === 'exam') : scheduleEvents, [examOnly]);
  const dateLabel = dateOffset === 0 ? 'Thứ Năm, 26/06/2025' : dateOffset < 0 ? 'Thứ Tư, 25/06/2025' : 'Thứ Sáu, 27/06/2025';
  const openEvent = (event: ScheduleEvent) => navigation.navigate('ScheduleDetail', { eventId: event.id });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Lịch học"
        onBack={() => navigation.canGoBack() && navigation.goBack()}
        actions={[{
          icon: 'plus',
          onPress: () => setMessage('Tính năng thêm lịch sẽ sớm được cập nhật.'),
          accessibilityLabel: 'Thêm lịch',
        }]}
      />

      <View style={styles.modeBar}>
        <View style={styles.segmented}>
          {(['Ngày', 'Tuần', 'Tháng'] as ViewMode[]).map((item) => (
            <Pressable key={item} onPress={() => setMode(item)} style={[styles.segment, mode === item && styles.segmentActive]}>
              <Text variant="titleSmall" style={mode === item ? styles.segmentTextActive : styles.segmentText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Button mode={examOnly ? 'contained' : 'outlined'} icon="calendar-check" onPress={() => setExamOnly((value) => !value)} style={styles.examButton} compact>
          Lịch thi
        </Button>
      </View>

      <View style={styles.dateNavigator}>
        <IconButton icon="chevron-left" size={21} onPress={() => setDateOffset(-1)} accessibilityLabel="Ngày trước" />
        <View style={styles.dateTitle}>
          <Icon source="calendar-check" size={20} color="#444B5C" />
          <Text variant="titleLarge" style={styles.dateText}>{mode === 'Ngày' ? dateLabel : mode === 'Tuần' ? 'Tuần 23 – 29/06/2025' : 'Tháng 06/2025'}</Text>
        </View>
        <IconButton icon="chevron-right" size={21} onPress={() => setDateOffset(1)} accessibilityLabel="Ngày sau" />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {mode === 'Ngày' ? (
          <View style={styles.timeline}>
            <View style={styles.hourColumn}>
              {hourLabels.map((hour) => <Text key={hour} variant="bodySmall" style={styles.hourLabel}>{hour}</Text>)}
            </View>
            <View style={styles.timelineBody}>
              {hourLabels.map((hour) => <View key={hour} style={styles.hourLine} />)}
              {events.map((event) => <TimelineCard key={event.id} event={event} onPress={() => openEvent(event)} />)}
            </View>
          </View>
        ) : mode === 'Tuần' ? (
          <WeekCalendar events={events} onOpen={openEvent} />
        ) : (
          <MonthCalendar selectedDay={selectedMonthDay} events={events} onSelectDay={setSelectedMonthDay} onOpen={openEvent} />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legend}>
          {Object.entries(kindStyle).map(([key, meta]) => (
            <View key={key} style={styles.legendItem}>
              <Icon source={meta.icon} size={18} color={meta.color} />
              <Text variant="bodySmall">{meta.label}</Text>
            </View>
          ))}
        </ScrollView>

        <Text variant="titleLarge" style={styles.sectionTitle}>
          {mode === 'Tuần' ? 'Sự kiện trong tuần' : mode === 'Tháng' ? `Sự kiện ngày ${selectedMonthDay}/06` : 'Sự kiện trong ngày'}
        </Text>
        <Surface elevation={0} style={styles.eventList}>
          {events.length ? events.map((event) => <EventRow key={event.id} event={event} onPress={() => openEvent(event)} />) : (
            <Text style={styles.emptyText}>Không có sự kiện trong ngày này.</Text>
          )}
        </Surface>
      </ScrollView>
      <AppBottomBar activeKey="calendar" />
      <Snackbar visible={Boolean(message)} onDismiss={() => setMessage('')} duration={2200}>{message}</Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.surface },
  header: { minHeight: 62, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.surface },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  modeBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  segmented: { flex: 1, minHeight: 46, flexDirection: 'row', padding: 2, borderRadius: 10, backgroundColor: '#F1F2F5' },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  segmentActive: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7DCE5' },
  segmentText: { color: '#454D5F' },
  segmentTextActive: { color: palette.primary, fontWeight: '700' },
  examButton: { borderRadius: 9 },
  dateNavigator: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  dateTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateText: { fontWeight: '700' },
  content: { flex: 1, backgroundColor: palette.background },
  contentContainer: { paddingBottom: 22 },
  timeline: { height: 500, flexDirection: 'row', backgroundColor: palette.surface },
  hourColumn: { width: 68, paddingTop: 7, borderRightWidth: 1, borderRightColor: palette.outlineVariant },
  hourLabel: { height: 46, paddingLeft: 16, color: '#2D3546' },
  timelineBody: { flex: 1, position: 'relative', paddingTop: 7 },
  hourLine: { height: 46, borderTopWidth: 1, borderTopColor: '#EEF0F4' },
  timelineEvent: { position: 'absolute', left: 0, right: 14, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#D7E4F5', borderRadius: 8 },
  timelineEventText: { flex: 1, minWidth: 0, gap: 2 },
  eventTime: { color: '#525B6E' },
  eventTitle: { color: palette.onSurface, fontWeight: '700' },
  eventSubtitle: { color: '#596276' },
  legend: { gap: 14, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FAFAFB' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { marginHorizontal: 16, marginTop: 16, marginBottom: 10, fontWeight: '700' },
  eventList: { marginHorizontal: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 12, backgroundColor: palette.surface },
  eventRow: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  rowIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowTime: { width: 48, gap: 3 },
  rowAccent: { width: 2, height: 48, borderRadius: 2 },
  rowText: { flex: 1, minWidth: 0, gap: 4 },
  muted: { color: palette.onSurfaceVariant },
  emptyText: { padding: 24, textAlign: 'center', color: palette.onSurfaceVariant },
  weekScroller: { height: 548, backgroundColor: palette.surface },
  weekCanvas: { width: 806, backgroundColor: palette.surface },
  weekHeaderRow: { height: 64, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  weekTimeHeader: { width: 56 },
  weekDayHeader: { width: 107, alignItems: 'center', justifyContent: 'center', gap: 3, borderLeftWidth: 1, borderLeftColor: '#EEF0F4' },
  weekDayHeaderActive: { backgroundColor: '#F3F7FF' },
  weekDayText: { color: palette.onSurfaceVariant },
  weekDayTextActive: { color: palette.primary, fontWeight: '700' },
  weekDayNumber: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  weekDayNumberActive: { backgroundColor: palette.primary },
  weekDayNumberText: { color: palette.onSurface },
  weekDayNumberTextActive: { color: '#FFFFFF', fontWeight: '700' },
  weekGrid: { height: 484, flexDirection: 'row' },
  weekTimeColumn: { width: 56, paddingTop: 5 },
  weekHour: { height: 44, paddingLeft: 9, color: palette.onSurfaceVariant },
  weekColumn: { width: 107, position: 'relative', borderLeftWidth: 1, borderLeftColor: '#E9ECF1' },
  weekColumnActive: { backgroundColor: '#FAFCFF' },
  weekHourLine: { height: 44, borderTopWidth: 1, borderTopColor: '#EEF0F4' },
  weekEvent: { position: 'absolute', left: 4, right: 4, zIndex: 2, padding: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#E1E6EE', borderRadius: 6 },
  weekEventTitle: { marginTop: 2, color: palette.onSurface, fontWeight: '700', lineHeight: 14 },
  monthCalendar: { paddingBottom: 8, backgroundColor: palette.surface },
  monthWeekHeader: { height: 42, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: palette.outlineVariant },
  monthWeekday: { flex: 1, textAlign: 'center', color: palette.onSurfaceVariant },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell: { width: '14.285714%', height: 72, alignItems: 'center', paddingTop: 6, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#EEF0F4' },
  monthCellSelected: { backgroundColor: '#EEF5FF', borderWidth: 1, borderColor: '#73A8F9' },
  monthDayCircle: { width: 27, height: 27, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  monthDayCircleSelected: { backgroundColor: palette.primary },
  monthDayText: { color: palette.onSurface },
  monthOutsideText: { color: '#B4BAC5' },
  monthSelectedText: { color: '#FFFFFF', fontWeight: '700' },
  monthDots: { height: 8, flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  monthDot: { width: 5, height: 5, borderRadius: 3 },
  monthEventLabel: { maxWidth: '92%', color: palette.primary, fontSize: 8 },
});

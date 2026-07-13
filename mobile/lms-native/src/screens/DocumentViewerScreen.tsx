import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, Icon, IconButton, Snackbar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentViewer'>;

const slideBullets = [
  '<!DOCTYPE html>: Khai báo kiểu tài liệu.',
  '<html>: Phần tử gốc bao bọc toàn bộ nội dung.',
  '<head>: Chứa siêu dữ liệu như tiêu đề, liên kết CSS, v.v.',
  '<body>: Chứa nội dung hiển thị trên trình duyệt.',
];

function SlidePreview({ compact = false }: { compact?: boolean }) {
  return (
    <View style={compact ? styles.miniSlide : styles.slidePage}>
      <Text style={compact ? styles.miniTitle : styles.slideTitle}>Cấu trúc cơ bản của HTML</Text>
      {!compact ? (
        <>
          <Text variant="bodySmall" style={styles.slideIntro}>Một tài liệu HTML gồm các thành phần chính:</Text>
          <View style={styles.slideBullets}>
            {slideBullets.map((bullet) => <View key={bullet} style={styles.slideBulletRow}><View style={styles.slideDot} /><Text variant="bodySmall" style={styles.slideBulletText}>{bullet}</Text></View>)}
          </View>
          <View style={styles.visualRow}>
            <View style={styles.codePanel}>
              <View style={styles.windowDots}><View style={[styles.windowDot, { backgroundColor: '#FF5F57' }]} /><View style={[styles.windowDot, { backgroundColor: '#FFBD2E' }]} /><View style={[styles.windowDot, { backgroundColor: '#28C840' }]} /></View>
              <Text style={styles.codeText}>{'<!DOCTYPE html>\n<html lang="vi">\n  <head>\n    <meta charset="UTF-8">\n    <title>Trang web của tôi</title>\n  </head>\n  <body>\n    <h1>Xin chào!</h1>\n    <p>Đây là đoạn văn đầu tiên.</p>\n  </body>\n</html>'}</Text>
            </View>
            <View style={styles.browserPanel}>
              <View style={styles.browserBar}><View style={styles.browserTinyDot} /><View style={styles.browserTinyDot} /><View style={styles.browserTinyDot} /></View>
              <View style={styles.browserHero}><Icon source="file-code-outline" size={40} color="#FFFFFF" /></View>
              <View style={styles.browserLine} /><View style={[styles.browserLine, { width: '58%' }]} />
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}

export function DocumentViewerScreen({ navigation, route }: Props) {
  const [page, setPage] = useState(8);
  const [zoom, setZoom] = useState(100);
  const [bookmarked, setBookmarked] = useState(true);
  const [message, setMessage] = useState('');
  const title = route.params.title ?? 'Slide bài giảng HTML cơ bản';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Tài liệu bài học"
        onBack={navigation.goBack}
        actions={[
          { icon: 'share-variant-outline', onPress: () => setMessage('Đã sao chép liên kết tài liệu.'), accessibilityLabel: 'Chia sẻ tài liệu' },
          { icon: 'download', onPress: () => setMessage('Đang tải tài liệu xuống.'), accessibilityLabel: 'Tải tài liệu' },
          { icon: bookmarked ? 'bookmark' : 'bookmark-outline', onPress: () => setBookmarked((value) => !value), accessibilityLabel: bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu' },
        ]}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card mode="elevated" style={styles.documentInfo}>
          <Card.Content style={styles.documentInfoContent}>
            <View style={styles.pdfIcon}><Icon source="file-pdf-box" size={34} color="#ED1C24" /></View>
            <View style={styles.documentText}>
              <Text variant="titleLarge" numberOfLines={1} style={styles.documentTitle}>{title.includes('Slide') ? 'Slide bài giảng HTML cơ bản' : title}</Text>
              <View style={styles.documentMeta}><Text variant="bodyMedium" style={styles.metaPill}>PDF</Text><View style={styles.metaDivider} /><Text variant="bodyMedium">2.5 MB</Text><View style={styles.metaDivider} /><Icon source="check-circle" size={18} color={palette.success} /><Text variant="bodySmall" style={styles.downloadAllowed}>Cho phép tải xuống</Text></View>
            </View>
          </Card.Content>
        </Card>

        <Surface elevation={1} style={styles.viewer}>
          <View style={styles.viewerClip}>
            <View style={styles.pagePill}><Text variant="titleMedium" style={styles.pagePillText}>{page} / 20</Text></View>
            <View style={[styles.slideScale, { width: `${zoom}%` }]}><SlidePreview /></View>
            <View style={styles.viewerControls}>
              <View style={styles.zoomControls}><IconButton icon="minus" size={18} disabled={zoom <= 80} onPress={() => setZoom((value) => Math.max(80, value - 10))} style={styles.roundControl} /><Text variant="titleMedium">{zoom}%</Text><IconButton icon="plus" size={18} disabled={zoom >= 120} onPress={() => setZoom((value) => Math.min(120, value + 10))} style={styles.roundControl} /></View>
              <View style={styles.controlDivider} />
              <Button mode="text" icon="chevron-left" disabled={page === 1} onPress={() => setPage((value) => Math.max(1, value - 1))}>Trang trước</Button>
              <View style={styles.controlDivider} />
              <Button mode="text" icon="chevron-right" contentStyle={styles.nextButtonContent} disabled={page === 20} onPress={() => setPage((value) => Math.min(20, value + 1))}>Trang sau</Button>
            </View>

            <View style={styles.thumbnailSection}>
              <View style={styles.pageListLabel}><Icon source="format-list-bulleted" size={25} color={palette.primary} /><Text variant="bodyMedium" style={styles.pageListText}>Danh sách trang</Text></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnails}>
                {[6, 7, 8, 9, 10].map((item) => (
                  <Pressable key={item} onPress={() => setPage(item)} style={styles.thumbnailItem}>
                    <View style={[styles.thumbnail, page === item && styles.thumbnailActive]}><SlidePreview compact /></View>
                    <Text variant="bodySmall" style={page === item ? styles.thumbnailNumberActive : styles.thumbnailNumber}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Surface>

        <View style={styles.bookmarkBanner}>
          <Icon source={bookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color={palette.primary} />
          <Text variant="bodyMedium" style={styles.bookmarkText}>{bookmarked ? 'Đã đánh dấu trang này' : 'Trang này chưa được đánh dấu'}</Text>
        </View>
      </ScrollView>
      <AppBottomBar activeKey="courses" />
      <Snackbar visible={Boolean(message)} onDismiss={() => setMessage('')} duration={2200}>{message}</Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.surface },
  headerTitle: { color: '#071047', fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 18, gap: 14 },
  documentInfo: { backgroundColor: palette.surface },
  documentInfoContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  pdfIcon: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#F4F5F8' },
  documentText: { flex: 1, minWidth: 0, gap: 10 },
  documentTitle: { color: '#071047', fontWeight: '600' },
  documentMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9 },
  metaPill: { paddingHorizontal: 12, paddingVertical: 5, overflow: 'hidden', borderRadius: 7, backgroundColor: '#F0F2F6' },
  metaDivider: { width: 1, height: 23, backgroundColor: palette.outlineVariant },
  downloadAllowed: { color: palette.success },
  viewer: { borderRadius: 12, backgroundColor: '#F1F3F7' },
  viewerClip: { overflow: 'hidden', borderRadius: 12 },
  pagePill: { alignSelf: 'center', marginVertical: 14, paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF' },
  pagePillText: { color: '#071047' },
  slideScale: { alignSelf: 'center', paddingHorizontal: 10 },
  slidePage: { minHeight: 430, padding: 22, backgroundColor: '#FFFFFF' },
  slideTitle: { color: '#0B3FB2', fontSize: 28, lineHeight: 34, fontWeight: '700' },
  slideIntro: { marginTop: 18, color: '#172454' },
  slideBullets: { marginTop: 14, gap: 10 },
  slideBulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  slideDot: { width: 7, height: 7, marginTop: 5, borderRadius: 4, backgroundColor: palette.primary },
  slideBulletText: { flex: 1, color: '#172454', lineHeight: 18 },
  visualRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  codePanel: { flex: 1.25, minHeight: 170, padding: 12, borderRadius: 8, backgroundColor: '#0B2A5E' },
  windowDots: { flexDirection: 'row', gap: 5, marginBottom: 8 },
  windowDot: { width: 7, height: 7, borderRadius: 4 },
  codeText: { color: '#A9DEFF', fontSize: 9, lineHeight: 13 },
  browserPanel: { flex: 1, minHeight: 170, padding: 10, borderWidth: 1, borderColor: '#CDD3DF', borderRadius: 8, backgroundColor: '#FFFFFF' },
  browserBar: { flexDirection: 'row', gap: 4, paddingBottom: 8 },
  browserTinyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D6DAE2' },
  browserHero: { height: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: '#5DA5F8' },
  browserLine: { width: '86%', height: 4, marginTop: 12, borderRadius: 2, backgroundColor: '#D6DAE2' },
  viewerControls: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10, paddingHorizontal: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.outlineVariant, backgroundColor: '#FFFFFF' },
  zoomControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roundControl: { borderWidth: 1, borderColor: palette.outlineVariant },
  controlDivider: { width: 1, height: 34, backgroundColor: palette.outlineVariant },
  nextButtonContent: { flexDirection: 'row-reverse' },
  thumbnailSection: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, backgroundColor: '#FFFFFF' },
  pageListLabel: { width: 92, alignItems: 'center', gap: 5 },
  pageListText: { textAlign: 'center', color: palette.primary },
  thumbnails: { gap: 10, paddingRight: 12 },
  thumbnailItem: { alignItems: 'center', gap: 5 },
  thumbnail: { width: 92, height: 58, padding: 4, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 7, backgroundColor: '#FFFFFF' },
  thumbnailActive: { borderWidth: 2, borderColor: palette.primary },
  miniSlide: { flex: 1, padding: 4, backgroundColor: '#FFFFFF' },
  miniTitle: { color: '#0B3FB2', fontSize: 5, fontWeight: '600' },
  thumbnailNumber: { color: '#172454' },
  thumbnailNumberActive: { minWidth: 22, textAlign: 'center', color: '#FFFFFF', overflow: 'hidden', borderRadius: 11, backgroundColor: palette.primary },
  bookmarkBanner: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#EDF4FF' },
  bookmarkText: { flex: 1, color: palette.primary },
});

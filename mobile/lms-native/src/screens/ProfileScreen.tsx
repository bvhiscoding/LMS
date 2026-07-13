import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Card, Divider, List, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomBar } from '../components/AppBottomBar';
import { AppTopBar } from '../components/AppTopBar';
import { palette } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AppTopBar
        title="Cá nhân"
        actions={[{ icon: 'gear', onPress: () => undefined, accessibilityLabel: 'Cài đặt' }]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Surface elevation={1} style={styles.profileCard}>
          <Avatar.Image size={76} source={{ uri: 'https://i.pravatar.cc/200?img=12' }} />
          <View style={styles.profileText}>
            <Text variant="titleLarge" style={styles.name}>Nguyễn Anh Khoa</Text>
            <Text variant="bodyMedium" style={styles.muted}>Học viên • K65 CNTT</Text>
            <Text variant="bodySmall" style={styles.muted}>Mã học viên: HV20240012</Text>
          </View>
        </Surface>

        <Text variant="titleMedium" style={styles.sectionTitle}>Học tập và thành tích</Text>
        <Card mode="elevated" style={styles.menuCard}>
          <View style={styles.menuCardClip}>
            <List.Item
              title="Xếp hạng năng lực"
              description="Theo dõi thứ hạng, điểm năng lực và thành tích"
              left={(props) => <List.Icon {...props} icon="trophy" color={palette.primary} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('RankingOverview')}
            />
            <Divider />
            <List.Item
              title="Chứng chỉ của tôi"
              description="Xem các chứng chỉ đã đạt được"
              left={(props) => <List.Icon {...props} icon="certificate" color="#8A4EF5" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            <List.Item
              title="Kết quả học tập"
              description="Điểm thi, bài tập và tiến độ khóa học"
              left={(props) => <List.Icon {...props} icon="chart-line" color={palette.success} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </View>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Tài khoản</Text>
        <Card mode="elevated" style={styles.menuCard}>
          <View style={styles.menuCardClip}>
            <List.Item title="Thông tin cá nhân" left={(props) => <List.Icon {...props} icon="address-card" />} right={(props) => <List.Icon {...props} icon="chevron-right" />} />
            <Divider />
            <List.Item title="Thông báo" left={(props) => <List.Icon {...props} icon="bell" />} right={(props) => <List.Icon {...props} icon="chevron-right" />} />
            <Divider />
            <List.Item title="Đổi mật khẩu" left={(props) => <List.Icon {...props} icon="lock-outline" />} right={(props) => <List.Icon {...props} icon="chevron-right" />} />
          </View>
        </Card>
      </ScrollView>
      <AppBottomBar activeKey="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  headerTitle: { fontWeight: '700' },
  content: { padding: 16, paddingBottom: 28 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 14, backgroundColor: palette.surface },
  profileText: { flex: 1, minWidth: 0, gap: 4 },
  name: { fontWeight: '700' },
  muted: { color: palette.onSurfaceVariant },
  sectionTitle: { marginTop: 22, marginBottom: 10, fontWeight: '700' },
  menuCard: { borderRadius: 12, backgroundColor: palette.surface },
  menuCardClip: { overflow: 'hidden', borderRadius: 12 },
});

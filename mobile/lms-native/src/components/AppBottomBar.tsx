import { useState } from 'react';
import { BottomNavigation, Icon, Portal, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  activeKey?: string;
};

const routes = [
  { key: 'home', title: 'Trang chủ', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'courses', title: 'Khóa học', focusedIcon: 'book-open-page-variant', unfocusedIcon: 'book-open-page-variant-outline' },
  { key: 'calendar', title: 'Lịch', focusedIcon: 'calendar', unfocusedIcon: 'calendar-outline' },
  { key: 'discussion', title: 'Thảo luận', focusedIcon: 'message-text', unfocusedIcon: 'message-text-outline' },
  { key: 'profile', title: 'Cá nhân', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
];

export function AppBottomBar({ activeKey = 'courses' }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const index = Math.max(0, routes.findIndex((route) => route.key === activeKey));

  return (
    <>
      <BottomNavigation.Bar
        navigationState={{ index, routes }}
        safeAreaInsets={{ bottom: insets.bottom }}
        onTabPress={({ route }) => {
          if (route.key !== activeKey) {
            setMessage(`${route.title} chưa nằm trong phạm vi prototype này.`);
          }
        }}
        renderIcon={({ route, focused, color }) => (
          <Icon source={focused ? route.focusedIcon : route.unfocusedIcon} color={color} size={24} />
        )}
        getLabelText={({ route }) => route.title}
        getAccessibilityLabel={({ route }) => `Mở ${route.title}`}
      />
      <Portal>
        <Snackbar visible={Boolean(message)} onDismiss={() => setMessage('')} duration={2500} style={{ bottom: 76 }}>
          {message}
        </Snackbar>
      </Portal>
    </>
  );
}

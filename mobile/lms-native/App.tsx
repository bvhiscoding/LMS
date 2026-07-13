import { DefaultTheme as NavigationDefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { renderFontAwesomeIcon } from './src/components/FontAwesomeIconProvider';
import { AssignmentDetailScreen, AssignmentResultScreen } from './src/screens/AssignmentScreens';
import { CourseDetailScreen } from './src/screens/CourseDetailScreen';
import { CoursesScreen } from './src/screens/CoursesScreen';
import { CompetencyDetailScreen } from './src/screens/CompetencyDetailScreen';
import { DiscussionDetailScreen } from './src/screens/DiscussionDetailScreen';
import { DiscussionScreen } from './src/screens/DiscussionScreen';
import { DocumentViewerScreen } from './src/screens/DocumentViewerScreen';
import { ExamDetailScreen, ExamResultScreen, ExamTakingScreen } from './src/screens/ExamScreens';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RankingHistoryScreen } from './src/screens/RankingHistoryScreen';
import { RankingOverviewScreen } from './src/screens/RankingOverviewScreen';
import { ScheduleDetailScreen } from './src/screens/ScheduleDetailScreen';
import { ScheduleScreen } from './src/screens/ScheduleScreen';
import { appTheme } from './src/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const paperSettings = { icon: renderFontAwesomeIcon };

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: appTheme.colors.primary,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    text: appTheme.colors.onSurface,
    border: appTheme.colors.outlineVariant,
    notification: appTheme.colors.error,
  },
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={appTheme} settings={paperSettings}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" backgroundColor={appTheme.colors.surface} />
          <Stack.Navigator
            initialRouteName="Courses"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: appTheme.colors.background },
            }}
          >
            <Stack.Screen name="Courses" component={CoursesScreen} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="Discussion" component={DiscussionScreen} />
            <Stack.Screen name="DiscussionDetail" component={DiscussionDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="RankingOverview" component={RankingOverviewScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="CompetencyDetail" component={CompetencyDetailScreen} />
            <Stack.Screen name="RankingHistory" component={RankingHistoryScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
            <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
            <Stack.Screen name="ExamTaking" component={ExamTakingScreen} />
            <Stack.Screen name="ExamResult" component={ExamResultScreen} />
            <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
            <Stack.Screen name="AssignmentResult" component={AssignmentResultScreen} />
            <Stack.Screen name="DocumentViewer" component={DocumentViewerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

import type { Discussion } from '../data/discussions';

export type RootStackParamList = {
  Courses: undefined;
  CourseDetail: { courseId: string };
  Discussion: undefined;
  DiscussionDetail: { discussionId: string; discussion?: Discussion };
  Profile: undefined;
  RankingOverview: undefined;
  Leaderboard: undefined;
  CompetencyDetail: { studentId: string };
  RankingHistory: { studentId: string };
  Schedule: undefined;
  ScheduleDetail: { eventId: string };
  ExamDetail: { examId: string };
  ExamTaking: { examId: string };
  ExamResult: { examId: string; answered: number; bookmarked: number; correct: number };
  AssignmentDetail: { assignmentId: string };
  AssignmentResult: { assignmentId: string };
  DocumentViewer: { title?: string };
};

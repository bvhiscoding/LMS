export type ScheduleKind = 'online' | 'offline' | 'exam' | 'assignment' | 'deadline';

export type ScheduleEvent = {
  id: string;
  kind: ScheduleKind;
  start: string;
  end?: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  duration?: string;
  location?: string;
  meetingUrl?: string;
  instructor?: string;
  course?: string;
};

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'react-online',
    kind: 'online',
    start: '08:30',
    end: '10:00',
    title: 'Lập trình Web với ReactJS',
    subtitle: 'Online • Nguyễn Văn A',
    dateLabel: 'Thứ Năm, 26/06/2025',
    duration: '1 giờ 30 phút',
    location: 'Online trên Google Meet',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    instructor: 'Nguyễn Văn A',
    course: 'Lập trình Web Frontend cơ bản',
  },
  {
    id: 'ui-ux-offline',
    kind: 'offline',
    start: '10:30',
    end: '12:00',
    title: 'Thiết kế UI/UX cơ bản',
    subtitle: 'Trực tiếp • Phòng 201',
    dateLabel: 'Thứ Năm, 26/06/2025',
    duration: '1 giờ 30 phút',
    location: 'Phòng 201, Tòa nhà A',
    instructor: 'Trần Thị B',
    course: 'Thiết kế UI/UX cơ bản',
  },
  {
    id: 'week-3-assignment',
    kind: 'assignment',
    start: '13:30',
    end: '15:00',
    title: 'Hạn nộp bài: Bài tập Tuần 3',
    subtitle: 'ReactJS cơ bản',
    dateLabel: 'Thứ Năm, 26/06/2025',
    duration: 'Trước 15:00',
    course: 'ReactJS cơ bản',
  },
  {
    id: 'database-midterm',
    kind: 'exam',
    start: '15:30',
    end: '17:00',
    title: 'Thi giữa kỳ: Cơ sở dữ liệu',
    subtitle: 'Phòng thi A • 60 phút',
    dateLabel: 'Thứ Năm, 26/06/2025',
    duration: '60 phút',
    location: 'Phòng thi A',
    course: 'Cơ sở dữ liệu',
  },
  {
    id: 'react-deadline',
    kind: 'deadline',
    start: '17:00',
    title: 'Hạn cuối khóa học: Lập trình Web với ReactJS',
    subtitle: 'Kết thúc lúc 17:00',
    dateLabel: 'Thứ Năm, 26/06/2025',
    course: 'Lập trình Web với ReactJS',
  },
];

export function getScheduleEvent(id: string) {
  return scheduleEvents.find((event) => event.id === id) ?? scheduleEvents[0];
}

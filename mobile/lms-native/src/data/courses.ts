export type CourseStatus = 'learning' | 'new' | 'done' | 'overdue';

export type Course = {
  id: string;
  title: string;
  teacher: string;
  teacherInitials: string;
  dates: string;
  progress: number;
  status: CourseStatus;
  image: string;
};

export const statusMeta: Record<CourseStatus, { label: string; icon: string }> = {
  learning: { label: 'Đang học', icon: 'book-open-page-variant-outline' },
  new: { label: 'Chưa bắt đầu', icon: 'clock-outline' },
  done: { label: 'Đã hoàn thành', icon: 'check-circle-outline' },
  overdue: { label: 'Quá hạn', icon: 'alert-circle-outline' },
};

export const courses: Course[] = [
  {
    id: 'web-basic',
    title: 'Lập trình Web cơ bản',
    teacher: 'Thầy Nguyễn Văn A',
    teacherInitials: 'NA',
    dates: '01/05/2024 - 30/06/2024',
    progress: 0.65,
    status: 'learning',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'excel-analysis',
    title: 'Phân tích dữ liệu với Excel',
    teacher: 'Cô Trần Thị B',
    teacherInitials: 'TB',
    dates: '10/06/2024 - 10/07/2024',
    progress: 0.3,
    status: 'learning',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing tổng quan',
    teacher: 'Thầy Lê Minh C',
    teacherInitials: 'MC',
    dates: '15/07/2024 - 15/08/2024',
    progress: 0,
    status: 'new',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'ui-ux-basic',
    title: 'Thiết kế UI/UX cơ bản',
    teacher: 'Cô Phạm Thị D',
    teacherInitials: 'PD',
    dates: '20/03/2024 - 20/05/2024',
    progress: 1,
    status: 'done',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'time-management',
    title: 'Quản lý thời gian hiệu quả',
    teacher: 'Thầy Hoàng Văn E',
    teacherInitials: 'HE',
    dates: '01/02/2024 - 01/03/2024',
    progress: 1,
    status: 'overdue',
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'cyber-security',
    title: 'An ninh mạng cơ bản',
    teacher: 'Thầy Trần Văn F',
    teacherInitials: 'TF',
    dates: '01/08/2024 - 31/08/2024',
    progress: 0,
    status: 'new',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=640&q=80',
  },
];

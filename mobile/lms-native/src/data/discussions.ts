export type DiscussionKind = 'pinned' | 'question' | 'assignment' | 'announcement';

export type Discussion = {
  id: string;
  title: string;
  lesson: string;
  excerpt: string;
  body: string;
  author: string;
  authorRole?: string;
  avatar: string;
  time: string;
  replyCount: number;
  likeCount: number;
  kind: DiscussionKind;
  badge?: 'Ghim' | 'Chưa trả lời' | 'Mới';
  tags: string[];
};

export const discussions: Discussion[] = [
  {
    id: 'semantic-html',
    title: 'Giải thích thêm về thẻ semantic trong HTML',
    lesson: 'Lập trình Web cơ bản – Bài 3: HTML nâng cao',
    excerpt: 'Thẻ <article>, <section>, <aside> khác nhau như thế nào và khi nào nên dùng thẻ nào ạ?',
    body: 'Thầy cô cho em hỏi, các thẻ <article>, <section> và <aside> khác nhau như thế nào? Trong một trang tin tức thì em nên dùng từng thẻ ở vị trí nào để cấu trúc trang đúng semantic ạ?',
    author: 'Nguyễn Minh Anh',
    avatar: 'https://i.pravatar.cc/160?img=12',
    time: '5 phút trước',
    replyCount: 12,
    likeCount: 3,
    kind: 'pinned',
    badge: 'Ghim',
    tags: ['HTML', 'Semantic'],
  },
  {
    id: 'javascript-loop',
    title: 'Em chưa hiểu phần vòng lặp for trong JavaScript',
    lesson: 'Lập trình Web cơ bản – Bài 5: JavaScript cơ bản',
    excerpt: 'Khi dùng for (let i = 0; i < n; i++) thì i bắt đầu từ 0 hay 1 ạ? Và điều kiện dừng là gì?',
    body: 'Khi dùng for (let i = 0; i < n; i++) thì i bắt đầu từ 0 hay 1 ạ? Em vẫn chưa hiểu cách xác định điều kiện dừng và số lần vòng lặp được thực hiện.',
    author: 'Trần Thùy Linh',
    avatar: 'https://i.pravatar.cc/160?img=47',
    time: 'Hôm nay',
    replyCount: 8,
    likeCount: 1,
    kind: 'question',
    badge: 'Chưa trả lời',
    tags: ['JavaScript'],
  },
  {
    id: 'css-assignment',
    title: 'Bài tập CSS cuối chương nộp như thế nào?',
    lesson: 'Lập trình Web cơ bản – Bài 8: CSS Layout',
    excerpt: 'Thầy/cô cho em hỏi bài tập CSS cuối chương nộp trên hệ thống hay gửi qua Google Classroom ạ?',
    body: 'Thầy/cô cho em hỏi bài tập CSS cuối chương nộp trực tiếp trên hệ thống hay gửi qua Google Classroom ạ? Em chưa thấy nút nộp bài trong phần nội dung khóa học.',
    author: 'Lê Quang Huy',
    avatar: 'https://i.pravatar.cc/160?img=11',
    time: 'Hôm qua',
    replyCount: 5,
    likeCount: 0,
    kind: 'assignment',
    badge: 'Mới',
    tags: ['CSS', 'Bài tập'],
  },
  {
    id: 'weekly-qa',
    title: 'Thông báo: Chủ đề hỏi đáp buổi học tuần này',
    lesson: 'Lập trình Web cơ bản – Thông báo chung',
    excerpt: 'Các bạn có thể đặt câu hỏi trước buổi học để giảng viên chuẩn bị giải đáp chi tiết hơn nhé!',
    body: 'Các bạn có thể đặt câu hỏi trước buổi học để giảng viên chuẩn bị giải đáp chi tiết hơn. Những câu hỏi được nhiều bạn quan tâm sẽ được ưu tiên trong phần hỏi đáp cuối buổi.',
    author: 'Giảng viên: Phạm Thu Hà',
    authorRole: 'Giảng viên',
    avatar: 'https://i.pravatar.cc/160?img=44',
    time: 'Hôm qua',
    replyCount: 3,
    likeCount: 9,
    kind: 'announcement',
    badge: 'Ghim',
    tags: ['Thông báo'],
  },
  {
    id: 'chapter-two-resources',
    title: 'Cho em hỏi tài liệu tham khảo của chương 2',
    lesson: 'Lập trình Web cơ bản – Bài 2: HTML cơ bản',
    excerpt: 'Ngoài slide trên lớp, thầy/cô có thể gợi ý thêm tài liệu tham khảo về HTML cho người mới được không ạ?',
    body: 'Ngoài slide trên lớp, thầy/cô có thể gợi ý thêm tài liệu tham khảo về HTML cho người mới được không ạ? Em muốn có thêm bài tập để luyện cấu trúc trang.',
    author: 'Phạm Bảo Ngọc',
    avatar: 'https://i.pravatar.cc/160?img=32',
    time: '2 ngày trước',
    replyCount: 6,
    likeCount: 2,
    kind: 'question',
    badge: 'Chưa trả lời',
    tags: ['HTML', 'Tài liệu'],
  },
];

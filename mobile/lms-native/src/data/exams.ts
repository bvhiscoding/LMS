export type Exam = {
  id: string;
  title: string;
  subject: string;
  status: string;
  startTime: string;
  durationMinutes: number;
  questionCount: number;
  attempts: string;
  kind: 'quiz' | 'midterm' | 'final';
};

export type ExamQuestion = {
  id: number;
  prompt: string;
  answers: string[];
  correctIndex: number;
};

export const exams: Exam[] = [
  { id: 'quiz-chapter-1', title: 'Kiểm tra nhanh Chương 1', subject: 'HTML cơ bản', status: 'Có thể làm ngay', startTime: 'Sau khi hoàn thành chương', durationMinutes: 10, questionCount: 5, attempts: 'Không giới hạn', kind: 'quiz' },
  { id: 'midterm-web', title: 'Môn Lập trình Web cơ bản – Thi giữa khóa', subject: 'HTML & CSS', status: 'Sắp bắt đầu', startTime: '09:00, 24/05/2024', durationMinutes: 60, questionCount: 40, attempts: '1/1', kind: 'midterm' },
  { id: 'quiz-chapter-2', title: 'Kiểm tra nhanh Chương 2', subject: 'CSS cơ bản', status: 'Chưa mở', startTime: 'Sau khi hoàn thành chương', durationMinutes: 10, questionCount: 5, attempts: 'Không giới hạn', kind: 'quiz' },
  { id: 'final-web', title: 'Môn Lập trình Web cơ bản – Thi cuối kỳ', subject: 'HTML, CSS & JavaScript', status: 'Chưa mở', startTime: '09:00, 30/06/2024', durationMinutes: 90, questionCount: 50, attempts: '1/1', kind: 'final' },
];

const questionTemplates = [
  { prompt: 'Thuộc tính nào trong CSS được sử dụng để thay đổi màu chữ của một phần tử HTML?', answers: ['font-color', 'text-color', 'color', 'text-style'], correctIndex: 2 },
  { prompt: 'Thẻ HTML nào được dùng để tạo một liên kết?', answers: ['<link>', '<a>', '<href>', '<url>'], correctIndex: 1 },
  { prompt: 'Thuộc tính nào tạo khoảng cách bên trong một phần tử?', answers: ['margin', 'padding', 'spacing', 'border'], correctIndex: 1 },
  { prompt: 'Cú pháp nào đúng để chọn phần tử có id="header" trong CSS?', answers: ['.header', '#header', 'header#', '*header'], correctIndex: 1 },
  { prompt: 'Thẻ nào biểu thị tiêu đề lớn nhất trong HTML?', answers: ['<heading>', '<h6>', '<h1>', '<title>'], correctIndex: 2 },
];

export function getExam(examId: string) {
  return exams.find((exam) => exam.id === examId) ?? exams[1];
}

export function getExamQuestions(examId: string): ExamQuestion[] {
  const exam = getExam(examId);
  return Array.from({ length: exam.questionCount }, (_, index) => ({
    id: index + 1,
    ...questionTemplates[index % questionTemplates.length],
  }));
}

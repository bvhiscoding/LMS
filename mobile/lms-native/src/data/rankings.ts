export type RankedStudent = {
  id: string;
  rank: number;
  name: string;
  cohort: string;
  score: number;
  level: number;
  trend: number;
  avatar: string;
};

export const currentStudent: RankedStudent = {
  id: 'current-user',
  rank: 12,
  name: 'Nguyễn Anh Khoa',
  cohort: 'K65 CNTT',
  score: 865,
  level: 4,
  trend: 3,
  avatar: 'https://i.pravatar.cc/200?img=12',
};

export const rankedStudents: RankedStudent[] = [
  { id: 'thu-ha', rank: 1, name: 'Nguyễn Thu Hà', cohort: 'K65 CNTT', score: 1125, level: 4, trend: 0, avatar: 'https://i.pravatar.cc/160?img=47' },
  { id: 'minh-duc', rank: 2, name: 'Trần Minh Đức', cohort: 'K65 CNTT', score: 928, level: 4, trend: 1, avatar: 'https://i.pravatar.cc/160?img=11' },
  { id: 'quoc-bao', rank: 3, name: 'Lê Quốc Bảo', cohort: 'K65 CNTT', score: 912, level: 4, trend: -1, avatar: 'https://i.pravatar.cc/160?img=13' },
  { id: 'thanh-huyen', rank: 4, name: 'Phạm Thanh Huyền', cohort: 'K65 CNTT', score: 900, level: 4, trend: 2, avatar: 'https://i.pravatar.cc/160?img=45' },
  { id: 'hoang-nam', rank: 5, name: 'Đỗ Hoàng Nam', cohort: 'K65 CNTT', score: 880, level: 4, trend: 1, avatar: 'https://i.pravatar.cc/160?img=5' },
  { id: 'thi-mai', rank: 6, name: 'Vũ Thị Mai', cohort: 'K65 CNTT', score: 883, level: 4, trend: -1, avatar: 'https://i.pravatar.cc/160?img=32' },
  { id: 'gia-bao', rank: 7, name: 'Hoàng Gia Bảo', cohort: 'K65 CNTT', score: 842, level: 4, trend: -1, avatar: 'https://i.pravatar.cc/160?img=3' },
  { id: 'thao-vy', rank: 8, name: 'Nguyễn Thảo Vy', cohort: 'K65 CNTT', score: 820, level: 4, trend: 2, avatar: 'https://i.pravatar.cc/160?img=49' },
  { id: 'nhat-minh', rank: 9, name: 'Phan Nhật Minh', cohort: 'K65 CNTT', score: 805, level: 4, trend: -2, avatar: 'https://i.pravatar.cc/160?img=15' },
  currentStudent,
];

export const nearbyStudents: RankedStudent[] = [
  { id: 'near-9', rank: 9, name: 'Hoàng Nam', cohort: 'K65 CNTT', score: 1350, level: 8, trend: 1, avatar: 'https://i.pravatar.cc/160?img=5' },
  { id: 'near-10', rank: 10, name: 'Phương Anh', cohort: 'K65 CNTT', score: 1300, level: 8, trend: 0, avatar: 'https://i.pravatar.cc/160?img=44' },
  { id: 'near-11', rank: 11, name: 'Đức Anh', cohort: 'K65 CNTT', score: 1245, level: 8, trend: -1, avatar: 'https://i.pravatar.cc/160?img=14' },
  { ...currentStudent, score: 1280, level: 8 },
  { id: 'near-13', rank: 13, name: 'Bảo Trâm', cohort: 'K65 CNTT', score: 1210, level: 8, trend: 0, avatar: 'https://i.pravatar.cc/160?img=48' },
  { id: 'near-14', rank: 14, name: 'Hải Đăng', cohort: 'K65 CNTT', score: 1180, level: 8, trend: -1, avatar: 'https://i.pravatar.cc/160?img=8' },
];

export const podiumStudents = [
  { id: 'minh-quan', rank: 2, name: 'Minh Quân', score: 1420, avatar: 'https://i.pravatar.cc/160?img=11' },
  { id: 'khanh-linh', rank: 1, name: 'Khánh Linh', score: 1680, avatar: 'https://i.pravatar.cc/160?img=47' },
  { id: 'gia-bao-podium', rank: 3, name: 'Gia Bảo', score: 1360, avatar: 'https://i.pravatar.cc/160?img=13' },
];

export function getRankedStudent(studentId: string) {
  return rankedStudents.find((student) => student.id === studentId)
    ?? nearbyStudents.find((student) => student.id === studentId)
    ?? currentStudent;
}

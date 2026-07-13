# LMS Mobile — React Native

Hai màn hình khóa học được xây dựng bằng Expo SDK 54, TypeScript, React Navigation và React Native Paper (Material 3).

## Chạy ứng dụng

```powershell
cd mobile\lms-native
npm start
```

Quét QR bằng Expo Go, hoặc nhấn `a` trong terminal để mở Android emulator.

## UI library được sử dụng

- `react-native-paper`: Appbar, Card, Chip, Avatar, ProgressBar, List.Accordion, SegmentedButtons, Button, BottomNavigation, Snackbar và hệ thống theme Material 3.
- `@react-navigation/native-stack`: chuyển màn và back stack native.
- `react-native-safe-area-context`: tránh notch, status bar và home indicator.

`StyleSheet` chỉ đảm nhiệm layout, khoảng cách và kích thước; các control tương tác đều dùng component thư viện.

## Luồng prototype

1. Màn **Khóa học** hiển thị danh sách và bộ lọc trạng thái.
2. Chạm **Lập trình Web cơ bản** để mở **Chi tiết khóa học**.
3. Nút quay lại sử dụng native stack.
4. Màn chi tiết hỗ trợ bookmark, tab nội dung, đóng/mở chương và nút tiếp tục học.

# LMS Mobile prototype

Prototype hai màn hình mobile được dựng bằng HTML, CSS và JavaScript thuần.

## Chạy thử

Cách nhanh nhất là mở trực tiếp `index.html` bằng trình duyệt. Hoặc chạy local server:

```powershell
python -m http.server 4173 --directory mobile
```

Sau đó mở `http://127.0.0.1:4173` và bật chế độ giả lập điện thoại trong DevTools.

## Tương tác

- Chạm thẻ **Lập trình Web cơ bản** để đi tới màn chi tiết.
- Chạm nút quay lại để trở về danh sách.
- Các tab trạng thái ở màn danh sách có thể lọc khóa học.
- Các chương ở màn chi tiết có thể đóng/mở.
- Nút **Mở rộng tất cả** đóng/mở toàn bộ chương.
- Nút bookmark có trạng thái đã lưu/chưa lưu.

## Khi nào cần framework mobile?

Không cần framework cho giai đoạn prototype giao diện và duyệt luồng. Khi phát triển ứng dụng cài trên iOS/Android, có thể chuyển thiết kế sang Flutter hoặc React Native; lựa chọn nên dựa vào đội ngũ hiện có và mức độ cần tích hợp native.

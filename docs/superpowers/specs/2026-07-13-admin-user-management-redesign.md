# Thiết kế lại trang Quản lý người dùng

## Phạm vi

- Chỉ thay phần body của `webapp/html/ad/quan-ly-nguoi-dung.html` theo mockup.
- Giữ nguyên toàn bộ navbar, sidebar và hành vi điều hướng hiện có.
- Dùng màu, font và component nền từ `webapp/css/main.css`; style riêng đặt tại `webapp/css/ad/quan-ly-nguoi-dung.css`.
- Dùng Font Awesome đã được `webapp/js/app.js` nạp sẵn.

## Giao diện

- Breadcrumb, tiêu đề, mô tả và hai nút “Thêm người dùng”, “Xuất dữ liệu”.
- Một card gồm ô tìm kiếm, bộ lọc vai trò/trạng thái/đơn vị, bảng người dùng và phân trang.
- Bảng responsive bằng vùng cuộn ngang, không thay đổi layout chung của ứng dụng.
- Modal dùng chung cho thêm/sửa người dùng; hộp xác nhận cho khóa/mở khóa.

## Hành vi demo

- Mock data nằm trong JS và chỉ tồn tại trong phiên trang hiện tại.
- Tìm kiếm/lọc cập nhật bảng và phân trang ngay trên trình duyệt.
- Thêm, sửa, khóa/mở khóa cập nhật mock data trong bộ nhớ.
- Menu ba chấm mở danh sách thao tác; click ngoài hoặc Escape sẽ đóng.
- Xuất dữ liệu tạo CSV từ tập dữ liệu đang lọc.
- Form yêu cầu họ tên, email hợp lệ, vai trò, đơn vị và trạng thái; lỗi hiển thị trong modal.

## Kiểm tra

- Một self-check nhỏ trong JS xác nhận logic tìm kiếm, lọc và phân trang cơ bản.
- Kiểm tra thủ công modal, menu thao tác, tải CSV và responsive.

## Ngoài phạm vi

- Không backend/API, xác thực, upload avatar hay lưu `localStorage`.
- Không sửa component hoặc style dùng chung của navbar/sidebar.

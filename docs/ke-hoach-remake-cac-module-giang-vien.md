# Kế hoạch remake và bổ sung các module Giảng viên

## 1. Mục tiêu

Remake các trang đã có trong `webapp/html/gv` và tạo mới các trang còn thiếu theo bộ mockup trong `webapp/mockups/GiangVien`, với các yêu cầu thống nhất:

- Giữ nguyên layout chung hiện tại của hệ thống: topbar, sidebar, role switch và cách điều hướng.
- Chỉ remake phần nội dung chính của từng trang để bám sát mockup.
- Dùng mock data phía client; không cần backend, API, database hay lưu dữ liệu lâu dài.
- Mọi nút có ý nghĩa trong mockup phải có hành vi demo tương ứng: lọc, tìm kiếm, phân trang, đổi tab, mở/đóng modal, xác nhận xóa, thêm/sửa dữ liệu trong bộ nhớ, điều hướng sang trang chi tiết.
- Dùng Font Awesome hoặc bộ icon chung đang có; icon trong sidebar phải dùng cùng kích thước và wrapper với các mục hiện hữu để không bị lệch căn.
- Tận dụng `webapp/css/main.css`; CSS riêng đặt trong `webapp/css/gv/`, JavaScript riêng đặt trong `webapp/js/`.
- Giao diện phải co giãn theo vùng nội dung, không để khoảng trắng lớn bên phải khi thay đổi độ phân giải hoặc zoom.

## 2. Phạm vi và phân loại công việc

### 2.1. Ma trận remake / tạo mới

| Module | Trang hiện có | Phân loại | Trang/luồng đích |
|---|---|---|---|
| Quản lý giảng viên | `quan-ly-giang-vien.html` | **REMAKE** | Danh sách dạng thẻ, bộ lọc, đổi kiểu hiển thị, modal thêm/sửa, thao tác lịch/lớp/xóa |
| Quản lý chứng chỉ | `quan-ly-chung-chi.html` | **REMAKE** | Danh sách mẫu chứng chỉ, bộ lọc, khung xem trước, modal tạo/sửa, xóa mẫu |
| Khảo sát nhu cầu | `khao-sat-nhu-cau.html` | **REMAKE** | Danh sách khảo sát và modal đăng ký nhu cầu đào tạo |
| Giám sát thi | `giam-sat-thi.html` | **REMAKE** | Danh sách ca thi, bộ lọc và thao tác giám sát |
| Chi tiết giám sát | Chưa có | **TẠO MỚI** | `chi-tiet-giam-sat-thi.html` với giám sát trực tiếp, nhật ký và vi phạm |
| Quản lý khóa học | Chưa có | **TẠO MỚI** | `quan-ly-khoa-hoc.html` |
| Thêm khóa học | Chưa có | **TẠO MỚI** | `them-khoa-hoc.html` |
| Chi tiết khóa học nhiều tab | Chưa có | **TẠO MỚI** | `chi-tiet-khoa-hoc.html`, dùng tab/hash để đổi nội dung trên cùng một route |
| Ngân hàng câu hỏi & đề thi | `ngan-hang-de-thi.html` | **REMAKE** | Một trang có hai tab “Câu hỏi” và “Đề thi” |
| Chi tiết câu hỏi | Chưa có | **TẠO MỚI** | `chi-tiet-cau-hoi.html` |
| Thêm/sửa câu hỏi | Chưa có | **TẠO MỚI** | `them-cau-hoi.html`, dùng query `?id=` cho chế độ sửa |
| Chủ đề & chương trình | `chu-de-chuong-trinh.html` | **REMAKE** | Hai tab “Chủ đề” và “Chương trình”; tab Chủ đề bám sát bộ mockup |
| Chi tiết chủ đề | Chưa có | **TẠO MỚI** | `chi-tiet-chu-de.html` |
| Phân nhóm chủ đề | Chưa có | **TẠO MỚI** | `phan-nhom-chu-de.html` |
| Thêm chủ đề / thêm nội dung | Chưa có route riêng | **MODAL MỚI** | Modal trong trang danh sách/chi tiết, không tạo HTML độc lập |

### 2.2. Các file hiện có không thay vai trò

- `quan-ly-lop-hoc.html` vẫn quản lý các lớp đã mở, không gộp với “Quản lý khóa học”.
- `quan-ly-hoc-lieu.html` vẫn là nội dung/học liệu, không dùng thay cho danh mục khóa học.
- `ca-thi.html` vẫn là tổ chức ca thi; `giam-sat-thi.html` chỉ tập trung vào theo dõi và xử lý trong thời gian thi.
- `quan-ly-chung-chi.html` được định nghĩa lại theo mockup là quản lý **mẫu chứng chỉ**, không phải danh sách chứng chỉ đã cấp.

## 3. Kiến trúc demo và quy ước chung

### 3.1. Dữ liệu

- Mỗi module có một mảng mock data trong file JavaScript của module.
- Thêm/sửa/xóa chỉ cập nhật mảng trong bộ nhớ; tải lại trang sẽ trở về dữ liệu ban đầu.
- Không dùng `localStorage` trừ khi sau này có yêu cầu giữ dữ liệu qua lần refresh.
- ID trong URL dùng dạng dễ đọc, ví dụ `chi-tiet-khoa-hoc.html?id=ATLD-01`.
- Các trang chi tiết đọc `id` từ query string và chọn bản ghi tương ứng; nếu không có ID hợp lệ thì dùng bản ghi mẫu đầu tiên và hiển thị thông báo nhẹ.

### 3.2. Điều hướng và trạng thái

- Tab dùng query hoặc hash để có thể mở trực tiếp, ví dụ:
  - `ngan-hang-de-thi.html?tab=questions`
  - `ngan-hang-de-thi.html?tab=exams`
  - `chi-tiet-khoa-hoc.html?id=ATLD-01#overview`
  - `chi-tiet-khoa-hoc.html?id=ATLD-01#content`
- Các thao tác “Xem”, “Chi tiết”, “Giám sát” phải điều hướng thật sang route tương ứng.
- Nút “Quay lại” ưu tiên `history.back()` và có fallback về trang danh sách.

### 3.3. Bộ hành vi dùng chung

Mỗi trang danh sách cần có tối thiểu:

1. Tìm kiếm không phân biệt hoa/thường theo các trường hiển thị chính.
2. Bộ lọc select/chip hoạt động đồng thời.
3. Nút đặt lại khôi phục toàn bộ bộ lọc.
4. Phân trang thật trên mảng đã lọc; khi lọc phải quay về trang 1.
5. Chọn số bản ghi/trang nếu mockup có điều khiển này.
6. Empty state khi không có kết quả.
7. Modal đóng bằng nút X, nút Hủy, phím `Escape` và click backdrop.
8. Form kiểm tra trường bắt buộc, hiển thị lỗi ngay dưới trường và khóa submit khi dữ liệu chưa hợp lệ.
9. Xóa phải qua modal xác nhận; sau khi xóa cập nhật lại bảng/thẻ và tổng số.
10. Toast thông báo cho thao tác lưu, xóa, sao chép, nhập Excel hoặc thao tác demo khác.

### 3.4. CSS và responsive

- Container nội dung dùng `width: 100%`, không đặt `max-width` cứng gây thừa khoảng trắng bên phải.
- Grid thẻ dùng `repeat(auto-fit, minmax(...))`; không cố định bốn cột ở mọi độ rộng.
- Bảng nằm trong wrapper `overflow-x: auto`; không làm toàn trang tràn ngang.
- Các vùng hai cột chuyển thành một cột ở màn hình nhỏ.
- Sticky header/toolbar chỉ dùng ở nơi mockup cần và không che topbar.
- CSS mỗi module có namespace riêng, ví dụ `.instructor-page`, `.course-detail-page`, để tránh ảnh hưởng trang cũ.
- Sidebar động phải tạo icon theo cấu trúc `<svg class="ic"><use ...></use></svg>` giống các mục tĩnh; không chèn `<i>` trần gây lệch lề.

## 4. Lộ trình triển khai

### Giai đoạn 0 — Chuẩn hóa nền chung và route

#### Công việc

1. Kiểm tra `main.css`, `app.js` và một trang GV chuẩn để xác định chính xác spacing, typography, card, button, badge, modal và breakpoint đang dùng.
2. Bổ sung mục **Quản lý khóa học** vào nhóm “Nghiệp vụ đào tạo” của sidebar cho toàn bộ trang GV qua `app.js`, đặt gần “Quản lý lớp học”.
3. Chuẩn hóa mục **Quản lý học viên** đang được chèn động về cùng icon wrapper, chiều rộng và padding với các mục khác.
4. Giữ route `ngan-hang-de-thi.html` nhưng đổi nhãn hiển thị thành “Ngân hàng câu hỏi & đề thi” nếu chiều rộng cho phép; ở sidebar hẹp có thể giữ nhãn ngắn “Ngân hàng đề thi”.
5. Bảo đảm `data-page` mới có active state đúng:
   - `gv-courses`
   - `gv-course-create`
   - `gv-course-detail`
   - `gv-proctor-detail`
   - `gv-question-detail`
   - `gv-question-form`
   - `gv-topic-detail`
   - `gv-topic-groups`
6. Với trang con, active state của sidebar phải quy về module cha, ví dụ mọi trang khóa học đều active “Quản lý khóa học”.
7. Kiểm tra encoding UTF-8 để không phát sinh chữ tiếng Việt bị lỗi khi sửa các file cũ.

#### Kết quả đầu ra

- Route mới có liên kết nhất quán.
- Sidebar không lệch icon hoặc text.
- Chưa thay đổi body nghiệp vụ ở giai đoạn này.

#### Tiêu chí hoàn thành

- Mở bất kỳ trang trong `html/gv` đều nhìn thấy mục “Quản lý khóa học”.
- Click mục mới đi đúng `quan-ly-khoa-hoc.html`.
- Trang con khóa học/giám sát/câu hỏi/chủ đề vẫn active đúng menu cha.
- Sidebar không thay layout chung và không tạo khoảng dịch trái/phải giữa các option.

### Giai đoạn 1 — Quản lý giảng viên (REMAKE)

#### File chính

- Sửa: `webapp/html/gv/quan-ly-giang-vien.html`
- Tạo: `webapp/css/gv/quan-ly-giang-vien.css`
- Tạo: `webapp/js/quan-ly-giang-vien.js`

#### Phần giao diện

1. Header, breadcrumb, mô tả và nút “Thêm giảng viên”.
2. Thanh lọc gồm:
   - Tìm theo họ tên/email/số điện thoại.
   - Khoa/phòng.
   - Bộ môn/chuyên môn.
   - Trạng thái.
   - Nút bộ lọc mở rộng và đặt lại.
   - Chuyển dạng lưới/danh sách.
3. Chip thống kê “Tất cả”, “Nội bộ”, “Thỉnh giảng”.
4. Card giảng viên gồm avatar, tên, loại giảng viên, chuyên môn, email, điện thoại, số lớp, số học viên và điểm đánh giá.
5. Nhóm action: xem lịch, xem lớp phụ trách, xem học viên, sửa, xóa và menu mở rộng.
6. Footer tổng số, số bản ghi/trang và phân trang.

#### Chức năng demo

- Tìm kiếm, filter, chip và pagination dùng chung một tập dữ liệu đã lọc.
- Nút grid/list đổi layout nhưng giữ nguyên dữ liệu và trang hiện tại.
- “Thêm giảng viên” mở modal form; submit hợp lệ thêm card mới lên đầu danh sách.
- “Sửa” mở lại modal với dữ liệu đã điền.
- “Xóa” mở confirm modal và xóa khỏi mock data.
- “Xem lịch/lớp/học viên” mở modal tóm tắt hoặc điều hướng tới trang liên quan nếu đã có route phù hợp.

#### Tiêu chí hoàn thành

- Bố cục desktop bám sát mockup 4 card/hàng ở vùng nội dung đủ rộng.
- Ở viewport nhỏ, card tự giảm cột và không làm tràn trang.
- Tất cả action trên card có phản hồi; không để nút chết.

### Giai đoạn 2 — Mẫu chứng chỉ (REMAKE)

#### File chính

- Sửa: `webapp/html/gv/quan-ly-chung-chi.html`
- Tạo: `webapp/css/gv/quan-ly-chung-chi.css`
- Tạo: `webapp/js/quan-ly-chung-chi.js`

#### Phần giao diện

1. Đổi tiêu đề body thành “Mẫu chứng chỉ”.
2. Toolbar tạo mẫu mới và bộ lọc:
   - Từ khóa.
   - Loại chứng chỉ.
   - Trạng thái.
   - Thời hạn.
   - Lọc và đặt lại.
3. Bảng mẫu chứng chỉ với checkbox, thumbnail, mã mẫu, tên/mô tả, loại, trạng thái, ngày tạo/cập nhật và action.
4. Panel xem trước bên phải hiển thị ảnh mẫu, mã, loại, trạng thái, ngày cập nhật và action sửa/xóa.
5. Footer bảng, page size và phân trang.

#### Chức năng demo

- Click một dòng hoặc nút xem sẽ cập nhật panel preview.
- Tạo/sửa dùng cùng một modal form theo chế độ.
- Upload ảnh mẫu tạo preview bằng `URL.createObjectURL`; không upload server.
- Xóa từ bảng hoặc panel đều dùng cùng confirm modal và cập nhật lựa chọn hiện tại.
- Checkbox chọn tất cả/riêng từng dòng hoạt động; nếu chưa có bulk action trong mockup thì chỉ phản ánh trạng thái chọn.

#### Tiêu chí hoàn thành

- Panel preview luôn đồng bộ với dòng đang chọn.
- Khi chiều rộng không đủ, panel chuyển xuống dưới bảng thay vì làm trang bị bó hẹp.

### Giai đoạn 3 — Khảo sát nhu cầu (REMAKE + MODAL MỚI)

#### File chính

- Sửa: `webapp/html/gv/khao-sat-nhu-cau.html`
- Tạo: `webapp/css/gv/khao-sat-nhu-cau.css`
- Tạo: `webapp/js/khao-sat-nhu-cau.js`

#### Phần giao diện danh sách

1. Header “Khảo sát nhu cầu đào tạo”.
2. Card “Danh sách khảo sát”.
3. Tìm kiếm, trạng thái, năm, nút đăng ký nhu cầu và đặt lại.
4. Bảng khảo sát với tên/đợt khảo sát, thời gian, trạng thái và action theo trạng thái.
5. Phân trang và khối hướng dẫn phía dưới.

#### Modal “Đăng ký nhu cầu đào tạo”

Các trường bám sát mockup:

- Tên khóa học/chương trình, bắt buộc.
- Lĩnh vực đào tạo, bắt buộc.
- Hình thức: trực tiếp, trực tuyến hoặc kết hợp.
- Đơn vị tổ chức.
- Mức độ ưu tiên, bắt buộc.
- Lý do đăng ký, tối đa 500 ký tự.
- Mục tiêu mong đợi, tối đa 500 ký tự.
- Thời gian mong muốn.
- Ghi chú, tối đa 500 ký tự.
- Nút Hủy và Gửi đăng ký.

#### Chức năng demo

- Hiển thị bộ đếm ký tự thực cho các textarea.
- Validate trường bắt buộc và giới hạn ký tự.
- Gửi hợp lệ tạo một bản ghi mock mới hoặc thêm vào nhóm “Đã đăng ký”, sau đó hiện toast thành công.
- Action “Thực hiện” mở form khảo sát demo ngắn hoặc chuyển trạng thái sau khi hoàn tất.
- “Xem kết quả” và “Xem” mở modal chi tiết tương ứng.

#### Tiêu chí hoàn thành

- Modal có thể cuộn độc lập ở màn hình thấp, footer action luôn dễ truy cập.
- Đóng modal không làm thay đổi dữ liệu; submit hợp lệ mới cập nhật danh sách.

### Giai đoạn 4 — Giám sát thi (REMAKE + TRANG CHI TIẾT MỚI)

#### File chính

- Sửa: `webapp/html/gv/giam-sat-thi.html`
- Tạo: `webapp/html/gv/chi-tiet-giam-sat-thi.html`
- Tạo: `webapp/css/gv/giam-sat-thi.css`
- Tạo: `webapp/js/giam-sat-thi.js`
- Tạo: `webapp/js/chi-tiet-giam-sat-thi.js`

#### Trang danh sách ca thi

1. Header, breadcrumb, nút hướng dẫn.
2. Bộ lọc theo từ khóa, chuyên ngành, kỳ thi, trạng thái và ngày.
3. Nút làm mới trả dữ liệu về trạng thái ban đầu và cập nhật thời gian làm mới trên giao diện.
4. Bảng ca thi: tên ca, chuyên ngành, kỳ thi, lịch thi, số thí sinh, trạng thái, giám thị và action.
5. Action thay đổi theo trạng thái: “Giám sát”, “Xem chi tiết”, “Xem kết quả”.

#### Trang chi tiết giám sát trực tiếp

1. Header ca thi, trạng thái, metadata, quay lại danh sách và nút kết thúc ca thi.
2. Ba tab:
   - Giám sát trực tiếp.
   - Nhật ký giám sát.
   - Báo cáo vi phạm.
3. Sidebar thí sinh có tìm kiếm, lọc trạng thái, danh sách thí sinh, đồng hồ làm bài và phân trang.
4. Khu vực theo dõi thí sinh có thông tin, ảnh/camera giả lập, badge trực tiếp và các nút âm thanh, camera, toàn màn hình, trước/sau.
5. Tab nhật ký có timeline sự kiện; tab vi phạm có bảng mức độ, thời gian, mô tả và trạng thái xử lý.

#### Chức năng demo và giới hạn

- Không triển khai WebRTC/camera thật; dùng placeholder hoặc ảnh mock trong dự án.
- Chọn thí sinh sẽ cập nhật khu vực theo dõi và nhật ký tương ứng.
- Các nút mic/camera chỉ bật/tắt trạng thái giao diện.
- Toàn màn hình dùng Fullscreen API nếu trình duyệt hỗ trợ, nếu không hiển thị toast.
- “Kết thúc ca thi” mở confirm modal; xác nhận chuyển trạng thái ca sang đã kết thúc.
- Gắn cờ vi phạm mở modal nhập loại/mức độ/ghi chú và thêm vào bảng vi phạm trong bộ nhớ.

#### Tiêu chí hoàn thành

- Từ danh sách có thể vào đúng chi tiết bằng `id` ca thi.
- Ba tab hoạt động và giữ thí sinh đang chọn khi chuyển tab trong cùng phiên.
- Không mô phỏng sai kỳ vọng bằng camera thật; nhãn “demo” hoặc placeholder phải rõ ràng.

### Giai đoạn 5 — Chủ đề & chương trình (REMAKE + TRANG/MODAL MỚI)

Module này được làm trước khóa học vì danh sách chủ đề/chương trình sẽ là nguồn chọn trong cấu trúc khóa học.

#### File chính

- Sửa: `webapp/html/gv/chu-de-chuong-trinh.html`
- Tạo: `webapp/html/gv/chi-tiet-chu-de.html`
- Tạo: `webapp/html/gv/phan-nhom-chu-de.html`
- Tạo: `webapp/css/gv/chu-de-chuong-trinh.css`
- Tạo: `webapp/js/chu-de-chuong-trinh.js`
- Tạo: `webapp/js/chi-tiet-chu-de.js`
- Tạo: `webapp/js/phan-nhom-chu-de.js`

#### Trang danh sách

1. Giữ option sidebar “Chủ đề & chương trình”.
2. Tạo hai tab trong body:
   - **Chủ đề**: bám sát toàn bộ mockup được cung cấp.
   - **Chương trình**: dùng cùng hệ thiết kế, hiển thị danh sách chương trình, số chủ đề, số khóa học, đơn vị và trạng thái bằng mock data.
3. Tab Chủ đề gồm bộ lọc từ khóa, phân nhóm, trạng thái, tìm kiếm và thêm mới.
4. Bảng gồm thumbnail, tên/mô tả, phân nhóm, số nội dung, trạng thái, ngày tạo và action xem/sửa/xóa.
5. Bổ sung action đi tới “Phân nhóm chủ đề”.

#### Modal thêm/sửa chủ đề

- Tên chủ đề, phân nhóm, mô tả tối đa 500 ký tự.
- Ảnh đại diện và banner với preview cục bộ.
- Thứ tự hiển thị và trạng thái.
- Dùng cùng modal cho tạo mới và chỉnh sửa.

#### Trang chi tiết chủ đề

1. Khối tổng quan ảnh, tên, phân nhóm, trạng thái, mô tả, chỉnh sửa và xóa.
2. Các tab “Thông tin”, “Nội dung”, “Lịch sử”.
3. Tab Nội dung có bảng tiêu đề, loại, thứ tự, trạng thái và action.
4. Nút thêm nội dung mở modal đúng mockup.

#### Modal thêm nội dung

- Chủ đề readonly.
- Tiêu đề và loại nội dung.
- Khu soạn thảo giả lập toolbar; không tích hợp thư viện rich text mới.
- File đính kèm và URL.
- Thứ tự hiển thị và trạng thái.
- Validate loại nội dung: URL cần thiết cho video/link; file phù hợp cho PDF/tài liệu nếu người dùng chọn.

#### Trang phân nhóm chủ đề

1. Bảng phân nhóm, mô tả, số chủ đề, trạng thái và action.
2. Drawer hoặc panel bên phải để thêm/sửa phân nhóm theo mockup.
3. Tìm kiếm, làm mới, phân trang, xóa có xác nhận.

#### Tiêu chí hoàn thành

- Danh sách → chi tiết → thêm nội dung → quay lại danh sách là một luồng demo hoàn chỉnh.
- Hai tab Chủ đề/Chương trình có active state và URL state rõ ràng.
- Tab Chương trình không invent luồng phức tạp ngoài mockup: chỉ cần CRUD demo cơ bản và liên kết các chủ đề đã có.

### Giai đoạn 6 — Ngân hàng câu hỏi & đề thi (REMAKE + TRANG MỚI)

Module này được làm trước chi tiết khóa học để tab “Bài kiểm tra” có nguồn đề thi/câu hỏi sẵn có.

#### File chính

- Sửa: `webapp/html/gv/ngan-hang-de-thi.html`
- Tạo: `webapp/html/gv/chi-tiet-cau-hoi.html`
- Tạo: `webapp/html/gv/them-cau-hoi.html`
- Tạo: `webapp/css/gv/ngan-hang-de-thi.css`
- Tạo: `webapp/js/ngan-hang-de-thi.js`
- Tạo: `webapp/js/chi-tiet-cau-hoi.js`
- Tạo: `webapp/js/them-cau-hoi.js`

#### Trang hai tab

##### Tab “Danh sách câu hỏi”

- Nút nhập Excel, thêm câu hỏi và menu mở rộng.
- Bộ lọc từ khóa, chuyên ngành, chủ đề, loại câu hỏi, độ khó và trạng thái.
- Bảng mã, nội dung rút gọn, loại, chủ đề, độ khó, điểm, người tạo và action.
- Action xem chi tiết, sửa, sao chép, xóa.

##### Tab “Danh sách đề thi”

- Nút nhập Excel, bộ lọc, tạo thủ công và tạo tự động.
- Bộ lọc từ khóa, chuyên ngành, phương thức tạo và người tạo.
- Bảng mã đề, tên đề, số câu, thời lượng, điểm, phương thức, người tạo, trạng thái và action.
- Tạo thủ công/tự động dùng modal wizard ngắn; không tạo thêm route nếu mockup không yêu cầu.

#### Trang chi tiết câu hỏi

- Metadata câu hỏi, chuyên ngành, chủ đề, loại, mức độ, điểm và trạng thái.
- Nội dung câu hỏi và vùng ảnh minh họa nếu có.
- Danh sách đáp án, đánh dấu đáp án đúng.
- Lời giải thích, lịch sử sử dụng và thông tin hệ thống.
- Nút sửa, sao chép, xóa và quay lại danh sách.

#### Trang thêm/sửa câu hỏi

- Cột thông tin chung: chuyên ngành, chủ đề, loại, độ khó, điểm và trạng thái.
- Vùng nhập nội dung có toolbar giao diện, không kéo thêm rich-text dependency.
- Upload ảnh và preview cục bộ.
- Danh sách đáp án động: thêm/xóa, chọn đáp án đúng và validate tối thiểu.
- Trường giải thích.
- Nút lưu nháp, lưu và thêm tiếp, lưu hoàn tất.

#### Chức năng demo

- Tab state nằm trong URL.
- Sao chép tạo bản ghi mới với mã tạm và hậu tố “Bản sao”.
- Nhập Excel mở modal chọn file, hiển thị tên file và mô phỏng kết quả import; không parse thật.
- Form thay đổi theo loại câu hỏi:
  - Một đáp án: radio.
  - Nhiều đáp án: checkbox.
  - Đúng/sai: hai lựa chọn cố định.
  - Tự luận: ẩn danh sách đáp án, hiện gợi ý chấm.

#### Tiêu chí hoàn thành

- Cả hai tab có bộ lọc/phân trang riêng và không lẫn trạng thái.
- Các route xem/sửa từ bảng mở đúng câu hỏi bằng `id`.
- Form không cho lưu khi chưa đủ đáp án hoặc chưa chọn đáp án đúng đối với loại trắc nghiệm.

### Giai đoạn 7 — Quản lý khóa học nhiều tab (TOÀN BỘ TẠO MỚI)

Đây là module lớn nhất và được triển khai sau Chủ đề và Ngân hàng đề thi để tái sử dụng mock data/luồng chọn đã có.

#### File chính

- Tạo: `webapp/html/gv/quan-ly-khoa-hoc.html`
- Tạo: `webapp/html/gv/them-khoa-hoc.html`
- Tạo: `webapp/html/gv/chi-tiet-khoa-hoc.html`
- Tạo: `webapp/css/gv/quan-ly-khoa-hoc.css`
- Tạo: `webapp/css/gv/chi-tiet-khoa-hoc.css`
- Tạo: `webapp/js/quan-ly-khoa-hoc.js`
- Tạo: `webapp/js/them-khoa-hoc.js`
- Tạo: `webapp/js/chi-tiet-khoa-hoc.js`

#### 7.1. Danh sách khóa học

1. Header, breadcrumb, nhập Excel và thêm khóa học.
2. Bộ lọc từ khóa, đơn vị, hình thức và sắp xếp.
3. Bảng:
   - Mã khóa học.
   - Tên khóa học.
   - Đơn vị phụ trách.
   - Hình thức.
   - Thời lượng.
   - Số chủ đề.
   - Số nội dung.
   - Số lớp đã mở.
   - Thao tác.
4. Pagination và page size.
5. Action xem chi tiết, sửa, sao chép, xóa và menu mở rộng.

#### 7.2. Trang thêm khóa học

1. Thông tin chung: mã, tên, hình thức, đơn vị, thời lượng, đối tượng và mô tả.
2. Khóa học tiên quyết: tìm kiếm/chọn nhiều, hiển thị chip và xóa lựa chọn.
3. Năng lực yêu cầu: tìm kiếm/chọn nhiều, hiển thị chip và xóa lựa chọn.
4. Nút Hủy và Lưu.
5. Chế độ sửa dùng cùng trang với `?id=` để tránh tạo thêm file trùng lặp.

#### 7.3. Trang chi tiết khóa học và các tab

Header chung gồm tên/mã khóa học, quay lại, chỉnh sửa, sao chép, xóa và menu.

##### Tab 1 — Tổng quan

- Thông tin khóa học.
- Card thống kê cấu trúc: số chủ đề, số nội dung, số bài kiểm tra, thời lượng.
- Danh sách khóa học/năng lực tiên quyết.
- Bảng cấu trúc khóa học rút gọn.
- Thông tin tạo/cập nhật cuối trang.

##### Tab 2 — Chủ đề và nội dung

- Tìm kiếm, lọc theo nhóm, thêm chủ đề.
- Danh sách chủ đề dạng accordion.
- Mỗi chủ đề có bảng nội dung, loại, thời lượng, bắt buộc/tùy chọn và action.
- Thêm/xóa/sửa nội dung bằng modal.
- Đổi thứ tự bằng nút lên/xuống hoặc drag-and-drop HTML5; luôn có nút thay thế để demo không phụ thuộc kéo thả.

##### Tab 3 — Bài kiểm tra

- Danh sách bài kiểm tra đã gắn với khóa học.
- Nút tạo mới mở modal theo mockup `TaoMoiBaiKiemTra_1.png`.
- Ba phương thức:
  - Chọn từ ngân hàng đề thi.
  - Tạo ngẫu nhiên từ ngân hàng câu hỏi.
  - Upload file.
- Modal có tìm kiếm, bộ lọc, bảng chọn, phân trang, Hủy và Tiếp tục.
- Bước tiếp theo tối giản: xác nhận tên, thời lượng, điểm đạt và lưu vào mock data.

##### Tab 4 — Điều kiện tham gia

- Bảng khóa học tiên quyết.
- Bảng năng lực yêu cầu.
- Tìm kiếm, thêm, xóa và lưu điều kiện.
- Không cho chọn chính khóa học hiện tại làm tiên quyết.

##### Tab 5 — Điều kiện hoàn thành

Mockup không có ảnh riêng nhưng tab xuất hiện trong thiết kế, vì vậy xây dựng giao diện cùng hệ thống gồm:

- Tỷ lệ nội dung bắt buộc phải hoàn thành.
- Điểm đạt tối thiểu.
- Bài kiểm tra bắt buộc.
- Tỷ lệ chuyên cần nếu áp dụng.
- Điều kiện cấp chứng chỉ.
- Nút lưu và reset.

#### Chức năng demo

- List → thêm → chi tiết → chuyển tab → sửa là luồng điều hướng hoàn chỉnh.
- Dữ liệu thêm mới có thể truyền tạm qua query/session memory trong phiên trang; không hứa hẹn lưu sau refresh.
- “Nhập Excel” chỉ mô phỏng chọn file và kết quả import.
- “Sao chép” tạo khóa học mock mới với mã hậu tố `-COPY`.
- Các action xóa đều có confirm modal.

#### Tiêu chí hoàn thành

- Tất cả tab mở được trực tiếp bằng hash và không tải lại layout chung.
- Modal tạo bài kiểm tra có thể chọn đề/câu hỏi và thêm bản ghi vào tab.
- Bảng và accordion không tràn ngang ở viewport phổ biến.
- Không tạo năm HTML riêng cho năm tab; dùng một trang chi tiết và render theo tab để giảm trùng lặp.

### Giai đoạn 8 — Tích hợp, rà soát và hoàn thiện

#### Kiểm thử chức năng

Thực hiện checklist cho từng module:

- Tìm kiếm có kết quả đúng và empty state đúng.
- Từng select/chip filter hoạt động riêng và kết hợp.
- Reset xóa toàn bộ điều kiện lọc.
- Pagination cập nhật tổng số, nút trước/sau và trạng thái disabled.
- Tab đổi nội dung, active state và URL đúng.
- Modal mở/đóng đúng bằng mọi cách.
- Trường bắt buộc và giới hạn ký tự được validate.
- Thêm/sửa/xóa cập nhật UI ngay trong phiên.
- Action xem chi tiết truyền đúng ID.
- Không có nút action nào không phản hồi.

#### Kiểm thử giao diện

Kiểm tra tối thiểu ở:

- 1920 × 1080, zoom 100%.
- 1366 × 768, zoom 100%.
- Zoom 80%, 125% và 150% trên desktop.
- Vùng mobile/tablet để xác nhận sidebar overlay và card/table không phá layout.

Các điểm phải rà soát:

- Nội dung chiếm hết chiều rộng khả dụng; không còn vùng trắng lớn bên phải.
- Sidebar/topbar không bị thay đổi so với layout hệ thống.
- Dynamic sidebar item căn thẳng hàng với item tĩnh.
- Font, màu, border, shadow, radius và spacing bám sát mockup nhưng vẫn ưu tiên token trong `main.css`.
- Các bảng dài có scroll cục bộ, không tạo horizontal scroll cho toàn trang.
- Modal không vượt viewport và có scroll nội bộ.
- Không có lỗi JavaScript trong console và không có link 404.

#### Kiểm thử hồi quy

- Mở toàn bộ file trong `webapp/html/gv` để xác nhận sidebar mới không làm hỏng trang cũ.
- Kiểm tra role switch sang Học viên, Quản trị và Lãnh đạo vẫn hoạt động.
- Kiểm tra `app.js` không chèn trùng option khi được nạp lại hoặc khi DOM đã có sẵn mục tương ứng.
- Kiểm tra class CSS mới có namespace, không đổi style của trang admin/học viên/lãnh đạo.

## 5. Thứ tự bàn giao đề xuất

Mỗi mốc dưới đây có thể review độc lập:

1. **Mốc A — Nền chung:** sidebar, route và active state.
2. **Mốc B — Module độc lập:** Quản lý giảng viên, Mẫu chứng chỉ.
3. **Mốc C — Luồng form/monitor:** Khảo sát nhu cầu, Giám sát thi và chi tiết giám sát.
4. **Mốc D — Nguồn nội dung:** Chủ đề & chương trình, chi tiết chủ đề, phân nhóm.
5. **Mốc E — Nguồn đánh giá:** Ngân hàng câu hỏi & đề thi, chi tiết/thêm câu hỏi.
6. **Mốc F — Module tổng hợp:** Quản lý khóa học, thêm khóa học và chi tiết nhiều tab.
7. **Mốc G — QA tổng thể:** responsive, zoom, chức năng, link và hồi quy sidebar.

Lý do đặt Quản lý khóa học sau Chủ đề và Ngân hàng đề thi: hai module này cung cấp dữ liệu lựa chọn cho tab “Chủ đề và nội dung” và “Bài kiểm tra”, giúp luồng demo nhất quán thay vì tạo hai bộ mock data không liên quan.

## 6. Danh sách route sau khi hoàn thành

| Route | Vai trò | Sidebar active |
|---|---|---|
| `quan-ly-giang-vien.html` | Danh sách giảng viên | Quản lý giảng viên |
| `quan-ly-chung-chi.html` | Danh sách mẫu chứng chỉ | Quản lý chứng chỉ |
| `khao-sat-nhu-cau.html` | Danh sách khảo sát + modal đăng ký | Khảo sát nhu cầu |
| `giam-sat-thi.html` | Danh sách ca giám sát | Giám sát thi |
| `chi-tiet-giam-sat-thi.html?id=...` | Theo dõi trực tiếp ca thi | Giám sát thi |
| `chu-de-chuong-trinh.html?tab=topics` | Danh sách chủ đề | Chủ đề & chương trình |
| `chu-de-chuong-trinh.html?tab=programs` | Danh sách chương trình | Chủ đề & chương trình |
| `chi-tiet-chu-de.html?id=...` | Chi tiết và nội dung chủ đề | Chủ đề & chương trình |
| `phan-nhom-chu-de.html` | Quản lý phân nhóm | Chủ đề & chương trình |
| `ngan-hang-de-thi.html?tab=questions` | Danh sách câu hỏi | Ngân hàng đề thi |
| `ngan-hang-de-thi.html?tab=exams` | Danh sách đề thi | Ngân hàng đề thi |
| `chi-tiet-cau-hoi.html?id=...` | Chi tiết câu hỏi | Ngân hàng đề thi |
| `them-cau-hoi.html` | Thêm câu hỏi | Ngân hàng đề thi |
| `them-cau-hoi.html?id=...` | Sửa câu hỏi | Ngân hàng đề thi |
| `quan-ly-khoa-hoc.html` | Danh sách khóa học | Quản lý khóa học |
| `them-khoa-hoc.html` | Thêm khóa học | Quản lý khóa học |
| `them-khoa-hoc.html?id=...` | Sửa khóa học | Quản lý khóa học |
| `chi-tiet-khoa-hoc.html?id=...#overview` | Tổng quan khóa học | Quản lý khóa học |
| `chi-tiet-khoa-hoc.html?id=...#content` | Chủ đề và nội dung | Quản lý khóa học |
| `chi-tiet-khoa-hoc.html?id=...#exams` | Bài kiểm tra | Quản lý khóa học |
| `chi-tiet-khoa-hoc.html?id=...#participation` | Điều kiện tham gia | Quản lý khóa học |
| `chi-tiet-khoa-hoc.html?id=...#completion` | Điều kiện hoàn thành | Quản lý khóa học |

## 7. Definition of Done toàn dự án

Một module chỉ được xem là hoàn thành khi đáp ứng đủ:

1. Body bám sát mockup ở viewport desktop chuẩn.
2. Navbar và sidebar chung được giữ nguyên cấu trúc, không copy sang thiết kế mockup.
3. Route và active menu đúng.
4. Filter, search, pagination, tab, modal và action chính hoạt động bằng mock data.
5. Không có nút giả không phản hồi.
6. Có empty state, confirm xóa, validation và toast phù hợp.
7. Không có khoảng trắng bất thường bên phải khi zoom.
8. Không có lỗi console, link hỏng hoặc ký tự tiếng Việt lỗi encoding.
9. CSS/JS riêng không gây regression sang module khác.
10. Code được giữ ở mức demo gọn: không thêm framework, thư viện hoặc abstraction mới nếu `main.css`, DOM API và JavaScript thuần đã đủ dùng.

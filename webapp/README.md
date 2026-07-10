# E-Learning VBS prototype

`index.html` là dashboard mặc định của học viên. Các trang chức năng được đặt trong `html/`; stylesheet dùng chung ở `css/main.css` và logic điều hướng/tương tác dùng chung ở `js/app.js`.

## Cấu trúc

- `index.html` — route dashboard mặc định
- `html/` — một file HTML cho mỗi màn hình nghiệp vụ
- `css/main.css` — toàn bộ CSS dùng chung
- `js/app.js` — điều hướng giữa các trang, menu mobile và các thành phần động
- `tools/split_prototype.py` — script tái tạo cấu trúc trang từ file mockup nguồn

## Cập nhật từ mockup nguồn

Sau khi chỉnh sửa `07_Prototype_Giao_dien_LMS_VBS.html`, chạy:

```powershell
python tools/split_prototype.py
```

Lưu ý: script sẽ tái tạo `index.html`, các file trong `html/` và `css/main.css`. Các thay đổi dùng chung về hành vi nên thực hiện trong `js/app.js`.

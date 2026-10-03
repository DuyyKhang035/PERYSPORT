# PERY SPORT - Website Thương Mại Điện Tử Bán Giày Thể Thao Nam

Hệ thống E-Commerce thương mại điện tử chuyên nghiệp bán giày thể thao nam cho thương hiệu **PERY SPORT**. Xây dựng trên nền tảng Next.js (App Router), JavaScript, Node.js, MongoDB Atlas / Mongoose và Tailwind CSS.

---

## 🌟 Tính Năng Nổi Bật

### 🛒 1. Trang Cửa Hàng (Customer Frontend)
- **Trang Chủ (Homepage)**:
  - Hero Banner slider tự động với tiêu đề, mô tả và nút bấm CTA điều hướng.
  - Section Dòng Giày theo Chức Năng (Chạy bộ, Tập gym, Đi bộ, Bóng rổ, Thời trang).
  - Section **Hot Deals**: Countdown đếm ngược thời gian giảm giá thực tế từ chương trình khuyến mãi đang chạy.
  - Section **Sản Phẩm Bán Chạy**: Tự động sắp xếp theo `soldCount` giảm dần, cập nhật khi có đơn hàng hợp lệ.
  - Thương hiệu đối tác partner showcase.
  - Bài viết mới nhất, Cam kết dịch vụ và Đăng ký nhận tin Newsletter.
- **Trang Danh Sách Sản Phẩm (Catalog)**:
  - Bộ lọc đa chiều: Lọc theo Thương hiệu, Chức năng, Khoảng giá (min-max), Size (39-43), Màu sắc và Tình trạng còn hàng.
  - Sắp xếp linh hoạt: Mới nhất, Bán chạy nhất, Giá tăng dần, Giá giảm dần.
  - Phân trang (Pagination), Tìm kiếm trực tiếp theo từ khóa.
- **Trang Chi Tiết Sản Phẩm (Product Detail)**:
  - Thư viện hình ảnh sắc nét.
  - Chọn Màu sắc & Size (EU). Tự động kiểm tra tồn kho theo từng tổ hợp biến thể (color-size), vô hiệu hóa tổ hợp hết hàng.
  - Chọn số lượng mua (giới hạn tối đa bằng tồn kho thực tế).
  - Nút **Thêm Vào Giỏ** và **Mua Ngay Thanh Toán**.
  - Hiển thị danh sách sản phẩm cùng thương hiệu/danh mục liên quan.
- **Giỏ Hàng & Thanh Toán (Cart & Checkout)**:
  - CartDrawer slide-over góc phải màn hình, tính toán tổng tiền và tiến trình Miễn Phí Giao Hàng.
  - Kiểm tra & xác thực lại giá bán, tồn kho và khuyến mãi ở phía Server (`/api/checkout/validate`) để ngăn chặn can thiệp giá từ Client.
  - Đặt hàng COD hoặc Chuyển khoản QR code.
  - Khởi tạo mã đơn hàng chuẩn format `PS-YYYYMMDD-XXXX`.
  - Giảm tồn kho nguyên tử (`$inc: { stock: -qty }`) và tăng `soldCount`.
- **Trang Xác Nhận Đơn Hàng & Tra Cứu (Order Success & Lookup)**:
  - Trang xác nhận đơn hàng thành công kèm chi tiết sản phẩm snapshot.
  - Trang tra cứu đơn hàng công khai theo **Mã Đơn Hàng** + **Số điện thoại / Email xác minh**.
- **Bài Viết & Blog**:
  - Danh sách bài viết tin tức, bí quyết chọn giày.
  - Chi tiết bài viết chuẩn SEO metadata và bài viết liên quan.

---

### 🛡️ 2. Hệ Thống Quản Trị (Admin Dashboard)
- **Đường dẫn**: `/admin/login` và `/admin`
- **Xác thực Admin**: Đăng nhập bằng Session & HTTP-only cookies. Mật khẩu được hash bảo mật bằng `bcrypt`.
- **Tài khoản phát triển mặc định**:
  - **Tên đăng nhập**: `admin`
  - **Mật khẩu**: `123`
- **Bảng Điều Khiển (Dashboard Stats)**:
  - Thống kê tổng số sản phẩm, thương hiệu, đơn hàng, tổng doanh thu thực tế.
  - Cảnh báo sản phẩm sắp hết hàng (tồn kho <= 10).
  - Bảng đơn hàng mới cập nhật theo thời gian thực.
- **CRUD Quản Lý**:
  - **Quản lý Thương hiệu**: Tên, Slug, Logo, Mô tả, Status, Hiện trang chủ, Thứ tự.
  - **Quản lý Danh mục/Chức năng**: Tên, Slug, Mô tả, Ảnh, Status, Thứ tự.
  - **Quản lý Sản phẩm**: Tên, Slug, Thương hiệu, Danh mục, Giá gốc, Giá bán, Mô tả, Thư viện ảnh, Bộ khởi tạo biến thể Màu-Size, SKU, Tồn kho, `soldCount`, SEO fields.
  - **Quản lý Khuyến mãi**: Giảm %, Giảm cố định, Thời gian bắt đầu/kết thúc, Trạng thái.
  - **Quản lý Hero Banner**: Ảnh Desktop/Mobile, Tiêu đề, Mô tả, CTA text & link, Thứ tự.
  - **Quản lý Bài viết**: Tiêu đề, Slug, Ảnh đại diện, Nội dung, Tóm tắt, Trạng thái Nháp/Đã xuất bản.
  - **Quản lý Đơn hàng**: Danh sách đơn, Lọc theo trạng thái, Xem chi tiết snapshot. Cập nhật trạng thái (`pending` -> `confirmed` -> `shipping` -> `completed` hoặc `cancelled`). Khi chuyển sang `cancelled`, hệ thống tự động hoàn trả tồn kho và giảm `soldCount` an toàn.
  - **Cấu hình & Mật khẩu Admin**: Đổi mật khẩu mã hóa bcrypt.

---

## 🛠️ Cấu Trúc Dự Án

```
perysport-main/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── (store)/                 # Frontend Khách hàng
│   │   │   ├── products/            # Danh sách & Chi tiết sản phẩm
│   │   │   ├── cart/                # Trang Giỏ hàng
│   │   │   ├── checkout/            # Trang Thanh toán
│   │   │   ├── order-success/       # Trang Xác nhận đơn hàng
│   │   │   ├── lookup/              # Trang Tra cứu đơn hàng
│   │   │   ├── brands/              # Trang Thương hiệu
│   │   │   ├── blogs/               # Trang Bài viết & Chi tiết
│   │   │   └── contact/             # Trang Liên hệ
│   │   │   ├── admin/                   # Hệ thống Quản trị
│   │   │   ├── login/               # Đăng nhập Admin
│   │   │   └── (dashboard)/         # Quản lý Stats, CRUD Sản phẩm, Thương hiệu, v.v.
│   │   ├── components/              # Store & Admin Components
│   │   └── lib/                     # Cart Context, UI utilities, backend API client
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/app/api/                 # REST API Route Handlers
│   ├── src/lib/                     # MongoDB, Models, Auth JWT
│   ├── scripts/seed.js              # Seed dữ liệu mẫu
│   └── package.json
└── .env.example
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu Cầu Tiền Đề
- Node.js version 18 trở lên.
- MongoDB Atlas (Connection String) hoặc local MongoDB.

### 2. Thiết Lập Biến Môi Trường
Tạo file `.env.local` từ `.env.example`:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/pery_sport
SESSION_SECRET=pery_sport_super_secret_session_jwt_key_2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Cài Đặt Package Dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. Seed Dữ Liệu Mẫu (Khởi Tạo Admin & Dữ Liệu Demo)
Chạy lệnh seed để khởi tạo tài khoản `admin / 123`, 5 Thương hiệu, 5 Danh mục, 20+ Sản phẩm nhiều màu-size, 3 Banner và 5 Bài viết demo:
```bash
cd backend
npm run seed
```

### 5. Khởi Chạy Server Development
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```
Truy cập giao diện cửa hàng tại: `http://localhost:3000` (frontend). API chạy tại `http://localhost:4000` (backend).  
Truy cập trang đăng nhập Admin tại: `http://localhost:3000/admin/login`

### 6. Biên Dịch Build Production
```bash
cd backend && npm run build && npm run start
cd ../frontend && npm run build && npm run start
```

---

## 🧪 Kết Quả Kiểm Thử (Test Results)

- **Đăng nhập & Bảo mật**: Đã kiểm thử xác thực cookie HTTP-only, bảo vệ API route admin, chặn truy cập khi chưa đăng nhập.
- **Biến thể Sản phẩm**: Đã kiểm thử tạo sản phẩm có nhiều màu sắc và size khác nhau, mã SKU riêng biệt và đồng bộ giá/tồn kho.
- **Xác thực Đơn hàng & Tồn kho**: Đã kiểm thử quy trình mua hàng, re-validate giá phía server, trừ tồn kho nguyên tử (`$inc`), tăng `soldCount`, và hoàn tồn kho khi hủy đơn thành công.
- **Hot Deals & Promotions**: Đã kiểm thử tính chính xác của khoảng thời gian hiệu lực và bộ đếm ngược countdown.
- **Build Production**: Chạy lệnh `npm run build` thành công 100% không phát sinh lỗi.

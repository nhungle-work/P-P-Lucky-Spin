# 🎡 P&P Lucky Spin - Vietnam Labour Forum 2026

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 💡 Bài toán & Giải pháp

Tại sự kiện **Vietnam Labour Forum 2026 (VLF 2026)**, gian hàng (booth) của công ty luật Phuoc & Partners cần một giải pháp để thu hút khách tham quan và thu thập thông tin khách hàng tiềm năng (leads) một cách chuyên nghiệp. Việc dùng giấy tờ điền tay thủ công vừa tốn thời gian, vừa khó quản lý dữ liệu và trải nghiệm không tốt.

**P&P Lucky Spin** ra đời như một giải pháp số hóa toàn diện:
- **Khách tham dự:** Chỉ cần quét mã QR bằng điện thoại, điền thông tin nhanh gọn, tham gia vòng quay may mắn với hiệu ứng bắt mắt để nhận quà.
- **Ban tổ chức:** Dữ liệu khách hàng được ghi nhận hoàn toàn tự động, real-time, chặn trùng lặp số điện thoại (1 người chỉ quay 1 lần) và tự động quản lý kho quà tặng.
- **Tối ưu chi phí cho Doanh nghiệp:** App được phát triển bằng kỹ thuật Vibe Coding – phù hợp với người làm Marketing (non-tech background), không cần tăng số lượng người vận hành booth cho việc thu thập dữ liệu khách hàng.

## 🎥 Video Demo
> **Lưu ý dành cho nhà tuyển dụng:** Vì lý do bảo mật dữ liệu khách hàng sau sự kiện, ứng dụng hiện không còn chạy live. Vui lòng xem video demo quá trình hoạt động của app dưới đây:

![Demo PP Lucky Spin](Demo%20PP%20Lucky%20Spin.png)

[▶️ Xem Video Demo đầy đủ tại đây](Video%20Demo%20PP%20Lucky%20Spin.mp4)

## ✨ Các tính năng chính (Key Features)
- **📱 Mobile-First UI/UX:** Thiết kế tối ưu 100% cho màn hình điện thoại.
- **🛡️ Real-time Validation & Anti-Spam:** Validate form nhập liệu ngay lập tức, kiểm tra số điện thoại để đảm bảo mỗi người chỉ được tham gia 1 lần duy nhất.
- **🎡 Interactive Animation:** Hiệu ứng vòng quay may mắn (Lucky Spin) mượt mà.
- **🤖 AI Integration:** Tích hợp Google Gemini API để hỗ trợ xử lý logic nội dung (nếu có).

## 🧠 System Architecture & Design Decision
Một trong những thách thức của ứng dụng phục vụ sự kiện (Event App) là giúp đội ngũ vận hành theo dõi dữ liệu thực tế mà không cần kiến thức kỹ thuật. Do đó, hệ thống được thiết kế tách biệt:
- **Core Backend (Supabase):** Xử lý lưu lượng truy cập, validate dữ liệu, chống spam và quản lý logic vòng quay với tốc độ cao.
- **Operations Dashboard (Google Sheets):** Dữ liệu lead được đồng bộ song song. Đội ngũ vận hành tại gian hàng có thể xem trực tiếp danh sách người trúng giải, tồn kho quà tặng theo thời gian thực trên giao diện Excel/Sheets quen thuộc mà không cần cấp quyền truy cập vào database chính (No-code Admin Panel).

## ⚙️ Hướng dẫn chạy Local (Dành cho Technical Review)

Nếu bạn muốn chạy thử source code của dự án trên máy cá nhân, vui lòng làm theo các bước sau:

**1. Clone repository**
```bash
git clone https://github.com/nhungle-work/P-P-Lucky-Spin.git
cd P-P-Lucky-Spin
```

**2. Cài đặt Dependencies**
```bash
npm install
```

**3. Cấu hình biến môi trường (.env)**
Tạo file `.env.local` ở thư mục gốc (root). Bạn bắt buộc phải cung cấp API Key của Google Gemini và Supabase:
```bash
# Copy file mẫu
cp .env.example .env.local

# Mở file .env.local và điền key của bạn:
GEMINI_API_KEY=your_gemini_api_key_here
```

**4. Khởi chạy ứng dụng**
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

---
*Lưu ý nội bộ: Bản phác thảo ban đầu của dự án này được hỗ trợ tạo bởi [Google AI Studio](https://ai.studio/apps/449b4507-ecf8-4602-be5e-10a38526974a).*

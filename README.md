# Quản Lý Đặt Vé Chuyến Bay

## ProjectProposal

### Giới Thiệu
Hệ thống đặt vé chuyến bay được thiết kế để tối ưu hóa quy trình đặt vé cho hãng hàng không và khách hàng. 
Dự án nhằm cải thiện trải nghiệm người dùng, tự động hóa quy trình nghiệp vụ và quản lý vé máy bay một cách hiệu quả.

### Đặt Vấn Đề
Hiện nay, việc đặt vé chuyến bay truyền thống còn gặp nhiều hạn chế như:
- Khách hàng phải đến trực tiếp phòng vé để đặt vé.
- Khó khăn trong việc theo dõi và thay đổi thông tin đặt vé.
- Quản lý vé thủ công gây mất thời gian và dễ xảy ra sai sót.
- Thiếu tính năng theo dõi trạng thái chuyến bay theo thời gian thực.

### Mục Tiêu
- Phát triển hệ thống đặt vé máy bay trên nền tảng web.
- Cung cấp giao diện thân thiện cho người dùng tìm kiếm và đặt vé.
- Tự động hóa quy trình quản lý vé.
- Theo dõi tình trạng chuyến bay theo thời gian thực.
- Đảm bảo giao dịch thanh toán an toàn.

### Phạm Vi Dự Án
#### Phạm Vi Chức Năng
- Đăng ký & Đăng nhập người dùng.
- Tìm kiếm và lọc chuyến bay.
- Lựa chọn ghế ngồi.
- Đặt vé & Thanh toán trực tuyến.
- Theo dõi trạng thái chuyến bay.
- Bảng điều khiển dành cho quản trị viên.

#### Phạm Vi Kỹ Thuật
- **Giao diện người dùng:** HTML, CSS, JavaScript (React.js).
- **Backend:** PHP với MySQL (tích hợp qua XAMPP).
- **Tích hợp API:** Cổng thanh toán, API theo dõi chuyến bay.
- **Triển khai:** GitHub với CI/CD.

### Phương Pháp Thực Hiện
1. **Thu thập yêu cầu:** Khảo sát nhu cầu người dùng, nghiên cứu quy trình đặt vé hiện tại.
2. **Phân tích hệ thống:** Xây dựng sơ đồ quy trình nghiệp vụ (BPMN) và mô hình dữ liệu.
3. **Thiết kế giao diện:** Xây dựng wireframe và prototype.
4. **Phát triển hệ thống:** Lập trình backend, frontend và tích hợp API.
5. **Kiểm thử:** Thực hiện kiểm thử đơn vị, kiểm thử hệ thống và kiểm thử người dùng.
6. **Triển khai:** Đưa hệ thống vào hoạt động thử nghiệm và đánh giá.

### Dữ Liệu
- **Dữ liệu chuyến bay:** Danh sách chuyến bay, sân bay, lịch trình.
- **Dữ liệu người dùng:** Tài khoản, thông tin đặt vé.
- **Dữ liệu giao dịch:** Lịch sử đặt vé, thanh toán.

### Công Nghệ Dự Kiến
| Thành phần   | Công nghệ |
|-------------|-----------|
| **Backend** | Node.js, Express.js, MySQL |
| **Frontend**  | React.js, HTML, CSS, JavaScript |
| **API**      | RESTful API, Express.js |
| **Triển khai** | GitHub |

### Phương Pháp Phát Triển
- **Mô hình phát triển:** Agile Scrum với các sprint 2 tuần.
- **Quản lý mã nguồn:** GitHub với nhánh riêng cho từng tính năng.
- **Quản lý tiến độ:** Dùng Trello hoặc Jira để theo dõi nhiệm vụ.

### Kết Quả Mong Đợi
- Hệ thống đặt vé máy bay trực tuyến hoạt động ổn định.
- Giao diện thân thiện giúp người dùng dễ dàng đặt vé.
- Tích hợp thanh toán trực tuyến an toàn và nhanh chóng.
- Cải thiện quản lý chuyến bay cho hãng hàng không.

### Kế Hoạch Thực Hiện
| Giai đoạn   | Công việc                     | Thời gian |
|------------|------------------------------|-----------|
| **Giai đoạn 1** | Khảo sát & phân tích yêu cầu | 2 tuần |
| **Giai đoạn 2** | Thiết kế hệ thống          | 3 tuần |
| **Giai đoạn 3** | Phát triển Backend & API   | 4 tuần |
| **Giai đoạn 4** | Phát triển Frontend        | 4 tuần |
| **Giai đoạn 5** | Kiểm thử & Triển khai      | 3 tuần |

### Nguồn Lực & Ngân Sách
- **Nhân lực:** 3 thành viên (1 lập trình backend, 1 lập trình frontend, 1 kiểm thử & triển khai).
- **Chi phí dự kiến:**
  - **Máy chủ & Domain:** Khoảng 50-100$ (có thể sử dụng hosting miễn phí như GitHub Pages hoặc Firebase để tiết kiệm chi phí).
  - **Công cụ phát triển:** Miễn phí (GitHub, XAMPP, VS Code, Figma cho thiết kế UI/UX).
  - **API & Thanh toán:** Sử dụng các dịch vụ miễn phí hoặc bản thử nghiệm trước khi tích hợp bản trả phí.

### Kết Luận
Hệ thống đặt vé chuyến bay là một giải pháp cần thiết để hiện đại hóa quy trình đặt vé, mang lại trải nghiệm tốt hơn cho khách hàng và giúp hãng hàng không quản lý chuyến bay hiệu quả. Với công nghệ hiện đại, phương pháp phát triển linh hoạt, dự án này hứa hẹn mang lại nhiều giá trị thực tiễn và tối ưu hóa hoạt động đặt vé.

# Quản Lý Đặt Vé Chuyến Bay - Kế Hoạch Dự Án

## ProjectPlan

### 1. Giới Thiệu
Dự án "Hệ thống đặt vé chuyến bay" nhằm tối ưu hóa quy trình đặt vé, giúp người dùng dễ dàng tìm kiếm, đặt chỗ và thanh toán vé máy bay trực tuyến. Hệ thống cung cấp các chức năng quan trọng như đặt vé, theo dõi trạng thái chuyến bay và quản lý thông tin khách hàng.

### 2. Phân Công Nhiệm Vụ
| Thành viên | Vai trò | Nhiệm vụ |
|------------|---------|----------|
| **La Hiểu Phong** | Leader | Quản lý dự án, theo dõi tiến độ, điều phối công việc và đảm bảo chất lượng sản phẩm. |
| **Nguyễn Long Vũ** | Lập trình Backend | Phát triển hệ thống server, thiết kế và quản lý cơ sở dữ liệu, xây dựng API, đảm bảo bảo mật và hiệu suất hệ thống. |
| **Nguyễn Công Huy** | Lập trình Frontend & Kiểm thử | Thiết kế giao diện người dùng, kết nối API, đảm bảo trải nghiệm mượt mà và thực hiện kiểm thử hệ thống. |

### 3. Kế Hoạch Làm Việc
#### Giai đoạn 1: Phân Tích Yêu Cầu & Khảo Sát (1 tuần)
- Tìm hiểu yêu cầu của hệ thống đặt vé.
- Khảo sát các hệ thống hiện có để đưa ra giải pháp phù hợp.
- Xác định phạm vi và tính năng chính.
- Phân công nhiệm vụ.

#### Giai đoạn 2: Thiết Kế Giao Diện & Cơ Sở Dữ Liệu (2 tuần)
- Xây dựng UI/UX Wireframe bằng Figma.
- Thiết kế kiến trúc hệ thống và cơ sở dữ liệu.
- Định nghĩa API và luồng dữ liệu.

#### Giai đoạn 3: Xây Dựng Backend (2 tuần)
- Phát triển API chính: đăng ký, đăng nhập, đặt vé, quản lý vé, tra cứu chuyến bay, thanh toán.
- Thiết lập cơ sở dữ liệu và xử lý truy vấn.
- Kiểm thử API bằng Postman.

#### Giai đoạn 4: Xây Dựng Frontend & Kết Nối API (2 tuần)
- Phát triển giao diện theo thiết kế ban đầu.
- Kết nối frontend với API.
- Xây dựng các chức năng tương tác.

#### Giai đoạn 5: Kiểm Thử & Sửa Lỗi (1 tuần)
- Kiểm thử đơn vị (unit test), kiểm thử tích hợp (integration test).
- Mô phỏng tình huống sử dụng thực tế.
- Fix lỗi và tối ưu hệ thống.

#### Giai đoạn 6: Hoàn Thiện Tài Liệu & Báo Cáo (1 tuần)
- Viết tài liệu hướng dẫn sử dụng.
- Báo cáo tiến độ và kết quả.
- Chuẩn bị trình bày dự án.

### 4. Cập Nhật & Đánh Giá
- Nhóm họp hàng tuần để kiểm tra tiến độ và cập nhật tình hình thực hiện.
- Leader tổng hợp báo cáo tiến độ, xử lý khó khăn phát sinh và điều chỉnh kế hoạch nếu cần.
- Thành viên có thể đề xuất ý tưởng cải tiến để tối ưu hóa hệ thống.

### 5. Công Cụ Hỗ Trợ
| Mục đích | Công cụ |
|-----------|---------|
| **Quản lý mã nguồn** | GitHub (repository riêng cho backend, frontend, tài liệu) |
| **Quản lý công việc** | Trello, Notion |
| **Lập trình Backend** | PHP, MySQL, XAMPP |
| **Lập trình Frontend** | React.js hoặc Vue.js |
| **Thiết kế giao diện** | Figma |
| **Kiểm thử API** | Postman |
| **Triển khai** | GitHub Pages, XAMPP (Local Server) |

### 6. Kết Luận
Bản kế hoạch này cung cấp hướng dẫn ban đầu cho quá trình thực hiện dự án. Trong quá trình triển khai, kế hoạch có thể thay đổi để phù hợp với thực tế và khắc phục các vấn đề phát sinh. Nhóm sẽ liên tục đánh giá, cập nhật và điều chỉnh để đảm bảo dự án hoàn thành thành công.

---
#### Nhóm thực hiện
- **La Hiểu Phong** (3121411162)
- **Nguyễn Long Vũ** (3121411228)
- **Nguyễn Công Huy** (3121411084)

#### Giảng viên hướng dẫn
- **Đỗ Như Tài**

#### Ngày thực hiện: 05/03/2025

---
© 2025 Trường Đại học Sài Gòn - Khoa Công Nghệ Thông Tin

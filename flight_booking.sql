-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th5 20, 2025 lúc 08:29 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `flight_booking`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `aircraft_types`
--

CREATE TABLE `aircraft_types` (
  `id` int(11) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `aircraft_types`
--

INSERT INTO `aircraft_types` (`id`, `type_name`, `description`) VALUES
(1, '320', 'Airbus A320 – Dòng máy bay thân hẹp, tầm bay trung bình, tiết kiệm nhiên liệu.'),
(2, '320B', 'Airbus A320B – Phiên bản cải tiến của A320 với hiệu suất nhiên liệu tốt hơn.'),
(3, '321', 'Airbus A321 – Dòng máy bay thân hẹp, tầm bay trung bình, sức chứa hành khách lớn hơn A320.'),
(4, '330', 'Airbus A330 – Máy bay thân rộng, tầm bay xa, phục vụ các chuyến bay quốc tế.'),
(5, '350', 'Airbus A350 – Máy bay thân rộng, tầm bay rất xa, được trang bị công nghệ tiên tiến.'),
(6, '359', 'Airbus A350-900 – Phiên bản cải tiến của A350, với khoang hành khách rộng hơn.'),
(7, '787', 'Boeing 787 – Máy bay thân rộng, tiết kiệm nhiên liệu, tầm bay xa, phục vụ các chuyến bay xuyên lục địa.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `airlines`
--

CREATE TABLE `airlines` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `airlines`
--

INSERT INTO `airlines` (`id`, `name`, `logo`) VALUES
(1, 'VietJet', 'vietjet.jpg'),
(2, 'Bamboo', 'bamboo.jpg'),
(3, 'VNA', NULL),
(4, 'Pacific Airlines', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `airports`
--

CREATE TABLE `airports` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `airports`
--

INSERT INTO `airports` (`id`, `name`, `code`) VALUES
(1, 'Hà Nội', 'HAN'),
(2, 'Hồ Chí Minh', 'SGN'),
(3, 'Đà Nẵng', 'DAD'),
(4, 'Nha Trang', 'CXR'),
(5, 'Phú Quốc', 'PQC');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baggage`
--

CREATE TABLE `baggage` (
  `id` int(11) NOT NULL,
  `weight` varchar(10) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `baggage`
--

INSERT INTO `baggage` (`id`, `weight`, `price`) VALUES
(1, '0', 0.00),
(2, '20', 216000.00),
(3, '30', 324000.00),
(4, '40', 432000.00),
(5, '50', 543000.00),
(6, '60', 647000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flight_result_id` int(11) NOT NULL,
  `passenger_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `card_payment`
--

CREATE TABLE `card_payment` (
  `id` int(11) NOT NULL,
  `cardholder_name` varchar(255) DEFAULT NULL,
  `last_four_digits` char(4) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `card_token` varchar(255) DEFAULT NULL,
  `cvv` char(3) DEFAULT NULL,
  `payment_method_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `card_payment`
--

INSERT INTO `card_payment` (`id`, `cardholder_name`, `last_four_digits`, `expiration_date`, `card_token`, `cvv`, `payment_method_code`) VALUES
(5, 'La Hiểu Phong', '123', '2023-12-31', '123', '123', 'card');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `contact_info`
--

INSERT INTO `contact_info` (`id`, `name`, `phone`, `email`, `address`) VALUES
(51, 'La Hiểu Phong', '0326526898', 'hieuphong144@gmail.com', '430/28/5 TA28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flight_prices`
--

CREATE TABLE `flight_prices` (
  `id` int(11) NOT NULL,
  `flight_number_id` varchar(50) DEFAULT NULL,
  `price_adult` decimal(10,2) NOT NULL,
  `price_child` decimal(10,2) NOT NULL,
  `price_infant` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flight_prices`
--

INSERT INTO `flight_prices` (`id`, `flight_number_id`, `price_adult`, `price_child`, `price_infant`, `tax`) VALUES
(1, 'VJ160', 1290000.00, 990000.00, 500000.00, 0.10),
(2, 'QH202', 1390000.00, 1040000.00, 600000.00, 0.15),
(3, 'QH201', 1490000.00, 1090000.00, 700000.00, 0.15),
(4, 'VJ161', 1590000.00, 1190000.00, 800000.00, 0.20);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flight_results`
--

CREATE TABLE `flight_results` (
  `id` int(11) NOT NULL,
  `airline_id` int(11) NOT NULL,
  `flight_number` varchar(50) NOT NULL,
  `aircraft_type_id` int(11) NOT NULL,
  `flight_times_id` int(11) NOT NULL,
  `departure_airport_id` int(11) NOT NULL,
  `arrival_airport_id` int(11) NOT NULL,
  `seat_type_id` int(11) NOT NULL,
  `ticket_conditions_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flight_results`
--

INSERT INTO `flight_results` (`id`, `airline_id`, `flight_number`, `aircraft_type_id`, `flight_times_id`, `departure_airport_id`, `arrival_airport_id`, `seat_type_id`, `ticket_conditions_id`) VALUES
(1, 1, 'VJ160', 1, 1, 1, 2, 3, 1),
(2, 2, 'QH202', 1, 2, 1, 4, 1, 1),
(3, 2, 'QH201', 1, 3, 1, 2, 4, 1),
(4, 1, 'VJ161', 1, 2, 2, 1, 4, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flight_times`
--

CREATE TABLE `flight_times` (
  `id` int(11) NOT NULL,
  `flight_number_id` varchar(20) DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `arrival_time` time DEFAULT NULL,
  `duration` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flight_times`
--

INSERT INTO `flight_times` (`id`, `flight_number_id`, `departure_time`, `arrival_time`, `duration`) VALUES
(1, 'VJ160', '20:45:00', '22:50:00', '02:05:00'),
(2, 'QH202', '05:10:00', '07:20:00', '02:10:00'),
(3, 'QH201', '21:50:00', '23:55:00', '02:05:00'),
(4, 'VJ161', '23:45:00', '01:50:00', '02:05:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `type` enum('food','drink') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `meals`
--

INSERT INTO `meals` (`id`, `name`, `price`, `type`) VALUES
(1, 'Không chọn', 0.00, 'food'),
(2, 'Không chọn', 0.00, 'drink'),
(3, 'Cơm gà', 98000.00, 'food'),
(4, 'Combo Mì Ý', 106000.00, 'food'),
(5, 'Trà sữa', 46000.00, 'drink'),
(6, 'Nước suối', 20000.00, 'drink');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `passengers`
--

CREATE TABLE `passengers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `dob` date NOT NULL,
  `id_number` varchar(20) NOT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `departure_baggage_id` int(11) DEFAULT NULL,
  `return_baggage_id` int(11) DEFAULT NULL,
  `departure_food_meal_id` int(11) DEFAULT NULL,
  `departure_drink_meal_id` int(11) DEFAULT NULL,
  `return_food_meal_id` int(11) DEFAULT NULL,
  `return_drink_meal_id` int(11) DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `contact_info_id` int(11) DEFAULT NULL,
  `payment_method_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `passengers`
--

INSERT INTO `passengers` (`id`, `first_name`, `last_name`, `gender`, `dob`, `id_number`, `flight_id`, `departure_baggage_id`, `return_baggage_id`, `departure_food_meal_id`, `departure_drink_meal_id`, `return_food_meal_id`, `return_drink_meal_id`, `voucher_id`, `contact_info_id`, `payment_method_id`) VALUES
(93, 'LA', 'Hiểu Phong', 'Male', '2003-11-21', '123', 3, 2, 2, 3, 5, 3, 5, 4, 51, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_method`
--

CREATE TABLE `payment_method` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_method`
--

INSERT INTO `payment_method` (`id`, `code`, `name`, `description`, `icon_url`, `is_active`) VALUES
(1, 'momo', 'Ví Momo', 'Thanh toán qua ví điện tử Momo', 'momo.png', 1),
(2, 'qr', 'QR Banking', 'Chuyển khoản qua mã QR ngân hàng', 'qr-code.png', 1),
(3, 'card', 'Thẻ tín dụng/ghi nợ', 'Thanh toán bằng thẻ quốc tế', 'master-card.png', 1),
(4, 'pay_later', 'Thanh toán sau', 'Giữ mã đặt chỗ và thanh toán sau', 'return.png', 1),
(5, 'postpaid', 'Bay trước, trả sau', 'Thanh toán trả sau qua đối tác', 'vnpay.png', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `postpaid_application`
--

CREATE TABLE `postpaid_application` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `national_id` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `monthly_income` decimal(15,2) DEFAULT NULL,
  `postpaid_partner_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `postpaid_application`
--

INSERT INTO `postpaid_application` (`id`, `full_name`, `national_id`, `email`, `phone`, `address`, `occupation`, `monthly_income`, `postpaid_partner_id`, `status`) VALUES
(4, 'La Hiểu Phong', '123', 'hieuphong144@gmail.com', '0326526898', '430/28/5 TA28', 'Công Nhân', 10000000.00, 1, 'rejected');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `postpaid_partner`
--

CREATE TABLE `postpaid_partner` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `payment_method_code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `postpaid_partner`
--

INSERT INTO `postpaid_partner` (`id`, `name`, `description`, `logo_url`, `payment_method_code`, `is_active`) VALUES
(1, 'Fundiin', 'Trả sau 30 ngày hoặc chia 3 kỳ 0% lãi', 'fundiin.png', 'postpaid', 1),
(2, 'Kredivo', 'Trả sau 30 ngày hoặc góp 3/6/12 tháng', 'kredivo.png', 'postpaid', 1),
(3, 'HomePayLater (TPBank)', 'Liên kết thẻ tín dụng, xét duyệt trả sau', 'homepaylater.png', 'postpaid', 1),
(4, 'MoMo – PayLater', 'Thanh toán trả sau nội bộ', 'momo-paylater.png', 'postpaid', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seat_types`
--

CREATE TABLE `seat_types` (
  `id` int(11) NOT NULL,
  `remaining_seats` varchar(50) NOT NULL,
  `additional_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seat_types`
--

INSERT INTO `seat_types` (`id`, `remaining_seats`, `additional_price`) VALUES
(1, 'Phổ thông', 1315000.00),
(2, 'Phổ thông cao cấp', 4000000.00),
(3, 'Thương gia', 2500000.00),
(4, 'Hạng nhất', 10000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ticket_conditions`
--

CREATE TABLE `ticket_conditions` (
  `id` int(11) NOT NULL,
  `baggage_carry_on` decimal(10,0) DEFAULT NULL,
  `baggage_checked` varchar(255) DEFAULT NULL,
  `name_change` varchar(255) DEFAULT NULL,
  `flight_change` decimal(10,2) DEFAULT NULL,
  `upgrade` decimal(10,2) DEFAULT NULL,
  `refund` decimal(10,2) DEFAULT NULL,
  `no_show` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ticket_conditions`
--

INSERT INTO `ticket_conditions` (`id`, `baggage_carry_on`, `baggage_checked`, `name_change`, `flight_change`, `upgrade`, `refund`, `no_show`, `note`) VALUES
(1, 7, 'Thu phí', 'Không áp dụng', 378000.00, 378000.00, 378000.00, 'Không hoàn lại', 'Tất cả các thay đổi phải được thực hiện và hoàn tất tối thiểu 4 giờ trước giờ khởi hành đã đặt! Một số loại phí có thể thay đổi theo quy định hãng mà chưa kịp cập nhật trên hệ thống.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', '123', 'admin', 1, '2025-05-17 17:35:52', '2025-05-17 17:53:07'),
(2, 'lahieuphong', 'hieuphong144@gmail.com', '123', 'admin', 1, '2025-05-17 17:47:53', '2025-05-18 09:23:15'),
(8, 'test', 'test@gmail.com', '123', 'user', 1, '2025-05-18 19:55:54', '2025-05-18 19:55:54'),
(9, 'test2', 'test2@gmail.com', '123', 'user', 1, '2025-05-18 20:18:51', '2025-05-18 20:18:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount`, `is_active`) VALUES
(1, 'Không chọn', 0.00, 1),
(2, 'GIAM10', 10.00, 1),
(3, 'GIAM20', 20.00, 1),
(4, 'GIAM50', 50.00, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `aircraft_types`
--
ALTER TABLE `aircraft_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type_name` (`type_name`);

--
-- Chỉ mục cho bảng `airlines`
--
ALTER TABLE `airlines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name` (`name`);

--
-- Chỉ mục cho bảng `airports`
--
ALTER TABLE `airports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_code` (`code`),
  ADD UNIQUE KEY `unique_name` (`name`);

--
-- Chỉ mục cho bảng `baggage`
--
ALTER TABLE `baggage`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `flight_result_id` (`flight_result_id`),
  ADD KEY `passenger_id` (`passenger_id`);

--
-- Chỉ mục cho bảng `card_payment`
--
ALTER TABLE `card_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_method_code` (`payment_method_code`);

--
-- Chỉ mục cho bảng `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `flight_prices`
--
ALTER TABLE `flight_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_flight_results` (`flight_number_id`),
  ADD KEY `fk_price_adult` (`price_adult`);

--
-- Chỉ mục cho bảng `flight_results`
--
ALTER TABLE `flight_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_flight_number` (`flight_number`),
  ADD KEY `fk_seat_type_id` (`seat_type_id`),
  ADD KEY `fk_airline_id` (`airline_id`),
  ADD KEY `fk_departure_airport_id` (`departure_airport_id`),
  ADD KEY `fk_arrival_airport_id` (`arrival_airport_id`),
  ADD KEY `fk_ticket_conditions_id` (`ticket_conditions_id`),
  ADD KEY `fk_flight_times_id` (`flight_times_id`),
  ADD KEY `fk_aircraft_type_id` (`aircraft_type_id`);

--
-- Chỉ mục cho bảng `flight_times`
--
ALTER TABLE `flight_times`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flight_number` (`flight_number_id`);

--
-- Chỉ mục cho bảng `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_flight_id` (`flight_id`),
  ADD KEY `fk_depature_baggage_id` (`departure_baggage_id`),
  ADD KEY `fk_return_baggage_id` (`return_baggage_id`),
  ADD KEY `fk_return_drink_meal_id` (`return_drink_meal_id`),
  ADD KEY `fk_return_food_meal_id` (`return_food_meal_id`),
  ADD KEY `fk_voucher_id` (`voucher_id`),
  ADD KEY `fk_departure_drink_meal_id` (`departure_drink_meal_id`),
  ADD KEY `fk_departure_food_meal_id` (`departure_food_meal_id`),
  ADD KEY `fk_contact_info_id` (`contact_info_id`),
  ADD KEY `fk_payment_method_id` (`payment_method_id`);

--
-- Chỉ mục cho bảng `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `postpaid_application`
--
ALTER TABLE `postpaid_application`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_postpaid_partner_id` (`postpaid_partner_id`);

--
-- Chỉ mục cho bảng `postpaid_partner`
--
ALTER TABLE `postpaid_partner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_method_code-fk` (`payment_method_code`);

--
-- Chỉ mục cho bảng `seat_types`
--
ALTER TABLE `seat_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_remaining_seats` (`remaining_seats`),
  ADD UNIQUE KEY `unique_additional_price` (`additional_price`);

--
-- Chỉ mục cho bảng `ticket_conditions`
--
ALTER TABLE `ticket_conditions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `aircraft_types`
--
ALTER TABLE `aircraft_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `airlines`
--
ALTER TABLE `airlines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `airports`
--
ALTER TABLE `airports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `baggage`
--
ALTER TABLE `baggage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `card_payment`
--
ALTER TABLE `card_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT cho bảng `flight_prices`
--
ALTER TABLE `flight_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `flight_results`
--
ALTER TABLE `flight_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `flight_times`
--
ALTER TABLE `flight_times`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `passengers`
--
ALTER TABLE `passengers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT cho bảng `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `postpaid_application`
--
ALTER TABLE `postpaid_application`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `postpaid_partner`
--
ALTER TABLE `postpaid_partner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `seat_types`
--
ALTER TABLE `seat_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `ticket_conditions`
--
ALTER TABLE `ticket_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`flight_result_id`) REFERENCES `flight_results` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`id`);

--
-- Các ràng buộc cho bảng `card_payment`
--
ALTER TABLE `card_payment`
  ADD CONSTRAINT `fk_payment_method_code` FOREIGN KEY (`payment_method_code`) REFERENCES `payment_method` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `flight_prices`
--
ALTER TABLE `flight_prices`
  ADD CONSTRAINT `fk_flight_results` FOREIGN KEY (`flight_number_id`) REFERENCES `flight_results` (`flight_number`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `flight_results`
--
ALTER TABLE `flight_results`
  ADD CONSTRAINT `fk_aircraft_type_id` FOREIGN KEY (`aircraft_type_id`) REFERENCES `aircraft_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_airline_id` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`),
  ADD CONSTRAINT `fk_arrival_airport_id` FOREIGN KEY (`arrival_airport_id`) REFERENCES `airports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_departure_airport_id` FOREIGN KEY (`departure_airport_id`) REFERENCES `airports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_flight_times_id` FOREIGN KEY (`flight_times_id`) REFERENCES `flight_times` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_seat_type_id` FOREIGN KEY (`seat_type_id`) REFERENCES `seat_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticket_conditions_id` FOREIGN KEY (`ticket_conditions_id`) REFERENCES `ticket_conditions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `flight_times`
--
ALTER TABLE `flight_times`
  ADD CONSTRAINT `flight_times_ibfk_1` FOREIGN KEY (`flight_number_id`) REFERENCES `flight_results` (`flight_number`);

--
-- Các ràng buộc cho bảng `passengers`
--
ALTER TABLE `passengers`
  ADD CONSTRAINT `fk_contact_info_id` FOREIGN KEY (`contact_info_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_departure_drink_meal_id` FOREIGN KEY (`departure_drink_meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_departure_food_meal_id` FOREIGN KEY (`departure_food_meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_depature_baggage_id` FOREIGN KEY (`departure_baggage_id`) REFERENCES `baggage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight_results` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_method_id` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_return_baggage_id` FOREIGN KEY (`return_baggage_id`) REFERENCES `baggage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_return_drink_meal_id` FOREIGN KEY (`return_drink_meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_return_food_meal_id` FOREIGN KEY (`return_food_meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_voucher_id` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `postpaid_application`
--
ALTER TABLE `postpaid_application`
  ADD CONSTRAINT `fk_postpaid_partner_id` FOREIGN KEY (`postpaid_partner_id`) REFERENCES `postpaid_partner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `postpaid_partner`
--
ALTER TABLE `postpaid_partner`
  ADD CONSTRAINT `fk_payment_method_code-fk` FOREIGN KEY (`payment_method_code`) REFERENCES `payment_method` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

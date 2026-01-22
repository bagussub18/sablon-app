-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Jan 2026 pada 14.11
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sablon_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nama_penerima` varchar(100) NOT NULL,
  `jenis_barang` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `desain` varchar(255) DEFAULT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `total_harga` int(11) NOT NULL,
  `status` enum('pending','diproses','selesai','batal') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`id`, `id_user`, `nama_penerima`, `jenis_barang`, `alamat`, `no_hp`, `desain`, `bukti_pembayaran`, `total_harga`, `status`, `created_at`) VALUES
(1, 4, 'Bagus', 'Label Pita', 'Tempel Wirogunan', '0859102654', '1768301807317-Aktivity Diagram (Pesanan).png', '1768301807318-Aktivity Diagram (Login).png', 50000, 'selesai', '2026-01-13 10:56:47'),
(2, 4, 'budi', 'Tas', 'Tempel Wirogunan', '0859102654', '1768303852009-Aktivity Diagram (Daftar).png', '1768303852010-Untitled Diagram.drawio.png', 1000000, 'batal', '2026-01-13 11:30:52'),
(3, 4, 'Bagus', 'Gelas', 'Tempel Wirogunan', '0859102654', '1768313689065-Aktivity Diagram (Login).png', '1768313689066-Untitled Diagram.drawio (1).png', 60000, 'selesai', '2026-01-13 14:14:49'),
(4, 4, 'Bagus', 'Label', 'Tempel Wirogunan', '0859102654', '1768314381429-Aktivity Diagram (Login).png', '1768314381430-aktivity Diagram gabung.png', 75000, 'selesai', '2026-01-13 14:26:21'),
(5, 4, 'Faisal', 'Tas', 'Tempel Wirogunan', '0859102654', '1768314408581-Aktivity Diagram (Login).png', '1768314408582-Untitled Diagram.drawio (1).png', 25000, 'batal', '2026-01-13 14:26:48'),
(6, 3, 'bambang', 'Payung', 'Sleman,Tempel', '08180258952', '1768319542175-Aktivity Diagram (Login).png', '1768319542176-aktivity Diagram gabung.png', 78000, 'batal', '2026-01-13 15:52:22'),
(7, 3, 'Bani', 'Stiker', 'Bantul, Kasihan', '083854512', '1768319584511-Untitled Diagram.drawio.png', '1768319584512-Aktivity Diagram (Login).png', 65000, 'selesai', '2026-01-13 15:53:04'),
(8, 3, 'Yudi', 'Plastik', 'Kulon Progo, Wates', '08598651', '1768319647709-Untitled Diagram.drawio.png', '1768319647711-Untitled Diagram.drawio (1).png', 38000, 'selesai', '2026-01-13 15:54:07'),
(9, 3, 'Geri', 'Tumbler', 'Sleman, Godean', '083865112', '1768319697213-Aktivity Diagram (Daftar).png', '1768319697214-Untitled Diagram.drawio (2).png', 58000, 'selesai', '2026-01-13 15:54:57'),
(10, 4, 'bambang', 'Label Pita', 'Tempel Wirogunan', '08180258952', '1768489632362-Aktivity Diagram (Pesanan).png', '1768489632363-aktivity Diagram gabung.png', 45000, 'diproses', '2026-01-15 15:07:12'),
(11, 4, 'bambang', 'Gelas', 'Sleman,Tempel', '08598651', '1768493199191-Aktivity Diagram (Login).png', '1768493199195-Aktivity Diagram (Daftar).png', 50000, 'pending', '2026-01-15 16:06:39'),
(12, 4, 'Bani', 'Tas', 'Bantul, Kasihan', '08180258952', '1768493228858-aktivity Diagram gabung.png', '1768493228867-Aktivity Diagram (Pesanan).png', 70000, 'pending', '2026-01-15 16:07:08'),
(13, 4, 'Bani', 'Payung', 'Sleman, Godean', '08598651', '1768493258809-Aktivity Diagram (Pesanan).png', '1768493258810-Untitled Diagram.drawio.png', 30000, 'pending', '2026-01-15 16:07:38'),
(14, 4, 'Bagyo', 'Thumbler', 'Kulon Progo, Wates', '08180258952', '1768493301888-Aktivity Diagram (Login).png', '1768493301889-Aktivity Diagram (Pesanan).png', 80000, 'selesai', '2026-01-15 16:08:21'),
(15, 4, 'Beni', 'Stiker', 'Kulon Progo, Wates', '0859102654', '1768493361242-Aktivity Diagram (Pesanan).png', '1768493361246-aktivity Diagram gabung.png', 45000, 'pending', '2026-01-15 16:09:21'),
(16, 4, 'bambang', 'Tas', 'Tempel Wirogunan', '08180258952', '1768537168641-Aktivity Diagram (Konfirmasi Pesanan).png', '1768537168642-aktivity Diagram gabung.png', 65000, 'pending', '2026-01-16 04:19:28'),
(17, 4, 'bambang', 'Label Pita', 'Bantul, Kasihan', '0859102654', '1768537236289-aktivity Diagram gabung.png', '1768537236293-aktivity Diagram gabung.png', 45000, 'pending', '2026-01-16 04:20:36'),
(18, 4, 'budi', 'Stiker', 'Sleman,Tempel', '08180258952', '1768537265144-aktivity Diagram gabung.png', '1768537265146-Aktivity Diagram (Pesanan).png', 65000, 'pending', '2026-01-16 04:21:05'),
(19, 4, 'Bani', 'Label', 'Kulon Progo, Wates', '0859102654', '1768537288242-Aktivity Diagram (Login).png', '1768537288242-aktivity Diagram gabung.png', 50000, 'pending', '2026-01-16 04:21:28'),
(20, 4, 'Bani', 'Gelas', 'Sleman, Godean', '08598651', '1768537317258-Untitled Diagram.drawio (1).png', '1768537317262-Relasi tabel.png', 65000, 'batal', '2026-01-16 04:21:57'),
(21, 4, 'bambang', 'Label', 'Kulon Progo, Wates', '628180258952', '1768540936819-Aktivity Diagram (Login).png', '1768540936819-Aktivity Diagram (Login).png', 75000, 'pending', '2026-01-16 05:22:16'),
(22, 4, 'Bagus', 'Stiker', 'Bantul, Kasihan', '62859102654', '1768540966851-Aktivity Diagram (Login).png', '1768540966851-Aktivity Diagram (Login).png', 25000, 'pending', '2026-01-16 05:22:46'),
(23, 4, 'budi', 'Tas', 'Sleman, Godean', '628180258952', '1768541010809-Aktivity Diagram (Login).png', '1768541010810-Aktivity Diagram (Login).png', 65000, 'pending', '2026-01-16 05:23:30'),
(24, 4, 'bambang Murti', 'Payung', 'Joyonegaran, 58468, 800, RT12/RW15', '628598651', '1768544645690-Aktivity Diagram (Login).png', '1768544645691-Aktivity Diagram (Login).png', 55000, 'batal', '2026-01-16 06:24:05'),
(25, 5, 'Muhamad Faiz', 'Tas', 'Tuntungan, 840, RT32/RW18, 51238', '6285654325', '1768545725881-Aktivity Diagram (Login).png', '1768545725882-Aktivity Diagram (Pesanan).png', 45000, 'batal', '2026-01-16 06:42:05'),
(26, 6, 'Doni Pamungkas', 'Label Pita', 'Godean jl.kunigan no.888, RT23/RW25, 544785', '6285746123', '1768644241074-Aktivity Diagram (Login).png', '1768644241075-Untitled Diagram.drawio (3).png', 55000, 'diproses', '2026-01-17 10:04:01'),
(27, 6, 'Doni Pamungkas', 'Tas', 'Prawirotaman, no.354, RT41/RW33, 562214', '6287456123', '1768644318754-aktivity Diagram gabung.png', '1768644318758-Aktivity Diagram (Daftar).png', 65000, 'diproses', '2026-01-17 10:05:18'),
(28, 7, 'Novi Pamungkas', 'Payung', 'Prawiroderjan, no.333, RT44/RW83, 562278', '6287457845', '1768644385822-Aktivity Diagram (Daftar).png', '1768644385823-aktivity Diagram.drawio.png', 75000, 'selesai', '2026-01-17 10:06:25'),
(29, 4, 'Bagus Subagyo', 'Stiker', 'Bugisan, no.233, RT42/RW13, 561578', '628180258952', '1768644782076-Aktivity Diagram (Login).png', '1768644782076-Untitled Diagram.drawio (1).png', 55000, 'batal', '2026-01-17 10:13:02'),
(30, 4, 'Bagus Subagyo', 'Stiker', 'Tempel Wirogunan Uh3', '62859102654', '1768796175658-Aktivity Diagram (Daftar).png', '1768796175660-Aktivity Diagram (Pesanan).png', 55000, 'diproses', '2026-01-19 04:16:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('pelanggan','owner') DEFAULT 'pelanggan',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Yudi', 'yudi@test.com', '$2b$10$KlGMoo9gGcWq6wceZjdvRu0TmG7aB3JPdZdqgZbJqxL3tSHmzyCTO', 'owner', '2026-01-08 12:01:53'),
(3, 'Faisal', 'faisal@test.com', '$2b$10$HSVSyAcGjaqNAweduFN71.DbRxoLc7YhToedIKmVIAm3.5e4WBkdm', 'pelanggan', '2026-01-08 12:05:02'),
(4, 'Bagus', 'bagus@test.com', '$2b$10$rR38Z3DsmTA4z/3yAPfMwOK5kz5sc4Q86uJPMWNVkylTre2oQuDKm', 'pelanggan', '2026-01-08 13:18:11'),
(5, 'Muhamad Faiz', 'faiz@gmail.com', '$2b$10$u5T7limDRYebTgJs1bpJwudoMw2Lw3fVKPh0E8tb8xQJGoQOe/gIi', 'pelanggan', '2026-01-16 06:40:39'),
(6, 'Doni Pamungkas', 'donipamungkas@gmail.com', '$2b$10$sveRjRWdxy9uUwXkbyRlVu4rINI1Kmt9av5/BwRd648IM41XLA6l2', 'pelanggan', '2026-01-17 10:01:52'),
(7, 'Novi Pamungkas', 'novipamungkas@gmail.com', '$2b$10$wl7rPStY5q2jo7j0l6y6sOBqnGeBjvTYDHcVs171SlysxTZ9Ce0D6', 'pelanggan', '2026-01-17 10:02:43');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pesanan_user` (`id_user`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `fk_pesanan_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

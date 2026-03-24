# 🔐 Aplikasi Penyandian Data

## 📌 Deskripsi
Aplikasi ini merupakan aplikasi berbasis web yang digunakan untuk melakukan proses enkripsi dan dekripsi data menggunakan metode block cipher sederhana. Aplikasi ini dibuat tanpa menggunakan library kriptografi sehingga seluruh proses dilakukan secara manual menggunakan JavaScript.

## ⚙️ Fitur Utama
- Enkripsi dan dekripsi data
- Menggunakan 3 mode operasi:
  - ECB (Electronic Code Book) → tanpa IV
  - CBC (Cipher Block Chaining) → menggunakan IV
  - CFB (Cipher Feedback) → menggunakan IV
- Menggunakan fungsi dasar kriptografi:
  - XOR
  - Substitusi
  - Permutasi
- Output enkripsi dalam bentuk Base64
- Tampilan sederhana dan mudah digunakan

## 🧠 Konsep yang Digunakan
1. XOR  
Digunakan untuk menggabungkan data dengan kunci.

2. Substitusi  
Mengubah nilai byte menggunakan rumus: (x × 7 + 3) mod 256

3. Permutasi  
Mengacak urutan data dengan cara membalik posisi.

## 🔄 Mode Operasi
ECB:
- Tidak menggunakan IV
- Setiap blok diproses secara independen

CBC:
- Menggunakan IV
- Setiap blok dipengaruhi oleh blok sebelumnya

CFB:
- Menggunakan IV
- Menggunakan feedback dari hasil sebelumnya

## ▶️ Cara Penggunaan

Enkripsi:
1. Pilih mode operasi (ECB / CBC / CFB)
2. Masukkan kunci (key)
3. Masukkan IV (hanya untuk CBC dan CFB)
4. Masukkan teks pada input
5. Klik tombol Enkripsi
6. Hasil akan muncul dalam bentuk Base64

Dekripsi:
1. Masukkan hasil Base64 dari enkripsi ke input
2. Gunakan mode, key, dan IV yang sama
3. Klik tombol Dekripsi
4. Hasil akan kembali menjadi teks asli

## ⚠️ Catatan
- IV tidak wajib untuk mode ECB
- IV wajib untuk mode CBC dan CFB
- Key dan IV bersifat bebas (tidak dibatasi panjang tertentu)
- Hasil enkripsi akan selalu sama jika input, key, dan IV tidak berubah

## 🌐 Demo Aplikasi
https://dwtrxy-star.github.io/kamsis-project1/

## 🛠️ Teknologi
- HTML
- CSS
- JavaScript

## 📌 Kesimpulan
Aplikasi ini berhasil mengimplementasikan konsep dasar kriptografi menggunakan block cipher sederhana dengan tiga mode operasi, serta mampu melakukan proses enkripsi dan dekripsi dengan baik.

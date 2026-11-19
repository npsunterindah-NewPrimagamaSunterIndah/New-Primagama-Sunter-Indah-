# Tes Diagnostik New Primagama Sunter Indah

## Status
Antarmuka dan alur pratinjau sudah tersedia. Integrasi Supabase belum aktif sampai project Supabase dibuat, schema dijalankan, Edge Functions dideploy, konfigurasi website diisi, dan bank soal divalidasi.

## 1. Buat project Supabase
1. Buat project baru di Supabase.
2. Buka SQL Editor dan jalankan seluruh isi `supabase/schema.sql`.
3. Catat Project URL dan anon/public key dari Project Settings > API.
4. Jangan pernah menaruh service_role key di website atau GitHub.

## 2. Deploy Edge Functions
Pasang Supabase CLI, login, lalu link project:
```bash
supabase login
supabase link --project-ref PROJECT_REF
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY_ANDA
supabase functions deploy diagnostic-start
supabase functions deploy diagnostic-submit
```
Supabase menyediakan SUPABASE_URL untuk Edge Functions. Service role key hanya disimpan sebagai secret server.

## 3. Hubungkan website
Edit `tes-diagnostik/config.js`:
- SUPABASE_URL: Project URL Supabase.
- SUPABASE_ANON_KEY: anon/public key.
- WHATSAPP_NUMBER: nomor WhatsApp admin dalam format internasional tanpa tanda +.

Anon key memang digunakan di browser. Keamanan data bergantung pada RLS yang aktif dan Edge Functions yang memakai service role di server.

## 4. Isi bank soal

Bank soal awal Matematika SMP kelas VII tersedia di `supabase/question-bank-smp7-matematika.csv`. File ini berisi 20 soal yang digunakan sebagai versi 1.0, lengkap dengan kunci, pembahasan, tingkat kesulitan, dan indikator kompetensi. Nilai `is_active` disetel `true` agar bisa dipakai setelah CSV diimpor ke tabel `diagnostic_questions` dan Supabase siap.

Kolom `difficulty` memakai nilai `dasar`, `menengah`, `sulit`, atau `hots`. Kolom `competency_indicator` menjelaskan kompetensi yang diukur.
Setiap kombinasi jenjang, kelas, dan mata pelajaran memerlukan minimal 20 soal aktif. Soal harus ditinjau tim akademik sebelum `is_active` diubah menjadi true. Struktur pilihan jawaban adalah array empat teks, misalnya:
`["Pilihan A","Pilihan B","Pilihan C","Pilihan D"]`.
Kolom `answer_key` berisi A, B, C, atau D. Isi `topic` dan `explanation` untuk mendukung pemetaan dan pembahasan.

Jangan aktifkan bank soal yang belum diperiksa. Mode pratinjau saat ini menyediakan 20 soal Matematika SMP kelas VII. Identitas pada mode pratinjau tidak dikirim ke server.

## 5. Uji sebelum dipublikasikan
- Uji pendaftaran dari desktop dan ponsel.
- Pastikan satu sesi berisi tepat 20 soal dan waktu 20 menit.
- Uji pengumpulan jawaban, nilai, dan rincian topik.
- Pastikan sesi kedaluwarsa setelah waktu habis.
- Uji RLS: anon key tidak boleh membaca tabel peserta, sesi, jawaban, atau kunci jawaban.
- Uji WhatsApp dan persetujuan penggunaan data.

## Catatan pengembangan berikutnya
Dashboard admin, ekspor laporan, pembahasan jawaban per soal, pembatasan spam/rate limit, dan verifikasi keamanan tambahan perlu dibuat sebelum pemakaian skala besar.

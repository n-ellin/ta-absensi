## 1. Struktur Branch

- `main` — kode stabil, hanya diisi dari `dev` yang sudah teruji. Jangan pernah push langsung ke sini.

- `dev` — branch gabungan tempat semua fitur digabung sebelum masuk `main`.

- `feature/nama-fitur` — branch kerja individu/tim kecil untuk 1 fitur/tugas spesifik.

- `fix/nama-bug` — branch khusus untuk perbaikan bug.

## 2. Alur Kerja Harian

1. **Sebelum mulai kerja**, selalu update branch `dev` di lokal:

```
git checkout dev  
git pull origin dev
```

2. **Buat branch baru** dari `dev` untuk tugas kamu:

```
git checkout -b feature/nama-fitur
```

3. **Kerja seperti biasa**, commit sesering mungkin dengan pesan yang jelas (lihat format di bawah).

4. **Sebelum push**, tarik perubahan terbaru dari `dev` dan gabungkan ke branch kamu supaya conflict ketemu lebih awal (lebih gampang diselesaikan sendiri daripada pas PR):

```
git fetch origin  
git merge origin/dev
```

5. **Push branch kamu**:

```
git push origin feature/nama-fitur
```

6. **Buka Pull Request (PR)** dari `feature/nama-fitur` ke `dev`. Minta minimal 1 orang review sebelum merge.

7. Setelah di-approve, merge PR (gunakan "Squash and merge" biar histori `dev` rapi).

## 3. Format Commit Message

Gunakan format ini supaya histori gampang dibaca:

```
\<tipe\>: \<deskripsi singkat\>
```

Tipe yang dipakai:

- `feat` — menambah fitur baru

- `fix` — memperbaiki bug

- `docs` — perubahan dokumentasi saja

- `style` — perubahan format/style kode (tanpa mengubah logic)

- `refactor` — perubahan struktur kode tanpa mengubah fungsi

- `chore` — pekerjaan pendukung (update dependency, config, dll)

Contoh:

```
feat: tambah halaman login  
fix: perbaiki validasi input email  
docs: update cara instalasi di README
```

## 4. Cara Menghindari Conflict

- Jangan kerja di file yang sama dengan anggota lain dalam waktu bersamaan tanpa koordinasi. Kabari di grup kalau mau edit file besar/shared (misal file routing, file model utama).

- Commit kecil dan sering, jangan menumpuk banyak perubahan dalam 1 commit besar.

- Selalu `pull`/`merge` dari `dev` sebelum mulai kerja baru, jangan kerja dari branch yang sudah ketinggalan jauh.

- Jangan push langsung ke `main` atau `dev` — semua lewat PR.

## 5. Kalau Sudah Terlanjur Conflict

1. Jangan panik, jalankan:

```
git status
```

untuk lihat file mana yang conflict.

2. Buka file tersebut, cari tanda:

```
\<\<\<\<\<\<\< HEAD  
(kode kamu)  
=======  
(kode dari branch lain)  
\>\>\>\>\>\>\> nama-branch
```

3. Diskusikan dengan yang bersangkutan kode mana yang dipakai/digabung, lalu hapus tanda `\<\<\<\<\<\<\<`, `=======`, `\>\>\>\>\>\>\>`.

4. Setelah selesai:

```
git add .  
git commit -m "fix: resolve merge conflict"  
git push
```

## 6. Branch Protection (untuk yang pegang akses repo/admin)

Di pengaturan repo (GitHub: Settings → Branches), aktifkan protection untuk `main` dan `dev`:

- Wajib lewat Pull Request (tidak bisa push langsung)

- Wajib minimal 1 approval sebelum merge


# Tutorial: Cara Membuat Pull Request (PR)

Panduan dari **membuat branch** sampai **PR diajukan** ke `dev`.

> **Pull Request (PR)** = permintaan ke tim: _"Tolong cek kerjaanku, lalu gabungkan ke `dev`."_
> Kamu tidak boleh mengirim kerjaan langsung ke `dev` atau `main`, jadi semuanya lewat PR.

---

## Gambaran Alur

```
1. Cek posisi        →  2. Buat branch   →  3. Kerjakan tugas
        ↓
4. Add + CEK BRANCH  →  5. Gabung dev    →  6. Cek aplikasi
   + Commit             terbaru              masih jalan
        ↓
7. Push              →  8. Buka PR di    →  9. Isi detail PR
                           GitHub              lalu kirim
```

**Sebelum mulai:** repo sudah di-clone ke laptopmu. Belum? Lihat bagian _Langkah Awal_ di `TIPS_BRANCH_PROTECTED.md`.

---

## Bagian 1: Di Laptop (Terminal / VS Code)

### Langkah 1: Cek kamu lagi di branch mana

```bash
git branch
```

![Hasil git branch --show-current di terminal](docs/step1A.png)
Akan muncul daftar semua branch di laptopmu. Cari yang ada tanda **`*`** (biasanya juga berwarna hijau), itu **branch yang sedang aktif**. Contoh tampilannya ada di screenshot Langkah 2.

> Kalau daftarnya panjang dan layar berubah jadi mode baca, tekan **`q`** untuk keluar.

Mau yang lebih ringkas, hanya menampilkan nama branch aktif? Pakai:

```bash
git branch --show-current
```

![Hasil git branch --show-current di terminal](docs/step1.png)

📷 **Keterangan:** Contoh hasil `git branch --show-current`. Tulisan di bawah command (`docs/panduan-branch-protection`) adalah **nama branch yang sedang aktif**. Kalau yang aktif `main` atau `dev`, jangan coding di situ, lanjut ke Langkah 2 untuk membuat branch baru.

---

### Langkah 2: Buat branch baru dari `dev` terbaru

> ⚠️ **Branch baru selalu dibuat dari `dev`, bukan dari `main`.**
> PR-mu menuju `dev`, jadi branchmu harus berangkat dari `dev` yang terbaru.

Ganti `feat/nama-tugas` dengan nama tugasmu:

```bash
git fetch origin
git switch -c feat/nama-tugas --no-track origin/dev
```

Artinya: _"ambil yang terbaru dari GitHub, lalu buat branch baru dari `dev` yang paling baru."_

**Aturan nama branch:** `jenis/nama-singkat`, huruf kecil, pakai tanda `-`, tanpa spasi.

| Jenis       | Dipakai untuk     | Contoh                 |
| ----------- | ----------------- | ---------------------- |
| `feat/`     | Fitur baru        | `feat/login-page`      |
| `fix/`      | Memperbaiki bug   | `fix/otp-timer`        |
| `style/`    | Mengubah tampilan | `style/navbar-spacing` |
| `refactor/` | Merapikan kode    | `refactor/axios-setup` |
| `docs/`     | Dokumentasi       | `docs/tutorial-pr`     |

![Membuat branch baru dan melihat daftar branch](docs/step2.png)

📷 **Keterangan:**

- Baris `Switched to a new branch '...'` = branch baru **berhasil dibuat** dan kamu sudah pindah ke situ.
- `git branch` menampilkan **semua branch di laptopmu**. Tanda `*` dan warna hijau menunjukkan **branch yang sedang aktif**.
- Lihat juga **bar paling bawah VS Code**: nama branch aktif tampil di **pojok kiri bawah**. Tanda kecil di sebelahnya (`*`, `+`) menandakan ada perubahan yang belum di-commit.

> Catatan: command di screenshot ini lebih pendek (`git switch -c "nama-branch"`). Untuk tugas sungguhan, **tetap pakai command lengkap di atas** supaya branchmu berangkat dari `dev` terbaru.

> 🛑 Kalau di pojok kiri bawah masih tertulis `main` atau `dev`, **jangan lanjut coding**. Ulangi langkah 2.

---

### Langkah 3: Kerjakan tugasmu

Coding seperti biasa di VS Code. Kerjakan **satu tugas per branch**. Jangan campur login dan register dalam satu branch.

---

### Langkah 4: Siapkan dan simpan pekerjaan (add + commit)

**a. Lihat apa yang berubah:**

```bash
git status
```

![git status sebelum git add, file berwarna merah](docs/step4-red.png)

📷 **Keterangan:** Tulisan **merah** = perubahan yang **belum masuk** commit.

- `Changes not staged for commit` → file lama yang kamu **ubah** (contoh: `modified: ... main.tsx`).
- `Untracked files` → file atau folder **baru** yang belum pernah dilacak Git (contoh: `TUTORIAL_PR.md`, `docs/`).

**b. Siapkan file untuk di-commit:**

```bash
git add .
```

> Pakai `git add .` hanya kalau semua file di `git status` memang hasil kerjamu.
> Ada file yang bukan milikmu, atau ada `.env`? Tambahkan satu-satu: `git add nama-file`.

![Menjalankan git add titik](docs/step4-add.png)

📷 **Keterangan:** `git add .` menyiapkan **semua perubahan** untuk di-commit. Kalau tidak ada tulisan error, berarti berhasil. (Tulisan `Already up to date.` di atasnya adalah output command sebelumnya, bukan dari `git add`.)

Lalu jalankan `git status` **sekali lagi** untuk memastikan:

![git status setelah git add, file berwarna hijau](docs/step4-green.png)

📷 **Keterangan:** Sekarang file berwarna **hijau** di bawah `Changes to be committed` = sudah **siap masuk commit**.

- `new file` = file baru, `modified` = file diubah, `renamed` = file diganti nama/dipindah.
- Baris pertama, `On branch ...`, juga menampilkan **nama branch aktif**.
- **Baca daftar hijau ini dengan teliti.** Pastikan isinya hanya file hasil kerjamu.

**c. 🛑 CEK BRANCH SEBELUM COMMIT**

Ini langkah yang **tidak boleh dilewati**. Commit di branch yang salah (`main` atau `dev`) bikin push ditolak dan repot dibereskan.

```bash
git branch
```

Lihat baris yang ada tanda **`*`**:

| Tanda `*` ada di                             | Yang dilakukan                                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Branch fiturmu** (misal `feat/login-page`) | ✅ Aman, lanjut commit                                                                                |
| `main` atau `dev`                            | 🛑 **Berhenti.** Jangan commit. Buat branch baru dulu (`git switch -c ...`), perubahanmu ikut terbawa |

**d. Simpan dengan pesan yang jelas:**

```bash
git commit -m "feat(auth): tambah halaman login"
```

Format pesan: `jenis(bagian): apa yang dikerjakan`

| ❌ Kurang jelas | ✅ Jelas                                                |
| --------------- | ------------------------------------------------------- |
| `update`        | `feat(auth): tambah validasi email di form login`       |
| `fix`           | `fix(otp): perbaiki timer tidak reset saat kirim ulang` |
| `p`             | `style(navbar): rapikan jarak dropdown profil`          |

![Hasil git commit](docs/step4-commit.png)

📷 **Keterangan:** Hasil `git commit`:

- Baris pertama `[nama-branch kode-commit] pesan commit` → **cek lagi nama branch-nya**, harus branch fiturmu.
- Baris berikutnya adalah ringkasan: jumlah file yang berubah, baris yang ditambah (`insertions`) dan dihapus (`deletions`).
- `create mode ...` = file baru yang ikut tersimpan.
- Bandingkan jumlah file dengan tugasmu. Kalau jauh lebih banyak dari yang kamu kerjakan, ada file yang ikut tanpa sengaja. Cek lagi sebelum push.

Boleh commit **beberapa kali** sambil kerja. Commit kecil-kecil lebih aman daripada satu commit besar.

---

### Langkah 5: Gabungkan `dev` terbaru ke branchmu

Selama kamu kerja, teman mungkin sudah menggabungkan PR mereka ke `dev`. Ambil dulu perubahannya supaya tidak bentrok saat PR:

```bash
git fetch origin
git merge origin/dev
```

Kemungkinan hasilnya:

| Tulisan yang muncul                         | Artinya                            | Yang dilakukan                                                         |
| ------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `Already up to date.`                       | Tidak ada yang baru                | Lanjut ke langkah 6                                                    |
| Muncul daftar file berubah                  | Berhasil digabung                  | Lanjut ke langkah 6                                                    |
| `CONFLICT (content): Merge conflict in ...` | **Bentrok** dengan perubahan teman | Jangan panik. Lihat `GIT_WORKFLOW.md` bagian 8, atau minta bantuan tim |

> Mau mengintip bentrok **sebelum** benar-benar menggabungkan? Lihat _Situasi 3_ di `TIPS_BRANCH_PROTECTED.md`.

---

### Langkah 6: Pastikan aplikasi masih jalan

Masuk ke folder aplikasi, lalu jalankan:

```bash
cd ta-absensi-dev
npm run dev
```

Buka di browser, coba fitur yang kamu kerjakan. Kalau project punya script `lint` dan `build`, jalankan juga:

```bash
npm run lint
npm run build
```

> Jangan kirim PR kalau aplikasi error di laptopmu sendiri.

---

### Langkah 7: Kirim branchmu ke GitHub (push)

Kembali ke folder utama repo (kalau tadi `cd ta-absensi-dev`, jalankan `cd ..`), lalu:

```bash
git branch
git push -u origin feat/nama-tugas
```

Baris pertama untuk mengecek sekali lagi: tanda `*` harus ada di **branch fiturmu**, bukan `dev` atau `main`.

Kalau berhasil, terminal menampilkan tulisan seperti _"Create a pull request for 'feat/nama-tugas' on GitHub by visiting: ..."_. Itu pertanda branchmu sudah ada di GitHub.

<!-- TODO: tambahkan screenshot hasil git push di sini, misalnya docs/step7-push.png
![Hasil git push](docs/step7-push.png)
📷 Keterangan: ... -->

---

## Bagian 2: Di GitHub (Browser)

### Langkah 8: Buka halaman repo dan mulai PR

Ada **dua cara** membuka PR. Pilih salah satu.

#### Cara 1: Lewat banner (paling cepat)

Setelah push, GitHub menampilkan **banner kuning** di bagian atas halaman repo atau tab _Pull requests_. Klik tombol hijau **Compare & pull request**.

![Banner Compare & pull request di tab Pull requests](docs/pr_langsung.png)

📷 **Keterangan:**

- Banner kuning bertuliskan _"<nama-branch> had recent pushes ... minutes ago"_ muncul sesaat setelah kamu push. Klik **Compare & pull request** di sebelah kanannya.
- Di pojok kanan ada tombol hijau **New pull request** (itu untuk Cara 2).
- Banner ini hilang setelah beberapa waktu. Kalau tidak muncul, pakai Cara 2.

#### Cara 2: Manual lewat tab Pull requests

**a.** Buka tab **Pull requests** di menu atas repo.

![Tab Pull requests di menu repo](docs/pr.png)

📷 **Keterangan:** Menu repo ada di bagian atas halaman GitHub. Klik tab **Pull requests**. Kalau layarmu kecil, beberapa menu terlipat di tombol **More**.

**b.** Klik tombol hijau **New pull request** (kanan atas daftar PR, lihat gambar Cara 1).

**c.** Pilih branch di halaman **Comparing changes**.

![Halaman Comparing changes untuk memilih base dan compare](docs/pr_manual_step1.png)

📷 **Keterangan:**

- Di atas ada dua kotak: **`base`** (tujuan PR) dan **`compare`** (sumber, yaitu branch kamu).
- ⚠️ Di screenshot ini `base` masih **`main`**. **Ganti ke `dev`** sebelum lanjut (lihat Langkah 9).
- Tulisan hijau **Able to merge** = tidak ada bentrok.
- Setelah `base` dan `compare` benar, klik tombol hijau **Create pull request**.
- Di bawahnya ada ringkasan: jumlah **commits**, jumlah **files changed**, dan **contributor**. Cek angka ini. Kalau jumlah file jauh lebih banyak dari yang kamu kerjakan, ada file yang ikut tanpa sengaja.

---

### Langkah 9: Pastikan tujuan PR ke `dev` ⚠️

Ini langkah yang **paling sering salah**. Di bagian atas halaman, cek dua kotak ini:

```
base: dev   ←   compare: feat/nama-tugas
```

| Kotak     | Harus berisi       | Artinya                          |
| --------- | ------------------ | -------------------------------- |
| `base`    | **`dev`**          | Tujuan: PR ini digabung ke `dev` |
| `compare` | **branch fiturmu** | Sumber: kerjaanmu                |

> 🛑 GitHub sering memilih `main` secara otomatis. Kalau `base` masih `main`, **klik dan ganti ke `dev`**.

**❌ Contoh yang SALAH: `base` masih `main`**

![Form PR dengan base main (salah)](docs/create_pr.png)

📷 **Keterangan:** Lihat kotak `base: main` di bagian atas. Ini **salah**, karena PR akan menuju `main`. Klik kotak `base`, lalu pilih `dev`.

**✅ Contoh yang BENAR: `base` sudah `dev`**

![Memilih base dev dan compare branch fitur](docs/branch_tujuan.png)

📷 **Keterangan:**

- `base: dev` ← `compare: <branch fiturmu>` → arah PR sudah benar.
- Tulisan hijau **Able to merge. These branches can be automatically merged.** = tidak ada bentrok.
- Kalau di bawahnya muncul kotak PR yang sudah ada (contoh: _"Docs/panduan branch protection #4"_ dengan tombol **View pull request**), artinya **PR untuk branch ini sudah pernah dibuat**. Klik **View pull request**, tidak perlu membuat yang baru.

---

### Langkah 10: Isi judul dan deskripsi

**Judul:** pakai format yang sama dengan pesan commit.

```
feat(auth): tambah halaman login
```

**Deskripsi:** salin template ini lalu isi.

```md
## Ringkasan

Apa yang dikerjakan di PR ini (1-3 kalimat).

## Perubahan

- Tambah halaman Login
- Tambah tombol Login dengan Google

## Cara Test

1. Jalankan `npm run dev`
2. Buka `/login`
3. Coba login dengan email salah, harus muncul pesan error

## Screenshot

(tempel gambar kalau ada perubahan tampilan)

## Checklist

- [ ] Sudah gabungkan `dev` terbaru ke branch ini
- [ ] Aplikasi jalan tanpa error di laptopku
- [ ] Sudah dites manual di browser
- [ ] Tidak ada file `.env` atau `console.log` yang tertinggal
```

![Form judul dan deskripsi PR dengan base dev](docs/title_dan_descd_pr.png)

📷 **Keterangan:**

- **Add a title** = judul PR. GitHub otomatis mengisinya dari **nama branch** (contoh: _"Docs/panduan branch protection"_), jadi **ganti** dengan format `jenis(bagian): deskripsi`.
- **Add a description** = deskripsi PR. Mendukung **Markdown** (tab _Write_ untuk menulis, tab _Preview_ untuk melihat hasilnya). Isi dengan template di atas.
- Mau menempel screenshot? **Seret gambarnya** ke kolom deskripsi, atau klik _Paste, drop, or click to add files_ di bawah kolom.
- Perhatikan `base: dev` di bagian atas. Pastikan sudah benar sebelum mengirim.

---

### Langkah 11: Pilih reviewer

Lihat **kolom kanan** pada gambar di Langkah 10:

- **Reviewers**: orang yang akan mengecek PR-mu. Klik ikon ⚙ lalu pilih ketua atau teman yang ditunjuk. Tulisan _"No reviews—at least 1 approving review is required"_ artinya PR **butuh minimal 1 approval** sebelum bisa di-merge.
- **Assignees**: penanggung jawab PR. Klik _assign yourself_ untuk menugaskan dirimu sendiri.
- **Labels**, **Projects**, **Milestone**: opsional, isi kalau tim memakainya.

> Kerjaan belum 100% selesai tapi ingin dilihat dulu? Klik panah kecil di tombol hijau, pilih **Create draft pull request**. Draft tidak bisa di-merge sampai kamu ubah jadi _Ready for review_.

---

### Langkah 12: Kirim PR

Klik tombol hijau **Create pull request** (kanan bawah form, lihat gambar di Langkah 10). Panah kecil di sampingnya untuk memilih **draft**.

<!-- TODO: tambahkan screenshot halaman PR setelah berhasil dibuat, misalnya docs/pr-berhasil.png
![PR berhasil dibuat](docs/pr-berhasil.png)
📷 Keterangan: ... -->

🎉 **PR-mu sudah diajukan.**

---

## Cek Terakhir Setelah PR Dibuat

Buka tab **Files changed** di PR-mu dan baca ulang perubahanmu sendiri. Cari:

- file yang seharusnya tidak ikut (misalnya `.env`)
- `console.log` atau kode yang dikomentari yang tertinggal
- perubahan di file yang bukan bagian tugasmu

<!-- TODO: tambahkan screenshot tab Files changed, misalnya docs/files-changed.png
![Tab Files changed](docs/files-changed.png)
📷 Keterangan: ... -->

Kalau ada yang salah, perbaiki di laptop, commit, lalu `git push`. PR otomatis ter-update.

---

## Setelah PR Diajukan

| Situasi                                        | Yang dilakukan                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Reviewer minta perbaikan                       | Edit di **branch yang sama**, `git add` → cek branch → `git commit` → `git push`. PR otomatis ter-update |
| Muncul tulisan **"This branch has conflicts"** | `git fetch origin` → `git merge origin/dev` → selesaikan bentrok → `git push`                            |
| PR sudah di-approve dan di-merge               | Selesai! Untuk tugas berikutnya, **buat branch baru** dari Langkah 2. Jangan pakai branch lama lagi      |

---

## Kesalahan yang Sering Terjadi

| Kesalahan                                   | Akibat                                      | Cara menghindari                                                               |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| **Commit tanpa cek branch**                 | Commit nyasar di `main`/`dev`, push ditolak | Jalankan `git branch` **sebelum setiap commit** dan cek tanda `*` (Langkah 4c) |
| `base` PR masih `main`                      | PR menuju branch yang salah                 | Selalu cek Langkah 9                                                           |
| Branch baru dibuat dari `main`              | Tidak membawa kode terbaru, PR bentrok      | Buat dari `origin/dev` (Langkah 2)                                             |
| `git add .` membawa file yang bukan milikmu | PR berisi perubahan acak, susah direview    | Baca daftar hijau di `git status` sebelum commit                               |
| Lupa gabung `dev` terbaru                   | PR bentrok                                  | Lakukan Langkah 5                                                              |
| Satu PR isinya banyak tugas                 | Susah direview, rawan bentrok               | Satu branch = satu tugas                                                       |
| Pesan commit `update` / `fix`               | Tidak jelas apa yang berubah                | Pakai format `jenis(bagian): deskripsi`                                        |
| File `.env` ikut ter-commit                 | Rahasia bocor                               | Cek `git status` sebelum `git add`                                             |

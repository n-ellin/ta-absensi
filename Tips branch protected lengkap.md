# Tips & Trik Kerja di Repo dengan Branch Terproteksi

Pelengkap `GIT_WORKFLOW.md`. Fokus dokumen ini: **kebiasaan aman sehari-hari** supaya tidak salah branch, tidak salah push, dan tidak kaget kena konflik.

---

## 0. Satu Ide yang Harus Diingat

> **`main` dan `dev` di laptopmu hanyalah CERMIN dari yang ada di GitHub. Jangan dipakai untuk kerja.**

```
GitHub (origin)             Laptopmu
───────────────             ─────────────────────────────────
main  (versi bersih)   ───▶ main   = cermin, tidak pernah di-edit
dev   (versi progres)  ───▶ dev    = cermin, tidak pernah di-edit
                            feat/login-page  ← TEMPAT KERJA
```

- `main` = versi paling bersih, hanya diisi dari `dev` oleh ketua.
- `dev` = versi yang masih progres, tempat semua fitur digabung lewat PR.
- Kerja **hanya** di branch fitur (`feat/...`, `fix/...`) yang kamu buat sendiri **dari `dev`** (bukan dari `main`).

Karena cermin, `main` dan `dev` lokal boleh **dihapus dan diambil ulang kapan saja** tanpa rugi apa-apa. Itu yang membuat reset (bagian 4) aman.

---

## Langkah Awal: Ambil Repo ke Laptop (Sekali Saja)

Ada 2 pilihan. **Pilih salah satu**, alur kerja Git setelahnya (branch, commit, push, PR) sama persis.

|                       | Pilihan A: Ambil semua                                    | Pilihan B: Hanya `ta-absensi-dev`                                         |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Cocok untuk           | Mau melihat atau mengedit dokumentasi (`docs/`) di laptop | Hanya fokus ngoding, laptop lebih ringan                                  |
| Yang muncul di laptop | Semua folder, termasuk `docs/`                            | `ta-absensi-dev` + file langsung di root (`readme.md`, `CONTRIBUTING.md`) |
| Tingkat kesulitan     | Paling mudah                                              | 1 command tambahan                                                        |
| Nama teknisnya        | Clone biasa                                               | Sparse-checkout                                                           |

### Pilihan A: Ambil semua

```bash
git clone <url-repo>
cd <nama-repo>
```

### Pilihan B: Hanya `ta-absensi-dev`

```bash
git clone --filter=blob:none --sparse <url-repo>
cd <nama-repo>
git sparse-checkout set ta-absensi-dev
```

Arti tiap bagian:

- `--sparse` : hanya tampilkan folder yang kamu pilih (ditambah file di root).
- `--filter=blob:none` : tunda mengunduh isi file sampai benar-benar dibutuhkan, jadi proses clone lebih ringan.
- `git sparse-checkout set ta-absensi-dev` : memilih folder yang ditampilkan.

### Pertanyaan yang sering muncul

| Pertanyaan                                                       | Jawaban                                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Apakah `docs/` hilang dari repo kalau dipilih B?                 | **Tidak.** Repo di GitHub tetap lengkap. Folder itu hanya tidak ditampilkan di laptopmu |
| Kalau aku push atau buka PR, apakah `docs/` ikut terhapus?       | **Tidak.** Git hanya mencatat file yang kamu ubah                                       |
| Kalau `docs/` diperbarui di `dev`, apakah `git pull` bermasalah? | **Tidak.** Perubahannya diambil di belakang layar, file-nya tidak muncul di laptopmu    |
| Kalau ternyata aku butuh `docs/`?                                | `git sparse-checkout add docs`                                                          |
| Mau balik jadi ambil semua?                                      | `git sparse-checkout disable`                                                           |
| Cek folder apa yang sedang ditampilkan?                          | `git sparse-checkout list`                                                              |
| Apakah pilihan ini mempengaruhi proteksi `main`/`dev`?           | **Tidak.** Aturan proteksi ada di GitHub, bukan di laptop                               |
| Pilihan B error                                                  | Kemungkinan Git terlalu lama. Cek `git --version`, disarankan 2.37 atau lebih baru      |

### Catatan penting

- Ganti `<url-repo>` dengan link repo (tombol hijau **Code** di GitHub), dan `<nama-repo>` dengan nama folder hasil clone. Kalau kamu memakai **fork**, `<url-repo>` adalah link fork milikmu (lihat bagian 8).
- Aplikasinya ada di dalam folder `ta-absensi-dev`. Sebelum `npm install` atau `npm run dev`, jalankan `cd ta-absensi-dev`. Command `git` bisa dijalankan dari folder mana pun di dalam repo.
- Dokumentasi di `docs/` selalu bisa dibaca langsung di github.com, jadi Pilihan B tidak membuatmu kehilangan akses ke panduan.

---

## 1. Cheat Sheet

### Cek posisi (biasakan SERING)

| Tujuan                                            | Command                              |
| ------------------------------------------------- | ------------------------------------ |
| Sekarang di branch apa?                           | `git branch --show-current`          |
| Status singkat + posisi terhadap remote           | `git status -sb`                     |
| Semua branch + tracking-nya                       | `git branch -vv`                     |
| Ada apa baru di `dev` yang belum ada di branchku? | `git log --oneline HEAD..origin/dev` |

### Perbarui cermin

| Tujuan                                               | Command                                            |
| ---------------------------------------------------- | -------------------------------------------------- |
| Ambil info terbaru dari GitHub (tidak mengubah file) | `git fetch origin --prune`                         |
| Perbarui `dev` lokal (aman, gagal kalau menyimpang)  | `git switch dev` → `git pull --ff-only origin dev` |

### Buat branch fitur baru (paling aman)

```bash
git fetch origin
git switch -c feat/nama-tugas --no-track origin/dev   # dari dev, bukan main
```

### Reset local jadi 100% sama dengan GitHub

| Tujuan                                                     | Command                                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Reset `dev` (sedang di dev)                                | `git fetch origin && git reset --hard origin/dev && git clean -fd`                   |
| Reset `dev` & `main` tanpa pindah (sedang di branch fitur) | `git fetch origin && git branch -f dev origin/dev && git branch -f main origin/main` |
| Reset branch fitur ke versi di GitHub                      | `git fetch origin && git reset --hard origin/feat/nama-tugas`                        |

⚠️ `reset --hard` **menghapus** perubahan yang belum di-commit dan commit yang belum di-push. Baca bagian 4 dulu.

### Simulasi merge (cek konflik sebelum merge beneran)

| Cara                                                        | Command                                                                                                        |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Cara 1: tidak menyentuh file apa pun** (Git ≥ 2.38)       | `git fetch origin` → `git merge-tree --write-tree --name-only HEAD origin/dev`                                 |
| **Cara 2: simulasi lalu batalkan**                          | `git fetch origin` → `git merge --no-commit --no-ff origin/dev` → `git status` → `git merge --abort`           |
| File mana yang berpotensi bentrok? (Git Bash / Linux / Mac) | `comm -12 <(git diff --name-only origin/dev...HEAD \| sort) <(git diff --name-only HEAD...origin/dev \| sort)` |

Ganti `origin/dev` dengan `origin/main` kalau ingin simulasi terhadap `main`.

### Pengaman supaya tidak sengaja push dari `main`/`dev` (sekali saja per laptop)

```bash
git config branch.main.pushRemote no_push
git config branch.dev.pushRemote no_push
```

---

## 2. Kebiasaan Cek Branch

Banyak kecelakaan Git terjadi karena **mengira sedang di branch A, padahal di branch B**. Biasakan cek di titik-titik ini:

| Kapan                                | Kenapa                                          |
| ------------------------------------ | ----------------------------------------------- |
| Setelah `git switch`                 | Pastikan benar-benar pindah                     |
| **Sebelum `git add` / `git commit`** | Jangan sampai commit di `dev`/`main`            |
| **Sebelum `git push`**               | Jangan sampai push dari branch yang salah       |
| Setelah `git pull` / `git merge`     | Pastikan ada di branch yang dimaksud            |
| Setiap pagi sebelum mulai kerja      | Laptop mungkin ditinggal di branch lain kemarin |

### Command-nya

```bash
git branch --show-current
```

Output contoh: `feat/login-page`. Kalau yang muncul `main` atau `dev`, **berhenti**, jangan commit.

```bash
git status -sb
```

Output contoh:

```
## feat/login-page...origin/feat/login-page [ahead 2]
 M src/features/auth/pages/LoginPage.jsx
?? src/features/auth/components/GoogleButton.jsx
```

Cara bacanya:

- Baris `##` pertama = nama branch dan posisinya terhadap remote.
- `[ahead 2]` = ada 2 commit lokal yang belum di-push.
- `[behind 1]` = ada 1 commit di GitHub yang belum kamu ambil.
- `M` = file diubah, `??` = file baru yang belum di-track.

```bash
git branch -vv
```

Output contoh:

```
  dev              a1b2c3d [origin/dev] feat(auth): ...
* feat/login-page  e4f5g6h [origin/feat/login-page: ahead 2] feat(auth): ...
  main             9z8y7x6 [origin/main] release: Epic 1
```

Tanda `*` = branch aktif. Kolom dalam `[...]` = pasangan remote-nya.

### Tips tambahan

- **Lihat nama branch di VS Code:** pojok kiri bawah, ikon cabang. Biasakan melirik.
- **Pakai terminal yang menampilkan nama branch** (Git Bash default-nya sudah menampilkan di prompt).
- **Pasang pengaman `pushRemote`** dari cheat sheet di atas. Kalau kamu iseng `git push` dari `dev`, akan langsung error, bukan lolos.

---

## 3. Membuat Branch Fitur dari Remote Terbaru

> ⚠️ **Branch baru selalu dibuat dari `dev`, bukan dari `main`.**
> `dev` berisi hasil kerja teman yang sudah di-merge, dan PR-mu menuju `dev`. Branch dari `main` tidak membawa kode terbaru itu, sehingga PR-nya hampir pasti bentrok.

Cara lama: pindah ke `dev` → pull → buat branch. Ada risiko `dev` lokal basi atau menyimpang.

Cara yang lebih aman, **langsung dari `origin/dev`**:

```bash
git fetch origin
git switch -c feat/nama-tugas --no-track origin/dev
```

Penjelasan:

- `git fetch origin` mengambil kondisi terbaru GitHub ke laptop (tidak mengubah file kerjamu).
- `origin/dev` adalah salinan lokal dari `dev` di GitHub, **bukan** `dev` lokal. Jadi branch barumu dijamin berangkat dari versi GitHub yang terbaru.
- `--no-track` mencegah branch barumu "menempel" ke `origin/dev`. Tanpa ini, `git push` pertama bisa membingungkan karena git mengira kamu mau push ke `dev`.

Push pertama kali:

```bash
git push -u origin feat/nama-tugas
```

---

## 4. Memperbarui dan Mereset Branch Lokal

### 4.1 Memperbarui cermin dengan aman

```bash
git switch dev
git pull --ff-only origin dev
```

`--ff-only` artinya: "hanya boleh maju lurus mengikuti GitHub". Kalau `dev` lokalmu pernah tidak sengaja di-commit, git akan **menolak** dan memberi tahu. Ini alarm yang berguna.

### 4.2 Reset `dev` lokal agar 100% sama dengan GitHub

Pakai kalau: `dev` lokal berantakan, ada commit nyasar, atau kamu bingung kondisinya.

**Langkah aman (disarankan):**

```bash
# 1. (Opsional tapi disarankan) simpan cadangan, jaga-jaga ada yang penting
git branch backup/dev-sebelum-reset

# 2. Ambil kondisi terbaru GitHub
git fetch origin

# 3. Pindah ke dev
git switch dev

# 4. Samakan 100% dengan GitHub
git reset --hard origin/dev

# 5. Lihat dulu file apa yang akan dibersihkan (dry run)
git clean -fdn

# 6. Kalau daftarnya aman, hapus file sampah yang tidak ter-track
git clean -fd
```

Apa yang terjadi:

- `reset --hard origin/dev` memaksa `dev` lokal, file kerja, dan staging jadi **persis** sama dengan `origin/dev`.
- `clean -fd` menghapus file/folder baru yang belum di-track. Folder yang ada di `.gitignore` (seperti `node_modules`) **tidak ikut terhapus**, jangan tambahkan `-x`.
- `-n` = dry run, hanya menampilkan, belum menghapus.

Untuk `main`, sama persis, tinggal ganti `dev` jadi `main`.

### 4.3 Reset tanpa pindah branch (saat sedang di branch fitur)

Berguna kalau kamu sedang kerja dan ingin menyegarkan cermin tanpa ganti-ganti branch:

```bash
git fetch origin
git branch -f dev origin/dev
git branch -f main origin/main
```

Catatan: tidak bisa dipakai pada branch yang **sedang aktif**. Kalau sedang di `dev`, pakai cara 4.2.

Versi PowerShell untuk keduanya sekaligus:

```powershell
foreach ($b in "main","dev") { git branch -f $b "origin/$b" }
```

### 4.4 Cara "nuklir": hapus lalu ambil ulang

```bash
git switch feat/nama-tugas        # pindah dulu dari dev
git branch -D dev                 # hapus dev lokal
git fetch origin
git switch dev                    # git otomatis membuat dev baru dari origin/dev
```

### 4.5 Reset branch fitur ke versi di GitHub

Pakai kalau branch fiturmu lokal sudah kacau, tapi versi yang sudah di-push masih bagus.

```bash
git fetch origin
git reset --hard origin/feat/nama-tugas
```

⚠️ Commit yang belum di-push akan hilang dari branch (tapi masih bisa dicari lewat `git reflog`, lihat bagian 7).

### Sebelum reset, tanya diri sendiri

- Ada perubahan yang belum di-commit dan penting? → `git stash -u` dulu.
- Ada commit yang belum di-push dan penting? → buat cadangan: `git branch backup/nama`.
- Aku sedang di branch yang benar? → `git branch --show-current`.

---

## 5. Simulasi Merge: Cek Konflik Sebelum Merge Beneran

Skenario: kamu sudah lama kerja di `feat/login-page`, sementara teman sudah merge beberapa PR ke `dev`. Sebelum menggabungkan `dev` ke branchmu, kamu ingin tahu **bakal konflik atau tidak**.

> **Selalu `git fetch origin` dulu.** Simulasi memakai `origin/dev` yang ada di laptopmu. Kalau tidak di-fetch, hasilnya berdasarkan data lama.

### 5.1 Lihat dulu apa yang baru di `dev`

```bash
git fetch origin
git log --oneline HEAD..origin/dev      # commit di dev yang belum ada di branchmu
git diff --stat HEAD...origin/dev       # file apa yang berubah di dev
```

Kalau `git log` kosong, branchmu sudah mutakhir dan tidak ada yang perlu digabung.

### 5.2 Cara 1: `merge-tree` (paling aman)

Tidak mengubah file, tidak butuh working tree bersih, tidak ada yang perlu dibatalkan. Butuh **Git 2.38+** (cek dengan `git --version`).

```bash
git fetch origin
git merge-tree --write-tree --name-only HEAD origin/dev
echo $?
```

Cara membaca hasil:

| Hasil                                                                                                 | Artinya                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Hanya keluar satu baris (hash panjang), dan `echo $?` menampilkan `0`                                 | ✅ **Tidak ada konflik**                   |
| Keluar nama file dan pesan `CONFLICT (content): Merge conflict in ...`, dan `echo $?` menampilkan `1` | ❌ **Ada konflik** di file yang disebutkan |

Contoh hasil jika ada konflik (kurang lebih):

```
8c2f1a9d3b...
src/app/router.jsx

Auto-merging src/app/router.jsx
CONFLICT (content): Merge conflict in src/app/router.jsx
```

Di PowerShell, cek kode hasil dengan `$LASTEXITCODE`, bukan `$?`.

### 5.3 Cara 2: merge tanpa commit, lalu batalkan

Kalau Git-mu lebih lama dari 2.38, atau ingin lihat konfliknya langsung di editor.

```bash
# 1. Pastikan tidak ada perubahan menggantung
git status                         # harus "working tree clean"
                                   # kalau tidak: commit atau git stash dulu

# 2. Ambil terbaru
git fetch origin

# 3. Simulasi merge: tidak dibuat commit, tidak ada fast-forward
git merge --no-commit --no-ff origin/dev

# 4. Lihat hasilnya
git status
git diff --name-only --diff-filter=U   # daftar file yang konflik

# 5. BATALKAN simulasi, kembali ke kondisi semula
git merge --abort
```

Cara membaca langkah 3:

- `Automatic merge went well; stopped before committing as requested` → ✅ tidak ada konflik.
- `CONFLICT (content): Merge conflict in ...` → ❌ ada konflik.
- `Already up to date.` → tidak ada yang perlu digabung (dan `--abort` tidak perlu, karena memang tidak ada merge yang berjalan).

Setelah `git merge --abort`, branchmu **kembali persis seperti sebelum simulasi**.

### 5.4 Cara cepat: tebak file yang berpotensi bentrok

Konflik hanya terjadi di file yang diubah oleh **kedua** pihak. Daftar irisannya (Git Bash / Linux / Mac):

```bash
comm -12 \
  <(git diff --name-only origin/dev...HEAD | sort) \
  <(git diff --name-only HEAD...origin/dev | sort)
```

- Baris pertama: file yang **kamu** ubah sejak berpisah dari `dev`.
- Baris kedua: file yang **`dev`** ubah sejak berpisah darimu.
- Hasil: file yang diubah keduanya. **Itu kandidat konflik.** Kalau kosong, hampir pasti aman.

### 5.5 Simulasi terhadap `main`

Ganti `origin/dev` dengan `origin/main`. Dalam alur normal, **branch fitur hanya menggabungkan `dev`**. `main` hanya relevan kalau ada hotfix atau diminta ketua.

### 5.6 Simulasi untuk ketua: PR `dev` → `main`

Bisa dicek tanpa checkout apa pun:

```bash
git fetch origin
git merge-tree --write-tree --name-only origin/main origin/dev
echo $?
```

### 5.7 Setelah simulasi, lalu apa?

| Hasil simulasi                       | Langkah selanjutnya                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| ✅ Bersih                            | Merge beneran: `git merge origin/dev`, lalu jalankan `npm run build` dan tes |
| ❌ Ada konflik, bisa kamu selesaikan | Merge beneran, lalu selesaikan konflik (lihat `GIT_WORKFLOW.md` bagian 8)    |
| ❌ Ada konflik, kamu bingung         | Jangan merge dulu. Kirim daftar file konflik ke tim, minta bantuan           |

⚠️ Simulasi hanya mendeteksi **konflik teks**. Merge yang "bersih" tetap bisa merusak aplikasi (misalnya dua orang mengganti nama fungsi yang sama). Setelah merge sungguhan, selalu jalankan `npm run lint` dan `npm run build`, lalu coba di browser.

---

## 6. Alur Aman dari Awal sampai Push

```bash
# 1. Cek posisi
git branch --show-current

# 2. Ambil info terbaru dan buat branch dari origin/dev
git fetch origin
git switch -c feat/nama-tugas --no-track origin/dev

# 3. Kerja + commit kecil (cek branch dulu sebelum commit)
git branch --show-current
git status -sb
git add <file-atau-folder>
git commit -m "feat(scope): deskripsi singkat"

# 4. Sebelum push: ada yang baru di dev?
git fetch origin
git log --oneline HEAD..origin/dev

# 5. Kalau ada, simulasi dulu
git merge-tree --write-tree --name-only HEAD origin/dev

# 6. Merge beneran lalu tes
git merge origin/dev
npm run lint && npm run build

# 7. Cek branch terakhir kali, lalu push
git branch --show-current
git push -u origin feat/nama-tugas

# 8. Buka PR di GitHub: base = dev, compare = feat/nama-tugas
```

---

## 7. Situasi Umum dan Solusinya

### "Push ditolak: protected branch"

Kamu mencoba push langsung ke `dev`/`main`, atau commit-mu ada di sana.

```bash
git branch --show-current              # kalau dev/main, lanjut ke bawah
git switch -c feat/nama-tugas          # bawa commit-mu ke branch baru
git push -u origin feat/nama-tugas
# lalu kembalikan cermin:
git branch -f dev origin/dev           # (jalankan dari branch fitur)
```

### PR menunjukkan "This branch has conflicts"

Artinya `dev` berubah setelah kamu buka PR.

```bash
git fetch origin
git merge origin/dev
# selesaikan konflik kalau ada, lalu:
git push
```

PR ter-update otomatis.

### Branch fitur sudah di-merge (squash) tapi aku mau lanjut kerja

**Jangan lanjut di branch lama.** Karena PR di-_squash_, commit lamamu tidak ada di riwayat `dev`, dan git mengira semuanya perubahan baru, sehingga muncul konflik aneh.

```bash
git fetch origin
git switch -c feat/tugas-berikutnya --no-track origin/dev
```

### `git pull --ff-only` gagal

`dev` lokalmu menyimpang dari GitHub (biasanya ada commit nyasar). Karena `dev` hanya cermin:

```bash
git fetch origin
git reset --hard origin/dev
```

Kalau ragu commit itu penting, buat cadangan dulu (`git branch backup/dev-lama`).

### Aku lupa tadi di branch mana

```bash
git branch --show-current
git reflog -10
```

`reflog` menampilkan 10 aksi terakhir (pindah branch, commit, reset). Hampir semua kesalahan bisa ditelusuri dari sini.

### Reset terlanjur dan commit hilang

```bash
git reflog                      # cari hash commit sebelum reset
git branch pulih <hash>         # buat branch dari commit itu
```

---

## 8. Versi Fork (Kalau Suatu Saat Dipakai)

Dokumen ini ditulis untuk skenario **collaborator**: semua orang push ke repo yang sama (`origin`). Kalau temanmu memakai **fork**, ada dua remote:

| Remote     | Isi                | Dipakai untuk                             |
| ---------- | ------------------ | ----------------------------------------- |
| `origin`   | Fork milik temanmu | **Push** branch fitur                     |
| `upstream` | Repo aslimu        | **Ambil** `dev`/`main` terbaru, tujuan PR |

Setup sekali:

```bash
git remote add upstream <url-repo-asli>
git remote -v
```

Lalu semua command yang memakai `origin/dev` untuk mengambil `dev` terbaru diganti jadi `upstream/dev`:

```bash
git fetch upstream
git switch -c feat/nama-tugas --no-track upstream/dev      # buat branch
git merge-tree --write-tree --name-only HEAD upstream/dev  # simulasi
git branch -f dev upstream/dev                             # reset cermin
git push -u origin feat/nama-tugas                         # push ke fork sendiri
```

PR dibuka dari `fork-teman:feat/nama-tugas` menuju `repo-asli:dev`.

---

## 9. Istilah yang Sering Membingungkan

| Istilah        | Artinya                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `origin`       | Nama panggilan untuk repo di GitHub                                        |
| `dev`          | Branch `dev` **di laptopmu**                                               |
| `origin/dev`   | Salinan lokal dari `dev` **di GitHub**, diperbarui lewat `git fetch`       |
| `HEAD`         | Posisimu sekarang (biasanya ujung branch aktif)                            |
| `fetch`        | Mengambil info terbaru dari GitHub, **tidak** mengubah file kerjamu        |
| `pull`         | `fetch` + langsung menggabungkan ke branch aktif                           |
| `fast-forward` | Maju lurus mengikuti remote tanpa membuat commit merge                     |
| `reset --hard` | Memaksa branch dan file jadi sama dengan target, perubahan lain **hilang** |
| `tracking`     | "Pasangan" remote sebuah branch lokal (terlihat di `git branch -vv`)       |

---

## 10. Ringkasan

1. `main` dan `dev` lokal = **cermin**, jangan dipakai kerja.
2. **Cek branch** sebelum commit dan sebelum push: `git branch --show-current`.
3. Buat branch **dari `dev` (bukan `main`)** setelah `git fetch`: `git switch -c feat/x --no-track origin/dev`.
4. Cermin berantakan? **Reset**: `git reset --hard origin/dev`.
5. Sebelum menggabungkan `dev`, **simulasi dulu**: `git merge-tree --write-tree --name-only HEAD origin/dev`.
6. Setelah merge, **selalu** `npm run lint && npm run build`.
7. Branch yang sudah di-squash-merge **jangan dipakai lagi**, buat yang baru dari `origin/dev`.

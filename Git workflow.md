# Git Workflow Tim

Aturan tim untuk repo E-Absensi. Langkah kerja harian ada di [CONTRIBUTING.md](CONTRIBUTING.md), langkah membuat PR di [TUTORIAL_PR.md](TUTORIAL_PR.md), dan kebiasaan aman di [TIPS_BRANCH_PROTECTED.md](TIPS_BRANCH_PROTECTED.md).

---

## 1. Struktur Branch

- `main`: kode stabil, hanya diisi dari `dev` yang sudah teruji.
- `dev`: tempat semua fitur digabung sebelum masuk `main`.
- `feature/nama-fitur`: branch kerja untuk 1 fitur/tugas.
- `fix/nama-bug`: branch khusus perbaikan bug.

> ❌ **Jangan pernah push langsung ke `main` atau `dev`.** Semuanya lewat Pull Request.

Awalan lain dengan pola yang sama: `refactor/`, `style/`, `docs/`, `chore/`.

Aturan nama: huruf kecil, pakai tanda `-`, tanpa spasi. Contoh: `feature/login-page`, `fix/otp-timer`.

## 2. Alur Singkat

```
feature/nama-fitur  ──PR──▶  dev  ──PR (oleh ketua)──▶  main
```

- Branch kerja **selalu dibuat dari `dev`**, bukan dari `main`.
- `main` dan `dev` di laptop hanya cermin dari GitHub, bukan tempat kerja.

## 3. Format Commit

```
<tipe>: <deskripsi singkat>
```

| Tipe       | Dipakai untuk                       |
| ---------- | ----------------------------------- |
| `feat`     | Fitur baru                          |
| `fix`      | Perbaikan bug                       |
| `docs`     | Dokumentasi saja                    |
| `style`    | Format/tampilan, tanpa ubah logic   |
| `refactor` | Merapikan kode tanpa ubah fungsi    |
| `chore`    | Pendukung (dependency, config, dll) |

Contoh:

```
feat: tambah halaman login
fix: perbaiki validasi input email
docs: update cara instalasi di README
```

Tulis kata kerja di awal (_tambah, perbaiki, hapus, rapikan_) dan jelaskan **apa** yang berubah. Hindari `update` atau `fix` saja.

## 4. Aturan Pull Request

- Tujuan PR selalu **`dev`**, judulnya memakai format commit.
- **Satu PR = satu tugas**, usahakan di bawah 400 baris.
- Minimal **1 approval**. **Jangan merge PR sendiri** sebelum di-approve.
- Merge ke `dev` pakai **Squash and merge** (judul PR jadi pesan commit di `dev`).
- Setelah di-merge, branchnya **jangan dipakai lagi**. Tugas berikutnya pakai branch baru.
- Template deskripsi PR ada di [TUTORIAL_PR.md](TUTORIAL_PR.md).

**Yang dicek reviewer:**

- Tujuan PR ke `dev`, isinya sesuai tugas, tidak ada file nyasar
- Nama variabel/fungsi jelas, tidak ada kode dobel
- Tidak ada `console.log`, kode yang dikomentari, atau file `.env`
- Tampilan sesuai desain (kalau ada perubahan UI)

Kritik **kodenya**, bukan orangnya. Review secepatnya supaya PR tidak menggantung.

## 5. Cara Menghindari Conflict

- Kerjakan file di bagianmu sendiri. Mau edit file shared (routing, `package.json`, konstanta)? **Kabari grup dulu.**
- Commit kecil dan sering.
- Gabungkan `dev` terbaru ke branchmu **sebelum push**.
- Jangan format ulang seluruh file di PR fitur.
- Selesaikan PR dalam 1-2 hari. Branch yang hidup berminggu-minggu hampir pasti bentrok.

Sudah terlanjur bentrok? Lihat _Situasi 5_ di [TIPS_BRANCH_PROTECTED.md](TIPS_BRANCH_PROTECTED.md).
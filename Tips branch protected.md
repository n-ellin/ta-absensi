# Panduan Git Singkat untuk Tim (Versi Mudah)

Kamu cuma perlu paham **1 ide** dan **4 situasi**. Semua command tinggal copy-paste.

---

## Ide Utamanya

Bayangkan tugas kelompok:

| Di dunia nyata | Di Git |
|---|---|
| **Dokumen asli** | **GitHub** (nama panggilannya `origin`) |
| Versi final yang sudah rapi | Branch `main` |
| Versi yang sedang dikerjakan bareng | Branch `dev` |
| **Fotokopi** dokumen asli di laptopmu | `main` dan `dev` **di laptopmu** |
| **Kertas coretan** milikmu sendiri | Branch buatanmu, misal `feat/login-page` |

Jadi:
- Fotokopi (`main` dan `dev` di laptop) **hanya untuk dilihat**. Jangan dicoret-coret.
- Semua kerjaanmu ditulis di **kertas coretan** (branch buatanmu).
- Kalau sudah selesai, kerjaanmu dikirim ke `dev` lewat **Pull Request (PR)**.

---

## 4 Aturan

1. ❌ Jangan kerja di `main` atau `dev`.
2. ✅ Cek dulu kamu di branch mana, **sebelum commit dan sebelum push**.
3. ✅ Ambil kondisi terbaru GitHub sebelum mulai tugas baru.
4. ✅ Branch baru **selalu dibuat dari `dev`**, bukan dari `main`.

---

## Langkah Awal: Ambil Repo ke Laptop (Sekali Saja)

Ada 2 pilihan, **pilih salah satu**. Cara kerja setelahnya sama persis.

| | Pilihan A: Ambil semua | Pilihan B: Hanya `ta-absensi-dev` |
|---|---|---|
| Cocok untuk | Kamu mau melihat atau mengedit dokumentasi (`docs/`) di laptop | Kamu cuma mau fokus ngoding, laptop lebih ringan |
| Yang muncul di laptop | Semua folder, termasuk `docs/` | Folder `ta-absensi-dev` + file di luar folder (`readme.md`, `CONTRIBUTING.md`) |
| Tingkat kesulitan | Paling mudah | Ada 1 command tambahan |

**Pilihan A: ambil semua**

```bash
git clone <url-repo>
cd <nama-repo>
```

**Pilihan B: hanya `ta-absensi-dev`**

```bash
git clone --filter=blob:none --sparse <url-repo>
cd <nama-repo>
git sparse-checkout set ta-absensi-dev
```

Catatan:
- Ganti `<url-repo>` dengan link repo (tombol hijau **Code** di GitHub), dan `<nama-repo>` dengan nama folder yang terbentuk setelah clone.
- Pilih B **tidak menghapus** folder `docs/` dari GitHub. Folder itu cuma tidak ditampilkan di laptopmu, dan tetap bisa dibaca di github.com kapan saja.
- Berubah pikiran? Jalankan `git sparse-checkout add docs` (untuk menampilkan `docs/`) atau `git sparse-checkout disable` (kembali jadi ambil semua).
- Kalau Pilihan B error, kemungkinan Git-mu terlalu lama. Cek dengan `git --version`, disarankan versi 2.37 atau lebih baru.
- Aplikasinya ada di dalam folder `ta-absensi-dev`. Sebelum `npm install` atau `npm run dev`, jalankan dulu `cd ta-absensi-dev`. Command `git` bisa dijalankan dari mana saja di dalam repo.

---

## Situasi 1: Mau Mulai Tugas Baru

> ⚠️ **Branch baru selalu dibuat dari `dev`, bukan dari `main`.**
> PR-mu nanti menuju `dev`, jadi branchmu harus berangkat dari `dev` yang terbaru.
> Dua baris di bawah ini sudah otomatis mengambil dari `dev`, jadi tinggal copy-paste.

Copy 2 baris ini, ganti `feat/nama-tugas` dengan nama tugasmu (contoh: `feat/login-page`):

```bash
git fetch origin
git switch -c feat/nama-tugas --no-track origin/dev
```

Artinya: *"ambil yang terbaru dari GitHub, lalu buat kertas coretan baru dari `dev` yang paling baru."*

Saat pertama kali push, pakai:

```bash
git push -u origin feat/nama-tugas
```

---

## Situasi 2: Cek Aku Lagi di Branch Mana

```bash
git branch --show-current
```

Hasilnya harus **nama branch fiturmu**.

> 🛑 Kalau tulisannya `main` atau `dev` → **berhenti**, jangan commit dan jangan push.

Lakukan ini setiap:
- sebelum `git commit`
- sebelum `git push`
- setelah pindah branch
- setiap pagi sebelum mulai kerja

Tips: di VS Code, nama branch terlihat di **pojok kiri bawah**. Biasakan melirik ke situ.

---

## Situasi 3: Mau Push, Takut Bentrok (Conflict)

**Bentrok** = kamu dan temanmu mengubah baris yang sama di file yang sama.

Kamu bisa **mencoba menggabungkan dulu lalu langsung membatalkannya**. Tidak ada yang rusak, ini cuma untuk mengintip hasilnya.

**Syarat:** semua perubahanmu sudah di-commit. Cek dengan `git status`, harus ada tulisan *"nothing to commit, working tree clean"*.

Jalankan satu per satu:

```bash
git fetch origin
git merge --no-commit --no-ff origin/dev
git status
git merge --abort
```

Lihat hasil dari baris ke-2 (`git merge ...`):

| Tulisan yang muncul | Artinya |
|---|---|
| `Automatic merge went well` | ✅ **Aman**, tidak bentrok |
| `CONFLICT ... Merge conflict in <nama file>` | ❌ **Bentrok** di file itu |
| `Already up to date` | ✅ Tidak ada yang perlu digabung. Error di baris terakhir (`--abort`) boleh diabaikan |

Baris terakhir (`git merge --abort`) = **membatalkan percobaan**. Branchmu kembali persis seperti semula.

**Setelah itu:**
- ✅ Aman → gabungkan beneran: `git merge origin/dev`, lalu cek aplikasi masih jalan (`npm run build`).
- ❌ Bentrok → **jangan panik**. Kabari tim/ketua dan kirim nama file yang bentrok. Cara menyelesaikannya ada di `GIT_WORKFLOW.md` bagian 8.

> Mau cek terhadap `main`? Ganti `origin/dev` jadi `origin/main`. Tapi ini jarang dipakai, biasanya cukup `dev`.

---

## Situasi 4: `main` / `dev` di Laptop Berantakan, Mau Disamakan Lagi dengan GitHub

Ingat: `main` dan `dev` di laptop itu cuma fotokopi, jadi **aman ditimpa** dengan yang asli.

Jalankan saat kamu sedang di **branch fiturmu** (bukan di `dev`/`main`):

```bash
git fetch origin
git branch -f dev origin/dev
git branch -f main origin/main
```

Artinya: *"timpa fotokopi `dev` dan `main` dengan dokumen aslinya."* Setelah ini, `dev` dan `main` di laptopmu **100% sama** dengan GitHub.

**Kalau muncul error** tentang *"cannot force update the current branch"*, berarti kamu sedang berada di `dev` atau `main`. Pindah dulu ke branch fiturmu:

```bash
git switch feat/nama-tugas
```

lalu ulangi 3 baris di atas.

**Kalau kamu memang sedang di `dev` dan tidak punya branch lain**, pakai ini:

```bash
git fetch origin
git reset --hard origin/dev
```

⚠️ Command ini **menghapus** semua perubahan di `dev` yang belum ada di GitHub. Aman kalau kamu yakin tidak pernah mengerjakan apa-apa di `dev`.

---

## Kalau Muncul Masalah Ini

| Yang kamu lihat | Artinya | Yang dilakukan |
|---|---|---|
| Push ditolak, ada tulisan **protected branch** | Kamu mencoba push langsung ke `dev`/`main` | 1. `git switch -c feat/nama-tugas` (kerjaanmu ikut terbawa)<br>2. `git push -u origin feat/nama-tugas`<br>3. Buka PR di GitHub<br>4. Samakan `dev` lagi dengan **Situasi 4** |
| Di PR ada tulisan **"This branch has conflicts"** | `dev` berubah setelah kamu buka PR | `git fetch origin` → `git merge origin/dev` → selesaikan bentrok → `git push` |
| Lupa lagi di branch mana | | `git branch --show-current` |

---

## Setelah PR Kamu Di-merge

**Jangan pakai branch lama lagi.** Mulai dari **Situasi 1** dengan nama branch baru.

Alasannya: kalau branch lama dipakai lagi, Git bisa menganggap kerjaan lamamu sebagai perubahan baru dan memunculkan bentrok yang aneh.

---

## Contekan

| Mau apa | Command |
|---|---|
| Cek branch | `git branch --show-current` |
| Mulai tugas baru (dari `dev`) | `git fetch origin` lalu `git switch -c feat/nama --no-track origin/dev` |
| Intip bentrok | `git fetch origin` → `git merge --no-commit --no-ff origin/dev` → `git status` → `git merge --abort` |
| Samakan `dev`/`main` dengan GitHub | `git fetch origin` → `git branch -f dev origin/dev` → `git branch -f main origin/main` |
| Push pertama kali | `git push -u origin feat/nama` |

Penjelasan yang lebih dalam (cara lain, istilah Git, kasus fork) ada di `TIPS_BRANCH_PROTECTED_LENGKAP.md`.
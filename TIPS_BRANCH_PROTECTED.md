# Tips Kerja di Repo dengan Branch Terproteksi

Cukup paham **1 ide** dan **5 situasi**. Semua command tinggal copy-paste.
Belum punya repo di laptop? Lihat [readme.md](readme.md). Aturan tim ada di [GIT_WORKFLOW.md](GIT_WORKFLOW.md).

---

## Ide Utamanya

Bayangkan tugas kelompok:

- **GitHub** = dokumen asli.
- **`main` dan `dev` di laptopmu** = fotokopi dokumen asli. Hanya untuk dilihat, jangan dicoret-coret.
- **Branch buatanmu** (misal `feature/login-page`) = kertas coretan. Semua kerjaanmu di sini, lalu dikirim ke `dev` lewat **Pull Request (PR)**.

## 4 Aturan

1. ❌ Jangan kerja di `main` atau `dev`.
2. ✅ Cek branch **sebelum commit dan sebelum push**.
3. ✅ Ambil kondisi terbaru GitHub sebelum mulai tugas baru.
4. ✅ Branch baru **selalu dari `dev`**, bukan dari `main`.

---

## Situasi 1: Mau Mulai Tugas Baru

Ganti `feature/nama-tugas` dengan nama tugasmu:

```bash
git fetch origin
git switch -c feature/nama-tugas --no-track origin/dev
```

Artinya: ambil yang terbaru dari GitHub, lalu buat branch baru dari `dev` yang paling baru. Push pertama kali pakai `git push -u origin feature/nama-tugas`.

## Situasi 2: Cek Aku Lagi di Branch Mana

```bash
git branch
```

Cari tanda **`*`** (biasanya hijau), itu branch yang aktif:

```
  dev
* feature/login-page      ← kamu di sini
  main
```

> 🛑 Kalau tanda `*` ada di `main` atau `dev`, **berhenti**. Jangan commit dan jangan push.

Cek setiap: sebelum commit, sebelum push, setelah pindah branch, dan tiap pagi. Di VS Code, nama branch juga terlihat di **pojok kiri bawah**. Kalau layar berubah jadi mode baca, tekan `q`.

## Situasi 3: Takut Bentrok, Mau Mengintip Dulu

**Bentrok** = kamu dan temanmu mengubah baris yang sama di file yang sama. Kamu bisa mencoba menggabungkan lalu langsung membatalkannya. Syaratnya semua perubahanmu sudah di-commit (`git status` bilang _working tree clean_).

```bash
git fetch origin
git merge --no-commit --no-ff origin/dev
git status
git merge --abort
```

| Tulisan hasil `git merge`     | Artinya                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| `Automatic merge went well`   | ✅ Aman                                                               |
| `CONFLICT ... in <nama file>` | ❌ Bentrok di file itu                                                |
| `Already up to date`          | ✅ Tidak ada yang perlu digabung (error di `--abort` boleh diabaikan) |

`git merge --abort` membatalkan percobaan, branchmu kembali seperti semula. Kalau aman, gabungkan beneran dengan `git merge origin/dev`. Kalau bentrok, lanjut ke Situasi 5.

## Situasi 4: `main` / `dev` di Laptop Berantakan

`main` dan `dev` di laptop cuma fotokopi, jadi aman ditimpa dengan yang asli. Jalankan dari **branch fiturmu**:

```bash
git fetch origin
git branch -f dev origin/dev
git branch -f main origin/main
```

Error _"cannot force update the current branch"_? Artinya kamu sedang di `dev`/`main`. Pindah dulu: `git switch feature/nama-tugas`, lalu ulangi.

Kalau memang sedang di `dev` dan tidak punya branch lain:

```bash
git fetch origin
git reset --hard origin/dev
```

⚠️ Ini **menghapus** semua perubahan di `dev` yang belum ada di GitHub.

## Situasi 5: Bentrok Beneran, Cara Menyelesaikannya

Muncul setelah `git merge origin/dev` dengan tulisan `CONFLICT`.

1. `git status`, file di bawah _Unmerged paths_ adalah yang bentrok.
2. Buka file itu di VS Code. Cari tanda ini:
   ```
   <<<<<<< HEAD
   (kode kamu)
   =======
   (kode dari dev)
   >>>>>>> origin/dev
   ```
3. Pilih kode yang dipakai (VS Code punya tombol _Accept Current / Incoming / Both_). Seringnya **keduanya** perlu dipertahankan. Pastikan semua tanda `<<<`, `===`, `>>>` sudah terhapus.
4. Jalankan aplikasinya, pastikan tidak error.
5. Selesaikan:
   ```bash
   git add nama-file-yang-bentrok
   git commit
   git push
   ```

Bingung dan mau mulai dari awal? `git merge --abort`, lalu kabari tim.

---

## Kalau Muncul Masalah Ini

| Yang kamu lihat                                | Yang dilakukan                                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Push ditolak, ada tulisan **protected branch** | `git switch -c feature/nama-tugas` (kerjaanmu ikut terbawa) → `git push -u origin feature/nama-tugas` → buka PR → samakan `dev` lagi (Situasi 4) |
| PR bertuliskan **"This branch has conflicts"** | `git fetch origin` → `git merge origin/dev` → selesaikan bentrok (Situasi 5) → `git push`                                                        |
| Salah commit di `dev`/`main`, belum push       | `git switch -c feature/nama-tugas`, lalu samakan `dev` lagi (Situasi 4)                                                                          |
| Mau pindah branch tapi kerjaan belum selesai   | `git stash -u`, pindah branch, nanti balik dan `git stash pop`                                                                                   |
| File `.env` ikut ter-commit                    | Kabari ketua, `git rm --cached .env`, pastikan ada di `.gitignore`, dan **ganti token/password-nya**                                             |

## Setelah PR Kamu Di-merge

**Jangan pakai branch lama lagi.** Mulai dari Situasi 1 dengan nama branch baru. Kalau branch lama dipakai, Git menganggap kerjaan lamamu sebagai perubahan baru dan memunculkan bentrok yang aneh.

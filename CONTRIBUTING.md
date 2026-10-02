# Contributing Guide

## Sebelum Mulai

1. Cek dulu apakah ada issue/task yang sudah ada untuk fitur yang mau kamu kerjakan

## Langkah Kontribusi

1. `git pull origin dev, `pastikan branch dev kamu paling baru.

2. Buat branch baru: `feature/nama-fitur.`

3. Test dulu sebelum push.

4. Commit dengan format: `feat: .. fix: .. (contoh format, format lengkap ada di GIT\_WORKFLOW.md)`

5. Push branch kamu dan buka Pull Request ke `dev`.

6. Setelah di-approve, merge PR.

## Aturan Kode

- Ikuti struktur folder yang sudah ada, jangan bikin folder baru sembarangan.

- Kasih nama variabel/fungsi yang jelas.

- Kalau nambah fitur baru, kasih komentar singkat kalau logic-nya cukup kompleks.

- Jangan commit file yang seharusnya di-ignore (`.env`, `build/`, dll) cek `.gitignore` dulu.


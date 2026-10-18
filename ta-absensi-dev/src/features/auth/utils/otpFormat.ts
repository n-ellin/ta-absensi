/**
 * Samarkan surel untuk layar verifikasi, mengikuti PRD: "k*****@gmail.com".
 * Huruf pertama + 5 bintang tetap, sehingga panjang surel asli tidak terlihat.
 * (Contoh di Figma menulis "*k@gmail.com"; PRD yang dipakai karena itu spesifikasinya.)
 */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  return `${email[0]}*****${email.slice(at)}`;
}

/** 58 -> "00:58" */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

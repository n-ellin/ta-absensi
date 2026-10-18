import type { ReactNode } from "react";
import eAbsensiLogo from "@/assets/e-absensi-logo.svg";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-vh-100 d-flex bg-white">
      {/* Panel kiri: branding (disembunyikan di layar kecil) */}
      <aside
        className="d-none d-lg-flex flex-column align-items-center justify-content-between text-center p-5"
        style={{
          flex: "0 0 40%",
          background: "#E8E3E8",
          color: "#282333",
        }}
      >
        {/* Pengisi supaya logo berada di tengah */}
        <div aria-hidden="true" />

        <div>
          <img
            src={eAbsensiLogo}
            alt=""
            height={180}
            className="d-block mx-auto mb-3"
          />
          <h2 className="fw-bold mb-0">E-Absensi SMK</h2>
        </div>

        <div className="mx-auto" style={{ maxWidth: 340 }}>
          <h3 className="h5 fw-bold">
            Presensi Lebih Mudah untuk Sekolah yang Lebih Baik
          </h3>
          <p className="small mb-0" style={{ color: "#514857" }}>
            Disiplin hari ini, untuk masa depan yang lebih baik.
          </p>
        </div>
      </aside>

      {/* Panel kanan: konten (form tanpa kartu) */}
      <main
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 p-md-5"
        style={{ minWidth: 0 }}
      >
        {/* Brand ringkas: hanya tampil di layar kecil (panel kiri disembunyikan) */}
        <div className="d-lg-none text-center mb-4">
          <img
            src={eAbsensiLogo}
            alt=""
            height={56}
            className="d-block mx-auto mb-2"
          />
          <h2 className="h5 fw-bold mb-0">E-Absensi SMK</h2>
          <p className="text-secondary small text-uppercase mb-0">
            SMK Negeri 2 Singosari
          </p>
        </div>

        <div className="w-100" style={{ maxWidth: 400 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

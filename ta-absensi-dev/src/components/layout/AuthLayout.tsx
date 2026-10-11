import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import schoolIllustration from "@/assets/school-illustration.svg";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Panel kiri: branding (disembunyikan di layar kecil) */}
        <aside className="col-lg-5 col-xl-4 d-none d-lg-flex flex-column align-items-center justify-content-between text-center text-white bg-dark p-5">
          <div>
            <div className="bg-white bg-opacity-10 rounded-4 d-inline-flex p-3 mb-3">
              <GraduationCap size={28} />
            </div>
            <h2 className="h4 fw-bold mb-1">E- Absensi SMK</h2>
          </div>

          <img
            src={schoolIllustration}
            alt=""
            width={220}
            className="img-fluid"
          />

          <div className="mx-auto" style={{ maxWidth: 340 }}>
            <h3 className="h5 fw-bold">
              Presensi Lebih Mudah untuk Sekolah yang Lebih Baik
            </h3>
            <p className="text-white-50 small mb-0">
              Disiplin hari ini, untuk masa depan yang lebih baik.
            </p>
          </div>
        </aside>

        {/* Panel kanan: konten */}
        <main className="col-12 col-lg-7 col-xl-8 d-flex flex-column align-items-center justify-content-center bg-white p-3 p-sm-4">
          {/* Brand ringkas: hanya tampil di layar kecil (panel kiri disembunyikan) */}
          <div className="d-lg-none text-center mb-4">
            <div className="bg-dark text-white rounded-4 d-inline-flex p-3 mb-2">
              <GraduationCap size={24} />
            </div>
            <h2 className="h5 fw-bold mb-0">E- Absensi SMK</h2>
            <p className="text-secondary small text-uppercase mb-0">
              SMK Negeri 2 Singosari
            </p>
          </div>

          <div className="row w-100 justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-10 col-xl-8 col-xxl-6">
              <div className="card border-0 shadow rounded-4">
                <div className="card-body p-4 p-md-5">{children}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

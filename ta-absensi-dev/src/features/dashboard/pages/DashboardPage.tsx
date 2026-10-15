import { Link } from "react-router-dom";
import {
  GraduationCap,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function DashboardPage() {
  const { user } = useAuth();
  const { handleLogout, handleLogoutAll, isLoggingOut } = useLogout();

  return (
    <div className="min-h-screen bg-[#F5EFEF]">
      {/* Topbar */}
      <nav className="navbar bg-dark text-white px-3 px-md-4">
        <div className="container-fluid px-0">
          <span className="navbar-brand d-flex align-items-center gap-2 fw-bold mb-0 h5">
            <GraduationCap size={22} /> E-Absensi SMK
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="small text-white-50 d-none d-sm-inline">
              {user?.email}
            </span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-2"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                />
              ) : (
                <LogOut size={14} />
              )}
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-md-5">
        <div className="row g-4">
          {/* Kartu sapaan */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h1 className="h4 fw-bold mb-1">
                  Halo, {user?.name ?? "Pengguna"}!
                </h1>
                <p className="text-secondary small mb-3">
                  Selamat datang di dasbor E-Absensi. Modul absensi belum
                  tersedia — halaman ini masih tempat kosong.
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {user?.roles?.length ? (
                    user.roles.map((role) => (
                      <span
                        key={role}
                        className="badge rounded-pill text-bg-dark text-capitalize"
                      >
                        {role.replace(/_/g, " ")}
                      </span>
                    ))
                  ) : (
                    <span className="badge rounded-pill text-bg-secondary">
                      tanpa peran
                    </span>
                  )}
                </div>

                <ul className="list-unstyled small text-secondary mb-0">
                  <li className="d-flex align-items-center gap-2 mb-1">
                    <UserRound size={14} />
                    {user?.email}
                    {user?.nisn ? ` · NISN ${user.nisn}` : ""}
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <ShieldCheck size={14} />
                    Status: {user?.is_active ? "Aktif" : "Nonaktif"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kartu pengaturan akun */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 d-grid gap-2">
                <h2 className="h6 fw-bold mb-1">Pengaturan akun</h2>
                <Link
                  to="/change-password"
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                >
                  <KeyRound size={15} /> Ganti Kata Sandi
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                  onClick={handleLogoutAll}
                  disabled={isLoggingOut}
                >
                  Keluar dari Semua Perangkat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

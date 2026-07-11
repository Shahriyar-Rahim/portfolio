import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  HiOutlineViewGrid,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlineChatAlt2,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBookmark
} from "react-icons/hi";
import { useLogout } from "../lib/hooks/useAuth";
import { useAuthStore } from "../lib/stores/authStore";
import ThemeToggle from "../components/ThemeToggle";

const NAV = [
  { to: "/admin", label: "Overview", icon: HiOutlineViewGrid, end: true },
  { to: "/admin/inbox", label: "Inbox", icon: HiOutlineMail },
  { to: "/admin/blogs", label: "Blog", icon: HiOutlineDocumentText },
  { to: "/admin/experience", label: "Experience", icon: HiOutlineBriefcase },
  { to: "/admin/education", label: "Education", icon: HiOutlineAcademicCap },
  { to: "/admin/services", label: "Services", icon: HiOutlineCube },
  { to: "/admin/hero-status", label: "Hero Status", icon: HiOutlineCube },
  { to: "/admin/testimonials", label: "Testimonials", icon: HiOutlineChatAlt2 },
  { to: "/admin/jobs", label: "Jobs", icon: HiOutlineBookmark },
  { to: "/admin/cv", label: "CV profile", icon: HiOutlineUserCircle },
  { to: "/admin/about", label: "About", icon: HiOutlineUserCircle },
  { to: "/admin/account", label: "Account", icon: HiOutlineUserCircle },
];

export default function AdminLayout() {
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink flex">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className="hidden md:flex w-64 flex-col border-r border-line bg-surface p-6">
        <div className="mb-10 flex items-center justify-between font-mono text-lg">
          <span><span className="text-copper">&gt;</span>admin</span>
          <div className="flex items-center gap-2"><ThemeToggle /><Link to="/" className="rounded border border-line px-2 py-1 text-xs text-ink-dim hover:border-copper hover:text-copper-soft">home</Link></div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                  isActive
                    ? "bg-copper/10 text-copper-soft"
                    : "text-ink-dim hover:bg-surface-raised hover:text-ink"
                }`
              }
            >
              <Icon className="text-base" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line pt-4 mt-4">
          <p className="font-mono text-xs text-ink-muted truncate mb-3">
            {user?.email}
          </p>
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-2 font-mono text-sm text-ink-dim hover:text-danger transition-colors"
          >
            <HiOutlineLogout /> logout
          </button>
        </div>
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface p-6 transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-lg text-copper">&gt;admin</span>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-1 text-ink-dim hover:bg-surface-raised hover:text-ink"
            onClick={() => setMobileOpen(false)}
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
                  isActive
                    ? "bg-copper/10 text-copper-soft"
                    : "text-ink-dim hover:bg-surface-raised hover:text-ink"
                }`
              }
            >
              <Icon className="text-base" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line pt-4 mt-4">
          <p className="font-mono text-xs text-ink-muted truncate mb-3">{user?.email}</p>
          <button
            onClick={() => {
              setMobileOpen(false);
              logout.mutate();
            }}
            className="flex items-center gap-2 font-mono text-sm text-ink-dim hover:text-danger transition-colors"
          >
            <HiOutlineLogout /> logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-line bg-surface px-4 py-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-md p-2 text-ink-dim hover:bg-surface-raised hover:text-ink"
            onClick={() => setMobileOpen(true)}
          >
            <HiOutlineMenu className="text-lg" />
          </button>
          <div className="flex items-center gap-2"><ThemeToggle /><Link to="/" className="font-mono text-xs text-copper">home</Link></div>
          <button
            onClick={() => logout.mutate()}
            className="font-mono text-xs text-ink-dim"
          >
            logout
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

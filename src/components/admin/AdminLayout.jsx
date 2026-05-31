import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Star, Images, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-display uppercase tracking-wider transition-all min-h-[48px] ${
    isActive
      ? 'bg-[#2F78F5] text-white'
      : 'text-[#888] hover:text-white hover:bg-white/5'
  }`;

function NavItems({ onNavigate }) {
  const linkProps = onNavigate ? { onClick: onNavigate } : {};

  return (
    <>
      <NavLink to="/admin/reviews" className={navClass} {...linkProps}>
        <Star size={18} /> Recensioni
      </NavLink>
      <NavLink to="/admin/gallery" className={navClass} {...linkProps}>
        <Images size={18} /> Galleria
      </NavLink>
    </>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut();
    navigate('/');
  };

  const pageTitle = location.pathname.includes('/gallery') ? 'Galleria' : 'Recensioni';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F2F2] flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0">
          <LayoutDashboard size={18} className="text-[#2F78F5] shrink-0" />
          <span className="font-display font-bold uppercase tracking-widest text-xs truncate">{pageTitle}</span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          aria-label="Apri menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={closeMenu}
            aria-label="Chiudi menu"
          />
          <aside className="absolute right-0 top-0 bottom-0 w-[min(100%,280px)] bg-[#0a0a0a] border-l border-white/10 flex flex-col p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="min-w-0">
                <span className="font-display font-bold uppercase tracking-widest text-sm">Dashboard</span>
                <p className="text-xs text-[#666] truncate mt-1">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 shrink-0"
                aria-label="Chiudi menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              <NavItems onNavigate={closeMenu} />
            </nav>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all min-h-[48px]"
              >
                <ExternalLink size={18} /> Vai al sito
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm text-[#888] hover:text-red-400 hover:bg-red-400/5 transition-all w-full text-left min-h-[48px]"
              >
                <LogOut size={18} /> Esci
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/10 flex-col p-6 shrink-0">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard size={20} className="text-[#2F78F5]" />
            <span className="font-display font-bold uppercase tracking-widest text-sm">Dashboard</span>
          </div>
          <p className="text-xs text-[#666] truncate">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItems />
        </nav>

        <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} /> Vai al sito
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#888] hover:text-red-400 hover:bg-red-400/5 transition-all w-full text-left"
          >
            <LogOut size={16} /> Esci
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/10 bg-[#050505]/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-[10px] font-display uppercase tracking-wider ${
              isActive ? 'text-[#2F78F5]' : 'text-[#666]'
            }`
          }
        >
          <Star size={20} />
          Recensioni
        </NavLink>
        <NavLink
          to="/admin/gallery"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-[10px] font-display uppercase tracking-wider ${
              isActive ? 'text-[#2F78F5]' : 'text-[#666]'
            }`
          }
        >
          <Images size={20} />
          Galleria
        </NavLink>
        <Link
          to="/"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-[10px] font-display uppercase tracking-wider text-[#666]"
        >
          <ExternalLink size={20} />
          Sito
        </Link>
      </nav>

      <main className="flex-1 overflow-auto min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}

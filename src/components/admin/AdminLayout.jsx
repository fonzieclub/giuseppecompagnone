import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Star, Images, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display uppercase tracking-wider transition-all ${
    isActive
      ? 'bg-[#2F78F5] text-white'
      : 'text-[#888] hover:text-white hover:bg-white/5'
  }`;

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F2F2] flex">
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 shrink-0">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard size={20} className="text-[#2F78F5]" />
            <span className="font-display font-bold uppercase tracking-widest text-sm">Dashboard</span>
          </div>
          <p className="text-xs text-[#666] truncate">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavLink to="/admin/reviews" className={navClass}>
            <Star size={16} /> Recensioni
          </NavLink>
          <NavLink to="/admin/gallery" className={navClass}>
            <Images size={16} /> Galleria
          </NavLink>
        </nav>

        <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} /> Vai al sito
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#888] hover:text-red-400 hover:bg-red-400/5 transition-all w-full text-left"
          >
            <LogOut size={16} /> Esci
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

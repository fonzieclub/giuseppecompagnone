import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function AdminAccessDenied() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest mb-4">
          Accesso negato
        </h1>
        {isAuthenticated ? (
          <>
            <p className="text-sm text-[#888] mb-2">
              Sei connesso come <span className="text-white">{user?.email}</span>, ma questo account non ha i permessi admin.
            </p>
            <p className="text-sm text-[#666] mb-8">
              In Supabase, esegui la query SQL per impostare <code className="text-[#2F78F5]">role = admin</code> sul tuo profilo, poi ricarica la pagina.
            </p>
          </>
        ) : (
          <p className="text-sm text-[#888] mb-8">
            Devi accedere con un account admin per moderare le recensioni.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {!isAuthenticated && (
            <Link
              to="/login?redirect=/admin/reviews"
              className="px-8 py-3 rounded-full bg-[#2F78F5] text-white font-display uppercase text-sm tracking-wider"
            >
              Accedi al dashboard
            </Link>
          )}
          <Link to="/" className="text-sm text-[#666] hover:text-[#2F78F5]">
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

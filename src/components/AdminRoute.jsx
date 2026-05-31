import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import AdminAccessDenied from '@/components/AdminAccessDenied';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
    <div className="w-8 h-8 border-4 border-white/20 border-t-[#2F78F5] rounded-full animate-spin" />
  </div>
);

export default function AdminRoute({ children, fallback = <DefaultFallback /> }) {
  const { isAuthenticated, isAdmin, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return fallback;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return children;
}

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Servizi from './pages/Servizi';
import ChiSono from './pages/ChiSono';
import Risultati from './pages/Risultati';
import Calcola from './pages/Calcola';
import MetodoPersonale from './pages/MetodoPersonale';
import MetodoOnline from './pages/MetodoOnline';
import Recensioni from './pages/Recensioni';
import Contatti from './pages/Contatti';
import Login from './pages/Login';
import AdminReviews from './pages/AdminReviews';

const AppRoutes = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-[#2F78F5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/chi-sono" element={<ChiSono />} />
        <Route path="/risultati" element={<Risultati />} />
        <Route path="/calcola" element={<Calcola />} />
        <Route path="/metodo-personale" element={<MetodoPersonale />} />
        <Route path="/metodo-online" element={<MetodoOnline />} />
        <Route path="/recensioni" element={<Recensioni />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviews />
            </AdminRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App

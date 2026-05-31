import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
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
import AuthCallback from './pages/AuthCallback';
import AdminReviews from './pages/admin/AdminReviews';
import AdminGallery from './pages/admin/AdminGallery';

const AppRoutes = () => (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="/admin/reviews" replace />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="gallery" element={<AdminGallery />} />
      </Route>

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
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
);


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

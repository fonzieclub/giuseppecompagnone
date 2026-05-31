import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLenis from '../hooks/useLenis';
import Navbar from './Navbar';
import Footer from './Footer';
import FilmGrain from './FilmGrain';

export default function Layout() {
  const [scrollY, setScrollY] = useState(0);
  useLenis(({ scroll }) => setScrollY(scroll));

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F2F2]">
      <FilmGrain />
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
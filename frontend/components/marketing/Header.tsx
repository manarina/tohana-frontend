// components/marketing/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🌾</span>
            <span className="font-bold text-xl text-green-700">Tohana</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="#contact"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <nav className="flex flex-col gap-3">
              <Link
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors px-4 py-2 hover:bg-green-50 rounded-lg"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors px-4 py-2 hover:bg-green-50 rounded-lg"
              >
                Comment ça marche
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors px-4 py-2 hover:bg-green-50 rounded-lg"
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-2 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors text-center"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors px-4 py-2 hover:bg-green-50 rounded-lg"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Commencer
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
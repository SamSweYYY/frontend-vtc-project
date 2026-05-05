import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAdmin, isClient } from '../types';

function Header() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const userName = user ? JSON.parse(user).prenom : '';
  const admin = isAdmin();
  const client = isClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const hasActiveReservation = localStorage.getItem('hasActiveReservation') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasActiveReservation');
    navigate('/Login');
  };

  const isActive = (path: string) => location.pathname === path;
  const navItem = (path: string) =>
    isActive(path)
      ? 'bg-white text-dark-900 shadow-sm'
      : 'text-slate-400 hover:text-white hover:bg-white/10';
  const mobileItem = (path: string) =>
    isActive(path)
      ? 'bg-white text-dark-900'
      : 'text-slate-300 hover:text-white hover:bg-white/10';

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/85 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[72px]">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-white text-dark-900 rounded-lg flex items-center justify-center shadow-[0_10px_30px_rgba(34,211,238,0.18)]">
              <span className="font-bold text-sm">VM</span>
            </div>
            <div className="leading-tight">
              <span className="block text-white font-semibold text-base tracking-tight">VTC Manager</span>
              <span className="hidden sm:block text-slate-500 text-[11px] uppercase tracking-[0.18em]">
                dispatch suite
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
            <Link to="/" className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition ${navItem('/')}`}>
              Tableau de bord
            </Link>
            {admin && (
              <Link
                to="/localisation"
                className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition ${navItem('/localisation')}`}
              >
                Localisation
              </Link>
            )}
            {client && (
              <>
                <Link
                  to="/reserver"
                  className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition ${navItem('/reserver')}`}
                >
                  Réserver
                </Link>
                <Link
                  to="/mes-reservations"
                  className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition relative ${navItem('/mes-reservations')}`}
                >
                  Mes réservations
                  {hasActiveReservation && (
                    <span className="absolute top-1.5 right-2 inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-full text-sm font-medium no-underline transition flex items-center gap-1.5 ${
                    isActive('/profile') ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {userName || 'Mon profil'}
                  {admin && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-gold-500/15 text-gold-400 rounded-full">
                      ADMIN
                    </span>
                  )}
                  {client && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/15 text-blue-300 rounded-full">
                      CLIENT
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/15 border-0 bg-transparent cursor-pointer"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="px-3 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 no-underline transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/SignUp"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-dark-900 hover:bg-gold-400 no-underline transition shadow-[0_10px_30px_rgba(34,211,238,0.18)]"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 bg-transparent border border-white/10 cursor-pointer"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium no-underline ${mobileItem('/')}`}
            >
              Tableau de bord
            </Link>
            {admin && (
              <Link
                to="/localisation"
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium no-underline ${mobileItem('/localisation')}`}
              >
                Localisation
              </Link>
            )}
            {client && (
              <>
                <Link
                  to="/reserver"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium no-underline ${mobileItem('/reserver')}`}
                >
                  Réserver
                </Link>
                <Link
                  to="/mes-reservations"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium no-underline relative ${mobileItem('/mes-reservations')}`}
                >
                  Mes réservations
                  {hasActiveReservation && (
                    <span className="absolute top-2.5 right-3 inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </Link>
              </>
            )}
            {token ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 no-underline"
                >
                  {userName || 'Mon profil'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/15 bg-transparent border-0 cursor-pointer"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 no-underline"
                >
                  Connexion
                </Link>
                <Link
                  to="/SignUp"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-gold-400 hover:text-gold-300 no-underline"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;

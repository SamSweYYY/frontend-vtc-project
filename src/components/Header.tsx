
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-900 border-b border-dark-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-gold-500 rounded-md flex items-center justify-center">
              <span className="text-dark-900 font-bold text-sm">V</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">VTC Manager</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition ${
              isActive('/') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
            }`}>
              Tableau de bord
            </Link>
            {admin && (
              <Link to="/localisation" className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition ${
                isActive('/localisation') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`}>
                Localisation
              </Link>
            )}
            {client && (
              <>
                <Link to="/reserver" className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition ${
                  isActive('/reserver') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}>
                  Réserver
                </Link>
                <Link to="/mes-reservations" className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition ${
                  isActive('/mes-reservations') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}>
                  Mes réservations
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition flex items-center gap-1.5 ${
                  isActive('/profile') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}>
                  {userName || 'Mon profil'}
                  {admin && <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-gold-500/20 text-gold-400 rounded">ADMIN</span>}
                  {client && <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded">CLIENT</span>}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-dark-700 border-0 bg-transparent cursor-pointer"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/Login" className="px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-dark-700 no-underline transition">
                  Connexion
                </Link>
                <Link to="/SignUp" className="px-4 py-2 rounded-md text-sm font-medium bg-gold-500 text-dark-900 hover:bg-gold-400 no-underline transition">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-dark-700 bg-transparent border-0 cursor-pointer"
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
              isActive('/') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
            }`}>Tableau de bord</Link>
            {admin && (
              <Link to="/localisation" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                isActive('/localisation') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`}>Localisation</Link>
            )}
            {client && (
              <>
                <Link to="/reserver" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  isActive('/reserver') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}>Réserver</Link>
                <Link to="/mes-reservations" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  isActive('/mes-reservations') ? 'bg-dark-600 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-dark-700'
                }`}>Mes réservations</Link>
              </>
            )}
            {token ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-dark-700 no-underline">
                  {userName || 'Mon profil'}
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-dark-700 bg-transparent border-0 cursor-pointer">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/Login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-dark-700 no-underline">Connexion</Link>
                <Link to="/SignUp" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gold-500 hover:text-gold-400 no-underline">Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;

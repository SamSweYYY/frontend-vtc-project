import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password) {
            setError('Tous les champs sont requis');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email invalide');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await axios.post(apiUrl('/Login'), { email, password });
            const { token, chauffeur } = response.data;
            localStorage.setItem('token', token || 'session-active');
            if (chauffeur) {
                localStorage.setItem('user', JSON.stringify(chauffeur));
            } else {
                localStorage.setItem('user', JSON.stringify({ email }));
            }
            navigate('/');
        } catch (err) {
            setError('Identifiants incorrects.');
            console.error('Erreur de connexion:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900">
            <Header />
            <div className="flex items-center justify-center min-h-[calc(100vh-72px)] py-12 px-4">
                <div className="w-full max-w-md bg-white/[0.045] border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-3">Espace sécurisé</p>
                        <h2 className="text-3xl font-semibold text-white">Connexion</h2>
                        <p className="text-slate-400 text-sm mt-1">Accédez à votre espace VTC Manager</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm"
                                placeholder="nom@exemple.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-1.5">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm"
                                placeholder="Votre mot de passe"
                            />
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-lg">{error}</div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-white text-dark-900 py-3 px-4 rounded-full text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                    <p className="text-slate-500 text-sm mt-6 text-center">
                        Pas de compte ?{' '}
                        <Link to="/SignUp" className="text-gold-400 hover:text-gold-500 no-underline font-medium">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

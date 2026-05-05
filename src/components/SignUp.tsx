import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, VehicleCategory } from '../types';
import { apiUrl } from '../utils/api';

type AccountType = 'client' | 'chauffeur';

const inputClass = "w-full px-3 py-2.5 bg-dark-700 border border-white/10 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm";

function SignUp() {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState<AccountType | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        telephone: '',
        vehicule: '',
        categorie: '' as VehicleCategory | '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const { nom, prenom, email, password, telephone } = formData;
        if (!accountType) {
            setError('Choisissez un type de compte');
            return false;
        }
        if (!nom || !prenom || !email || !password || !telephone) {
            setError('Tous les champs sont requis');
            return false;
        }
        if (accountType === 'chauffeur' && !formData.vehicule) {
            setError('Le vehicule est requis pour les chauffeurs');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email invalide');
            return false;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caracteres');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !accountType) return;
        setLoading(true);
        setError('');
        setSuccess('');

        const role = accountType === 'client' ? 'client' : 'user';
        const targetPath = accountType === 'client' ? '/reserver' : '/profile';

        try {
            const payload: Record<string, unknown> = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                password: formData.password,
                telephone: formData.telephone,
                role,
            };

            if (accountType === 'chauffeur') {
                payload.vehicule = formData.vehicule;
                if (formData.categorie) payload.categorie = formData.categorie;
            }

            const response = await axios.post(apiUrl('/chauffeurs'), payload);
            const createdUser = response.data?.chauffeur || response.data?.user || response.data || {};
            const token = response.data?.token || createdUser.token || 'session-active';

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                ...createdUser,
                nom: createdUser.nom || formData.nom,
                prenom: createdUser.prenom || formData.prenom,
                email: createdUser.email || formData.email,
                telephone: createdUser.telephone || formData.telephone,
                vehicule: createdUser.vehicule || formData.vehicule || undefined,
                categorie: createdUser.categorie || formData.categorie || undefined,
                role: createdUser.role || role,
                token,
            }));

            setSuccess('Compte cree. Redirection...');
            navigate(targetPath, { replace: true });
        } catch (err) {
            setError("Erreur lors de l'inscription.");
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900">
            <Header />
            <div className="flex items-center justify-center min-h-[calc(100vh-72px)] py-12 px-4">
                <div className="w-full max-w-lg bg-white/[0.045] border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-3">Creer un acces</p>
                        <h2 className="text-3xl font-semibold text-white">Inscription</h2>
                        <p className="text-slate-400 text-sm mt-2">Choisissez votre espace, puis vous serez redirige automatiquement.</p>
                    </div>

                    {!accountType ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300 font-medium">Je suis :</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAccountType('client')}
                                    className="p-5 bg-white/[0.045] border border-white/10 rounded-lg text-left hover:border-gold-500/40 hover:bg-white/[0.07] transition cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <p className="text-white font-semibold text-sm group-hover:text-gold-400">Client</p>
                                    <p className="text-slate-500 text-xs mt-1">Je veux reserver un VTC</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccountType('chauffeur')}
                                    className="p-5 bg-white/[0.045] border border-white/10 rounded-lg text-left hover:border-gold-500/40 hover:bg-white/[0.07] transition cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                                    </div>
                                    <p className="text-white font-semibold text-sm group-hover:text-gold-400">Chauffeur</p>
                                    <p className="text-slate-500 text-xs mt-1">Je gere mes courses</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <button type="button" onClick={() => setAccountType(null)} className="text-slate-400 text-sm hover:text-white bg-transparent border-0 cursor-pointer flex items-center gap-1 p-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    {accountType === 'client' ? 'Client' : 'Chauffeur'} - changer
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="nom" className="block text-slate-300 text-sm font-medium mb-1.5">Nom</label>
                                        <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} className={inputClass} placeholder="Dupont" />
                                    </div>
                                    <div>
                                        <label htmlFor="prenom" className="block text-slate-300 text-sm font-medium mb-1.5">Prenom</label>
                                        <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} className={inputClass} placeholder="Jean" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="nom@exemple.com" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-1.5">Mot de passe</label>
                                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="Min. 6 caracteres" />
                                </div>
                                <div>
                                    <label htmlFor="telephone" className="block text-slate-300 text-sm font-medium mb-1.5">Telephone</label>
                                    <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} className={inputClass} placeholder="06 12 34 56 78" />
                                </div>

                                {accountType === 'chauffeur' && (
                                    <>
                                        <div>
                                            <label htmlFor="vehicule" className="block text-slate-300 text-sm font-medium mb-1.5">Vehicule</label>
                                            <input type="text" id="vehicule" name="vehicule" value={formData.vehicule} onChange={handleChange} className={inputClass} placeholder="Mercedes Classe E" />
                                        </div>
                                        <div>
                                            <label htmlFor="categorie" className="block text-slate-300 text-sm font-medium mb-1.5">Categorie de service</label>
                                            <select id="categorie" name="categorie" value={formData.categorie} onChange={handleChange} className={inputClass}>
                                                <option value="">Selectionner une categorie</option>
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat.key} value={cat.key}>{cat.label} - {cat.description}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-lg">{error}</div>}
                                {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm p-3 rounded-lg">{success}</div>}

                                <button type="submit" disabled={loading} className={`w-full bg-white text-dark-900 py-3 px-4 rounded-full text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {loading ? 'Inscription...' : `S'inscrire comme ${accountType}`}
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-slate-500 text-sm mt-6 text-center">
                        Deja inscrit ?{' '}
                        <Link to="/Login" className="text-gold-400 hover:text-gold-500 no-underline font-medium">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;

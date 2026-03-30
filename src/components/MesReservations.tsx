import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Reservation, CATEGORIES, CATEGORY_COLORS, RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS, VehicleCategory } from '../types';
import { Link } from 'react-router-dom';

function MesReservations() {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

    useEffect(() => {
        if (!user?._id) return;
        axios.get(`http://localhost:3000/reservations/client/${user._id}`)
            .then(r => { setReservations(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleCancel = async (id: string) => {
        try {
            await axios.put(`http://localhost:3000/reservations/${id}`, { statut: 'annulee' });
            setReservations(prev => prev.map(r => r._id === id ? { ...r, statut: 'annulee' } : r));
        } catch {
            // silent
        }
    };

    const filtered = reservations.filter(r => {
        if (filter === 'active') return ['en_attente', 'confirmee', 'en_cours'].includes(r.statut);
        if (filter === 'past') return ['terminee', 'annulee'].includes(r.statut);
        return true;
    });

    const getCatLabel = (key: VehicleCategory) => CATEGORIES.find(c => c.key === key)?.label || key;

    if (!user || user.role !== 'client') {
        return (
            <div className="min-h-screen bg-dark-800">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <p className="text-slate-400">Accès réservé aux clients</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Mes réservations</h1>
                        <p className="text-slate-400 text-sm mt-1">{reservations.length} réservation{reservations.length > 1 ? 's' : ''}</p>
                    </div>
                    <Link to="/reserver"
                        className="px-4 py-2.5 bg-gold-500 text-dark-900 rounded-md text-sm font-semibold hover:bg-gold-400 transition no-underline text-center">
                        Nouvelle réservation
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-1 mb-6 bg-dark-700 rounded-lg p-1 w-fit">
                    {[
                        { key: 'all' as const, label: 'Toutes' },
                        { key: 'active' as const, label: 'En cours' },
                        { key: 'past' as const, label: 'Terminées' },
                    ].map(f => (
                        <button key={f.key} onClick={() => setFilter(f.key)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition border-0 cursor-pointer ${
                                filter === f.key
                                    ? 'bg-dark-500 text-white'
                                    : 'bg-transparent text-slate-400 hover:text-white'
                            }`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-16"><p className="text-slate-500 text-sm">Chargement...</p></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-dark-700 rounded-lg border border-dark-500/30">
                        <p className="text-slate-500 text-sm mb-3">Aucune réservation{filter !== 'all' ? ` ${filter === 'active' ? 'en cours' : 'terminée'}` : ''}</p>
                        <Link to="/reserver" className="text-gold-400 hover:text-gold-300 text-sm no-underline font-medium">Réserver un VTC</Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(res => {
                            const chauffeur = typeof res.chauffeurId === 'object' && res.chauffeurId ? res.chauffeurId : null;
                            const canCancel = ['en_attente', 'confirmee'].includes(res.statut);
                            return (
                                <div key={res._id} className="bg-dark-700 rounded-lg border border-dark-500/30 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${CATEGORY_COLORS[res.categorie]}`}>
                                            <span className="text-xs font-bold">{getCatLabel(res.categorie).charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-white font-medium text-sm">{res.depart}</p>
                                                    <div className="flex items-center gap-1.5 my-1">
                                                        <div className="w-3 h-px bg-slate-600" />
                                                        <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                        <div className="w-3 h-px bg-slate-600" />
                                                    </div>
                                                    <p className="text-white font-medium text-sm">{res.arrivee}</p>
                                                </div>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border flex-shrink-0 ${RESERVATION_STATUT_COLORS[res.statut]}`}>
                                                    {RESERVATION_STATUT_LABELS[res.statut]}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400">
                                                <span>{new Date(res.dateCourse).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className={`border rounded px-1.5 py-0.5 ${CATEGORY_COLORS[res.categorie]}`}>{getCatLabel(res.categorie)}</span>
                                                <span>{res.passagers} passager{res.passagers > 1 ? 's' : ''}</span>
                                                {res.prix && <span className="text-gold-400 font-semibold">{res.prix}€</span>}
                                            </div>
                                            {chauffeur && (
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Chauffeur : <span className="text-slate-300">{chauffeur.prenom} {chauffeur.nom}</span>
                                                    {chauffeur.vehicule && <span className="text-slate-600"> — {chauffeur.vehicule}</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {canCancel && (
                                        <div className="mt-3 pt-3 border-t border-dark-500/20 flex justify-end">
                                            <button onClick={() => handleCancel(res._id)}
                                                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-transparent border border-red-500/20 rounded-md cursor-pointer transition hover:bg-red-500/5">
                                                Annuler la réservation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MesReservations;

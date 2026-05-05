import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import { apiUrl } from '../utils/api';
import { CATEGORIES, Reservation } from '../types';

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function DriverHome() {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?._id;
    const driverCategory = user?.categorie;

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const fetchPendingReservations = useCallback(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        axios.get(apiUrl('/reservations'))
            .then(response => {
                setReservations(response.data);
                setError('');
            })
            .catch(() => setError('Impossible de charger les courses en attente.'))
            .finally(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        fetchPendingReservations();
        const refresh = window.setInterval(fetchPendingReservations, 12000);
        return () => window.clearInterval(refresh);
    }, [fetchPendingReservations]);

    const pendingReservations = useMemo(() => {
        return reservations.filter((reservation) => {
            const isPending = reservation.statut === 'en_attente';
            const categoryMatches = !driverCategory || reservation.categorie === driverCategory;
            return isPending && categoryMatches;
        });
    }, [reservations, driverCategory]);

    const handleAccept = async (reservationId: string) => {
        if (!userId) return;
        setAcceptingId(reservationId);
        setError('');

        try {
            await axios.put(apiUrl(`/reservations/${reservationId}`), {
                chauffeurId: userId,
                statut: 'confirmee',
            });
            setReservations(prev => prev.filter(reservation => reservation._id !== reservationId));
        } catch {
            setError("Impossible d'accepter cette course.");
        } finally {
            setAcceptingId(null);
        }
    };

    const categoryLabel = (key: string) => CATEGORIES.find(category => category.key === key)?.label || key;

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Espace Chauffeur</h1>
                        <p className="text-slate-400 text-sm mt-2">Bienvenue {user?.prenom}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchPendingReservations}
                            className="px-5 py-3 bg-white/10 text-white rounded-full border border-white/10 font-semibold hover:bg-white/15 transition cursor-pointer"
                        >
                            Actualiser
                        </button>
                        <Link to="/profile" className="px-6 py-3 bg-white text-dark-900 rounded-full font-semibold hover:bg-gold-400 transition no-underline text-center">
                            Mon profil
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Demandes ouvertes</p>
                        <p className="text-3xl font-bold text-gold-400 mt-2">{pendingReservations.length}</p>
                    </div>
                    <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Categorie</p>
                        <p className="text-3xl font-bold text-white mt-2">{driverCategory ? categoryLabel(driverCategory) : 'Toutes'}</p>
                    </div>
                    <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Rafraichissement</p>
                        <p className="text-3xl font-bold text-emerald-400 mt-2">12s</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-white mb-0">Courses en attente</h2>
                            <span className="text-xs text-slate-500">Depuis les reservations clients</span>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-lg">{error}</div>
                        )}

                        {loading ? (
                            <div className="text-slate-500 py-8 text-center">Chargement...</div>
                        ) : pendingReservations.length === 0 ? (
                            <div className="bg-dark-700 border border-dark-500/30 rounded-lg p-8 text-center">
                                <p className="text-slate-400 mb-1">Aucune course en attente pour le moment.</p>
                                <p className="text-slate-600 text-sm mb-0">Les nouvelles reservations client apparaitront ici automatiquement.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingReservations.map((reservation) => {
                                    const client = typeof reservation.clientId === 'object' ? reservation.clientId : null;
                                    return (
                                        <div key={reservation._id} className="bg-dark-700 border border-dark-500/30 rounded-lg p-5 hover:border-gold-500/30 transition">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-white">{reservation.depart} {'->'} {reservation.arrivee}</h3>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {formatDate(reservation.dateCourse)} · {reservation.passagers} passager{reservation.passagers > 1 ? 's' : ''}
                                                    </p>
                                                    {client && (
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            Client: <span className="text-slate-300">{client.prenom} {client.nom}</span>
                                                            {client.telephone && <span> · {client.telephone}</span>}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30 rounded-full w-fit">
                                                    En attente
                                                </span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
                                                <div className="flex flex-wrap gap-2 text-slate-400">
                                                    <span className="px-2.5 py-1 rounded-full bg-dark-800 border border-dark-500/30">{categoryLabel(reservation.categorie)}</span>
                                                    {reservation.prix && (
                                                        <span className="px-2.5 py-1 rounded-full bg-dark-800 border border-dark-500/30 text-gold-400">{reservation.prix} EUR</span>
                                                    )}
                                                    {reservation.note && (
                                                        <span className="px-2.5 py-1 rounded-full bg-dark-800 border border-dark-500/30">{reservation.note}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleAccept(reservation._id)}
                                                    disabled={acceptingId === reservation._id}
                                                    className="px-4 py-2 bg-white text-dark-900 rounded-full text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer disabled:opacity-50"
                                                >
                                                    {acceptingId === reservation._id ? 'Acceptation...' : 'Accepter'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
                        <div className="space-y-3">
                            <Link to="/profile" className="block w-full px-4 py-3 bg-dark-700 border border-dark-500/30 rounded-lg hover:border-gold-500/30 hover:bg-dark-600 transition text-sm font-medium text-white text-center no-underline">
                                Mettre a jour ma position
                            </Link>
                            <button
                                onClick={fetchPendingReservations}
                                className="w-full px-4 py-3 bg-dark-700 border border-dark-500/30 rounded-lg hover:border-gold-500/30 hover:bg-dark-600 transition text-sm font-medium text-white cursor-pointer"
                            >
                                Recharger les demandes
                            </button>
                        </div>

                        <div className="mt-6 bg-gold-500/10 border border-gold-500/20 rounded-lg p-4">
                            <p className="text-xs text-slate-300 leading-relaxed mb-0">
                                Les courses creees par les clients sont recuperees depuis l'API et filtrees selon votre categorie de vehicule.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DriverHome;

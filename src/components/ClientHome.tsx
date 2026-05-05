import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Driver } from '../types';
import { Link } from 'react-router-dom';
import { apiUrl } from '../utils/api';
import FleetMap from './FleetMap';

function isAvailableDriver(driver: Driver) {
    return driver.role !== 'client' && (driver.disponible || driver.statut === 'disponible');
}

function ClientHome() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(apiUrl('/chauffeurs'))
            .then(response => {
                setDrivers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false);
            });
    }, []);

    const availableDrivers = useMemo(() => drivers.filter(isAvailableDriver), [drivers]);

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Trouvez votre chauffeur</h1>
                        <p className="text-slate-400 text-sm mt-2">Les voitures visibles sur la carte sont disponibles maintenant.</p>
                    </div>
                    <Link to="/reserver" className="px-6 py-3 bg-white text-dark-900 rounded-full font-semibold hover:bg-gold-400 transition no-underline text-center">
                        Nouvelle reservation
                    </Link>
                </div>

                {loading ? (
                    <div className="h-[620px] rounded-xl border border-white/10 bg-dark-900 flex items-center justify-center">
                        <p className="text-slate-500">Chargement de la carte...</p>
                    </div>
                ) : (
                    <FleetMap
                        drivers={availableDrivers}
                        height={620}
                        title="Chauffeurs disponibles"
                        emptyMessage="Aucun chauffeur disponible pour le moment."
                    />
                )}
            </div>
        </div>
    );
}

export default ClientHome;

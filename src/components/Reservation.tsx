import { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CATEGORY_COLORS, VehicleCategory, CategoryInfo } from '../types';
import { apiUrl } from '../utils/api';

const inputClass = "w-full px-3 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm";

function CategoryIcon({ type, className }: { type: string; className?: string }) {
    if (type === 'car') return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 015.4 4h13.2a2 2 0 011.9 1.4L22 11M3 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-6M3 11h18" />
        </svg>
    );
    if (type === 'star') return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 4h8m-4 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
    );
}

function Reservation() {
    const navigate = useNavigate();
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const [selectedCat, setSelectedCat] = useState<VehicleCategory | null>(null);
    const [step, setStep] = useState<'choose' | 'form' | 'confirm'>('choose');
    const [formData, setFormData] = useState({
        depart: '',
        arrivee: '',
        dateCourse: '',
        passagers: 1,
        note: '',
    });
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
    const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [priceLoading, setPriceLoading] = useState(false);
    const [error, setError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!user || user.role !== 'client') {
        return (
            <div className="min-h-screen bg-dark-800">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <p className="text-white text-lg mb-2">Accès réservé aux clients</p>
                        <p className="text-slate-400 text-sm">Créez un compte client pour réserver un VTC</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSelectCategory = (cat: CategoryInfo) => {
        setSelectedCat(cat.key);
        setStep('form');
        setEstimatedPrice(null);
        setEstimatedDistance(null);
        setPriceError('');
    };

    const estimatePrice = async () => {
        if (!selectedCat || !formData.depart || !formData.arrivee) {
            setPriceError('Veuillez remplir les adresses de départ et arrivée');
            return;
        }

        setPriceLoading(true);
        setPriceError('');
        setEstimatedPrice(null);
        setEstimatedDistance(null);

        try {
            // Étape 1 : Géocoder l'adresse de départ via Nominatim
            const departRes = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.depart)}&format=json&limit=1`
            );
            const departData = await departRes.json();
            if (!departData || departData.length === 0) {
                setPriceError('Adresse de départ non trouvée. Essayez avec une adresse plus précise.');
                setPriceLoading(false);
                return;
            }
            const depLat = parseFloat(departData[0].lat);
            const depLon = parseFloat(departData[0].lon);

            // Étape 2 : Géocoder l'adresse d'arrivée via Nominatim
            const arriveeRes = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.arrivee)}&format=json&limit=1`
            );
            const arriveeData = await arriveeRes.json();
            if (!arriveeData || arriveeData.length === 0) {
                setPriceError('Adresse d\'arrivée non trouvée. Essayez avec une adresse plus précise.');
                setPriceLoading(false);
                return;
            }
            const arrLat = parseFloat(arriveeData[0].lat);
            const arrLon = parseFloat(arriveeData[0].lon);

            // Étape 3 : Appeler OSRM pour obtenir la distance réelle en mètres
            const osrmRes = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${depLon},${depLat};${arrLon},${arrLat}?overview=false`
            );
            const osrmData = await osrmRes.json();
            if (!osrmData.routes || osrmData.routes.length === 0) {
                setPriceError('Impossible de calculer la route. Vérifiez les adresses.');
                setPriceLoading(false);
                return;
            }

            // Étape 4 : Convertir la distance en km et calculer le prix réel
            const distanceMeters = osrmData.routes[0].distance;
            const distanceKm = distanceMeters / 1000;
            const cat = CATEGORIES.find(c => c.key === selectedCat)!;
            const finalPrice = Math.round(cat.prixBase + (distanceKm * cat.prixKm));

            setEstimatedDistance(Math.round(distanceKm * 10) / 10); // Arrondir à 1 décimale
            setEstimatedPrice(finalPrice);
            setPriceError('');
        } catch {
            setPriceError('Erreur lors du calcul. Vérifiez les adresses et réessayez.');
        } finally {
            setPriceLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCat || !formData.depart || !formData.arrivee || !formData.dateCourse) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(apiUrl('/reservations'), {
                clientId: user._id,
                categorie: selectedCat,
                depart: formData.depart,
                arrivee: formData.arrivee,
                dateCourse: formData.dateCourse,
                passagers: formData.passagers,
                note: formData.note || undefined,
            });
            // Enregistrer qu'une réservation active existe
            localStorage.setItem('hasActiveReservation', 'true');
            setSuccess(true);
            setStep('confirm');
        } catch {
            setError('Erreur lors de la réservation. Réessayez.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Progress steps */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {['Catégorie', 'Détails', 'Confirmation'].map((label, i) => {
                        const stepIndex = i;
                        const currentIndex = step === 'choose' ? 0 : step === 'form' ? 1 : 2;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                                    stepIndex <= currentIndex
                                        ? 'bg-gold-500 text-dark-900'
                                        : 'bg-dark-600 text-slate-500'
                                }`}>
                                    {stepIndex < currentIndex ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        stepIndex + 1
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${stepIndex <= currentIndex ? 'text-white' : 'text-slate-600'}`}>{label}</span>
                                {i < 2 && <div className={`w-12 h-px ${stepIndex < currentIndex ? 'bg-gold-500' : 'bg-dark-500'}`} />}
                            </div>
                        );
                    })}
                </div>

                {/* Step 1: Choose category */}
                {step === 'choose' && (
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold text-white">Choisissez votre véhicule</h1>
                            <p className="text-slate-400 text-sm mt-2">Sélectionnez la catégorie qui correspond à vos besoins</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => handleSelectCategory(cat)}
                                    className={`text-left p-6 rounded-xl border-2 transition-all bg-dark-700 hover:bg-dark-600 hover:scale-105 hover:shadow-lg cursor-pointer group relative ${
                                        selectedCat === cat.key
                                            ? 'border-gold-500 bg-gold-500/5'
                                            : 'border-dark-500/30 hover:border-dark-400/50'
                                    }`}
                                >
                                    {/* Badge "Recommandé" pour confort */}
                                    {cat.key === 'confort' && (
                                        <div className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                            Recommandé
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${CATEGORY_COLORS[cat.key]}`}>
                                        <CategoryIcon type={cat.icon} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{cat.label}</h3>
                                    <p className="text-slate-400 text-sm mb-3">{cat.description}</p>
                                    <div className="flex items-center justify-between">
                                        {/* Icône passager + nombre */}
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0H9m6 0a4 4 0 11-8 0 4 4 0 018 0zm-2 8v2h-4v-2m-4-8a3 3 0 106 0 3 3 0 00-6 0z" />
                                            </svg>
                                            <span className="text-xs text-slate-500">{cat.passengers}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gold-400 font-bold text-lg">{cat.prixBase}€</p>
                                            <p className="text-[11px] text-slate-500">+ {cat.prixKm}€/km</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Booking form */}
                {step === 'form' && selectedCat && (
                    <div className="max-w-lg mx-auto">
                        <div className="mb-6">
                            <button onClick={() => setStep('choose')} className="text-slate-400 text-sm hover:text-white bg-transparent border-0 cursor-pointer flex items-center gap-1 p-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Changer de catégorie
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-6 p-4 bg-dark-700 rounded-lg border border-dark-500/30">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[selectedCat]}`}>
                                <CategoryIcon type={CATEGORIES.find(c => c.key === selectedCat)!.icon} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{CATEGORIES.find(c => c.key === selectedCat)!.label}</p>
                                <p className="text-xs text-slate-500">À partir de {CATEGORIES.find(c => c.key === selectedCat)!.prixBase}€</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1.5">Lieu de départ</label>
                                <input
                                    type="text"
                                    value={formData.depart}
                                    onChange={e => setFormData({...formData, depart: e.target.value})}
                                    className={inputClass}
                                    placeholder="Ex: 15 rue de la Paix, Paris"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1.5">Destination</label>
                                <input
                                    type="text"
                                    value={formData.arrivee}
                                    onChange={e => setFormData({...formData, arrivee: e.target.value})}
                                    className={inputClass}
                                    placeholder="Ex: Aéroport CDG, Terminal 2"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Date & heure</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.dateCourse}
                                        onChange={e => setFormData({...formData, dateCourse: e.target.value})}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Passagers</label>
                                    <select
                                        value={formData.passagers}
                                        onChange={e => setFormData({...formData, passagers: Number(e.target.value)})}
                                        className={inputClass}
                                    >
                                        {[1,2,3,4,5,6,7].map(n => (
                                            <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1.5">Note pour le chauffeur <span className="text-slate-600">(optionnel)</span></label>
                                <textarea
                                    value={formData.note}
                                    onChange={e => setFormData({...formData, note: e.target.value})}
                                    className={inputClass + " resize-none"}
                                    rows={2}
                                    placeholder="Bagages volumineux, siège bébé..."
                                />
                            </div>

                            {/* Price estimate */}
                            {!estimatedPrice && !priceLoading && (
                                <button type="button" onClick={estimatePrice}
                                    className="w-full py-2 text-sm text-gold-400 hover:text-gold-300 bg-transparent border border-gold-500/20 rounded-md cursor-pointer transition">
                                    Estimer le prix
                                </button>
                            )}
                            {priceLoading && (
                                <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-4 text-center">
                                    <p className="text-sm text-gold-400 font-medium">Calcul en cours...</p>
                                </div>
                            )}
                            {priceError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-md">{priceError}</div>
                            )}
                            {estimatedPrice && (
                                <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs text-slate-400">Distance</p>
                                        <p className="text-sm font-semibold text-gold-400">{estimatedDistance} km</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400">Prix estimé</p>
                                        <p className="text-2xl font-bold text-gold-400">{estimatedPrice}€</p>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-2 text-center">Le prix final dépendra des conditions réelles</p>
                                </div>
                            )}

                            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-md">{error}</div>}

                            <button type="submit" disabled={loading}
                                className={`w-full bg-gold-500 text-dark-900 py-3 px-4 rounded-md text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 'confirm' && success && (
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">Réservation confirmée !</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            Votre demande a été enregistrée. Un chauffeur {CATEGORIES.find(c => c.key === selectedCat)?.label} vous sera assigné prochainement.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => navigate('/mes-reservations')}
                                className="px-5 py-2.5 bg-gold-500 text-dark-900 rounded-md text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer">
                                Voir mes réservations
                            </button>
                            <button onClick={() => { setStep('choose'); setSelectedCat(null); setSuccess(false); setEstimatedPrice(null); setEstimatedDistance(null); setPriceError(''); setFormData({ depart: '', arrivee: '', dateCourse: '', passagers: 1, note: '' }); }}
                                className="px-5 py-2.5 bg-dark-600 text-slate-300 rounded-md text-sm font-medium hover:bg-dark-500 transition border border-dark-500/50 cursor-pointer">
                                Nouvelle réservation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reservation;

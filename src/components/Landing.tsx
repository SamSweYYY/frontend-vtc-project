import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const vehicles = [
    {
        key: 'berline',
        label: 'Berline premium',
        short: 'Berline',
        image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=2200&q=82',
        meta: '1-3 passagers',
        line: 'La voiture actuelle, sobre et parfaite pour les trajets business.',
    },
    {
        key: 'van',
        label: 'Van business',
        short: 'Van',
        image: 'https://www.thecarexpert.co.uk/wp-content/uploads/2022/04/Original-47963-mercedes-vclass-0076-2133x1200-cropped.jpg',
        meta: '4-7 passagers',
        line: 'Plus de place pour les groupes, bagages et transferts aeroport.',
    },
    {
        key: 'crossover',
        label: 'Crossover urbain',
        short: 'Crossover',
        image: 'https://i.bstr.es/highmotor/2021/06/Toyota-Corolla-Touring-Sports-GR-Sport-2021-4-1220x853.jpg',
        meta: '1-4 passagers',
        line: 'Un style proche Toyota , compact, agile et moderne.',
    },
];

function Landing() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeVehicle = vehicles[activeIndex];

    const orbitVehicles = useMemo(() => {
        return vehicles.map((vehicle, index) => {
            const offset = (index - activeIndex + vehicles.length) % vehicles.length;
            return { ...vehicle, offset };
        });
    }, [activeIndex]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % vehicles.length);
        }, 5200);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-dark-900">
            <nav className="absolute top-0 left-0 right-0 z-20 bg-dark-900/45 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between min-h-[72px]">
                        <Link to="/" className="flex items-center gap-3 no-underline">
                            <div className="w-10 h-10 bg-white text-dark-900 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-sm">VM</span>
                            </div>
                            <div className="leading-tight">
                                <span className="block text-white font-semibold text-base tracking-tight">VTC Manager</span>
                                <span className="hidden sm:block text-slate-300 text-[11px] uppercase tracking-[0.18em]">dispatch suite</span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link to="/Login" className="px-3 py-2 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 no-underline transition">
                                Connexion
                            </Link>
                            <Link to="/SignUp" className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-dark-900 hover:bg-gold-400 no-underline transition">
                                S'inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="relative min-h-[86vh] flex items-end overflow-hidden">
                <img
                    key={activeVehicle.key}
                    src={activeVehicle.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover vehicle-hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/76 to-dark-900/18" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/12 to-dark-900/42" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 pt-32 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-10 items-end">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100 mb-5 backdrop-blur">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                Choisissez votre vehicule
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-[1.02]">
                                VTC Manager
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mb-8 leading-relaxed">
                                Faites tourner la selection autour du vehicule: berline premium, van business ou crossover urbain.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8 max-w-2xl">
                                {vehicles.map((vehicle, index) => (
                                    <button
                                        key={vehicle.key}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={`text-left rounded-lg border px-4 py-3 cursor-pointer ${
                                            activeIndex === index
                                                ? 'bg-white text-dark-900 border-white'
                                                : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                                        }`}
                                    >
                                        <span className="block text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
                                            {vehicle.short}
                                        </span>
                                        <span className="block text-sm font-semibold mt-1">{vehicle.meta}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/SignUp" className="px-6 py-3 bg-white text-dark-900 rounded-full text-center font-semibold hover:bg-gold-400 transition no-underline shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                                    Commencer
                                </Link>
                                <Link to="/Login" className="px-6 py-3 bg-white/10 text-white rounded-full border border-white/15 text-center font-semibold hover:bg-white/15 transition no-underline backdrop-blur">
                                    Se connecter
                                </Link>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="vehicle-orbit-ring" />
                            {orbitVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.key}
                                    className={`vehicle-orbit-chip vehicle-orbit-chip-${vehicle.offset}`}
                                >
                                    {vehicle.short}
                                </div>
                            ))}
                            <div className="relative rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl shadow-[0_28px_90px_rgba(0,0,0,0.36)]">
                                <div className="overflow-hidden rounded-lg bg-dark-900 aspect-[4/3]">
                                    <img
                                        key={`${activeVehicle.key}-panel`}
                                        src={activeVehicle.image}
                                        alt={activeVehicle.label}
                                        className="w-full h-full object-cover vehicle-panel-image"
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-2">Angle selectionne</p>
                                    <h2 className="text-2xl font-semibold text-white mb-2">{activeVehicle.label}</h2>
                                    <p className="text-sm text-slate-300 mb-0">{activeVehicle.line}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative bg-dark-900 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
                                L'histoire du site
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-semibold text-white leading-tight mb-6">
                                Une plateforme pensee pour remettre du calme dans chaque trajet.
                            </h2>
                            <p className="text-slate-400 text-base leading-relaxed mb-0">
                                VTC Manager est ne d'une idee simple: un service de transport doit etre aussi agreable a organiser
                                qu'a vivre. Le site rassemble la reservation, la disponibilite des chauffeurs et le suivi de flotte
                                dans une interface lisible, rapide, et faite pour les vraies journees de terrain.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="border-l border-white/15 pl-6">
                                <p className="text-xl sm:text-2xl text-white leading-relaxed mb-4">
                                    Ici, chaque detail a un role: aider le client a partir sereinement, aider le chauffeur a rester
                                    efficace, et donner a l'administrateur une vision claire sans bruit inutile.
                                </p>
                                <p className="text-slate-500 text-sm mb-0">
                                    Le resultat cherche moins l'effet spectaculaire que la confiance: une page qui respire, des actions
                                    evidentes, et une sensation premium sans lourdeur.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 border-y border-white/10">
                                {[
                                    { value: '24/7', label: 'Pret a reserver' },
                                    { value: '3', label: 'Gammes vehicules' },
                                    { value: '1', label: 'Espace unifie' },
                                ].map((item) => (
                                    <div key={item.label} className="py-5 pr-4">
                                        <p className="text-2xl sm:text-3xl font-semibold text-white mb-1">{item.value}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-[0.14em] mb-0">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-white mb-2">Notre cap</p>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-0">
                                        Construire une experience de mobilite qui donne envie de revenir: fluide, directe et humaine.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white mb-2">Notre ton</p>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-0">
                                        Premium, mais jamais froid. Organise, mais jamais complique.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900 border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-slate-500 text-sm">&copy; 2024 VTC Manager. Tous droits reserves.</p>
                </div>
            </div>
        </div>
    );
}

export default Landing;

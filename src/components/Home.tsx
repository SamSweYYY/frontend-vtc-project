import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DriverList from '../components/DriverList';
import { Driver, WeeklyStat, isAdmin, isLoggedIn, isClient, getStatutDisplay, CATEGORIES, CATEGORY_COLORS, Reservation, RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from '../types';
import AddDriver from './AddDriver';
import Header from './Header';
import UpdateDriver from './UpdateDriver';
import { Link } from 'react-router-dom';

// Fix Leaflet default icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const defaultCenter: [number, number] = [48.8566, 2.3522];

interface WeatherData {
    temp: number;
    desc: string;
    icon: string;
    city: string;
}

function Home() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [clientReservations, setClientReservations] = useState<Reservation[]>([]);

    const admin = isAdmin();
    const loggedIn = isLoggedIn();
    const client = isClient();
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const fetchDrivers = () => {
        axios.get('http://localhost:3000/chauffeurs')
            .then(response => setDrivers(response.data))
            .catch(error => console.error("Erreur:", error));
    };

    useEffect(() => {
        fetchDrivers();
        // Fetch weekly stats
        axios.get('http://localhost:3000/courses/stats/weekly')
            .then(r => setWeeklyStats(r.data))
            .catch(() => {});
        // Fetch weather (Paris default, free API)
        fetch('https://wttr.in/Paris?format=j1')
            .then(r => r.json())
            .then(data => {
                const curr = data.current_condition?.[0];
                if (curr) {
                    setWeather({
                        temp: parseInt(curr.temp_C),
                        desc: curr.lang_fr?.[0]?.value || curr.weatherDesc?.[0]?.value || '',
                        icon: curr.weatherIconUrl?.[0]?.value || '',
                        city: 'Paris',
                    });
                }
            })
            .catch(() => {});
        // Fetch client reservations
        if (user?._id && client) {
            axios.get(`http://localhost:3000/reservations/client/${user._id}`)
                .then(r => setClientReservations(r.data))
                .catch(() => {});
        }
    }, []);

    const handleUpdateClick = (driver: Driver) => {
        setSelectedDriver(driver);
        setShowModal(true);
    };
    const closeModal = () => { setSelectedDriver(null); setShowModal(false); };

    const driversWithLocation = drivers.filter(d => d.latitude && d.longitude);
    const availableCount = drivers.filter(d => d.disponible || d.statut === 'disponible').length;
    const enCourseCount = drivers.filter(d => d.statut === 'en_course').length;
    const unavailableCount = drivers.length - availableCount - enCourseCount;

    const totalRevWeek = useMemo(() => weeklyStats.reduce((s, d) => s + d.revenus, 0), [weeklyStats]);
    const totalCoursesWeek = useMemo(() => weeklyStats.reduce((s, d) => s + d.courses, 0), [weeklyStats]);

    // Search filter
    const filteredDrivers = useMemo(() => {
        if (!searchQuery.trim()) return drivers;
        const q = searchQuery.toLowerCase();
        return drivers.filter(d =>
            `${d.prenom} ${d.nom}`.toLowerCase().includes(q) ||
            d.vehicule.toLowerCase().includes(q) ||
            d.email.toLowerCase().includes(q) ||
            d.telephone.includes(q)
        );
    }, [drivers, searchQuery]);

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Title + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {admin ? 'Administration de la flotte VTC' : client ? 'Réservez votre chauffeur privé' : 'Vue d\'ensemble du réseau VTC'}
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Rechercher chauffeur, véhicule..."
                            className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition"
                        />
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <div className="bg-dark-700 rounded-lg p-4 border border-dark-500/30">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Chauffeurs</p>
                        <p className="text-2xl font-bold text-white mt-1">{drivers.length}</p>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4 border border-dark-500/30">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Disponibles</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{availableCount}</p>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4 border border-dark-500/30">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">En course</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">{enCourseCount}</p>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4 border border-dark-500/30">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Hors service</p>
                        <p className="text-2xl font-bold text-red-400 mt-1">{unavailableCount}</p>
                    </div>
                </div>

                {/* Two-column: Chart + Weather/Quick actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white">Activité — 7 derniers jours</h2>
                            <div className="flex gap-4 text-xs">
                                <span className="text-slate-400">
                                    <span className="text-white font-bold">{totalCoursesWeek}</span> courses
                                </span>
                                <span className="text-slate-400">
                                    <span className="text-gold-400 font-bold">{totalRevWeek}€</span> revenus
                                </span>
                            </div>
                        </div>
                        {weeklyStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={weeklyStats} barCategoryGap="20%">
                                    <XAxis dataKey="jour" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a2332', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                        formatter={(value, name) => [
                                            name === 'revenus' ? `${value}€` : value,
                                            name === 'revenus' ? 'Revenus' : 'Courses'
                                        ]}
                                    />
                                    <Bar dataKey="courses" fill="#c8a951" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="revenus" fill="#334155" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center">
                                <p className="text-slate-600 text-sm">Aucune donnée disponible</p>
                            </div>
                        )}
                    </div>

                    {/* Right sidebar: Weather + Quick actions */}
                    <div className="space-y-4">
                        {/* Weather */}
                        <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Météo locale</h3>
                            {weather ? (
                                <div className="flex items-center gap-3">
                                    {weather.icon && <img src={weather.icon} alt="" className="w-10 h-10" />}
                                    <div>
                                        <p className="text-xl font-bold text-white">{weather.temp}°C</p>
                                        <p className="text-xs text-slate-400 capitalize">{weather.desc}</p>
                                        <p className="text-[10px] text-slate-600">{weather.city}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-600 text-xs">Chargement...</p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        {loggedIn && (
                            <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
                                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Actions rapides</h3>
                                <div className="space-y-2">
                                    <Link to="/profile" className="flex items-center gap-2.5 p-2.5 rounded-md bg-dark-800 hover:bg-dark-600 transition no-underline group">
                                        <div className="w-8 h-8 rounded-md bg-gold-500/10 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition">Mon profil</span>
                                    </Link>
                                    {client && (
                                        <>
                                            <Link to="/reserver" className="flex items-center gap-2.5 p-2.5 rounded-md bg-dark-800 hover:bg-dark-600 transition no-underline group">
                                                <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                </div>
                                                <span className="text-sm text-slate-300 group-hover:text-white transition">Réserver un VTC</span>
                                            </Link>
                                            <Link to="/mes-reservations" className="flex items-center gap-2.5 p-2.5 rounded-md bg-dark-800 hover:bg-dark-600 transition no-underline group">
                                                <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <span className="text-sm text-slate-300 group-hover:text-white transition">Mes réservations</span>
                                            </Link>
                                        </>
                                    )}
                                    {!client && (
                                        <Link to="/historique" className="flex items-center gap-2.5 p-2.5 rounded-md bg-dark-800 hover:bg-dark-600 transition no-underline group">
                                            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <span className="text-sm text-slate-300 group-hover:text-white transition">Historique courses</span>
                                        </Link>
                                    )}
                                    {admin && (
                                        <Link to="/localisation" className="flex items-center gap-2.5 p-2.5 rounded-md bg-dark-800 hover:bg-dark-600 transition no-underline group">
                                            <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <span className="text-sm text-slate-300 group-hover:text-white transition">Localisation temps réel</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Maintenance alerts placeholder */}
                        {admin && (
                            <div className="bg-dark-700 rounded-lg border border-amber-500/20 p-5">
                                <h3 className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">Alertes maintenance</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                        <span className="text-slate-300">Vidange — Mercedes Classe E</span>
                                        <span className="ml-auto text-slate-600">dans 3j</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                                        <span className="text-slate-300">CT — BMW Série 5</span>
                                        <span className="ml-auto text-slate-600">dans 7j</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                        <span className="text-slate-300">Pneus — Tesla Model S</span>
                                        <span className="ml-auto text-slate-600">dans 15j</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-white">Carte des chauffeurs</h2>
                        <span className="text-xs text-slate-500">{driversWithLocation.length} localisé{driversWithLocation.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-dark-500/30" style={{ height: '380px' }}>
                        <MapContainer center={defaultCenter} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            {driversWithLocation.map(driver => {
                                const s = getStatutDisplay(driver);
                                return (
                                    <Marker key={driver._id} position={[driver.latitude!, driver.longitude!]}>
                                        <Popup>
                                            <div className="text-xs">
                                                <p className="font-semibold">{driver.prenom} {driver.nom}</p>
                                                <p className="text-gray-600">{driver.vehicule}</p>
                                                {admin && <p className="text-gray-600">{driver.telephone}</p>}
                                                <p className="font-medium mt-1">{s.label}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>

                {/* CTA for non-logged users */}
                {!loggedIn && (
                    <div className="mb-8 bg-dark-700 rounded-lg border border-dark-500/30 p-6 text-center">
                        <p className="text-white text-sm mb-3">Connectez-vous pour accéder à toutes les fonctionnalités</p>
                        <div className="flex justify-center gap-3">
                            <Link to="/Login" className="px-5 py-2.5 bg-gold-500 text-dark-900 rounded-md text-sm font-semibold hover:bg-gold-400 no-underline transition">Se connecter</Link>
                            <Link to="/SignUp" className="px-5 py-2.5 bg-dark-600 text-slate-300 rounded-md text-sm font-medium hover:bg-dark-500 no-underline transition border border-dark-500/50">S'inscrire</Link>
                        </div>
                    </div>
                )}

                {/* Admin: full driver management */}
                {admin && (
                    <>
                        <div className="border-t border-dark-500/30 pt-6 mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-white">Gestion des chauffeurs</h2>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="bg-gold-500 text-dark-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer"
                                >
                                    {showAddForm ? 'Fermer' : 'Nouveau chauffeur'}
                                </button>
                            </div>
                            {showAddForm && (
                                <div className="mt-4">
                                    <AddDriver onDriverAdded={() => { fetchDrivers(); setShowAddForm(false); }} />
                                </div>
                            )}
                        </div>
                        <DriverList drivers={filteredDrivers} onDelete={fetchDrivers} onUpdateClick={handleUpdateClick} />
                        {showModal && selectedDriver && (
                            <UpdateDriver driver={selectedDriver} onClose={closeModal} onDriverUpdated={fetchDrivers} />
                        )}
                    </>
                )}

                {/* Client dashboard */}
                {client && (
                    <div className="border-t border-dark-500/30 pt-6">
                        {/* Category cards */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-white">Réservez votre VTC</h2>
                                <Link to="/reserver" className="text-gold-400 hover:text-gold-300 text-xs no-underline font-medium">Voir tout</Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {CATEGORIES.map(cat => (
                                    <Link key={cat.key} to="/reserver"
                                        className="bg-dark-700 rounded-lg border border-dark-500/30 p-5 hover:border-gold-500/30 transition no-underline group">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${CATEGORY_COLORS[cat.key]}`}>
                                            <span className="text-sm font-bold">{cat.label.charAt(0)}</span>
                                        </div>
                                        <h3 className="text-white font-semibold text-sm group-hover:text-gold-400 transition">{cat.label}</h3>
                                        <p className="text-slate-500 text-xs mt-1 mb-3">{cat.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-slate-600">{cat.passengers}</span>
                                            <span className="text-gold-400 font-bold text-sm">{cat.prixBase}€<span className="text-[10px] text-slate-500 font-normal"> + {cat.prixKm}€/km</span></span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent reservations */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-white">Dernières réservations</h2>
                                <Link to="/mes-reservations" className="text-gold-400 hover:text-gold-300 text-xs no-underline font-medium">Tout voir</Link>
                            </div>
                            {clientReservations.length === 0 ? (
                                <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-6 text-center">
                                    <p className="text-slate-500 text-sm mb-2">Aucune réservation pour le moment</p>
                                    <Link to="/reserver" className="text-gold-400 hover:text-gold-300 text-sm no-underline font-medium">Faire une réservation</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {clientReservations.slice(0, 3).map(res => (
                                        <div key={res._id} className="bg-dark-700 rounded-lg border border-dark-500/30 p-4 flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border text-xs font-bold ${CATEGORY_COLORS[res.categorie]}`}>
                                                {CATEGORIES.find(c => c.key === res.categorie)?.label.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-white truncate">{res.depart} → {res.arrivee}</p>
                                                <p className="text-xs text-slate-500">{new Date(res.dateCourse).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <span className={`flex-shrink-0 inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${RESERVATION_STATUT_COLORS[res.statut]}`}>
                                                {RESERVATION_STATUT_LABELS[res.statut]}
                                            </span>
                                            {res.prix && <span className="flex-shrink-0 text-gold-400 font-bold text-sm">{res.prix}€</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User (chauffeur): simplified view */}
                {loggedIn && !admin && !client && (
                    <div className="border-t border-dark-500/30 pt-6">
                        <h2 className="text-sm font-semibold text-white mb-4">Chauffeurs actifs</h2>
                        {filteredDrivers.length === 0 ? (
                            <p className="text-slate-500 text-sm">Aucun chauffeur trouvé.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredDrivers.map(driver => {
                                    const s = getStatutDisplay(driver);
                                    return (
                                        <div key={driver._id} className="bg-dark-700 rounded-lg border border-dark-500/30 p-4 flex items-center gap-3">
                                            <div className="w-9 h-9 bg-dark-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gold-500 text-xs font-bold">{driver.prenom[0]}{driver.nom[0]}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{driver.prenom} {driver.nom}</p>
                                                <p className="text-xs text-slate-500">{driver.vehicule}</p>
                                            </div>
                                            <span className={`ml-auto flex-shrink-0 inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${s.className}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;


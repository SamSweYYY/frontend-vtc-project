import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Header from './Header';
import { Driver } from '../types';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 180px)',
};

const defaultCenter = {
    lat: 48.8566,
    lng: 2.3522,
};

function Localisation() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [geoError, setGeoError] = useState('');
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    useEffect(() => {
        axios.get('https://vtc-api-ho4o.onrender.com/chauffeurs')
            .then(response => setDrivers(response.data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError('Géolocalisation non supportée');
            return;
        }
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setMyPosition(coords);
                setMapCenter(coords);
                setGeoError('');
            },
            (err) => setGeoError(`Erreur: ${err.message}`),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const driversWithLocation = drivers.filter(d => d.latitude && d.longitude);

    return (
        <div className="min-h-screen bg-dark-800">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="lg:w-72 flex-shrink-0 space-y-4">
                        <h2 className="text-xl font-semibold text-white">Localisation</h2>

                        {/* My position */}
                        <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Ma position</h3>
                            {myPosition ? (
                                <div>
                                    <p className="text-xs text-slate-400 font-mono">
                                        {myPosition.lat.toFixed(5)}, {myPosition.lng.toFixed(5)}
                                    </p>
                                    <button
                                        onClick={() => setMapCenter(myPosition)}
                                        className="mt-2 text-xs text-gold-400 hover:text-gold-500 bg-transparent border-0 cursor-pointer p-0"
                                    >
                                        Centrer sur moi
                                    </button>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-600">Recherche...</p>
                            )}
                            {geoError && <p className="text-xs text-red-400 mt-2">{geoError}</p>}
                        </div>

                        {/* Drivers list */}
                        <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-4">
                            <h3 className="text-sm font-medium text-slate-300 mb-3">
                                Chauffeurs
                                <span className="ml-2 text-xs text-slate-500">({drivers.length})</span>
                            </h3>
                            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                                {drivers.map(driver => (
                                    <div
                                        key={driver._id}
                                        className={`p-2.5 rounded-md cursor-pointer transition text-sm ${
                                            selectedDriver?._id === driver._id
                                                ? 'bg-gold-500/10 border border-gold-500/20'
                                                : 'bg-dark-800 hover:bg-dark-600 border border-transparent'
                                        }`}
                                        onClick={() => {
                                            setSelectedDriver(driver);
                                            if (driver.latitude && driver.longitude) {
                                                setMapCenter({ lat: driver.latitude, lng: driver.longitude });
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-white text-xs">
                                                    {driver.prenom} {driver.nom}
                                                </p>
                                                <p className="text-[11px] text-slate-500">{driver.vehicule}</p>
                                            </div>
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                driver.disponible ? 'bg-emerald-400' : 'bg-red-400'
                                            }`}></span>
                                        </div>
                                        {driver.latitude && driver.longitude && (
                                            <p className="text-[10px] text-slate-600 mt-1 font-mono">
                                                {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 rounded-lg overflow-hidden border border-dark-500/30">
                        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
                                {myPosition && (
                                    <Marker
                                        position={myPosition}
                                        title="Ma position"
                                    />
                                )}
                                {driversWithLocation.map(driver => (
                                    <Marker
                                        key={driver._id}
                                        position={{ lat: driver.latitude!, lng: driver.longitude! }}
                                        title={`${driver.prenom} ${driver.nom}`}
                                        onClick={() => setSelectedDriver(driver)}
                                    />
                                ))}
                                {selectedDriver && selectedDriver.latitude && selectedDriver.longitude && (
                                    <InfoWindow
                                        position={{ lat: selectedDriver.latitude, lng: selectedDriver.longitude }}
                                        onCloseClick={() => setSelectedDriver(null)}
                                    >
                                        <div className="p-1">
                                            <p className="font-semibold text-gray-800 text-sm">{selectedDriver.prenom} {selectedDriver.nom}</p>
                                            <p className="text-xs text-gray-600">{selectedDriver.vehicule}</p>
                                            <p className="text-xs text-gray-600">{selectedDriver.telephone}</p>
                                            <p className={`text-xs font-semibold mt-1 ${selectedDriver.disponible ? 'text-green-600' : 'text-red-500'}`}>
                                                {selectedDriver.disponible ? 'Disponible' : 'Indisponible'}
                                            </p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Localisation;

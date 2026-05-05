import { useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Driver, getStatutDisplay } from '../types';

const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const mapStyles = [
    { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#111827' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#273244' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b1f33' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

interface FleetMapProps {
    drivers: Driver[];
    height?: number | string;
    title?: string;
    emptyMessage?: string;
}

function hasLocation(driver: Driver) {
    return typeof driver.latitude === 'number' && typeof driver.longitude === 'number';
}

function carIcon(color: string) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
            <filter id="s" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#000000" flood-opacity="0.35"/>
            </filter>
            <g filter="url(#s)">
                <circle cx="26" cy="26" r="22" fill="${color}"/>
                <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5"/>
                <path d="M16 28.5 18.6 20.8c.55-1.65 2.1-2.8 3.85-2.8h7.1c1.75 0 3.3 1.15 3.85 2.8L36 28.5v7.25c0 .7-.55 1.25-1.25 1.25h-1.5c-.7 0-1.25-.55-1.25-1.25V34H20v1.75c0 .7-.55 1.25-1.25 1.25h-1.5c-.7 0-1.25-.55-1.25-1.25V28.5Z" fill="#07111f"/>
                <path d="M20.5 21.4h11l1.55 5.1h-14.1l1.55-5.1Z" fill="white" opacity="0.92"/>
                <circle cx="20.5" cy="30.5" r="2" fill="white"/>
                <circle cx="31.5" cy="30.5" r="2" fill="white"/>
            </g>
        </svg>`;

    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(46, 46),
        anchor: new window.google.maps.Point(23, 23),
    };
}

function getMarkerColor(driver: Driver) {
    if (driver.statut === 'en_course') return '#60a5fa';
    if (driver.disponible || driver.statut === 'disponible') return '#22d3ee';
    return '#94a3b8';
}

function FallbackMap({ drivers, emptyMessage }: { drivers: Driver[]; emptyMessage: string }) {
    const points = useMemo(() => {
        const located = drivers.filter(hasLocation);
        const lats = located.map((driver) => driver.latitude!);
        const lngs = located.map((driver) => driver.longitude!);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const latRange = maxLat - minLat || 0.02;
        const lngRange = maxLng - minLng || 0.02;

        return located.map((driver) => ({
            driver,
            left: 10 + ((driver.longitude! - minLng) / lngRange) * 80,
            top: 90 - ((driver.latitude! - minLat) / latRange) * 80,
        }));
    }, [drivers]);

    if (points.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-dark-900">
                <p className="text-slate-500 text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="fleet-fallback-map">
            <div className="fleet-road fleet-road-a" />
            <div className="fleet-road fleet-road-b" />
            <div className="fleet-road fleet-road-c" />
            {points.map(({ driver, left, top }) => (
                <div
                    key={driver._id}
                    className="fleet-car-marker"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    title={`${driver.prenom} ${driver.nom}`}
                >
                    <svg viewBox="0 0 52 52" className="w-11 h-11">
                        <circle cx="26" cy="26" r="22" fill={getMarkerColor(driver)} />
                        <path d="M16 28.5 18.6 20.8c.55-1.65 2.1-2.8 3.85-2.8h7.1c1.75 0 3.3 1.15 3.85 2.8L36 28.5v7.25c0 .7-.55 1.25-1.25 1.25h-1.5c-.7 0-1.25-.55-1.25-1.25V34H20v1.75c0 .7-.55 1.25-1.25 1.25h-1.5c-.7 0-1.25-.55-1.25-1.25V28.5Z" fill="#07111f" />
                        <path d="M20.5 21.4h11l1.55 5.1h-14.1l1.55-5.1Z" fill="white" opacity="0.92" />
                        <circle cx="20.5" cy="30.5" r="2" fill="white" />
                        <circle cx="31.5" cy="30.5" r="2" fill="white" />
                    </svg>
                    <span>{driver.prenom}</span>
                </div>
            ))}
        </div>
    );
}

function GoogleFleetMap({ drivers, center, emptyMessage }: { drivers: Driver[]; center: { lat: number; lng: number }; emptyMessage: string }) {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'vtc-google-map',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    if (loadError) {
        return <FallbackMap drivers={drivers} emptyMessage={emptyMessage} />;
    }

    if (!isLoaded) {
        return (
            <div className="h-full flex items-center justify-center bg-dark-900">
                <p className="text-slate-500 text-sm">Chargement de la carte...</p>
            </div>
        );
    }

    if (drivers.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-dark-900">
                <p className="text-slate-500 text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            options={{
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: 'greedy',
                clickableIcons: false,
            }}
        >
            {drivers.map((driver) => (
                <Marker
                    key={driver._id}
                    position={{ lat: driver.latitude!, lng: driver.longitude! }}
                    title={`${driver.prenom} ${driver.nom}`}
                    icon={carIcon(getMarkerColor(driver))}
                    onClick={() => setSelectedDriver(driver)}
                />
            ))}
            {selectedDriver && hasLocation(selectedDriver) && (
                <InfoWindow
                    position={{ lat: selectedDriver.latitude!, lng: selectedDriver.longitude! }}
                    onCloseClick={() => setSelectedDriver(null)}
                >
                    <div className="text-xs min-w-[160px]">
                        <p className="font-semibold text-gray-900 mb-1">{selectedDriver.prenom} {selectedDriver.nom}</p>
                        <p className="text-gray-600 mb-1">{selectedDriver.vehicule || 'Vehicule VTC'}</p>
                        <p className="text-gray-600 mb-0">{getStatutDisplay(selectedDriver).label}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

function FleetMap({ drivers, height = 500, title = 'Carte des chauffeurs', emptyMessage = 'Aucun chauffeur disponible sur la carte.' }: FleetMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const locatedDrivers = useMemo(() => drivers.filter(hasLocation), [drivers]);
    const center = locatedDrivers[0]
        ? { lat: locatedDrivers[0].latitude!, lng: locatedDrivers[0].longitude! }
        : defaultCenter;

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-dark-900 relative" style={{ height }}>
            <div className="absolute left-4 top-4 z-10 rounded-full bg-dark-900/80 border border-white/10 px-4 py-2 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white mb-0">{title}</p>
            </div>
            {!apiKey ? (
                <FallbackMap drivers={locatedDrivers} emptyMessage={emptyMessage} />
            ) : (
                <GoogleFleetMap drivers={locatedDrivers} center={center} emptyMessage={emptyMessage} />
            )}
        </div>
    );
}

export default FleetMap;

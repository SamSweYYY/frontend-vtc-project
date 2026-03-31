
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { isAdmin } from '../types';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], map.getZoom()); }, [lat, lng, map]);
  return null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState('');
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/Login');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(coords);
          setGeoError('');
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
            .then(r => r.json())
            .then(data => {
              if (data.display_name) setAddress(data.display_name);
            })
            .catch(() => {});
        },
        (err) => {
          setGeoError(`Erreur de géolocalisation: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    } else {
      setGeoError('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  }, [token, navigate]);

  const updateMyPosition = () => {
    if (!position || !user?._id) return;
    setUpdating(true);
    axios.put(`https://vtc-api-ho4o.onrender.com/chauffeurs/${user._id}`, {
      latitude: position.lat,
      longitude: position.lng,
    })
    .then(() => setUpdating(false))
    .catch(() => setUpdating(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-800">
        <Header />
        <div className="flex items-center justify-center py-16">
          <p className="text-slate-500">Aucune donnée utilisateur. Veuillez vous reconnecter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 rounded-full flex items-center justify-center">
            <span className="text-gold-500 text-lg font-bold">{user.prenom?.[0]}{user.nom?.[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">{user.prenom} {user.nom}</h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Chauffeur VTC
              {isAdmin() && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gold-500/20 text-gold-400 rounded">ADMIN</span>}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-dark-700 rounded-lg border border-dark-500/30">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-white text-sm">{user.email}</p>
          </div>
          {user.telephone && (
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-500/30">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Téléphone</p>
              <p className="text-white text-sm">{user.telephone}</p>
            </div>
          )}
          {user.vehicule && (
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-500/30">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Véhicule</p>
              <p className="text-white text-sm">{user.vehicule}</p>
            </div>
          )}
          <div className="p-4 bg-dark-700 rounded-lg border border-dark-500/30">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Position</p>
            {position ? (
              <p className="text-white text-sm">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>
            ) : (
              <p className="text-slate-600 text-sm">Recherche...</p>
            )}
          </div>
        </div>

        {/* Address */}
        {address && (
          <div className="mb-6 p-4 bg-dark-700 rounded-lg border border-gold-500/20">
            <p className="text-xs text-gold-500 uppercase tracking-wider mb-1">Adresse détectée</p>
            <p className="text-slate-300 text-sm">{address}</p>
          </div>
        )}

        {geoError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">{geoError}</p>
          </div>
        )}

        {/* Map */}
        {position && (
          <div className="mb-6 rounded-lg overflow-hidden border border-dark-500/30" style={{ height: '300px' }}>
            <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[position.lat, position.lng]} />
              <RecenterMap lat={position.lat} lng={position.lng} />
            </MapContainer>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={updateMyPosition}
            disabled={!position || updating}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition border-0 cursor-pointer ${
              position && !updating
                ? 'bg-gold-500 text-dark-900 hover:bg-gold-400'
                : 'bg-dark-600 text-slate-600 cursor-not-allowed'
            }`}
          >
            {updating ? 'Mise à jour...' : 'Mettre à jour ma position'}
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-dark-600 text-slate-300 rounded-md text-sm font-medium hover:bg-dark-500 hover:text-white transition border border-dark-500/50 cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

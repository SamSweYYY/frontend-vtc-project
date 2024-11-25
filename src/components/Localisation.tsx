import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import Header from './Header';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 48.8566, // Coordonnées de Paris
  lng: 2.3522,
};

interface Chauffeur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  lat: number; // Coordonnées du chauffeur
  lng: number;
  vehicule: string;
  disponible: boolean;
}

function Localisation() {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);

  const generateRandomCoord = (centerLat: number, centerLng: number) => {
    const randomOff = () => (Math.random() - 0.5) * 0.1;
    return {
      lat: centerLat + randomOff(),
      lng: centerLng + randomOff(),
    };
  };

  // Fonction pour récupérer les chauffeurs
  const fetchChauffeurs = () => {
    axios
      .get('http://localhost:3000/chauffeurs') // Modifier l'URL selon votre backend
      .then((response) => {
        const ChauffeursCoords = response.data.map((chauffeur: Chauffeur) => {
          if (chauffeur.disponible) {
            const coords = generateRandomCoord(center.lat, center.lng);
            return { ...chauffeur, lat: coords.lat, lng: coords.lng };
          }
          return chauffeur;
        });
        setChauffeurs(ChauffeursCoords);
      })
      .catch((error) => console.error('Erreur lors de la récupération des chauffeurs:', error));
  };

  // Actualiser les données toutes les X secondes
  useEffect(() => {
    // Première récupération immédiate
    fetchChauffeurs();

    // Définir un intervalle pour actualiser les données
    const interval = setInterval(fetchChauffeurs, 5000); // Met à jour toutes les 5 secondes

    // Nettoyer l'intervalle à la fin
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      <LoadScript googleMapsApiKey="AIzaSyBBWagSo01yJUqEq5cOh_FrQO4o3meA0CQ">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {/* Afficher les markers pour chaque chauffeur */}
          {chauffeurs.map((chauffeur) => (
            <Marker
              key={chauffeur.id}
              position={{ lat: chauffeur.lat, lng: chauffeur.lng }}
              icon={{
                url: chauffeur.disponible
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' // Marker vert si disponible
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
              title={`${chauffeur.nom} ${chauffeur.prenom} ${chauffeur.telephone} ${chauffeur.vehicule}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Localisation;

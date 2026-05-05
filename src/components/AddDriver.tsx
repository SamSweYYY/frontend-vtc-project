import React, { useState } from 'react';
import axios from 'axios';
import { Driver } from '../types';
import { apiUrl } from '../utils/api';

interface AddDriverProps {
  onDriverAdded: () => void;
}

const AddDriver: React.FC<AddDriverProps> = ({ onDriverAdded }) => {
  const [driver, setDriver] = useState<Driver>({
    _id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    vehicule: '',
    disponible: false,
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDriver(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addDriver = () => {
    if (!driver.nom || !driver.prenom || !driver.email || !driver.telephone || !driver.vehicule) {
      setError('Tous les champs sont requis.');
      return;
    }
    setError('');
    axios
      .post(apiUrl('/chauffeurs'), {
        nom: driver.nom,
        prenom: driver.prenom,
        email: driver.email,
        telephone: driver.telephone,
        vehicule: driver.vehicule,
        disponible: driver.disponible,
      })
      .then(() => {
        setDriver({ _id: '', nom: '', prenom: '', email: '', telephone: '', vehicule: '', disponible: false });
        onDriverAdded();
      })
      .catch(() => setError('Erreur lors de l\'ajout.'));
  };

  const inputClass = "px-3 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm";

  return (
    <div className="bg-dark-700 rounded-lg border border-dark-500/30 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Ajouter un chauffeur</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input type="text" name="nom" value={driver.nom} onChange={handleInputChange} placeholder="Nom" className={inputClass} />
        <input type="text" name="prenom" value={driver.prenom} onChange={handleInputChange} placeholder="Prénom" className={inputClass} />
        <input type="email" name="email" value={driver.email} onChange={handleInputChange} placeholder="Email" className={inputClass} />
        <input type="text" name="telephone" value={driver.telephone} onChange={handleInputChange} placeholder="Téléphone" className={inputClass} />
        <input type="text" name="vehicule" value={driver.vehicule} onChange={handleInputChange} placeholder="Véhicule" className={inputClass} />
        <label className="flex items-center gap-2.5 text-slate-400 text-sm px-3 py-2.5">
          <input type="checkbox" name="disponible" checked={driver.disponible} onChange={handleInputChange}
            className="w-4 h-4 rounded accent-gold-500" />
          Disponible
        </label>
      </div>
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      <button
        className="mt-4 bg-gold-500 text-dark-900 py-2 px-6 text-sm font-semibold rounded-md hover:bg-gold-400 transition border-0 cursor-pointer"
        onClick={addDriver}
      >
        Ajouter
      </button>
    </div>
  );
};

export default AddDriver;

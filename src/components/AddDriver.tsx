import React, { useState } from 'react';
import axios from 'axios';
import { Driver } from '../types';

interface AddDriverProps {
  onDriverAdded: () => void; // Fonction callback pour rafraîchir la liste des chauffeurs
}

const AddDriver: React.FC<AddDriverProps> = ({ onDriverAdded }) => {
  // Initialisation de l'état avec tous les champs requis, y compris _id
  const [Driver, setDriver] = useState<Driver>({
    _id: '', 
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    vehicule: '',
    disponible: false,
  });

  // Gestion de la modification des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDriver(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Fonction pour ajouter un nouveau chauffeur
  const addDriver = () => {
    if (!Driver.nom || !Driver.prenom || !Driver.email || !Driver.telephone || !Driver.vehicule) {
      alert('Tous les champs sont requis.');
      return;
    }

    axios
      .post('http://localhost:3000/chauffeurs', {
        nom: Driver.nom,
        prenom: Driver.prenom,
        email: Driver.email,
        telephone: Driver.telephone,
        vehicule: Driver.vehicule,
        disponible: Driver.disponible,
      })
      .then(response => {
        console.log('Chauffeur ajouté :', response.data);
        setDriver({
          _id: '', 
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          vehicule: '',
          disponible: false,
        });
        onDriverAdded();
      })
      .catch(error => console.error('Erreur lors de l\'ajout du chauffeur :', error));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg w-full max-w-xl">
        <h4 className="text-xl font-bold text-gray-700 text-center">Ajouter un nouveau chauffeur</h4>
        <input
          type="text"
          name="nom"
          value={Driver.nom}
          onChange={handleInputChange}
          placeholder="Nom"
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="prenom"
          value={Driver.prenom}
          onChange={handleInputChange}
          placeholder="Prénom"
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          value={Driver.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="telephone"
          value={Driver.telephone}
          onChange={handleInputChange}
          placeholder="Téléphone"
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="vehicule"
          value={Driver.vehicule}
          onChange={handleInputChange}
          placeholder="Véhicule"
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="flex items-center gap-3 text-gray-600 text-lg">
          Disponible :
          <input
            type="checkbox"
            name="disponible"
            checked={Driver.disponible}
            onChange={handleInputChange}
            className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
          />
        </label>
        <button
          className="bg-green-500 text-white py-3 px-6 text-lg font-semibold rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400"
          onClick={addDriver}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddDriver;

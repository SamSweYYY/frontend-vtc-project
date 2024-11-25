import React, { useState } from "react";
import axios from "axios";
import { Driver } from "../types";

interface UpdateDriverProps {
  driver: Driver; // Chauffeur à mettre à jour
  onClose: () => void; // Fonction pour fermer la modal
  onDriverUpdated: () => void; // Fonction callback pour rafraîchir la liste des chauffeurs après mise à jour
}

const UpdateDriver: React.FC<UpdateDriverProps> = ({
  driver,
  onClose,
  onDriverUpdated,
}) => {
  const [updatedDriver, setUpdatedDriver] = useState<Driver>(driver); // État local pour les champs du chauffeur
  const [isLoading, setIsLoading] = useState(false); // Indicateur de chargement

  // Gestion de la modification des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedDriver((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion du champ checkbox (disponible)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setUpdatedDriver((prev) => ({ ...prev, disponible: checked }));
  };

  // Gestion de la soumission du formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .put(`http://localhost:3000/chauffeurs/${updatedDriver._id}`, updatedDriver)
      .then(() => {
        onDriverUpdated(); // Rafraîchir la liste des chauffeurs dans le composant parent
        onClose(); // Fermer la modal
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du chauffeur :", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Mettre à jour le chauffeur
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Champ Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nom :
            </label>
            <input
              type="text"
              name="nom"
              value={updatedDriver.nom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prénom :
            </label>
            <input
              type="text"
              name="prenom"
              value={updatedDriver.prenom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email :
            </label>
            <input
              type="email"
              name="email"
              value={updatedDriver.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Téléphone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Téléphone :
            </label>
            <input
              type="text"
              name="telephone"
              value={updatedDriver.telephone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Véhicule */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Véhicule :
            </label>
            <input
              type="text"
              name="vehicule"
              value={updatedDriver.vehicule}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Champ Disponible */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">
              Disponible :
            </label>
            <input
              type="checkbox"
              name="disponible"
              checked={updatedDriver.disponible}
              onChange={handleCheckboxChange}
              className="w-6 h-6"
            />
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDriver;

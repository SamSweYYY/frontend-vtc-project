import React, { useState } from "react";
import axios from "axios";
import { Driver } from "../types";

interface UpdateDriverProps {
  driver: Driver;
  onClose: () => void;
  onDriverUpdated: () => void;
}

const UpdateDriver: React.FC<UpdateDriverProps> = ({ driver, onClose, onDriverUpdated }) => {
  const [updatedDriver, setUpdatedDriver] = useState<Driver>(driver);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedDriver((prev) => ({ ...prev, disponible: e.target.checked }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(`https://vtc-api-ho4o.onrender.com/chauffeurs/${updatedDriver._id}`, updatedDriver)
      .then(() => { onDriverUpdated(); onClose(); })
      .catch((error) => console.error("Erreur mise à jour:", error))
      .finally(() => setIsLoading(false));
  };

  const inputClass = "w-full px-3 py-2.5 bg-dark-700 border border-dark-500/50 rounded-md text-white placeholder-slate-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition text-sm";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50" onClick={onClose}>
      <div className="bg-dark-800 border border-dark-500/30 rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-white mb-5">Modifier le chauffeur</h2>
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Nom</label>
            <input type="text" name="nom" value={updatedDriver.nom} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Prénom</label>
            <input type="text" name="prenom" value={updatedDriver.prenom} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
            <input type="email" name="email" value={updatedDriver.email} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Téléphone</label>
            <input type="text" name="telephone" value={updatedDriver.telephone} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Véhicule</label>
            <input type="text" name="vehicule" value={updatedDriver.vehicule} onChange={handleInputChange} className={inputClass} />
          </div>
          <label className="flex items-center gap-2.5 text-slate-400 text-sm py-1">
            <input type="checkbox" name="disponible" checked={updatedDriver.disponible} onChange={handleCheckboxChange}
              className="w-4 h-4 rounded accent-gold-500" />
            Disponible
          </label>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-dark-600 text-slate-300 rounded-md text-sm hover:bg-dark-500 transition border border-dark-500/50 cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={isLoading}
              className={`px-4 py-2 bg-gold-500 text-dark-900 rounded-md text-sm font-semibold hover:bg-gold-400 transition border-0 cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDriver;

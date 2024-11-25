import React from 'react';
import { Driver } from '../types'; // Import de l'interface Driver
import DeleteDriver from './DeleteDriver';

interface DriverListProps {
  drivers: Driver[];
  onDelete: (id: string) => void; // Fonction pour supprimer un chauffeur
  onUpdateClick: (driver: Driver) => void; // Fonction pour gérer la mise à jour
}

const DriverList: React.FC<DriverListProps> = ({ drivers, onDelete, onUpdateClick }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-0 list-none m-0">
    {drivers.map(driver => (
      <li
        key={driver._id}
        className="bg-white border border-gray-300 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-500 ease-in-out transform hover:scale-105 p-6 text-left"
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-2xl font-semibold text-green-600 mb-2">
              {driver.nom} {driver.prenom}
            </p>
            <p className="text-md text-gray-700 mb-2"><strong>Véhicule:</strong> {driver.vehicule}</p>
            <p className="text-md text-gray-700 mb-2"><strong>Email:</strong> {driver.email}</p>
            <p className="text-md text-gray-700 mb-2"><strong>Téléphone:</strong> {driver.telephone}</p>
            <p className={`text-md font-semibold mb-4 ${driver.disponible ? 'text-green-500' : 'text-red-500'}`}>
              {driver.disponible ? 'Disponible' : 'Indisponible'}
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto">
            {/* Bouton pour mettre à jour */}
            <button
              onClick={() => onUpdateClick(driver)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none"
            >
              Mettre à jour
            </button>

            {/* Bouton pour supprimer */}
            <DeleteDriver driverId={driver._id} onDriverDeleted={() => onDelete(driver._id)} />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

export default DriverList;

import React from 'react';
import { Driver } from '../types';
import DeleteDriver from './DeleteDriver';

interface DriverListProps {
  drivers: Driver[];
  onDelete: (id: string) => void;
  onUpdateClick: (driver: Driver) => void;
}

const DriverList: React.FC<DriverListProps> = ({ drivers, onDelete, onUpdateClick }) => {
  if (drivers.length === 0) {
    return (
      <div className="text-center py-16 bg-dark-700 rounded-lg border border-dark-500/30">
        <p className="text-slate-500 text-sm">Aucun chauffeur enregistré</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-dark-500/30">
      <table className="w-full">
        <thead>
          <tr className="bg-dark-700 border-b border-dark-500/30">
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Chauffeur</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Véhicule</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Position</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-500/20">
          {drivers.map(driver => (
            <tr key={driver._id} className="bg-dark-800 hover:bg-dark-700/50 transition">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center">
                    <span className="text-gold-500 text-xs font-bold">{driver.prenom[0]}{driver.nom[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{driver.prenom} {driver.nom}</p>
                    <p className="text-xs text-slate-500 sm:hidden">{driver.vehicule}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-300 hidden sm:table-cell">{driver.vehicule}</td>
              <td className="px-4 py-3 hidden md:table-cell">
                <p className="text-sm text-slate-300">{driver.email}</p>
                <p className="text-xs text-slate-500">{driver.telephone}</p>
              </td>
              <td className="px-4 py-3 text-sm hidden lg:table-cell">
                {driver.latitude && driver.longitude ? (
                  <span className="text-slate-300">{driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}</span>
                ) : (
                  <span className="text-slate-600">--</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  driver.disponible
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {driver.disponible ? 'Dispo' : 'Indispo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onUpdateClick(driver)}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-dark-600 text-slate-300 hover:text-white hover:bg-dark-500 transition border border-dark-500/50 cursor-pointer"
                  >
                    Modifier
                  </button>
                  <DeleteDriver driverId={driver._id} onDriverDeleted={() => onDelete(driver._id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverList;

import React, { useState } from 'react';
import axios from 'axios';

interface DeleteDriverProps {
    driverId: string;
    onDriverDeleted: () => void;
}

const DeleteDriver: React.FC<DeleteDriverProps> = ({ driverId, onDriverDeleted }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDriver = () => {
        const confirmDelete = window.confirm('Supprimer ce chauffeur ?');
        if (!confirmDelete) return;
        setIsLoading(true);
        setError(null);
        axios.delete(`http://localhost:3000/chauffeurs/${driverId}`)
            .then(() => onDriverDeleted())
            .catch((error) => {
                console.error('Erreur suppression:', error);
                setError('Erreur lors de la suppression.');
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div>
            <button
                onClick={deleteDriver}
                className="px-3 py-1.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={isLoading}
            >
                {isLoading ? 'Suppression...' : 'Supprimer'}
            </button>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default DeleteDriver;

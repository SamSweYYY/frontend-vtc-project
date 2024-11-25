import React, { useState } from 'react';
import axios from 'axios';

interface DeleteDriverProps {
    driverId: string; // ID du chauffeur à supprimer
    onDriverDeleted: () => void; // Fonction callback pour rafraîchir la liste des chauffeurs après suppression
}

const DeleteDriver: React.FC<DeleteDriverProps> = ({ driverId, onDriverDeleted }) => {
    const [isLoading, setIsLoading] = useState(false); // État pour indiquer si la suppression est en cours
    const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs

    // Fonction pour supprimer le chauffeur
    const deleteDriver = () => {
        // Confirmation avant suppression
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?');
        if (!confirmDelete) return;

        setIsLoading(true);
        setError(null); // Réinitialiser les erreurs
        axios.delete(`http://localhost:3000/chauffeurs/${driverId}`)
            .then(() => {
                console.log('Chauffeur supprimé avec succès');
                onDriverDeleted(); // Appel de la fonction de rappel pour rafraîchir la liste des chauffeurs
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression du chauffeur", error);
                setError("Une erreur est survenue lors de la suppression.");
            })
            .finally(() => {
                setIsLoading(false); // Réinitialiser l'état de chargement
            });
    };

    return (
        <div>
            <button 
                onClick={deleteDriver} 
                className="delete-button" 
                disabled={isLoading} // Désactive le bouton si suppression en cours
            >
                {isLoading ? 'Suppression...' : 'Supprimer'}
            </button>
            {error && <p className="error-message">{error}</p>} {/* Affichage des erreurs */}
        </div>
    );
};

export default DeleteDriver;

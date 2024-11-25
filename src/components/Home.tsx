import { useState, useEffect } from 'react';
import axios from 'axios';
import DriverList from '../components/DriverList';
import { Driver } from '../types'; // Import de l'interface Driver
import AddDriver from './AddDriver';
import Header from './Header';
import UpdateDriver from './UpdateDriver';

function Home() {
    const [drivers, setDrivers] = useState<Driver[]>([]);

    // Fonction pour récupérer la liste des chauffeurs
    const fetchDrivers = () => {
        axios.get('http://localhost:3000/chauffeurs')
            .then(response => setDrivers(response.data))
            .catch(error => console.error("Erreur lors de la récupération des chauffeurs", error));
    };

    // Charger les chauffeurs lors du montage du composant
    useEffect(() => {
        fetchDrivers();
    }, []);

    // Fonction de callback pour rafraîchir la liste des chauffeurs après ajout
    const handleDriverAdded = () => {
        fetchDrivers();
    };

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleUpdateClick = (driver: Driver) => {
        setSelectedDriver(driver); // Définit le chauffeur à mettre à jour
        setShowModal(true); // Affiche la modal
    };

    const closeModal = () => {
        setSelectedDriver(null);
        setShowModal(false);
    };

    return (
        <div>
            <Header />
            <AddDriver onDriverAdded={handleDriverAdded} />
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
            Liste des Chauffeurs VTC    
            </h1>
            <DriverList drivers={drivers} onDelete={fetchDrivers} onUpdateClick={handleUpdateClick}/>
            {showModal && selectedDriver && (
              <UpdateDriver driver={selectedDriver} onClose={closeModal} onDriverUpdated={fetchDrivers}/>
            )}
        </div>
    );
}

export default Home;


import { isAdmin, isClient, isLoggedIn } from '../types';
import AdminDashboard from './AdminDashboard';
import ClientHome from './ClientHome';
import DriverHome from './DriverHome';
import Landing from './Landing';

// Page d'accueil intelligente qui redirige selon le rôle
function Home() {
    const loggedIn = isLoggedIn();
    const admin = isAdmin();
    const client = isClient();

    // Vérifier si l'utilisateur est chauffeur (user avec role 'user')
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isDriver = user?.role === 'user';

    // Redirection basée sur le rôle
    if (!loggedIn) {
        // Page de landing pour utilisateurs non connectés
        return <Landing />;
    }

    if (admin) {
        // Tableau de bord admin
        return <AdminDashboard />;
    }

    if (client) {
        // Page client avec carte et réservations
        return <ClientHome />;
    }

    if (isDriver) {
        // Page chauffeur
        return <DriverHome />;
    }

    // Fallback - page de landing
    return <Landing />;
}

export default Home;

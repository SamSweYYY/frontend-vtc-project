export type DriverStatut = 'disponible' | 'en_course' | 'en_pause' | 'hors_service';
export type VehicleCategory = 'eco' | 'confort' | 'van';
export type ReservationStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';

export interface Driver {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    vehicule: string;
    categorie?: VehicleCategory;
    disponible: boolean;
    statut?: DriverStatut;
    latitude?: number;
    longitude?: number;
    lastUpdate?: string;
    role?: 'admin' | 'user' | 'client';
}

export interface Reservation {
    _id: string;
    clientId: string | { _id: string; nom: string; prenom: string; email?: string; telephone?: string };
    chauffeurId?: string | { _id: string; nom: string; prenom: string; vehicule?: string; categorie?: VehicleCategory };
    categorie: VehicleCategory;
    depart: string;
    arrivee: string;
    dateReservation: string;
    dateCourse: string;
    passagers: number;
    prix?: number;
    statut: ReservationStatut;
    note?: string;
}

export interface Course {
    _id: string;
    chauffeurId: string | { _id: string; nom: string; prenom: string; vehicule?: string };
    date: string;
    depart: string;
    arrivee: string;
    distance?: number;
    prix?: number;
    duree?: number;
    statut: 'terminee' | 'annulee' | 'en_cours';
}

export interface WeeklyStat {
    jour: string;
    date: string;
    courses: number;
    revenus: number;
    distance: number;
}

export interface UserSession {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    vehicule?: string;
    token: string;
    role?: 'admin' | 'user' | 'client';
}

// --- Category config ---
export interface CategoryInfo {
    key: VehicleCategory;
    label: string;
    description: string;
    passengers: string;
    prixBase: number;
    prixKm: number;
    icon: string; // emoji-free, we'll use SVG in components
}

export const CATEGORIES: CategoryInfo[] = [
    {
        key: 'eco',
        label: 'Éco',
        description: 'Berline confortable, idéale pour vos trajets quotidiens',
        passengers: '1-3 passagers',
        prixBase: 15,
        prixKm: 1.2,
        icon: 'car',
    },
    {
        key: 'confort',
        label: 'Confort',
        description: 'Véhicule premium avec finitions haut de gamme',
        passengers: '1-3 passagers',
        prixBase: 25,
        prixKm: 1.8,
        icon: 'star',
    },
    {
        key: 'van',
        label: 'Van',
        description: 'Espace généreux pour groupes et bagages volumineux',
        passengers: '4-7 passagers',
        prixBase: 40,
        prixKm: 2.5,
        icon: 'van',
    },
];

export const CATEGORY_COLORS: Record<VehicleCategory, string> = {
    eco: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    confort: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
    van: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export const RESERVATION_STATUT_LABELS: Record<ReservationStatut, string> = {
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    en_cours: 'En cours',
    terminee: 'Terminée',
    annulee: 'Annulée',
};

export const RESERVATION_STATUT_COLORS: Record<ReservationStatut, string> = {
    en_attente: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmee: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    en_cours: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    terminee: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    annulee: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const STATUT_LABELS: Record<DriverStatut, string> = {
    disponible: 'Disponible',
    en_course: 'En course',
    en_pause: 'En pause',
    hors_service: 'Hors service',
};

export const STATUT_COLORS: Record<DriverStatut, string> = {
    disponible: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    en_course: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    en_pause: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hors_service: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function isAdmin(): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    try {
        const user = JSON.parse(userData);
        return user.role === 'admin';
    } catch {
        return false;
    }
}

export function isClient(): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    try {
        const user = JSON.parse(userData);
        return user.role === 'client';
    } catch {
        return false;
    }
}

export function isDriver(): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    try {
        const user = JSON.parse(userData);
        return user.role === 'user' || user.role === 'admin';
    } catch {
        return false;
    }
}

export function isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
}

export function getUserRole(): 'admin' | 'user' | 'client' | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
        return JSON.parse(userData).role || null;
    } catch {
        return null;
    }
}

export function getStatutDisplay(driver: Driver): { label: string; className: string } {
    const statut = driver.statut || (driver.disponible ? 'disponible' : 'hors_service');
    return {
        label: STATUT_LABELS[statut],
        className: STATUT_COLORS[statut],
    };
}

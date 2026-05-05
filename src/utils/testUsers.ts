export type TestUserType = 'admin' | 'client' | 'driver';

export const testUsers = {
  admin: {
    _id: '660000000000000000000001',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'admin@vtc-manager.fr',
    password: 'admin123',
    telephone: '+33612345678',
    role: 'admin',
    token: 'test_admin_token_001',
  },
  client: {
    _id: '660000000000000000000002',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@email.fr',
    password: 'client123',
    telephone: '+33698765432',
    role: 'client',
    token: 'test_client_token_001',
  },
  driver: {
    _id: '660000000000000000000003',
    nom: 'Bernard',
    prenom: 'Marc',
    email: 'marc.bernard@vtc.fr',
    password: 'driver123',
    telephone: '+33787654321',
    vehicule: 'Mercedes Classe E',
    categorie: 'confort',
    role: 'user',
    token: 'test_driver_token_001',
  },
} as const;

export const loginAsTestUser = (userType: TestUserType) => {
  const { password, ...user } = testUsers[userType];
  void password;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', user.token);
  window.location.href = '/';
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('hasActiveReservation');
  window.location.href = '/';
};

import { loginAsTestUser, logout, testUsers, TestUserType } from '../utils/testUsers';

const userCards: Array<{
  key: TestUserType;
  title: string;
  badge: string;
  description: string;
  badgeClassName: string;
}> = [
  {
    key: 'admin',
    title: 'Administrateur',
    badge: 'Admin',
    description: 'Dashboard complet, gestion chauffeurs, statistiques et carte.',
    badgeClassName: 'bg-red-500/15 border-red-500/30 text-red-300',
  },
  {
    key: 'client',
    title: 'Client',
    badge: 'Client',
    description: 'Reservation, carte des chauffeurs et historique des trajets.',
    badgeClassName: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  },
  {
    key: 'driver',
    title: 'Chauffeur',
    badge: 'Driver',
    description: 'Profil chauffeur, position, courses et statistiques personnelles.',
    badgeClassName: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
];

function TestUsers() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-3">Mode demo</p>
          <h1 className="text-3xl font-bold text-white mb-2">Utilisateurs de test</h1>
          <p className="text-slate-400">
            Ces comptes servent a basculer rapidement entre les interfaces. Le bouton connecte directement en localStorage.
          </p>
        </div>

        <div className="space-y-4">
          {userCards.map((card) => {
            const user = testUsers[card.key];
            return (
              <div key={card.key} className="bg-white/[0.045] border border-white/10 rounded-xl p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-xl font-semibold text-white mb-0">{card.title}</h2>
                      <span className={`px-2 py-0.5 border rounded-full text-xs font-medium ${card.badgeClassName}`}>
                        {card.badge}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mb-4">
                      <p className="text-sm text-slate-300 mb-0"><span className="text-slate-500">Nom:</span> {user.prenom} {user.nom}</p>
                      <p className="text-sm text-slate-300 mb-0"><span className="text-slate-500">Email:</span> {user.email}</p>
                      <p className="text-sm text-slate-300 mb-0"><span className="text-slate-500">Mot de passe:</span> <span className="font-mono text-gold-400">{user.password}</span></p>
                      {'vehicule' in user && (
                        <p className="text-sm text-slate-300 mb-0"><span className="text-slate-500">Vehicule:</span> {user.vehicule}</p>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-0">{card.description}</p>
                  </div>

                  <button
                    onClick={() => loginAsTestUser(card.key)}
                    className="px-6 py-2.5 bg-white text-dark-900 rounded-full font-semibold hover:bg-gold-400 transition whitespace-nowrap border-0"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-6 mt-8">
          <button
            onClick={() => logout()}
            className="w-full px-6 py-2.5 bg-white/10 text-slate-300 rounded-full font-semibold hover:bg-white/15 transition border border-white/10"
          >
            Se deconnecter
          </button>
        </div>

        <div className="mt-8 bg-gold-500/10 border border-gold-500/20 rounded-lg p-4">
          <p className="text-xs text-slate-300 mb-0">
            Note: si tu veux utiliser ces comptes via le vrai formulaire de connexion, il faut aussi les creer dans le backend avec les memes emails et mots de passe.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestUsers;

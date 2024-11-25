

const Profile: React.FC = () => {
  const token = localStorage.getItem('token'); // Récupérez le token (ou les informations utilisateur)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profil Utilisateur
        </h2>
        <p className="text-gray-600 text-center">
          Bienvenue sur votre profil ! 🎉
        </p>
        <div className="mt-4 text-gray-700">
          <p>Votre token : <span className="font-medium text-gray-900">{token}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Gestion des changements des champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validation simple
    const validateForm = () => {
        const { nom, prenom, email, password } = formData;
        if (!nom || !prenom || !email || !password) {
            setError('Tous les champs sont requis');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email invalide');
            return false;
        }
        setError('');
        return true;
    };

    // Gestion de la soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:3000/chauffeurs', formData);

            setSuccess('Inscription réussie !');
            setFormData({ nom: '', prenom: '', email: '', password: '' });
        } catch (err) {
            setError('Erreur lors de l’inscription. Veuillez réessayer.');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Inscription
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* Champ Nom */}
                        <div className="mb-4">
                            <label
                                htmlFor="nom"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Nom :
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Votre nom"
                            />
                        </div>

                        {/* Champ Prénom */}
                        <div className="mb-4">
                            <label
                                htmlFor="prenom"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Prénom :
                            </label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Votre prénom"
                            />
                        </div>

                        {/* Champ Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Email :
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Votre email"
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Mot de passe :
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}

                        {/* Message de succès */}
                        {success && (
                            <div className="text-green-500 text-sm mb-4">{success}</div>
                        )}

                        {/* Bouton de soumission */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Chargement...' : 'S’inscrire'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

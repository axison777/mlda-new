import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-12 h-12 text-mdla-yellow" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Cette page est actuellement en cours de construction. Notre équipe travaille activement pour rendre cette fonctionnalité disponible prochainement.
            </p>
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-mdla-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
                <ArrowLeft className="w-5 h-5" />
                Retour
            </button>
        </div>
    );
};

export default PlaceholderPage;

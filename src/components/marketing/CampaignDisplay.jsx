import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, X } from 'lucide-react';
import api from '../../utils/api';

const CampaignDisplay = ({ placement }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveCampaigns();
    }, [placement]);

    // Auto-rotate campaigns if multiple exist for the same placement
    useEffect(() => {
        if (campaigns.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % campaigns.length);
        }, 8000); // Rotate every 8 seconds

        return () => clearInterval(interval);
    }, [campaigns.length]);

    const fetchActiveCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns/active');
            // Filter by the requested placement
            const placementCampaigns = data.filter(c => c.placement === placement);
            setCampaigns(placementCampaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const handleCampaignClick = async (campaign) => {
        try {
            // Track click in background
            api.post(`/campaigns/${campaign.id}/click`).catch(console.error);
            
            // Navigate or open URL
            if (campaign.url) {
                if (campaign.url.startsWith('http')) {
                    window.open(campaign.url, '_blank');
                } else {
                    navigate(campaign.url);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!isVisible || campaigns.length === 0) return null;

    const campaign = campaigns[currentIndex];

    // ----- PLACEMENT DESIGNS -----

    if (placement === 'top_banner') {
        return (
            <div className="bg-mdla-black text-mdla-yellow py-2 px-4 relative flex items-center justify-center text-sm font-medium transition-all duration-500 overflow-hidden group">
                <div 
                    className="flex items-center gap-4 cursor-pointer hover:underline"
                    onClick={() => handleCampaignClick(campaign)}
                >
                    <span className="animate-pulse bg-mdla-red text-white text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        NOUVEAU
                    </span>
                    <p>
                        {campaign.title} {campaign.promoPrice ? `- À partir de ${parseFloat(campaign.promoPrice).toLocaleString()} FCFA` : ''}
                    </p>
                    {campaign.buttonText && (
                        <span className="hidden sm:inline-block bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-xs font-bold transition-transform group-hover:scale-105">
                            {campaign.buttonText}
                        </span>
                    )}
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                    className="absolute right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    if (placement === 'hero') {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden group cursor-pointer" onClick={() => handleCampaignClick(campaign)}>
                <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors duration-500" />
                
                {campaign.imageUrl ? (
                    <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-900 to-mdla-black" />
                )}

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 text-white">
                    {campaign.eventDate && (
                        <span className="bg-mdla-red/90 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest mb-4 uppercase backdrop-blur-sm">
                            Événement • {new Date(campaign.eventDate.replace(' ', 'T')).toLocaleDateString()}
                        </span>
                    )}
                    
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg max-w-4xl">
                        {campaign.title}
                    </h2>
                    
                    {campaign.description && (
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md">
                            {campaign.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {campaign.buttonText && (
                            <button className="bg-mdla-yellow text-mdla-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-mdla-yellow/20">
                                {campaign.buttonText}
                            </button>
                        )}
                        {campaign.promoPrice && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                                <span className="text-sm text-gray-300 mr-2">Promo</span>
                                <span className="text-xl font-bold text-mdla-yellow">{parseFloat(campaign.promoPrice).toLocaleString()} FCFA</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Indicators for multiple campaigns */}
                {campaigns.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                        {campaigns.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-mdla-yellow' : 'w-4 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (placement === 'horizontal_middle') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div 
                    className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch cursor-pointer group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                    onClick={() => handleCampaignClick(campaign)}
                >
                    {/* Image Section */}
                    {campaign.imageUrl && (
                        <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                            <img 
                                src={campaign.imageUrl} 
                                alt={campaign.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden" />
                        </div>
                    )}
                    
                    {/* Content Section */}
                    <div className={`p-8 md:p-10 flex flex-col justify-center flex-1 relative ${!campaign.imageUrl ? 'bg-gradient-to-br from-gray-900 to-mdla-black text-white' : 'bg-white'}`}>
                        {campaign.promoPrice && (
                            <div className="absolute top-0 right-0 bg-mdla-red text-white px-6 py-2 rounded-bl-2xl font-bold shadow-lg">
                                PROMO {parseFloat(campaign.promoPrice).toLocaleString()} F
                            </div>
                        )}
                        
                        <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${!campaign.imageUrl ? 'text-white' : 'text-gray-900'}`}>
                            {campaign.title}
                        </h3>
                        
                        {campaign.description && (
                            <p className={`mb-6 text-lg line-clamp-2 ${!campaign.imageUrl ? 'text-gray-300' : 'text-gray-600'}`}>
                                {campaign.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            {campaign.eventDate && (
                                <div className={`flex items-center gap-2 ${!campaign.imageUrl ? 'text-gray-300' : 'text-gray-500'}`}>
                                    <Calendar className="w-5 h-5 text-mdla-yellow" />
                                    <span>{new Date(campaign.eventDate.replace(' ', 'T')).toLocaleDateString()}</span>
                                </div>
                            )}
                            {campaign.location && (
                                <div className={`flex items-center gap-2 ${!campaign.imageUrl ? 'text-gray-300' : 'text-gray-500'}`}>
                                    <MapPin className="w-5 h-5 text-mdla-yellow" />
                                    <span>{campaign.location}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <span className={`inline-block font-bold py-3 px-8 rounded-full transition-all transform group-hover:translate-x-2 ${
                                !campaign.imageUrl 
                                    ? 'bg-mdla-yellow text-mdla-black hover:bg-yellow-400' 
                                    : 'bg-mdla-black text-mdla-yellow hover:bg-gray-800'
                            }`}>
                                {campaign.buttonText || 'Découvrir l\'offre'} &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (placement === 'sidebar') {
        return (
            <div 
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-gray-100 mb-6"
                onClick={() => handleCampaignClick(campaign)}
            >
                {campaign.imageUrl && (
                    <div className="h-40 overflow-hidden relative">
                        <img 
                            src={campaign.imageUrl} 
                            alt={campaign.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {campaign.promoPrice && (
                            <div className="absolute bottom-2 left-2 bg-mdla-red text-white text-xs font-bold px-2 py-1 rounded">
                                {parseFloat(campaign.promoPrice).toLocaleString()} F
                            </div>
                        )}
                    </div>
                )}
                <div className="p-5">
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-mdla-yellow transition-colors line-clamp-2">
                        {campaign.title}
                    </h4>
                    {campaign.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {campaign.description}
                        </p>
                    )}
                    <span className="block w-full text-center bg-gray-50 text-mdla-black border border-gray-200 font-semibold py-2 rounded-lg group-hover:bg-mdla-yellow group-hover:border-mdla-yellow transition-colors text-sm">
                        {campaign.buttonText || 'En savoir plus'}
                    </span>
                </div>
            </div>
        );
    }

    return null;
};

export default CampaignDisplay;

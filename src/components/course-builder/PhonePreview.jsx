import React from 'react';
import { Volume2, ArrowRight, Check, X } from 'lucide-react';

const PhonePreview = ({ slide, totalSlides, currentIndex }) => {
    const handleSpeak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE'; // Force German accent
            window.speechSynthesis.speak(utterance);
        }
    };

    const renderContent = () => {
        if (!slide) return <div className="flex items-center justify-center h-full text-gray-400">Sélectionnez une carte</div>;

        switch (slide.type) {
            case 'vocab':
                return (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                        {slide.image && (
                            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg mb-4">
                                <img src={slide.image} alt={slide.de} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{slide.de}</h3>
                            <p className="text-xl text-gray-500">{slide.fr}</p>
                        </div>
                        <button
                            onClick={() => handleSpeak(slide.de)}
                            className="w-16 h-16 bg-mdla-yellow rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform active:scale-95"
                        >
                            <Volume2 className="w-8 h-8 text-mdla-black" />
                        </button>
                    </div>
                );

            case 'flashcard':
                return (
                    <div className="flex items-center justify-center h-full p-6 perspective-1000 group cursor-pointer">
                        <div className="relative w-full aspect-[3/4] transition-all duration-500 transform-style-3d group-hover:rotate-y-180">
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl border-2 border-mdla-yellow flex flex-col items-center justify-center p-8 text-center">
                                <span className="text-sm text-gray-400 uppercase tracking-widest mb-4">Question</span>
                                <h3 className="text-2xl font-bold text-gray-900">{slide.front}</h3>
                                <p className="text-gray-400 text-sm mt-8">(Cliquez pour retourner)</p>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-mdla-black rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
                                <span className="text-sm text-gray-400 uppercase tracking-widest mb-4">Réponse</span>
                                <h3 className="text-2xl font-bold text-mdla-yellow">{slide.back}</h3>
                            </div>
                        </div>
                    </div>
                );

            case 'quiz':
                return (
                    <div className="flex flex-col h-full p-6">
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{slide.question}</h3>
                            <div className="space-y-3">
                                {slide.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${idx === slide.answer
                                                ? 'border-green-500 bg-green-50 text-green-700' // Show correct for preview
                                                : 'border-gray-200 bg-white text-gray-700'
                                            }`}
                                    >
                                        {option}
                                        {idx === slide.answer && <Check className="w-5 h-5 float-right" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl mt-auto cursor-not-allowed">
                            Vérifier
                        </button>
                    </div>
                );

            default:
                return <div>Type inconnu</div>;
        }
    };

    return (
        <div className="w-[320px] h-[650px] bg-black rounded-[3rem] p-4 shadow-2xl border-8 border-gray-800 relative mx-auto">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

            {/* Screen */}
            <div className="bg-gray-50 w-full h-full rounded-[2rem] overflow-hidden flex flex-col relative">
                {/* Progress Bar */}
                <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-10">
                    {Array.from({ length: totalSlides || 1 }).map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${idx <= currentIndex ? 'bg-mdla-yellow' : 'bg-transparent'}`}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 mt-8 overflow-y-auto no-scrollbar">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PhonePreview;

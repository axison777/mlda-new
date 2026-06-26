import { User, Clock, CheckCircle, CreditCard, FileText } from 'lucide-react';

const CourseCard = ({ course, onAction, children }) => {
    const {
        id,
        title,
        instructor,
        Teacher,
        level,
        price,
        discount_price,
        inscription_fee,
        duration,
        features,
        thumbnail,
        description
    } = course;

    // Use instructor name from Teacher object if available
    const instructorName = instructor || Teacher?.name || 'Instructeur';

    const featuresList = Array.isArray(features) ? features : [];

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
            {/* Course Image */}
            <div className="relative overflow-hidden h-48 flex-shrink-0">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-mdla-yellow to-yellow-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-mdla-black opacity-20">MDLA Service</span>
                    </div>
                )}

                {/* Level Badge */}
                <div className="absolute top-4 right-4">
                    <span className="bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {level}
                    </span>
                </div>

                {/* Promo Badge */}
                {discount_price && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-mdla-red text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            PROMO
                        </span>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl font-bold text-mdla-black mb-2 line-clamp-2 group-hover:text-mdla-yellow transition-colors">
                    {title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{instructorName}</span>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Duration badge */}
                {duration && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 bg-mdla-yellow/15 text-mdla-black text-xs font-semibold px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {duration}
                        </span>
                    </div>
                )}

                {/* Features list (All items, 2 columns) */}
                {featuresList.length > 0 && (
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-4">
                        {featuresList.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 leading-tight">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price Section */}
                <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                    {/* Frais d'inscription */}
                    {inscription_fee && parseFloat(inscription_fee) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                                <CreditCard className="w-3.5 h-3.5" />
                                Frais d'inscription
                            </span>
                            <span className="font-semibold text-gray-700">
                                {parseFloat(inscription_fee).toLocaleString('fr-FR')} F
                            </span>
                        </div>
                    )}

                    {/* Coût de formation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Coût de formation</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            {discount_price ? (
                                <>
                                    <span className="text-gray-400 text-sm line-through">
                                        {parseFloat(price).toLocaleString('fr-FR')} F
                                    </span>
                                    <span className="text-mdla-red text-xl font-bold">
                                        {parseFloat(discount_price).toLocaleString('fr-FR')} F
                                    </span>
                                </>
                            ) : (
                                <span className="text-mdla-black text-xl font-bold">
                                    {parseFloat(price).toLocaleString('fr-FR')} F
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Total à prévoir (inscription + formation) */}
                    {inscription_fee && parseFloat(inscription_fee) > 0 && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Total à prévoir</span>
                            <span className="font-bold text-mdla-black text-base">
                                {(parseFloat(inscription_fee) + parseFloat(discount_price || price)).toLocaleString('fr-FR')} F
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-3">
                    {/* Action Button */}
                    <button
                        onClick={() => onAction && onAction(id)}
                        className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
                    >
                        Voir le cours
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

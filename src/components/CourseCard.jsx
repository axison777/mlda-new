import { User } from 'lucide-react';

const CourseCard = ({ course, onAction }) => {
    const {
        id,
        title,
        instructor,
        level,
        price,
        discount_price,
        image,
        description
    } = course;

    // Determine badge color based on level
    const getLevelColor = (level) => {
        const levelUpper = level.toUpperCase();
        if (levelUpper.includes('A1') || levelUpper.includes('A2')) return 'bg-green-500';
        if (levelUpper.includes('B1') || levelUpper.includes('B2')) return 'bg-blue-500';
        if (levelUpper.includes('C1') || levelUpper.includes('C2')) return 'bg-purple-500';
        return 'bg-mdla-yellow';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            {/* Course Image */}
            <div className="relative overflow-hidden h-48">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-mdla-yellow to-yellow-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-mdla-black opacity-20">MDLA</span>
                    </div>
                )}

                {/* Level Badge */}
                <div className="absolute top-4 right-4">
                    <span className="bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {level}
                    </span>
                </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-mdla-black mb-2 line-clamp-2 group-hover:text-mdla-yellow transition-colors">
                    {title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{instructor}</span>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Price Section */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                        {discount_price ? (
                            <>
                                {/* Original Price (Crossed Out) */}
                                <span className="text-gray-400 text-sm line-through">
                                    {price.toLocaleString()} FCFA
                                </span>
                                {/* Discount Price (Red, Large) */}
                                <span className="text-mdla-red text-2xl font-bold">
                                    {discount_price.toLocaleString()} FCFA
                                </span>
                            </>
                        ) : (
                            /* Normal Price (Black) */
                            <span className="text-mdla-black text-2xl font-bold">
                                {price.toLocaleString()} FCFA
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => onAction && onAction(id)}
                    className="w-full mt-4 bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
                >
                    Voir le cours
                </button>
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
    );
};

export default CourseCard;

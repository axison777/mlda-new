const KPICard = ({ title, value, icon: Icon, color = 'yellow', trend, subtitle }) => {
    const colorClasses = {
        yellow: {
            bg: 'bg-mdla-yellow',
            iconBg: 'bg-mdla-yellow',
            iconText: 'text-mdla-black',
            text: 'text-mdla-black'
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-500',
            iconText: 'text-white',
            text: 'text-green-600'
        },
        blue: {
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-500',
            iconText: 'text-white',
            text: 'text-blue-600'
        },
        red: {
            bg: 'bg-red-500',
            iconBg: 'bg-red-700',
            iconText: 'text-white',
            text: 'text-white'
        },
        purple: {
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-500',
            iconText: 'text-white',
            text: 'text-purple-600'
        },
        orange: {
            bg: 'bg-orange-50',
            iconBg: 'bg-orange-500',
            iconText: 'text-white',
            text: 'text-orange-600'
        }
    };

    const colors = colorClasses[color] || colorClasses.yellow;

    return (
        <div className={`${colors.bg} rounded-xl shadow-md p-6 transition-all hover:shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${color === 'red' ? 'text-white/80' : 'text-gray-600'} mb-1`}>
                        {title}
                    </p>
                    <p className={`text-3xl font-bold ${colors.text} mb-1`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-xs ${color === 'red' ? 'text-white/70' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{trend.positive ? '↑' : '↓'}</span>
                            <span>{trend.value}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.iconText}`} />
                </div>
            </div>
        </div>
    );
};

export default KPICard;

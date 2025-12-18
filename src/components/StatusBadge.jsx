const StatusBadge = ({ status, type = 'course' }) => {
    const getStatusConfig = () => {
        if (type === 'course') {
            const configs = {
                'draft': {
                    label: '🟡 Brouillon',
                    className: 'bg-gray-100 text-gray-800 border border-gray-300'
                },
                'pending': {
                    label: '🟠 En attente validation',
                    className: 'bg-orange-100 text-orange-800 border border-orange-300'
                },
                'published': {
                    label: '🟢 Publié',
                    className: 'bg-green-100 text-green-800 border border-green-300'
                }
            };
            return configs[status] || configs.draft;
        }

        if (type === 'tracking') {
            const configs = {
                'ordered': {
                    label: 'Commandé',
                    emoji: '📦',
                    className: 'bg-gray-100 text-gray-800'
                },
                'in_transit_sea': {
                    label: 'En Mer',
                    emoji: '🚢',
                    className: 'bg-blue-100 text-blue-800'
                },
                'customs': {
                    label: 'À la Douane',
                    emoji: '🛃',
                    className: 'bg-yellow-100 text-yellow-800'
                },
                'delivery': {
                    label: 'En Livraison',
                    emoji: '🚚',
                    className: 'bg-orange-100 text-orange-800'
                },
                'delivered': {
                    label: 'Livré',
                    emoji: '✅',
                    className: 'bg-green-100 text-green-800'
                }
            };
            return configs[status] || configs.ordered;
        }

        return { label: status, className: 'bg-gray-100 text-gray-800' };
    };

    const config = getStatusConfig();

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
            {config.emoji && <span>{config.emoji}</span>}
            <span>{config.label}</span>
        </span>
    );
};

export default StatusBadge;

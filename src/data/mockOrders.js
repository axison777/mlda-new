// Tracking steps with emojis
export const trackingSteps = {
    'ordered': { label: 'Commandé', emoji: '📦', color: 'bg-gray-100 text-gray-800' },
    'in_transit_sea': { label: 'En Mer', emoji: '🚢', color: 'bg-blue-100 text-blue-800' },
    'customs': { label: 'À la Douane', emoji: '🛃', color: 'bg-yellow-100 text-yellow-800' },
    'delivery': { label: 'En Livraison', emoji: '🚚', color: 'bg-orange-100 text-orange-800' },
    'delivered': { label: 'Livré', emoji: '✅', color: 'bg-green-100 text-green-800' }
};

// Mock orders with tracking information
export const mockOrders = [
    {
        id: 1,
        trackingNumber: 'MDLA-2024-001',
        product: {
            model: 'BMW X5',
            brand: 'BMW',
            year: 2023,
            image: '/api/placeholder/400/300'
        },
        customer: {
            name: 'Jean Dupont',
            email: 'jean@example.com',
            phone: '+226 70 12 34 56'
        },
        status: 'in_transit_sea',
        currentLocation: 'Océan Atlantique',
        origin: 'Hambourg, Allemagne',
        destination: 'Ouagadougou, Burkina Faso',
        orderDate: '2024-11-20',
        estimatedDelivery: '2024-12-20',
        amount: 25000000, // CFA
        timeline: [
            { step: 'ordered', date: '2024-11-20', completed: true },
            { step: 'in_transit_sea', date: '2024-12-01', completed: true },
            { step: 'customs', date: null, completed: false },
            { step: 'delivery', date: null, completed: false },
            { step: 'delivered', date: null, completed: false }
        ]
    },
    {
        id: 2,
        trackingNumber: 'MDLA-2024-002',
        product: {
            model: 'Mercedes-Benz C-Class',
            brand: 'Mercedes-Benz',
            year: 2024,
            image: '/api/placeholder/400/300'
        },
        customer: {
            name: 'Marie Kaboré',
            email: 'marie@example.com',
            phone: '+226 70 98 76 54'
        },
        status: 'customs',
        currentLocation: 'Port d\'Abidjan',
        origin: 'Berlin, Allemagne',
        destination: 'Bobo-Dioulasso, Burkina Faso',
        orderDate: '2024-11-15',
        estimatedDelivery: '2024-12-18',
        amount: 28000000, // CFA
        timeline: [
            { step: 'ordered', date: '2024-11-15', completed: true },
            { step: 'in_transit_sea', date: '2024-11-25', completed: true },
            { step: 'customs', date: '2024-12-10', completed: true },
            { step: 'delivery', date: null, completed: false },
            { step: 'delivered', date: null, completed: false }
        ]
    },
    {
        id: 3,
        trackingNumber: 'MDLA-2024-003',
        product: {
            model: 'Audi A4',
            brand: 'Audi',
            year: 2023,
            image: '/api/placeholder/400/300'
        },
        customer: {
            name: 'Sophie Sawadogo',
            email: 'sophie@example.com',
            phone: '+226 70 55 44 33'
        },
        status: 'delivery',
        currentLocation: 'En route vers Ouagadougou',
        origin: 'Munich, Allemagne',
        destination: 'Ouagadougou, Burkina Faso',
        orderDate: '2024-11-10',
        estimatedDelivery: '2024-12-16',
        amount: 22000000, // CFA
        timeline: [
            { step: 'ordered', date: '2024-11-10', completed: true },
            { step: 'in_transit_sea', date: '2024-11-20', completed: true },
            { step: 'customs', date: '2024-12-05', completed: true },
            { step: 'delivery', date: '2024-12-14', completed: true },
            { step: 'delivered', date: null, completed: false }
        ]
    }
];

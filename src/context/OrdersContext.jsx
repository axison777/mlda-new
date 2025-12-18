import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
};

// Mock orders data
const MOCK_ORDERS = [
    {
        id: 'MDL-8842',
        trackingNumber: 'MDL-8842',
        userId: 1, // Jean Dupont (client@mdla.bf)
        type: 'vehicle',
        product: {
            model: 'BMW X5 xDrive30d',
            vin: 'WBAKR8C50JB123456',
            image: 'https://placehold.co/600x400?text=BMW+X5'
        },
        orderDate: '2025-12-01',
        destination: 'Ouagadougou, Burkina Faso',
        estimatedDelivery: '2025-12-20',
        status: 'in_transit',
        currentStep: 4,
        totalAmount: 15000000,
        steps: [
            { id: 1, title: 'Commande Validée', date: '01 Déc 2025', status: 'completed', description: 'Acompte reçu. Dossier ouvert.' },
            { id: 2, title: 'Achat & Enlèvement', date: '03 Déc 2025', status: 'completed', description: 'Véhicule récupéré à Berlin.' },
            { id: 3, title: 'Transit vers le Port', date: '05 Déc 2025', status: 'completed', description: 'Arrivé à Hambourg. En attente de chargement.' },
            { id: 4, title: 'Expédition Maritime', date: 'En cours', status: 'current', description: 'Navire : MSC LIRICA. Départ imminent.' },
            { id: 5, title: 'Dédouanement', date: 'Estimé 20 Déc 2025', status: 'pending', description: 'Port de Lomé/Cotonou.' },
            { id: 6, title: 'Livraison Finale', date: '-', status: 'pending', description: 'Mise à disposition client.' }
        ]
    },
    {
        id: 'MDL-7721',
        trackingNumber: 'MDL-7721',
        userId: 1,
        type: 'vehicle',
        product: {
            model: 'Mercedes-Benz C-Class',
            vin: 'WDD2050071F123456',
            image: 'https://placehold.co/600x400?text=Mercedes+C-Class'
        },
        orderDate: '2025-11-15',
        destination: 'Ouagadougou, Burkina Faso',
        estimatedDelivery: '2025-12-10',
        status: 'delivered',
        currentStep: 6,
        totalAmount: 12500000,
        steps: [
            { id: 1, title: 'Commande Validée', date: '15 Nov 2025', status: 'completed', description: 'Acompte reçu. Dossier ouvert.' },
            { id: 2, title: 'Achat & Enlèvement', date: '18 Nov 2025', status: 'completed', description: 'Véhicule récupéré à Stuttgart.' },
            { id: 3, title: 'Transit vers le Port', date: '20 Nov 2025', status: 'completed', description: 'Arrivé à Hambourg.' },
            { id: 4, title: 'Expédition Maritime', date: '22 Nov 2025', status: 'completed', description: 'Navire : MSC MEDITERRANEAN.' },
            { id: 5, title: 'Dédouanement', date: '05 Déc 2025', status: 'completed', description: 'Port de Lomé.' },
            { id: 6, title: 'Livraison Finale', date: '08 Déc 2025', status: 'completed', description: 'Véhicule livré au client.' }
        ]
    },
    {
        id: 'MDL-9103',
        trackingNumber: 'MDL-9103',
        userId: 2, // Admin (admin@mdla.bf)
        type: 'product',
        product: {
            model: 'Lot de pièces détachées BMW',
            image: 'https://placehold.co/600x400?text=BMW+Parts'
        },
        orderDate: '2025-12-05',
        destination: 'Bobo-Dioulasso, Burkina Faso',
        estimatedDelivery: '2025-12-25',
        status: 'processing',
        currentStep: 2,
        totalAmount: 2500000,
        steps: [
            { id: 1, title: 'Commande Validée', date: '05 Déc 2025', status: 'completed', description: 'Paiement reçu.' },
            { id: 2, title: 'Préparation', date: 'En cours', status: 'current', description: 'Collecte des pièces en Allemagne.' },
            { id: 3, title: 'Expédition', date: 'Estimé 15 Déc 2025', status: 'pending', description: 'Envoi par cargo.' },
            { id: 4, title: 'Livraison', date: 'Estimé 25 Déc 2025', status: 'pending', description: 'Livraison finale.' }
        ]
    }
];

export const OrdersProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState(MOCK_ORDERS);

    const getMyOrders = () => {
        if (!user) return [];
        return orders.filter(order => order.userId === user.id);
    };

    const getOrderByTracking = (trackingNumber) => {
        return orders.find(order => order.trackingNumber === trackingNumber);
    };

    const getAllOrders = () => {
        return orders;
    };

    const createOrder = (orderData) => {
        const newOrder = {
            id: `MDL-${Math.floor(1000 + Math.random() * 9000)}`,
            trackingNumber: `MDL-${Math.floor(1000 + Math.random() * 9000)}`,
            userId: user?.id,
            ...orderData,
            orderDate: new Date().toISOString().split('T')[0],
            status: 'processing',
            currentStep: 1
        };
        setOrders([...orders, newOrder]);
        return newOrder;
    };

    const value = {
        orders,
        getMyOrders,
        getOrderByTracking,
        getAllOrders,
        createOrder
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

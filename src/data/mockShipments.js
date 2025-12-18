import { mockOrders } from './mockOrders';

// Export orders as shipments for transit dashboard
export const mockShipments = mockOrders.map(order => ({
    id: order.id,
    trackingNumber: order.trackingNumber,
    client: order.customer.name,
    clientEmail: order.customer.email,
    clientPhone: order.customer.phone,
    vehicle: `${order.product.brand} ${order.product.model}`,
    vehicleYear: order.product.year,
    currentStep: order.status,
    currentLocation: order.currentLocation,
    origin: order.origin,
    destination: order.destination,
    orderDate: order.orderDate,
    estimatedDelivery: order.estimatedDelivery,
    timeline: order.timeline,
    lastUpdate: order.timeline.filter(t => t.completed).pop()?.date || order.orderDate,
    comments: []
}));

// Add some additional shipments
mockShipments.push(
    {
        id: 4,
        trackingNumber: 'MDLA-2024-004',
        client: 'Ousmane Koné',
        clientEmail: 'ousmane.k@example.com',
        clientPhone: '+226 70 22 33 44',
        vehicle: 'Volkswagen Golf',
        vehicleYear: 2023,
        currentStep: 'ordered',
        currentLocation: 'Port de Hambourg',
        origin: 'Hambourg, Allemagne',
        destination: 'Ouagadougou, Burkina Faso',
        orderDate: '2024-12-14',
        estimatedDelivery: '2025-01-15',
        timeline: [
            { step: 'ordered', date: '2024-12-14', completed: true },
            { step: 'in_transit_sea', date: null, completed: false },
            { step: 'customs', date: null, completed: false },
            { step: 'delivery', date: null, completed: false },
            { step: 'delivered', date: null, completed: false }
        ],
        lastUpdate: '2024-12-14',
        comments: []
    },
    {
        id: 5,
        trackingNumber: 'MDLA-2024-005',
        client: 'Aminata Compaoré',
        clientEmail: 'aminata.c@example.com',
        clientPhone: '+226 70 66 77 88',
        vehicle: 'Peugeot 3008',
        vehicleYear: 2024,
        currentStep: 'delivered',
        currentLocation: 'Livré à Ouagadougou',
        origin: 'Paris, France',
        destination: 'Ouagadougou, Burkina Faso',
        orderDate: '2024-10-20',
        estimatedDelivery: '2024-11-25',
        timeline: [
            { step: 'ordered', date: '2024-10-20', completed: true },
            { step: 'in_transit_sea', date: '2024-10-30', completed: true },
            { step: 'customs', date: '2024-11-15', completed: true },
            { step: 'delivery', date: '2024-11-22', completed: true },
            { step: 'delivered', date: '2024-11-24', completed: true }
        ],
        lastUpdate: '2024-11-24',
        comments: [
            { date: '2024-11-24', text: 'Véhicule livré et inspecté par le client' }
        ]
    }
);

// Mock recent actions for admin dashboard
export const mockRecentActions = [
    {
        id: 1,
        type: 'registration',
        user: {
            name: 'Marie Kaboré',
            email: 'marie.kabore@example.com'
        },
        course: 'Allemand A1',
        date: '2024-12-14T15:30:00',
        timestamp: new Date('2024-12-14T15:30:00').getTime()
    },
    {
        id: 2,
        type: 'order',
        user: {
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com'
        },
        product: 'BMW X5',
        amount: 25000000, // CFA
        date: '2024-12-14T14:20:00',
        timestamp: new Date('2024-12-14T14:20:00').getTime()
    },
    {
        id: 3,
        type: 'registration',
        user: {
            name: 'Sophie Sawadogo',
            email: 'sophie.s@example.com'
        },
        course: 'Allemand B1',
        date: '2024-12-14T10:15:00',
        timestamp: new Date('2024-12-14T10:15:00').getTime()
    },
    {
        id: 4,
        type: 'order',
        user: {
            name: 'Amadou Traoré',
            email: 'amadou.t@example.com'
        },
        product: 'Mercedes-Benz C-Class',
        amount: 28000000, // CFA
        date: '2024-12-13T16:45:00',
        timestamp: new Date('2024-12-13T16:45:00').getTime()
    },
    {
        id: 5,
        type: 'registration',
        user: {
            name: 'Ibrahim Ouédraogo',
            email: 'ibrahim.o@example.com'
        },
        course: 'Business Deutsch',
        date: '2024-12-13T14:30:00',
        timestamp: new Date('2024-12-13T14:30:00').getTime()
    },
    {
        id: 6,
        type: 'order',
        user: {
            name: 'Fatima Diallo',
            email: 'fatima.d@example.com'
        },
        product: 'Audi A4',
        amount: 22000000, // CFA
        date: '2024-12-13T11:20:00',
        timestamp: new Date('2024-12-13T11:20:00').getTime()
    },
    {
        id: 7,
        type: 'registration',
        user: {
            name: 'Karim Sanogo',
            email: 'karim.s@example.com'
        },
        course: 'Allemand A2',
        date: '2024-12-12T17:00:00',
        timestamp: new Date('2024-12-12T17:00:00').getTime()
    }
];

// Sort by timestamp (most recent first)
mockRecentActions.sort((a, b) => b.timestamp - a.timestamp);

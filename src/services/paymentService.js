// Mock Payment Service - Simulation pour démo
export const paymentService = {
    // Simule un paiement Orange Money
    processOrangeMoney: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulation: 90% de succès
                const success = Math.random() > 0.1;

                if (success) {
                    resolve({
                        success: true,
                        transactionId: `OM-${Date.now()}`,
                        reference: `REF-${Math.floor(Math.random() * 1000000)}`,
                        amount: data.amount,
                        phoneNumber: data.phoneNumber,
                        message: 'Paiement Orange Money réussi'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Solde insuffisant ou transaction annulée',
                        message: 'Échec du paiement Orange Money'
                    });
                }
            }, 2000); // Simule 2 secondes de traitement
        });
    },

    // Simule un paiement par carte Visa
    processCardPayment: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Validation simple du numéro de carte (Luhn non implémenté pour démo)
                const success = data.cardNumber.length === 16 && Math.random() > 0.1;

                if (success) {
                    resolve({
                        success: true,
                        transactionId: `VISA-${Date.now()}`,
                        reference: `AUTH-${Math.floor(Math.random() * 1000000)}`,
                        amount: data.amount,
                        last4: data.cardNumber.slice(-4),
                        message: 'Paiement par carte réussi'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Carte refusée ou informations invalides',
                        message: 'Échec du paiement par carte'
                    });
                }
            }, 2500);
        });
    },

    // Simule un paiement PayPal
    processPayPal: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.05; // 95% de succès

                if (success) {
                    resolve({
                        success: true,
                        transactionId: `PP-${Date.now()}`,
                        reference: `PAYPAL-${Math.floor(Math.random() * 1000000)}`,
                        amount: data.amount,
                        email: data.email,
                        message: 'Paiement PayPal réussi'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Connexion PayPal échouée',
                        message: 'Échec du paiement PayPal'
                    });
                }
            }, 1500);
        });
    },

    // Calcul des frais de transaction
    calculateFees: (amount, method) => {
        const feeRates = {
            orange_money: 0.015, // 1.5%
            visa: 0.025, // 2.5%
            paypal: 0.029 // 2.9%
        };

        const fee = amount * (feeRates[method] || 0);
        return {
            subtotal: amount,
            fees: Math.round(fee),
            total: amount + Math.round(fee)
        };
    },

    // Vérification du statut d'une transaction
    verifyTransaction: async (transactionId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    transactionId,
                    status: 'completed',
                    verifiedAt: new Date().toISOString()
                });
            }, 1000);
        });
    }
};

// Méthodes de paiement disponibles
export const PAYMENT_METHODS = {
    orange_money: {
        id: 'orange_money',
        name: 'Orange Money',
        description: 'Paiement mobile via Orange Money',
        icon: 'Smartphone',
        color: 'orange',
        countries: ['BF', 'CI', 'ML', 'SN'],
        minAmount: 100,
        maxAmount: 1000000
    },
    visa: {
        id: 'visa',
        name: 'Carte Visa',
        description: 'Paiement sécurisé par carte bancaire',
        icon: 'CreditCard',
        color: 'blue',
        countries: ['ALL'],
        minAmount: 1000,
        maxAmount: 10000000
    },
    paypal: {
        id: 'paypal',
        name: 'PayPal',
        description: 'Paiement international via PayPal',
        icon: 'Wallet',
        color: 'blue',
        countries: ['ALL'],
        minAmount: 1000,
        maxAmount: 50000000
    }
};

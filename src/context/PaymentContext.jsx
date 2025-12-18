import { createContext, useContext, useState } from 'react';
import { paymentService } from '../services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const processPayment = async (paymentData) => {
        setIsProcessing(true);

        try {
            let result;

            switch (paymentData.method) {
                case 'orange_money':
                    result = await paymentService.processOrangeMoney(paymentData);
                    break;
                case 'visa':
                    result = await paymentService.processCardPayment(paymentData);
                    break;
                case 'paypal':
                    result = await paymentService.processPayPal(paymentData);
                    break;
                default:
                    throw new Error('Méthode de paiement non supportée');
            }

            if (result.success) {
                // Enregistrer la transaction
                const transaction = {
                    id: result.transactionId,
                    ...paymentData,
                    ...result,
                    createdAt: new Date().toISOString(),
                    status: 'completed'
                };

                setTransactions(prev => [transaction, ...prev]);

                // Sauvegarder dans localStorage
                const savedTransactions = JSON.parse(localStorage.getItem('mdla-transactions') || '[]');
                localStorage.setItem('mdla-transactions', JSON.stringify([transaction, ...savedTransactions]));
            }

            setIsProcessing(false);
            return result;

        } catch (error) {
            setIsProcessing(false);
            return {
                success: false,
                error: error.message,
                message: 'Erreur lors du traitement du paiement'
            };
        }
    };

    const getTransactionHistory = (userId) => {
        const savedTransactions = JSON.parse(localStorage.getItem('mdla-transactions') || '[]');
        if (userId) {
            return savedTransactions.filter(t => t.userId === userId);
        }
        return savedTransactions;
    };

    const calculateTotal = (amount, method) => {
        return paymentService.calculateFees(amount, method);
    };

    const value = {
        transactions,
        isProcessing,
        processPayment,
        getTransactionHistory,
        calculateTotal
    };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

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
            const { data } = await api.post('/payments/process', paymentData);

            if (data.success) {
                // Add transaction to local state
                setTransactions(prev => [data.payment, ...prev]);
            }

            setIsProcessing(false);
            return data;

        } catch (error) {
            setIsProcessing(false);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                message: error.response?.data?.message || 'Erreur lors du traitement du paiement'
            };
        }
    };

    const getTransactionHistory = async () => {
        try {
            const { data } = await api.get('/payments/transactions');
            setTransactions(data);
            return data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    };

    const calculateTotal = async (amount, method) => {
        try {
            const { data } = await api.post('/payments/calculate-fees', { amount, method });
            return data;
        } catch (error) {
            console.error('Error calculating fees:', error);
            // Fallback to local calculation
            const feeRates = {
                orange_money: 0.015,
                visa: 0.025,
                paypal: 0.029,
                bank_transfer: 0.01
            };
            const fee = amount * (feeRates[method] || 0);
            return {
                subtotal: amount,
                fees: Math.round(fee),
                total: amount + Math.round(fee)
            };
        }
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

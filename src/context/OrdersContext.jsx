import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const OrdersContext = createContext();

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
};

export const OrdersProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch orders when user logs in
    useEffect(() => {
        if (user) {
            if (['admin', 'transit'].includes(user.role)) {
                fetchAllOrders();
            } else {
                fetchMyOrders();
            }
        } else {
            setOrders([]);
        }
    }, [user]);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders/all');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching all orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderByTracking = async (trackingNumber) => {
        try {
            const { data } = await api.get(`/orders/track/${trackingNumber}`);
            return data;
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    };

    const getAllOrders = async () => {
        try {
            const { data } = await api.get('/orders/all');
            return data;
        } catch (error) {
            console.error('Error fetching all orders:', error);
            return [];
        }
    };

    const createOrder = async (orderData) => {
        try {
            const { data } = await api.post('/orders', orderData);
            // Refetch to ensure we have full object with associations
            if (['admin', 'transit'].includes(user.role)) {
                await fetchAllOrders();
            } else {
                await fetchMyOrders();
            }
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const updateOrderStatus = async (orderId, statusData) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, statusData);
            // Refetch to ensure we have full object with associations
            if (['admin', 'transit'].includes(user.role)) {
                await fetchAllOrders();
            } else {
                await fetchMyOrders();
            }
            return data;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    };

    const value = {
        orders,
        loading,
        getOrderByTracking,
        getAllOrders,
        createOrder,
        updateOrderStatus,
        refreshOrders: () => (user && ['admin', 'transit'].includes(user.role)) ? fetchAllOrders() : fetchMyOrders()
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

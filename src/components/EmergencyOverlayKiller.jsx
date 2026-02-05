import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Emergency Overlay Killer
 * Press Ctrl+Shift+X to force close all overlays and reset modal states
 */
const EmergencyOverlayKiller = () => {
    const { setIsCartOpen } = useCart();

    useEffect(() => {
        const handleEmergencyClose = (e) => {
            // Ctrl+Shift+X to force close everything
            if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                console.log('🚨 EMERGENCY OVERLAY KILLER ACTIVATED');

                // Close cart
                setIsCartOpen(false);

                // Remove all fixed/absolute overlays with high z-index
                const overlays = document.querySelectorAll('.fixed.inset-0, .absolute.inset-0');
                overlays.forEach(overlay => {
                    const zIndex = parseInt(window.getComputedStyle(overlay).zIndex);
                    if (zIndex > 30) {
                        overlay.remove();
                        console.log('Removed overlay:', overlay);
                    }
                });

                // Clear any stuck modals in localStorage
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('modal') || key.includes('open') || key.includes('show')) {
                        localStorage.removeItem(key);
                    }
                });

                alert('✅ Tous les overlays ont été fermés ! La page devrait être utilisable maintenant.');
            }
        };

        document.addEventListener('keydown', handleEmergencyClose);
        return () => document.removeEventListener('keydown', handleEmergencyClose);
    }, [setIsCartOpen]);

    return null; // This component doesn't render anything
};

export default EmergencyOverlayKiller;

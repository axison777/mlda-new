/**
 * Logistics Status Mapping (Frontend)
 * Synchronized with backend utils/logisticsStatus.js
 */

export const LOGISTICS_STATUS = {
    // Phase 1: Départ
    DOSSIER_OUVERT: { clientTitle: "Prise en charge", phase: "Départ", color: "blue", label: "Dossier Ouvert" },
    RAMASSAGE: { clientTitle: "Prise en charge", phase: "Départ", color: "blue", label: "Ramassage" },
    FORMALITES_EXPORT: { clientTitle: "En cours d'expédition", phase: "Départ", color: "blue", label: "Formalités Export" },
    EMBARQUEMENT: { clientTitle: "En cours d'expédition", phase: "Départ", color: "blue", label: "Embarquement" },

    // Phase 2: Transit
    EN_MER: { clientTitle: "En transit", phase: "Transit", color: "yellow", label: "En Mer" },
    EN_VOL: { clientTitle: "En transit", phase: "Transit", color: "yellow", label: "En Vol" },
    ARRIVEE_PORT: { clientTitle: "En transit", phase: "Transit", color: "yellow", label: "Arrivée Port" },

    // Phase 3: Douane
    DEPOT_DOUANE: { clientTitle: "Formalités Douanières", phase: "Douane", color: "orange", label: "Dépôt Douane" },
    COTATION: { clientTitle: "Formalités Douanières", phase: "Douane", color: "orange", label: "Cotation" },
    VISITE_SCANNER: { clientTitle: "Formalités Douanières", phase: "Douane", color: "orange", label: "Visite/Scanner" },
    BAE_VALIDE: { clientTitle: "Dédouané", phase: "Douane", color: "green", label: "BAE Validé" },

    // Phase 4: Livraison
    SORTIE_TERMINAL: { clientTitle: "En livraison", phase: "Livraison", color: "blue", label: "Sortie Terminal" },
    LIVRAISON_COURS: { clientTitle: "En livraison", phase: "Livraison", color: "blue", label: "Livraison en cours" },
    LIVRE: { clientTitle: "Livré", phase: "Livraison", color: "green", label: "Livré" }
};

export const getClientStatus = (internalStatus) => {
    return LOGISTICS_STATUS[internalStatus] || { clientTitle: internalStatus, phase: "Traitement", color: "gray", label: internalStatus };
};

export const getStatusPhase = (internalStatus) => {
    const status = getClientStatus(internalStatus);
    const phases = ["Départ", "Transit", "Douane", "Livraison"];
    const currentIdx = phases.indexOf(status.phase);
    return {
        phase: status.phase,
        progress: currentIdx === -1 ? 0 : ((currentIdx + 1) / phases.length) * 100
    };
};

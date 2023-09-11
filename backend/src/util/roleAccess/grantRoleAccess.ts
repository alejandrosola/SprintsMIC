import { AccessControl } from "accesscontrol";

const grantsObject: any = {
    ADMIN: {
        faq: {
            'read:any': ['*'],
        },
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        places: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        user: {
            'read:any': ['*'],
            'update:any': ['*'],
            'update:own': ['*'],
            'read:own': ['*'],
        }
    },
    GESTION_MIC: {
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        places: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*']
        }
    },
    CONSUMIDOR: {
        faq: {
            'read:any': ['*'],
        },
        // Solicitudes de alta de organización
        organizationRequest: {
            'create:own': ['*'],
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        },
        // Lista de organizaciones y propias
        organizations: {
            'read:any': ['*'],
            'update:any': ['*'],
            // 'delete:any': ['*']
        },
        places: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            // 'delete:any': ['*']
        },
        user: {
            'read:own': ['*'],
            'update:own': ['*']
        }
    }
};

const ac = new AccessControl(grantsObject);

export default ac;

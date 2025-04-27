import { STORAGE_KEYS, ACTIVE_ROLE_KEY } from "@src/constants";
import { toast } from 'react-hot-toast';

export const setActiveRole = (role: keyof typeof STORAGE_KEYS) => {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
};

export const getActiveRole = (): keyof typeof STORAGE_KEYS | null => {
    const role = localStorage.getItem(ACTIVE_ROLE_KEY);
    return role as keyof typeof STORAGE_KEYS || null;
};

export const getToken = (role: keyof typeof STORAGE_KEYS) => {
    const data = localStorage.getItem(STORAGE_KEYS[role]);
    return data ? JSON.parse(data).accessToken : null;
};

export const setToken = (
    role: keyof typeof STORAGE_KEYS,
    payload: { accessToken: string;[key: string]: any }
) => {
    localStorage.setItem(STORAGE_KEYS[role], JSON.stringify(payload));
    setActiveRole(role); // set the active role
};

export const getAuthUser: any = (role?: keyof typeof STORAGE_KEYS) => {
    try {
        const resolvedRole = role || getActiveRole();
        if (!resolvedRole) return null;
        const data = localStorage.getItem(STORAGE_KEYS[resolvedRole]);
        if (!data) return null;
        const parsed = JSON.parse(data);
        return parsed[resolvedRole] || null;
    } catch {
        return null;
    }
};

export const removeToken = (role?: keyof typeof STORAGE_KEYS) => {
    const resolvedRole = role || getActiveRole();
    if (resolvedRole) {
        localStorage.removeItem(STORAGE_KEYS[resolvedRole]);
    }
    localStorage.removeItem(ACTIVE_ROLE_KEY);
};


export const sendMailTo = ({ emailAddress = "", subject = "Hello", body = "I would like to connect with you." }) => {
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
};


export const formatCsvDataForBackend = (data: string[][], headers: string[]) => {
    return data?.map((row) => {
        return {
            debtorName: row[headers?.indexOf("Debtor Name")],
            demographics: {
                age: parseInt(row[headers.indexOf("Age")]),
                gender: row[headers.indexOf("Gender")],
                location: row[headers.indexOf("Location")]
            },
            principalAmount: parseFloat(row[headers.indexOf("Principal Amount")]),
            interest: parseFloat(row[headers.indexOf("Interest")]),
            debtAgeInMonths: parseInt(row[headers.indexOf("Debt Age")]),
            lastPaymentDate: new Date(row[headers.indexOf("Last Payment Date")]),
            collectionAttempts: parseInt(row[headers.indexOf("Collection Attempts")]),
            expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)) // Auto-set 6 months expiry
        };
    });
};





export const SuccessNotification = (message: string = 'Success!') => {
    toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#10b981', // Tailwind green-500
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: 500,
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    });
};

export const ErrorNotification = (message: string = 'Something went wrong') => {
    toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
            background: '#ef4444', // Tailwind red-500
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: 500,
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
        },
    });
};





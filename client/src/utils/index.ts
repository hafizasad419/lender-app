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


export const formatDebtType = (raw: string) =>
    raw
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  


/**
 * Obfuscates a name by keeping the first letter and last 2 letters visible
 * and replacing the rest with asterisks
 * @param name The name to obfuscate
 * @returns The obfuscated name
 */
export const obfuscateName = (name: string): string => {
    if (!name) return ""
  
    // Split the name into parts (first name, last name, etc.)
    const nameParts = name.split(" ")
  
    // Process each part of the name
    const obfuscatedParts = nameParts.map((part) => {
      if (part.length <= 4) {
        // For very short names, just show first letter and asterisks
        return `${part.charAt(0)}${"*".repeat(part.length - 1)}`
      } else {
        // For longer names, show first letter, asterisks, and last 2 letters
        const firstChar = part.charAt(0)
        const lastOneChar = part.slice(-1)
        const middleLength = part.length - 2
        const asterisks = "*".repeat(middleLength)
  
        return `${firstChar}${asterisks}${lastOneChar}`
      }
    })
  
    // Join the parts back together
    return obfuscatedParts.join(" ")
  }





/**
 * Calculates collector payout based on bid type.
 * @param totalAmount - Total debt portfolio amount.
 * @param percentage - Percentage offered by collector (e.g., 25 means 25%).
 * @returns Amount the collector will receive.
 */
export function calculateCollectorPayout(totalAmount: number, percentage: number): number {
    if (percentage < 0 || percentage > 100 || totalAmount < 0) return 0;
    return +(totalAmount * (percentage / 100)).toFixed(2); // Rounded to 2 decimal places
  }
  





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





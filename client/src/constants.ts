export const BASE_URL = import.meta.env.VITE_NODE_ENV === 'development'
  ? 'http://localhost:5000/api/v1'  // For development
  : 'https://lender-app-backend.vercel.app/api/v1';  // For production
// export const BASE_URL = 'http://localhost:5000/api/v1';  


// export const LENDER_APP_ACCESS = "lender-app-access"
export const STORAGE_KEYS = {
  lender: "LENDER_APP_ACCESS",
  collector: "COLLECTOR_APP_ACCESS",
  admin: "ADMIN_APP_ACCESS",
};

export const ACTIVE_ROLE_KEY = "ACTIVE_USER_ROLE";

export const CSV_UPLOAD_COLUMNS = [
    "Debtor Name", 
    "Principal Amount", 
    "Interest", 
    "Last Payment Date", 
    "Collection Attempts",
    "Debt Age", 
    "Age", 
    "Gender", 
    "Location"
  ];

  export const DEBT_TYPES = [
    { label: "Credit Card", value: "credit_card" },
    { label: "Student Loan", value: "student_loan" },
    { label: "Auto Loan", value: "auto_loan" },
    { label: "Mortgage", value: "mortgage" },
    { label: "Medical Debt", value: "medical_debt" },
    { label: "Payday Loan", value: "payday_loan" },
    { label: "Business Debt", value: "business_debt" },
    { label: "Other", value: "other" },
  ];


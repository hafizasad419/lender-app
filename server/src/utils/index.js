import express from "express";
import { IS_PRODUCTION } from "../constants.js";

export const handleError = (
    res,
    error,
    defaultStatusCode,
    defaultMessage = "Sorry, Something Went Wrong.") => {
    console.error("Error:", error?.message || error);

    const statusCode = error instanceof AppError ? error.statusCode : defaultStatusCode;

    res.
        status(statusCode)
        .json({
            error: IS_PRODUCTION
                ? `${defaultMessage} (Code: ${statusCode})`
                : error?.message || defaultMessage,
        });
};


export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}



// export const saveDebtEntries = async (debtEntries) => {
//     const debtEntryModels = debtEntries.map((entry) => new DebtEntry(entry));
//     await DebtEntry.insertMany(debtEntryModels);
//   };

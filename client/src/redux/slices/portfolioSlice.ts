import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioListing {
    portfolioId: string;
    portfolioName: string;
    portfolioFaceValue: number;
    averageDebtAgeInMonths: number;
    averageDebtSize: number;
    postedDaysAgo: number;
    lenderName: string;
    lenderOrganization: string;
    totalDebtors: number;
}

interface Pagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

interface PortfolioState {
    listings: PortfolioListing[];
    pagination: Pagination | null;
    hasFetched: boolean;
}

const initialState: PortfolioState = {
    listings: [],
    pagination: null,
    hasFetched: false,
};

const portfolioSlice = createSlice({
    name: "portfolioListings",
    initialState,
    reducers: {
        portfoliosFetched: (
            state,
            action: PayloadAction<{ listings: PortfolioListing[]; pagination: Pagination }>
        ) => {
            state.listings = action.payload.listings;
            state.pagination = action.payload.pagination;
            state.hasFetched = true;
        },
        clearPortfolios: () => initialState,
    },
});

export const { portfoliosFetched, clearPortfolios } = portfolioSlice.actions;
export default portfolioSlice.reducer;

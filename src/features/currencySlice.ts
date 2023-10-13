import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

export interface CurrencyData {
    [key: string]: number
};

export interface CurrencyState {
    ccy: string,
    rate: number,
    fx_data: CurrencyData
};

const initialState: CurrencyState = {
    ccy: "USD",
    rate: 1.0,
    fx_data: {}
};

export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrencyData: (state, action: PayloadAction<CurrencyState>) => {
            Object.entries(action.payload).forEach(ccy => {
                state.fx_data[ccy[0]] = ccy[1];
            });
        },
        setSelectedCurrency: (state, action: PayloadAction<CurrencyState>) => {
            state.ccy = action.payload.ccy;
            state.rate = state.fx_data[action.payload.ccy]
        },
    },
})

export const { setCurrencyData, setSelectedCurrency } = currencySlice.actions;

export const selectCurrency = (state: RootState) => state.currency;

export default currencySlice.reducer;
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setCurrencyData,
    setSelectedCurrency,
    selectCurrency
} from '../../features/currencySlice';
import Dropdown from 'react-bootstrap/Dropdown';
const currencyApiKey = import.meta.env.VITE_CURRENCY_API_KEY;
const currencyApiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${currencyApiKey}`;

const Currency = () => {
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectCurrency);

    const currencies = [
        "USD", "AUD", "EUR", "GBP", "MXN", "JPY", "HKD", "CAD", "NZD", "CNY"
    ];

    useEffect(() => {
        refreshCurrency();
    }, []);

    const refreshCurrency = async (): Promise<void> => {
        const request = await fetch(currencyApiURL);
        const data = await request.json();
        if (request.ok) {
            dispatch(setCurrencyData(data.data));
        };
    };

    const setCurrency = (selectedCCY: string) => {
        dispatch(setSelectedCurrency({
            ccy: selectedCCY,
            rate: 1,
            fx_data: currency.fx_data
        }));
    };

    const renderCurrencyOptions = currencies.map((ccy: string) => {
        return (
            <Dropdown.Item key={ccy} onClick={() => setCurrency(ccy)}>{ccy}</Dropdown.Item>
        );
    });

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {currency.ccy}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {renderCurrencyOptions}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Currency;
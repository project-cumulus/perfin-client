import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
const currencyApiKey = import.meta.env.VITE_CURRENCY_API_KEY;
const currencyApiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${currencyApiKey}`;

interface ICurrencyObj {
    ccy: string
    rate: number
}

interface ICurrencyData {
    [key: string]: number
}

const Currency = () => {
    const [selectedCurrency, setSelectedCurrency] = useState<ICurrencyObj>({ ccy: "USD", rate: 1.0 });
    const [currencyData, setCurrencyData] = useState<ICurrencyData>();

    const currencies = [
        "USD", "AUD", "EUR", "GBP", "MXN", "JPY", "HKD", "CAD", "NZD", "RMB"
    ];

    useEffect(() => {
        refreshCurrency();
    }, []);

    const refreshCurrency = async (): Promise<void> => {
        const request = await fetch(currencyApiURL);
        const data = await request.json();
        setCurrencyData(data.data);
    };

    const setCurrency = (currency: string) => {
        setSelectedCurrency({
            ccy: currency,
            rate: currencyData?.currency || 1
        })
    };

    const renderCurrencyOptions = currencies.map((ccy: string) => {
        return (
            <Dropdown.Item key={ccy} onClick={() => setCurrency(ccy)}>{ccy}</Dropdown.Item>
        );
    });

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedCurrency.ccy}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {renderCurrencyOptions}
            </Dropdown.Menu>
        </Dropdown>
    )
};

export default Currency;
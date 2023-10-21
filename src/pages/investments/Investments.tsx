import { useEffect, useState } from 'react';
import { ISecurity } from '../../types/index';
import { useForm, SubmitHandler } from 'react-hook-form';
import PriceChart from './PriceChart';
import "./Investments.css";
const securitiesURL = "http://localhost:8000/cumulus/securities/";
const API_KEY = import.meta.env.VITE_ADVANTAGE_API_KEY;

interface ITicker {
    ticker: string
};

interface ISecurityData {
    "Meta Data": {
        [key: string]: string
    }
    "Time Series (Daily)": {
        [key: string]: string
    }
};

interface ISearchResult {
    [key: string]: string
}

const Investments = () => {
    const [securities, setSecurities] = useState<Array<ISecurity>>([]);
    const [selectedSecurity, setSelectedSecurity] = useState<ISecurity | null>();
    const [searchResult, setSearchResult] = useState<Array<ISearchResult>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ITicker>();

    useEffect(() => {
        getSecurities();
    }, []);

    const getSecurities = async (): Promise<void> => {
        try {
            const request = await fetch(securitiesURL);
            if (request.ok) {
                const data = await request.json();
                setSecurities(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderSecurities = securities.map((sec: ISecurity, ind: number) => {
        return (
            <div key={ind} onClick={() => setSelectedSecurity(sec)}>
                <h5>Ticker: {sec.symbol}</h5>
                <p>{sec.name} | {sec.time_zone}</p>
            </div>
        );
    });

    const onSubmit = async (): Promise<void> => {
        const ticker = getValues("ticker");
        const searchTickerURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${API_KEY}`;
        setIsLoading(true);
        setSelectedSecurity(null);
        try {
            const request = await fetch(searchTickerURL);
            const data = await request.json();
            setSearchResult(data.bestMatches);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const renderSearchResults = searchResult?.map((result: ISearchResult, ind: number) => {
        return (
            <li
                key={ind}
                className="ticker-search-results"
                onClick={() => getSecurityData(result)}
            >
                <p>{result['1. symbol']} - {result['2. name']} ({result['3. type']}) | {result['4. region']} ({result['8. currency']})</p>
            </li>);
    });

    const getSecurityData = async (security: ISearchResult): Promise<void> => {
        const getSecurityDataURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${security['1. symbol']}&apikey=${API_KEY}`;
        setIsLoading(true);

        try {
            const request = await fetch(getSecurityDataURL);
            if (request.ok) {
                const data = await request.json();
                console.log(data);
                const payload: ISecurity = {
                    symbol: data['Meta Data']['2. Symbol'],
                    name: security['2. name'],
                    currency: security['8. currency'],
                    time_zone: data['Meta Data']['5. Time Zone'],
                    last_refreshed: data['Meta Data']['3. Last Refreshed'],
                    price_history: Object.entries(data['Time Series (Daily)']).map((priceDataPt) => {
                        return {
                            date: priceDataPt[0],
                            open: priceDataPt[1]['1. open'],
                            high: priceDataPt[1]['2. high'],
                            low: priceDataPt[1]['3. low'],
                            close: priceDataPt[1]['4. close'],
                            volume: Number(priceDataPt[1]['5. volume'])
                        }
                    })
                }
                setSelectedSecurity(payload);
                console.log(payload)
            }
        } catch (error) {
            console.error(error);
        };
        setIsLoading(false);
    };


    const saveSecurityData = async (securityData: ISecurityData): Promise<void> => {
        setIsLoading(true);
        console.log(securityData);
        const payload = {
            symbol: securityData['Meta Data']['2. Symbol'],
            name: "Test Co",
            time_zone: securityData['Meta Data']['5. Time Zone'],
            last_refreshed: securityData['Meta Data']['3. Last Refreshed']
        }
        try {
            const request = await fetch(securitiesURL, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(securityData)
            });
            const data = await request.json();

            console.log(data);

        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h3>Investments</h3>
            <div>
                <ul>
                    {renderSecurities}
                </ul>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="search-ticker-form"
            >
                <label htmlFor="ticker">Ticker</label>
                <input
                    {...register("ticker", { required: true })}
                    type="text"
                    placeholder="Search.."
                    autoComplete="off"
                />
                <input
                    type="submit"
                    value="Search"
                />
            </form>
            {errors.ticker && <span>This field is required</span>}
            {isLoading &&
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>}

            {renderSearchResults && <ul>{renderSearchResults}</ul>}
            {selectedSecurity && <PriceChart selectedSecurity={selectedSecurity} />}
        </div>
    )
};
export default Investments;
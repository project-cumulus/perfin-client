import { useEffect, useState } from 'react';
import { ISecurity, ISecurityPrice } from '../../types/index';
import { useForm } from 'react-hook-form';
import PriceChart from './PriceChart';
import "./Investments.css";
const securitiesURL = "http://localhost:8000/cumulus/securities/";
const API_KEY = import.meta.env.VITE_ADVANTAGE_API_KEY;

interface ITicker {
    ticker: string
};

interface ISearchResult {
    [key: string]: string
}

const Investments = () => {
    const [securities, setSecurities] = useState<Array<ISecurity>>([]);
    const [selectedSecurity, setSelectedSecurity] = useState<ISecurity | null>();
    const [searchResult, setSearchResult] = useState<Array<ISearchResult> | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

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
            <div
                key={ind}
                onClick={() => handleSelectSecurity(sec)}
                className="investment-tile-container"
            >
                <h5>{sec.symbol}</h5>
                <p>{sec.name} | {sec.time_zone}</p>
            </div>
        );
    });

    const handleSelectSecurity = (sec: ISecurity): void => {
        setSelectedSecurity(sec);
        setSearchResult(null);
    }

    const onSubmit = async (): Promise<void> => {
        const ticker = getValues("ticker");
        const searchTickerURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${API_KEY}`;
        setIsLoading(true);
        setSelectedSecurity(null);
        try {
            const request = await fetch(searchTickerURL);
            const data = await request.json();
            if (data.Information) {
                setErrorMsg(data.Information);
            }
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
                {selectedSecurity?.symbol === result['1. symbol'] &&
                    <button
                        onClick={() => saveToDataBase()}
                    >Save to Database
                    </button>}
            </li>);
    });

    const saveToDataBase = async (): Promise<void> => {
        setIsLoading(true);
        try {
            if (!selectedSecurity) {
                throw new Error("In saveToDatabase: No Security Selected");
            };
            const { name, symbol, currency, time_zone, last_refreshed, price_history } = selectedSecurity;
            const payload = {
                name: name,
                symbol: symbol,
                currency: currency,
                time_zone: time_zone,
                last_refreshed: last_refreshed
            };
            const request = await fetch(securitiesURL, {
                "method": "POST",
                "headers": { "content-type": "application/json" },
                "body": JSON.stringify(payload)
            });
            if (request.ok) {
                const data = await request.json();
                for (const pricePoint of price_history) {
                    savePriceDataToDB(pricePoint, data.id);
                };
            };
        } catch (error) {
            console.error(error);
        };
        getSecurities();
        setIsLoading(false);
    };

    const savePriceDataToDB = async (pricePoint: ISecurityPrice, secID: number): Promise<void> => {
        pricePoint.security = secID;
        try {
            const request = await fetch(`${securitiesURL}prices/`, {
                "method": "POST",
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(pricePoint)
            });
            if (request.ok) {
                const data = await request.json();
                console.log(data);
            }
        } catch (error) {
            console.error("Error in pricePoint:", secID, error);
        };
    };

    const getSecurityData = async (security: ISearchResult): Promise<void> => {
        const getSecurityDataURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${security['1. symbol']}&apikey=${API_KEY}&outputsize=full`;
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
                    price_history: Object.entries(data['Time Series (Daily)']).map((priceDataPt: [string, any]) => {
                        console.log(priceDataPt)
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

    return (
        <div className="investment-main-page">

            <div className="investment-col-left">
                <h3>My Watchlist</h3>
                <ul>
                    {renderSecurities}
                </ul>
            </div>

            <div className="investment-col-right">

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="search-ticker-form"
                >
                    <label htmlFor="ticker">🔎</label>

                    <input
                        {...register("ticker", { required: true })}
                        type="text"
                        placeholder="Search.."
                        autoComplete="off"
                    />
                    <input
                        type="submit"
                        value="Search"
                        className="search-ticker-submit"
                    />
                </form>
                <div className="search-ticker-form">
                    {errors.ticker && <span>This field is required</span>}
                    {errorMsg && <span>{errorMsg}</span>}
                </div>

                {isLoading &&
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>}

                {renderSearchResults && <ul className="ticker-search-result-list">{renderSearchResults}</ul>}
                {selectedSecurity && <PriceChart selectedSecurity={selectedSecurity} />}

            </div>


        </div>
    )
};
export default Investments;
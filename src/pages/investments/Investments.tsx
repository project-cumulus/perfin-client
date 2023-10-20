import { useEffect, useState } from 'react';
import { ISecurity } from '../../types/index';
import { useForm, SubmitHandler } from 'react-hook-form';
import PriceChart from './PriceChart';
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

const Investments = () => {
    const [securities, setSecurities] = useState<Array<ISecurity>>([]);
    const [selectedSecurity, setSelectedSecurity] = useState<ISecurity>();
    const [searchSecurityData, setSearchSecurityData] = useState<ISecurityData>();
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
                <h4>Ticker: {sec.symbol}</h4>
                <p>Name: {sec.name}</p>
                <p>Time Zone: {sec.time_zone}</p>
                <p>Last Refreshed: {sec.last_refreshed}</p>
            </div>
        );
    });

    const onSubmit = async (): Promise<void> => {
        const ticker = getValues("ticker");
        const searchTickerURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;
        setIsLoading(true);
        try {
            const request = await fetch(searchTickerURL);
            const data = await request.json();

            console.log(data);

            setSearchSecurityData(data);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    // const saveSecurityData = async (securityData: ISecurityData): Promise<void> => {
    //     setIsLoading(true);
    //     try {
    //         const request = await fetch(securitiesURL, {
    //             method: "POST",
    //             headers: { "content-type": "application/json" },
    //             body: JSON.stringify(securityData)
    //         });
    //         const data = await request.json();

    //         console.log(data);

    //     } catch (error) {
    //         console.error(error);
    //     }
    //     setIsLoading(false);
    // };

    return (
        <div>
            <h3>Investments</h3>
            <div>
                <ul>
                    {renderSecurities}
                </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
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
            {searchSecurityData &&
                <div>
                    <h4>Ticker: {searchSecurityData['Meta Data']['2. Symbol']}</h4>
                    <p>Time Zone: {searchSecurityData['Meta Data']['5. Time Zone']}</p>
                    <p>Last Refreshed: {searchSecurityData['Meta Data']['3. Last Refreshed']}</p>
                    {/* <button onClick={() => saveSecurityData(searchSecurityData)}>Save</button> */}
                </div>}
            {selectedSecurity && <PriceChart selectedSecurity={selectedSecurity} />}
        </div>
    )
};
export default Investments;
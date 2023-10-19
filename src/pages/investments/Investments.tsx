import { useEffect, useState } from 'react';
import { ISecurity } from '../../types/index';
import PriceChart from './PriceChart';
const getSecuritiesURL = "http://localhost:8000/cumulus/securities/";

const Investments = () => {
    const [securities, setSecurities] = useState<Array<ISecurity>>([]);
    const [selectedSecurity, setSelectedSecurity] = useState<ISecurity>();

    useEffect(() => {
        getSecurities();
    }, []);

    const getSecurities = async (): Promise<void> => {
        const request = await fetch(getSecuritiesURL);
        if (request.ok) {
            const data = await request.json();
            setSecurities(data);
            // console.log(data);
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

    return (
        <div>
            <h3>Investments</h3>
            <div>
                <ul>
                    {renderSecurities}
                </ul>
            </div>

            <form>
                <label htmlFor="ticker">Ticker</label>
                <input
                    name="ticker"
                    type="text"
                    placeholder="Search.."
                    autoComplete="off"
                />
                <input
                    type="submit"
                    value="Get Data"
                />
            </form>

            {selectedSecurity && <PriceChart selectedSecurity={selectedSecurity} />}
        </div>
    )
};

export default Investments;
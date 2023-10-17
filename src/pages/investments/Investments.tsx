import { useEffect, useState } from 'react';
import { ISecurity } from '../../types/index';
const getSecuritiesURL = "http://localhost:8000/cumulus/securities/";

const Investments = () => {
    const [securities, setSecurities] = useState<Array<ISecurity>>([]);

    useEffect(() => {
        getSecurities();
    }, []);

    const getSecurities = async (): Promise<void> => {
        const request = await fetch(getSecuritiesURL);
        if (request.ok) {
            const data = await request.json();
            setSecurities(data);
        }
    };

    const renderSecurities = securities.map((sec: ISecurity, ind: number) => {
        return (
            <div key={ind}>
                <h4>{sec.symbol}</h4>
                <p>{sec.name}</p>
                <p>{sec.time_zone}</p>
                <p>{sec.last_refreshed}</p>
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
        </div>
    )
};

export default Investments;
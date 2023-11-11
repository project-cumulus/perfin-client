import { useEffect, useState } from "react";
import './Wealth.css';

const assetValueURL = "http://localhost:8000/cumulus/assets/";

interface IAssetValue {
    readonly id: number
    account_name: string
    asset_class: string
    asset_type: string
    currency: string
    date: string
    date_closed: string | null
    date_opened: string
    offset_value: number
    value: number
    owner: string
}

const Wealth = () => {
    const [assetValues, setAssetValues] = useState<Array<IAssetValue>>([]);

    const getAssetValues = async (): Promise<void> => {
        const request = await fetch(assetValueURL);
        const data = await request.json();
        setAssetValues(data);
    };

    const dateSet = new Set(assetValues.map(assetValue => assetValue.date));

    const dateHeadings = [...dateSet].reverse().map(date => {
        return (
            <th key={date}>
                {date}
            </th>
        );
    });

    const accountNameSet = new Set(assetValues.map(assetValue => assetValue.account_name));

    const renderWealthTable = [...accountNameSet].map((acc, id) => {
        const assetRow = assetValues.filter(assetVal => assetVal.account_name == acc)
            .sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                return bDate.valueOf() - aDate.valueOf();
            })
            .map((assetVal, id) => {
                return (
                    <td key={id} className="acc-value">
                        {Number(assetVal.value).toFixed(0)}
                    </td>
                )
            });

        const assetCurrency = assetValues.find(assetVal => assetVal.account_name === acc)?.currency;
        const assetClass = assetValues.find(assetVal => assetVal.account_name === acc)?.asset_class;

        return (
            <tr key={id}>
                <td className="account-name">{acc}</td>
                <td className="acc-currency">{assetCurrency}</td>
                <td className="acc-asset-class">{assetClass}</td>
                {assetRow}
            </tr>
        );
    })


    useEffect(() => {
        getAssetValues();
    }, [])

    return (
        <div>
            <h3>Wealth Page goes here</h3>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>CCY</th>
                        <th>Asset Class</th>
                        {dateHeadings}
                    </tr>
                </thead>
                <tbody>
                    {renderWealthTable}
                </tbody>
            </table>

        </div>
    )
};

export default Wealth;

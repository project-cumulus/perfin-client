import { useEffect, useState } from "react";
import { ITransaction } from "../../types";
const baseURL = "http://localhost:8000/cumulus/transactions/";


const Transactions = () => {
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);

    useEffect(() => {
        getTransactions()
    }, []);

    const getTransactions = async (): Promise<void> => {
        const request = await fetch(baseURL);
        const data = await request.json();

        if (request.ok) {
            setTransactions(data);
        };
    };

    const renderTransactions = transactions?.map((tx: ITransaction, i: number) => {
        return (
            <div key={i}>
                <p>{tx.date}{tx.description}{tx.amount}</p>
            </div>
        );
    });

    return (
        <div>
            {renderTransactions}
        </div>
    );
};

export default Transactions;
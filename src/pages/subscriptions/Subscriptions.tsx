import { useState, useEffect } from 'react';
import { ISubscription } from './ISubscription';
import "./Subscription.css";
import NewSubForm from './NewSubForm';
const subscriptionURL = `http://localhost:8000/subscriptions/list/`;

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Array<ISubscription>>([]);

    const getSubscriptions = async (): Promise<void> => {
        const response = await fetch(subscriptionURL);
        const data = await response.json();
        setSubscriptions(data);
    };

    useEffect(() => {
        getSubscriptions();
    }, []);

    const renderMonthlySubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return sub.active && sub.frequency === "Monthly";
    })
        .sort((a: ISubscription, b: ISubscription): number => {
            return b.amount_per_frequency - a.amount_per_frequency;
        })
        .map((sub: ISubscription, key: number) => {
            const iconImagePath = `./src/assets/logos/${sub.subscription_name.toLowerCase().replaceAll(" ", "_")}.png`;
            const paymentIconPath = `./src/assets/payments/${sub.payment_method.toLowerCase().replaceAll(" ", "_")}.png`;

            return (
                <tr key={key} className="subscription_row">
                    <td className="subscription_icon"><img src={iconImagePath} alt="" /></td>
                    <td className="subscription_name_col">{sub.subscription_name}</td>
                    <td className="subscription_amt_col">{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                    <td className="payment_icon"><img src={paymentIconPath} /></td>
                    <td>{sub.discretionary ? "X" : ""}</td>
                </tr>
            );
        });

    const renderAnnualSubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return sub.active && sub.frequency === "Yearly";
    })
        .map((sub: ISubscription, key: number) => {
            return (
                <tr key={key}>
                    <td></td>
                    <td className="subscription_name_col">{sub.subscription_name}</td>
                    <td>{sub.payment_method}</td>
                    <td className="subscription_amt_col">{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                </tr>
            );
        });

    const renderCancelledSubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return !sub.active;
    })
        .map((sub: ISubscription, key: number) => {
            return (
                <tr key={key}>
                    <td></td>
                    <td>{sub.subscription_name}</td>
                    <td>{sub.payment_method}</td>
                    <td>{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                </tr>
            );
        });

    const subscriptionTableHeading = (
        <thead>
            <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Cancel</th>
            </tr>
        </thead>
    );

    return (
        <>
            <NewSubForm />
            <div className="subscription_table">
                <h3>Monthly Subscriptions</h3>
                <table>
                    {subscriptionTableHeading}
                    <tbody>
                        {renderMonthlySubscriptions}
                    </tbody>
                </table>
            </div>

            <div className="subscription_table">
                <h3>Annual Subscriptions</h3>
                <table>
                    {subscriptionTableHeading}
                    <tbody>
                        {renderAnnualSubscriptions}
                    </tbody>
                </table>
            </div>

            <div className="subscription_table">

                <h3>Cancelled Subscriptions</h3>
                <table>
                    {subscriptionTableHeading}
                    <tbody>
                        {renderCancelledSubscriptions}
                    </tbody>
                </table>
            </div>

        </>
    )
};

export default Subscriptions;
import { useState, useEffect } from 'react';
import { ISubscription, ITransaction } from '../../types';
import "./Subscription.css";
import NewSubForm from './NewSubForm';
import PieChart from './PieChart';
import RemoveSubModal from './RemoveSubModal';
import EditSubModal from './EditSubModal';
const subscriptionURL = `http://localhost:8000/cumulus/subscriptions/`;

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Array<ISubscription>>([]);
    const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
    const [subIDtoDelete, setSubIDtoDelete] = useState<number>(-1);
    const [selectedSubscription, setSelectedSubscription] = useState<ISubscription | null>();
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);
    const handleHideForm = () => setShowNewSubForm(false);

    useEffect(() => {
        getSubscriptions();
    }, []);

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean | undefined>(false);
    const handleEditModalOpen = (sub: ISubscription) => {
        setIsEditModalOpen(true);
        if (!sub) {
            console.error('subscription not defined')
        } else {
            setSubscriptionToEdit(sub);
        }
    };
    const handleEditModalClose = () => setIsEditModalOpen(false);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<ISubscription | undefined>();

    const getSubscriptions = async (): Promise<void> => {
        try {
            const response = await fetch(`${subscriptionURL}`);
            const data = await response.json();
            setSubscriptions(data);
        } catch (error) {
            console.error(error);
        }
    };

    const processDelete = async (sub_id: number | undefined): Promise<void> => {
        if (!sub_id || sub_id === -1) return;

        try {
            await fetch(`${subscriptionURL}${sub_id}`, {
                method: "DELETE"
            });
        } catch (error) {
            console.error(error);
        }
        setSubIDtoDelete(-1);
        handleClose();
        getSubscriptions();
    };

    const handleDelete = (sub_id: number): void => {
        if (!sub_id || sub_id === -1) return;
        handleOpen();
        setSubIDtoDelete(sub_id);
    };

    const handleSelectSubscription = (sub: ISubscription): void => {
        if (selectedSubscription && selectedSubscription?.id === sub.id) {
            setSelectedSubscription(null);
        } else {
            setSelectedSubscription(sub);
        }
    };

    const renderMonthlySubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return sub.active && sub.frequency === "Monthly";
    })
        .sort((a: ISubscription, b: ISubscription): number => {
            return b.amount_per_frequency - a.amount_per_frequency;
        })
        .map((sub: ISubscription) => {
            const paymentIconPath = `./src/assets/payments/${sub.payment_method.toLowerCase().replaceAll(" ", "_")}.png`;
            const { id, subscription_name, amount_per_frequency, frequency, category, company_logo_url } = sub;

            return (
                <tr
                    key={id}
                    className="subscription_row"
                    onClick={() => handleSelectSubscription(sub)}
                    style={id === selectedSubscription?.id ? { "backgroundColor": "rgb(140,140,140)" } : undefined}
                >
                    <td className="subscription_icon"><img src={company_logo_url} alt={subscription_name} /></td>
                    <td className="subscription_name_col">{subscription_name}</td>
                    <td className="subscription_amt_col">{amount_per_frequency}</td>
                    <td>{frequency}</td>
                    <td>{category}</td>
                    <td className="payment_icon"><img src={paymentIconPath} /></td>
                    <td><img
                        className="edit-subscription-icon"
                        src="./src/assets/edit_icon.png"
                        alt="edit icon"
                        onClick={() => handleEditModalOpen(sub)}
                    /></td>
                    <td><button onClick={() => handleDelete(id || -1)}>X</button></td>
                </tr>
            );
        });

    const renderAnnualSubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return sub.active && sub.frequency === "Yearly";
    })
        .map((sub: ISubscription, key: number) => {
            return (
                <tr key={key} className="subscription_row">
                    <td className="subscription_icon"><img src={sub.company_logo_url} /></td>
                    <td className="subscription_name_col">{sub.subscription_name}</td>
                    <td className="subscription_amt_col">{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                    <td>{sub.payment_method}</td>
                    <td><img
                        className="edit-subscription-icon"
                        src="./src/assets/edit_icon.png"
                        alt="edit icon"
                        onClick={() => handleEditModalOpen(sub)}
                    /></td>
                    <td><button onClick={() => handleDelete(sub.id || -1)}>X</button></td>
                </tr>
            );
        });

    const renderCancelledSubscriptions = subscriptions?.filter((sub: ISubscription) => {
        return !sub.active;
    })
        .map((sub: ISubscription, key: number) => {
            return (
                <tr key={key} className="subscription_row">
                    <td className="subscription_icon"><img src={sub.company_logo_url} /></td>
                    <td className="subscription_name_col">{sub.subscription_name}</td>
                    <td className="subscription_amt_col">{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                    <td>{sub.payment_method}</td>
                    <td><img
                        className="edit-subscription-icon"
                        src="./src/assets/edit_icon.png"
                        alt="edit icon"
                        onClick={() => handleEditModalOpen(sub)}
                    /></td>
                    <td><button onClick={() => handleDelete(sub.id || -1)}>X</button></td>
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
                <th>Edit</th>
                <th>Remove</th>
            </tr>
        </thead>
    );

    const totalMonthlySubscriptionAmount = subscriptions?.filter((sub: ISubscription) => sub.active && sub.frequency === "Monthly")
        .reduce((acc: number, curr: ISubscription) => acc + Number(curr.amount_per_frequency), 0).toFixed(2);

    const subscriptionTransactionHistory = selectedSubscription?.transaction_history.map((transaction: ITransaction, i: number) => {
        const { amount, currency, date_paid } = transaction;

        return (
            <tr key={i}>
                <td>{date_paid}</td>
                <td>{currency}</td>
                <td className="subscription_amt_col">{amount}</td>
            </tr>
        );
    });

    return (
        <>
            <div>
                <div >
                    <RemoveSubModal
                        show={isOpen}
                        handleClose={handleClose}
                        processDelete={processDelete}
                        subIDtoDelete={subIDtoDelete}
                    />
                </div>

                <div>
                    <EditSubModal
                        getSubscriptions={getSubscriptions}
                        show={isEditModalOpen}
                        handleEditModalClose={handleEditModalClose}
                        subscriptionToEdit={subscriptionToEdit}
                    />
                </div>



                <div className="new_subscription_heading">
                    <h3>Add New Subscription</h3>
                    <button onClick={() => setShowNewSubForm(!showNewSubForm)}>
                        {showNewSubForm ? "-" : "+"}
                    </button>

                </div>
                {showNewSubForm && <NewSubForm
                    handleHideForm={handleHideForm}
                    getSubscriptions={getSubscriptions}
                />}

                <div id="main_subscription_page">
                    <div className="left-column">
                        <div className="subscription_table">
                            <h3>Monthly Subscriptions</h3>
                            <table>
                                {subscriptionTableHeading}
                                <tbody>
                                    {renderMonthlySubscriptions}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className="subscription_amt_col">{totalMonthlySubscriptionAmount}</td>
                                        <td>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
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
                    </div>

                    <div className="right-column">
                        <PieChart subscriptions={subscriptions} />
                        {selectedSubscription && <div className="subscription_table transaction_history_table">
                            <h3>Transaction History</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>CCY</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionTransactionHistory}
                                </tbody>
                            </table>
                        </div>}
                    </div>
                </div>
            </div>

            <a href="https://clearbit.com">Logos provided by Clearbit</a>
        </>
    )
};

export default Subscriptions;
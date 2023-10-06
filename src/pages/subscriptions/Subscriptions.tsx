import { useState, useEffect } from 'react';
import { ISubscription } from './ISubscription';
import "./Subscription.css";
import NewSubForm from './NewSubForm';
import PieChart from './PieChart';
import RemoveSubModal from './RemoveSubModal';
import EditSubModal from './EditSubModal';
const subscriptionURL = `http://localhost:8000/subscriptions/`;

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Array<ISubscription>>([]);
    const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
    const [subIDtoDelete, setSubIDtoDelete] = useState<number>(-1);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

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
            const response = await fetch(`${subscriptionURL}list/`);
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

    useEffect(() => {
        getSubscriptions();
    }, []);

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
                <tr key={id} className="subscription_row">
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
                <th>Edit</th>
                <th>Remove</th>
            </tr>
        </thead>
    );

    return (
        <>
            <div id="main_subscription_page">
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
                    setShowNewSubForm={setShowNewSubForm}
                />}
                <PieChart subscriptions={subscriptions} />
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


            </div>

            <a href="https://clearbit.com">Logos provided by Clearbit</a>
        </>
    )
};

export default Subscriptions;
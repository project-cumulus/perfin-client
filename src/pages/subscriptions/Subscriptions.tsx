import { useState, useEffect } from 'react';
import { ISubscription } from './ISubscription';
import "./Subscription.css";
import Modal from 'react-bootstrap/Modal';
import NewSubForm from './NewSubForm';
import PieChart from './PieChart';
const subscriptionURL = `http://localhost:8000/subscriptions/`;

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Array<ISubscription>>([]);
    const [showNewSubForm, setShowNewSubForm] = useState<Boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
    const [subIDtoDelete, setSubIDtoDelete] = useState<Number>(-1);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    const getSubscriptions = async (): Promise<void> => {
        try {
            const response = await fetch(`${subscriptionURL}list/`);
            const data = await response.json();
            setSubscriptions(data);
        } catch (error) {
            console.error(error);
        }
    };

    const processDelete = async (sub_id: Number | undefined): Promise<void> => {
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

    const handleDelete = (sub_id: Number): void => {
        if (!sub_id || sub_id === -1) return;
        handleOpen();
        setSubIDtoDelete(sub_id);
    }

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
            const iconImagePath = `./src/assets/logos/${sub.subscription_name.toLowerCase().replaceAll(" ", "_")}.png`;
            const paymentIconPath = `./src/assets/payments/${sub.payment_method.toLowerCase().replaceAll(" ", "_")}.png`;

            return (
                <tr key={sub.id} className="subscription_row">
                    <td className="subscription_icon"><img src={iconImagePath} alt={sub.subscription_name} /></td>
                    <td className="subscription_name_col">{sub.subscription_name}</td>
                    <td className="subscription_amt_col">{sub.amount_per_frequency}</td>
                    <td>{sub.frequency}</td>
                    <td>{sub.category}</td>
                    <td className="payment_icon"><img src={paymentIconPath} /></td>
                    <td>{sub.discretionary ? "Link" : null}</td>
                    <td><button onClick={() => handleDelete(sub.id || -1)}>X</button></td>
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
                <th>Remove</th>
            </tr>
        </thead>
    );

    return (
        <>
            <div id="main_subscription_page">
                <div className="remove_sub_modal">
                    <Modal show={isOpen} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Warning</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to remove? This cannot be undone</Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleClose}>
                                Go Back
                            </button>
                            <button onClick={() => processDelete(subIDtoDelete)}>
                                Delete
                            </button>
                        </Modal.Footer>
                    </Modal>
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
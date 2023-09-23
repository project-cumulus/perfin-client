import { useState } from 'react';
import { ISubscription } from './ISubscription';
import "./Subscription.css";

import {
    Formik,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
} from 'formik';

const NewSubForm: React.FC<{}> = () => {
    const [newSubscriptionData, setNewSubscriptionData] = useState<ISubscription>({
        subscription_name: "",
        description: "",
        currency: "",
        amount_per_frequency: 0,
        frequency: "",
        frequency_detail: "",
        payment_method: "",
        category: "",
        discretionary: true,
        fixed: true,
        active: true
    });


    const handleChange = (e: Event): void => {
        console.log(e.target.value);
    };

    return (
        <div>
            <h3>Add New Subscription</h3>
            <Formik
                initialValues={newSubscriptionData}
                onSubmit={(values, actions) => {
                    console.log({ values, actions });
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                }}
            >
                <Form>
                    <div>
                        <label htmlFor="subscription_name">Service Name:</label>
                        <Field
                            name="subscription_name"
                            placeholder="Name"
                            type="text"
                            autocomplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <Field
                            name="description"
                            placeholder="Description"
                            autocomplete="off"
                            type="text"
                        />
                    </div>
                    <div>
                        <label htmlFor="currency">Currency:</label>
                        <Field
                            name="currency"
                            placeholder="USD"
                        />
                    </div>
                    <div>
                        <label htmlFor="frequency">Frequency:</label>
                        <Field
                            as="select"
                            name="frequency"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly" selected>Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </Field>
                    </div>
                    <div>
                        <label htmlFor="frequency_details">Frequency Details:</label>
                        <Field
                            id="frequency_details"
                            name="frequency_details"
                            placeholder="The 1st of each month"
                            autocomplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="payment_method">Payment Method:</label>
                        <Field
                            id="payment_method"
                            as="select"
                            name="payment_method"
                            placeholder=""
                            autocomplete="off"
                        >
                            <option value="Amex">Amex</option>
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                            <option value="Discover">Discover</option>
                            <option value="Bank Account">Bank Account</option>
                        </Field>
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <Field
                            id="category"
                            name="category"
                            placeholder=""
                        />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </Form>

            </Formik>
        </div>
    )
};

export default NewSubForm;
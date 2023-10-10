import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ISubscription } from '../../types';
const editSubscriptionURL = "http://localhost:8000/cumulus/subscriptions/";

type Props = {
    subscriptionToEdit?: ISubscription | undefined
    getSubscriptions: () => void
    handleEditModalClose: () => void
}

const EditSubForm = ({ subscriptionToEdit, getSubscriptions, handleEditModalClose }: Props) => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ISubscription>();

    const [errorMessages, setErrorMessages] = useState<Array<[string]>>();

    const renderErrorMessages = errorMessages?.map((errMsg, i) => {
        return (
            <p className="error_messages" key={i}>{errMsg.join("")}</p>
        );
    });

    if (!subscriptionToEdit) return;
    const { id, subscription_name,
        description,
        currency,
        amount_per_frequency,
        payment_method,
        frequency,
        frequency_detail,
        category,
        discretionary, fixed, active, company_logo_url
    } = subscriptionToEdit;

    useEffect(() => {
        setValue('subscription_name', subscription_name);
        setValue('description', description);
        setValue('currency', currency);
        setValue('company_logo_url', company_logo_url)
        setValue('amount_per_frequency', amount_per_frequency);
        setValue('payment_method', payment_method);
        setValue('frequency', frequency);
        setValue('frequency_detail', frequency_detail);
        setValue('category', category);
        setValue('discretionary', discretionary);
        setValue('fixed', fixed)
        setValue('active', active)
    }, [subscriptionToEdit]);

    const onSubmit: SubmitHandler<ISubscription> = async (data): Promise<void> => {
        setErrorMessages([]);
        try {
            let request = await fetch(`${editSubscriptionURL}${id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (request.ok) {
                request = await request.json();
                console.log('Changes to subscription successfully saved!');

                console.log(request);
                handleEditModalClose();
                getSubscriptions();
            } else {
                request = await request.json();
                console.error(request);
                setErrorMessages(Object.values(request));
            }
        } catch (errors) {
            console.error(errors);
        }
    };

    return (
        <div id="edit_subscription_form">
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <label>Subscription Name</label>
                    <input
                        {...register("subscription_name", { required: true })}
                        autoComplete="off"
                    />
                    {errors.subscription_name && <span>This field is required</span>}
                </div>
                <div>
                    <label>Company Logo</label>
                    <input
                        {...register("company_logo_url")}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        {...register("description")}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label>Currency</label>
                    <input
                        defaultValue="USD" {...register("currency", { required: true })}
                        autoComplete="off"
                    />
                    {errors.currency && <span>This field is required</span>}
                </div>
                <div>
                    <label>Amount</label>
                    <input
                        defaultValue="0" {...register("amount_per_frequency", { required: true })}
                        autoComplete="off"
                    />
                    {errors.amount_per_frequency && <span>This field is required</span>}
                </div>

                <div>
                    <label>Frequency</label>
                    <select defaultValue="Monthly" {...register("frequency", { required: true })}>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
                <div>
                    <label>Frequency Detail</label>
                    <input defaultValue="" {...register("frequency_detail")} />
                </div>
                <div>
                    <label>Payment Method</label>
                    <select {...register("payment_method", { required: true })}>
                        <option></option>
                        <option value="Amex">Amex</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="Discover">Discover</option>
                        <option value="Bank Account">Bank Account</option>
                    </select>
                    {errors.payment_method && <span>This field is required</span>}
                </div>
                <div>
                    <label>Category</label>
                    <select
                        defaultValue="" {...register("category", { required: true })}
                        autoComplete="off"
                    >
                        <option></option>
                        <option>Entertainment & Media</option>
                        <option>Transportation</option>
                        <option>Health & Wellbeing</option>
                        <option>Finance & Insurance</option>
                        <option>Technology</option>
                        <option>Utilities</option>

                    </select>
                    {errors.category && <span>This field is required</span>}
                </div>
                <div>
                    <label>Discretionary</label>
                    <input className="form_checkbox" type="checkbox" {...register("discretionary")} />
                </div>
                <div>
                    <label>Fixed</label>
                    <input className="form_checkbox" type="checkbox" {...register("fixed")} />
                </div>
                <div>
                    <label>Active</label>
                    <input className="form_checkbox" type="checkbox" {...register("active")} />
                </div>
                {errorMessages && errorMessages.length && renderErrorMessages}

                <button>Save</button>

            </form>

        </div >
    );
};

export default EditSubForm;
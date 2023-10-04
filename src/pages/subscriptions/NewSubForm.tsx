import { useForm, SubmitHandler } from 'react-hook-form';
import { ISubscription } from './ISubscription';
import "./Subscription.css";
const newSubscriptionURL = "http://localhost:8000/subscriptions/list/"

type Props = {
    setShowNewSubForm: React.Dispatch<React.SetStateAction<Boolean>>
}

const NewSubForm = ({ setShowNewSubForm }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ISubscription>()

    const onSubmit: SubmitHandler<ISubscription> = async (data): Promise<void> => {
        console.log(data);
        try {
            let request = await fetch(newSubscriptionURL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)
            });
            request = await request.json();
            console.log(request);
        } catch (errors) {
            console.error(errors);
        }
        setShowNewSubForm(false);
    };

    return (
        <div id="new_subscription_form">

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
                    <input
                        defaultValue="" {...register("category", { required: true })}
                        autoComplete="off"
                    />
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
                    <input className="form_checkbox" type="checkbox" checked {...register("active", { required: true })} />
                </div>

                <button>Save</button>

            </form>
        </div >
    )
};

export default NewSubForm;
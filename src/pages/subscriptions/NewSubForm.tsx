import { useForm, SubmitHandler } from 'react-hook-form';
import { ISubscription } from './ISubscription';
import "./Subscription.css";
import { useState } from 'react';
const newSubscriptionURL = "http://localhost:8000/subscriptions/list/";
const baseSearchURL = "https://www.googleapis.com/customsearch/v1";
const googleCX = import.meta.env.VITE_GOOGLE_CX;
const apiKEY = import.meta.env.VITE_GOOGLE_API_KEY;

type Props = {
    setShowNewSubForm: React.Dispatch<React.SetStateAction<Boolean>>
};

interface IResult {
    displayLink: string
}

const NewSubForm = ({ setShowNewSubForm }: Props) => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<ISubscription>();

    const [errorMessages, setErrorMessages] = useState<Array<[string]>>();

    const renderErrorMessages = errorMessages?.map((errMsg, i) => {
        return (
            <p className="error_messages" key={i}>{errMsg.join("")}</p>
        );
    });

    const [showResults, setShowResults] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Array<IResult>>([]);

    const findCompany = async (): Promise<void> => {
        const searchQuery = getValues("subscription_name")
        try {
            let request = await fetch(`${baseSearchURL}?q=${searchQuery}&cx=${googleCX}&key=${apiKEY}`);
            if (request.ok) {
                const data = await request.json();
                console.log(data);
                setSearchResults(data.items);
                setShowResults(true);
            };
        } catch (error) {
            console.error(error);
        };
    };

    const renderSearchResults = searchResults.slice(0, 5).map((result, i) => {
        const imagePath = `https://logo.clearbit.com/${result.displayLink}`;
        return (
            <div className="search-result-row" onClick={() => selectCompany(imagePath)}>
                <img className="search-results-logo" src={imagePath} />
                <p key={i} className="search-results-url">{result.displayLink}</p>
            </div>
        );
    });

    const selectCompany = (imagePath: string) => {
        setValue("company_logo", imagePath);
        setShowResults(false);
    };

    const onSubmit: SubmitHandler<ISubscription> = async (data): Promise<void> => {
        setErrorMessages([]);
        try {
            let request = await fetch(newSubscriptionURL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (request.ok) {
                // request = await request.json();
                console.log('successfully added new subscription!');
                setShowNewSubForm(false);
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
        <div id="new_subscription_form">

            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                {getValues("company_logo") && <img className="selected-logo" src={getValues("company_logo") || ""} alt="" />}
                <div>
                    <label>Subscription Name</label>

                    <input
                        {...register("subscription_name", { required: true })}
                        autoComplete="off"
                    />
                    <button onClick={findCompany}>Find</button>


                    {errors.subscription_name && <span>This field is required</span>}
                </div>
                <div className="search-results-dropdown">
                    {showResults && renderSearchResults}
                </div>
                <div>
                    <label>Company Logo</label>
                    <input
                        {...register("company_logo")}
                        autoComplete="off"
                        disabled
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
                    <input className="form_checkbox" type="checkbox" checked {...register("active", { required: true })} />
                </div>
                {errorMessages && errorMessages.length && renderErrorMessages}

                <button>Save</button>

            </form>
        </div >
    )
};

export default NewSubForm;
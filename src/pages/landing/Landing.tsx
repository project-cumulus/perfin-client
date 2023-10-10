import Subscriptions from "../subscriptions/Subscriptions";

import Nav from "../components/Nav";
import Transactions from "../budget/Transactions";

const Landing = () => {

    return (
        <>
            <Nav />
            <Subscriptions />
            <Transactions />
        </>
    )
};

export default Landing;
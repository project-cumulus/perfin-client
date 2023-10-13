import Nav from "../pages/components/Nav";
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    );
};

export default RootLayout;
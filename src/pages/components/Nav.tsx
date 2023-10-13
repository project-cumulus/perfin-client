import { Link } from 'react-router-dom';
import './Nav.css';
const logoPath = './src/assets/logos/perfin-logo.png';
import Currency from './Currency';

const Nav = () => {
    return (
        <div>
            <nav>
                <div className="nav-bar-left">
                    <img className="nav-bar-icon" src={logoPath} alt="nav icon" />
                    <h2>PerFinApp</h2>
                </div>
                <ul>
                    <Link to="/investments">Investments</Link>
                    <Link to="/wealth">Wealth</Link>
                    <Link to="/subscriptions">Subscriptions</Link>
                    <Link to="/budget">Budget</Link>
                    <Currency />
                </ul>
            </nav>
        </div>
    )
};

export default Nav;
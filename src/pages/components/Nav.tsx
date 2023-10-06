import './Nav.css';
const logoPath = './src/assets/logos/perfin-logo.png';

const Nav = () => {
    return (
        <div>
            <nav>
                <div className="nav-bar-left">
                    <img className="nav-bar-icon" src={logoPath} alt="nav icon" />
                    <h2>PerFinApp</h2>
                </div>
                <ul>
                    <li>Wealth</li>
                    <li>Subscriptions</li>
                    <li>Budget</li>
                </ul>
            </nav>
        </div>
    )
};

export default Nav;
import { Link, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

interface NavbarProps {
    badge?: string;
}

const Navbar = ({ badge }: NavbarProps) => {
    const { user, handleLogout } = useAuth();
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <header className="app-navbar">
            <div className="app-navbar__container">
                <Link to="/" className="app-navbar__brand" title="Resplan Home">
                    <span className="brand-name">Resplan</span>
                    {badge && <span className="brand-pill">{badge}</span>}
                </Link>

                <div className="app-navbar__actions">
                    {user ? (
                        <>
                            {!isDashboard && (
                                <Link to="/dashboard" className="button primary-button nav-btn">
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className="nav-btn-logout">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Sign In
                            </Link>
                            <Link to="/register" className="button primary-button nav-btn">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

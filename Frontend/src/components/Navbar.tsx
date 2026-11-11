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
                <Link to={user ? "/dashboard" : "/"} className="app-navbar__brand">
                    <span className="brand-name">Resplan</span>
                    {badge && <span className="brand-pill">{badge}</span>}
                </Link>

                <div className="app-navbar__actions">
                    {user ? (
                        <>
                            <span className="user-tag" title={user.email || user.username}>
                                {user.username || user.email}
                            </span>
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

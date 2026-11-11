import { Link } from 'react-router'
import '../style/landing.scss'
import { useAuth } from '../../auth/hooks/useAuth'

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            {/* Top Navigation */}
            <header className="landing-nav">
                <div className="landing-nav__container">
                    <Link to="/" className="landing-nav__brand">
                        <span>Resplan</span>
                    </Link>

                    <div className="landing-nav__actions">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="button primary-button nav-btn">
                                    Open Dashboard
                                </Link>
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

            {/* Hero Section */}
            <main>
                <section className="landing-hero">
                    <h1 className="landing-hero__title">
                        Turn any job description into your <span className="highlight">interview blueprint</span>.
                    </h1>
                    <p className="landing-hero__subtitle">
                        Paste your target role and resume to generate tailored technical questions, uncover skill gaps, and follow a practical 7-day preparation roadmap.
                    </p>
                    <div className="landing-hero__cta-group">
                        <Link to={user ? "/dashboard" : "/register"} className="button primary-button hero-btn-primary">
                            {user ? "Go to Dashboard" : "Start Preparing — Free"}
                        </Link>
                        {!user && (
                            <Link to="/login" className="hero-btn-secondary">
                                Sign In
                            </Link>
                        )}
                    </div>
                </section>

                {/* Product Preview Card */}
                <section className="landing-preview">
                    <div className="landing-preview__header">
                        <div className="preview-window-dots">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className="preview-title">Sample Generated Strategy</div>
                        <div style={{ width: 40 }} />
                    </div>

                    <div className="landing-preview__body">
                        <div className="preview-stat-card">
                            <span className="preview-badge">88% Match Score</span>
                            <h3>Senior Frontend Engineer</h3>
                            <p>Analyzed against candidate profile: strong TypeScript &amp; state management alignment. Recommended focus on system design.</p>
                        </div>

                        <div className="preview-sample-box">
                            <span className="sample-label">Targeted Technical Question</span>
                            <p className="sample-q">"How would you optimize React rendering performance in high-frequency data streaming dashboards?"</p>
                            <p className="sample-ans">Focus on memoization boundaries, virtualization, off-main-thread Web Workers, and throttling state updates.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="landing-features">
                    <div className="features-header">
                        <h2>Structured for interview success</h2>
                        <p>No generic advice. Clear, actionable steps built around the role you want.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-number">01</span>
                            <h3>Targeted Questions &amp; Answers</h3>
                            <p>Get role-specific technical and behavioral questions matched to your experience level, with interviewer intentions and suggested answers.</p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-number">02</span>
                            <h3>Skill Gap Breakdown</h3>
                            <p>Identify critical requirements you might be missing and understand their severity before stepping into the interview.</p>
                        </div>

                        <div className="feature-card">
                            <span className="feature-number">03</span>
                            <h3>7-Day Preparation Plan</h3>
                            <p>Follow a practical day-by-day plan with focused study topics and concrete tasks to pace yourself effectively.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="landing-cta">
                    <div className="landing-cta__content">
                        <h2>Ready to prepare with confidence?</h2>
                        <p>Build your personalized strategy in under a minute with your resume and job description.</p>
                        <Link to={user ? "/dashboard" : "/register"} className="button primary-button hero-btn-primary">
                            {user ? "Open Your Dashboard" : "Get Started Now"}
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <span>&copy; {new Date().getFullYear()} Resplan. All rights reserved.</span>
                <div className="footer-links">
                    <Link to="/login">Sign In</Link>
                    <Link to="/register">Create Account</Link>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

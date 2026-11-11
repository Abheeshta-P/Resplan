import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../../../components/LoadingScreen';

const Register = () => {
    const navigate = useNavigate();
    const { loading, handleRegister } = useAuth();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate('/dashboard')
    }

    if (loading) {
        return <LoadingScreen/>;
    }

    return (
        <main className="auth-page">
            {/* Left Side: Product Overview (Full-height split) */}
            <aside className="auth-showcase">
                <div className="auth-showcase__brand">
                    <span className="brand-name">Resplan</span>
                </div>

                <div className="auth-showcase__content">
                    <h2>Prepare with clarity for your next interview.</h2>
                    <p className="auth-showcase__description">
                        Structured roadmaps, curated role-specific questions, and targeted preparation plans built directly around the job description.
                    </p>

                    <ul className="auth-feature-list">
                        <li>
                            <span className="feature-dot" />
                            <div>
                                <strong>Targeted Questions</strong>
                                <p>Technical and behavioral questions matching the specific role and seniority.</p>
                            </div>
                        </li>
                        <li>
                            <span className="feature-dot" />
                            <div>
                                <strong>Skill Gap Analysis</strong>
                                <p>Identifies key focus areas so you spend preparation time where it counts.</p>
                            </div>
                        </li>
                        <li>
                            <span className="feature-dot" />
                            <div>
                                <strong>7-Day Roadmap</strong>
                                <p>A day-by-day plan to keep your study schedule structured and manageable.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="auth-showcase__footer">
                    <span>Personalized preparation from your resume &amp; job description.</span>
                </div>
            </aside>

            {/* Right Side: Form (Full-height split, Centered) */}
            <section className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h1>Create an account</h1>
                        <p>Start preparing with structured interview roadmaps</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                value={username}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                value={email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                value={password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a secure password"
                                required
                            />
                        </div>

                        <button type="submit" className="button primary-button auth-submit-btn">
                            Create Account
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Register;

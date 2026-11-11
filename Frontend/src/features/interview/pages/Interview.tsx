import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import '../style/interview.scss'
import LoadingScreen from '../../../components/LoadingScreen'

// Navigation Items Configuration
const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'roadmap',
        label: 'Preparation Roadmap',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
        ),
    },
]

// Question Card Component
const QuestionCard = ({ item, index }: { item: InterviewQuestion; index: number }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="q-card">
            <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
                <span className="q-card__index">Q{index + 1}</span>
                <p className="q-card__question">{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>
            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// Roadmap Day Component
const RoadMapDay = ({ day }: { day: PreparationDay }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header">
            <span className="roadmap-day__badge">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>
        <ul className="roadmap-day__tasks">
            {day.tasks.map((task: string, i: number) => (
                <li key={i}>
                    <span className="roadmap-day__bullet" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// Main Interview Component
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getResumePdf, resumeLoading } = useInterview()
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const [expandedInput, setExpandedInput] = useState<string | null>(null)

    const toggleInput = (input: string) => {
        setExpandedInput((current) => (current === input ? null : input))
    }

    if (loading) {
        return <LoadingScreen text="Loading interview strategy..." />
    }

    if (!report) {
        return (
            <main className="interview-empty">
                <div className="interview-empty__card">
                    <h2>Interview plan not found</h2>
                    <p>
                        This plan may have been removed or the link is invalid. Return to your dashboard to view saved plans.
                    </p>
                    <button
                        className="button primary-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </main>
        )
    }

    const scoreColorClass =
        report.matchScore >= 80
            ? 'score--high'
            : report.matchScore >= 60
            ? 'score--mid'
            : 'score--low'

    return (
        <div className="interview-studio">
            {/* Mobile / Tablet Horizontal Nav Tabs (< 1024px) */}
            <div className="interview-mobile-tabs">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`mobile-tab-btn ${activeNav === item.id ? 'mobile-tab-btn--active' : ''}`}
                        onClick={() => setActiveNav(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* 3-Column Studio Body */}
            <div className="interview-body">
                {/* Left Navigation Column */}
                <aside className="interview-nav-col">
                    <div className="nav-group">
                        <span className="nav-group__title">Sections</span>
                        <div className="nav-group__list">
                            {NAV_ITEMS.map((item) => {
                                const count =
                                    item.id === 'technical'
                                        ? report.technicalQuestions.length
                                        : item.id === 'behavioral'
                                        ? report.behavioralQuestions.length
                                        : `${report.preparationPlan.length}d`

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`nav-item ${activeNav === item.id ? 'nav-item--active' : ''}`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <div className="nav-item__left">
                                            <span className="nav-item__icon">{item.icon}</span>
                                            <span className="nav-item__label">{item.label}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (interviewId && !resumeLoading) {
                                getResumePdf(interviewId)
                            }
                        }}
                        className="button primary-button download-pdf-btn"
                        disabled={resumeLoading}
                    >
                        {resumeLoading ? (
                            <>
                                <span className="button-spinner" />
                                Downloading...
                            </>
                        ) : (
                            'Download Resume'
                        )}
                    </button>
                </aside>

                {/* Center Content Workspace Column */}
                <main className="interview-main-col">
                    {activeNav === 'technical' && (
                        <section className="section-block">
                            <div className="section-block__header">
                                <h2>Technical Questions</h2>
                                <span className="content-header__count">{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className="section-block">
                            <div className="section-block__header">
                                <h2>Behavioral Questions</h2>
                                <span className="content-header__count">{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className="q-list">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className="section-block">
                            <div className="section-block__header">
                                <h2>Preparation Roadmap</h2>
                                <span className="content-header__count">{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className="roadmap-list">
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Right Sidebar Column */}
                <aside className="interview-sidebar-col">
                    {/* Match Score Box */}
                    <div className="sidebar-widget match-score-widget">
                        <span className="widget-title">Match Analysis</span>
                        <div className={`score-ring ${scoreColorClass}`}>
                            <span className="score-ring__val">{report.matchScore}</span>
                            <span className="score-ring__pct">%</span>
                        </div>
                        <p className="score-summary">
                            {report.matchScore >= 80
                                ? 'Strong match for this position'
                                : report.matchScore >= 60
                                ? 'Moderate match with addressable gaps'
                                : 'Significant skill gaps to prepare'}
                        </p>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Skill Gaps Box */}
                    <div className="sidebar-widget skill-gaps-widget">
                        <div className="widget-header-row">
                            <span className="widget-title">Skill Gaps</span>
                            <span className="widget-count">{report.skillGaps.length} identified</span>
                        </div>
                        <div className="skill-gaps-list">
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Original Inputs Accordion */}
                    <div className="sidebar-widget inputs-widget">
                        <span className="widget-title">Source Inputs</span>
                        <div className="inputs-accordion-list">
                            {[
                                { id: 'jobDescription', label: 'Job Description', content: report.jobDescription },
                                ...(report.resume ? [{ id: 'resume', label: 'Parsed Resume', content: report.resume }] : []),
                                ...(report.selfDescription ? [{ id: 'selfDescription', label: 'Self-Description', content: report.selfDescription }] : []),
                            ].map((item) => (
                                <div className="input-accordion-item" key={item.id}>
                                    <button
                                        type="button"
                                        className="input-accordion-trigger"
                                        onClick={() => toggleInput(item.id)}
                                        aria-expanded={expandedInput === item.id}
                                    >
                                        <span>{item.label}</span>
                                        <svg
                                            className={`chevron-icon ${expandedInput === item.id ? 'chevron-icon--open' : ''}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    {expandedInput === item.id && (
                                        <div className="input-accordion-body">
                                            {item.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview

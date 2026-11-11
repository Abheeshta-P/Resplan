import { useState, useRef, useEffect, useMemo } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.ts'
import { useNavigate } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen.tsx'

const PAGE_SIZE = 8

const Home = () => {
    const { loading, handleGenerateInterviewReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState<string>("")
    const [selfDescription, setSelfDescription] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<'generator' | 'plans'>('generator')
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [displayLimit, setDisplayLimit] = useState<number>(PAGE_SIZE)
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

    const resumeInputRef = useRef<HTMLInputElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleGenerateReport = async () => {
        const resume = selectedFile || resumeInputRef.current?.files?.[0]

        const data = await handleGenerateInterviewReport({
            jobDescription,
            resume,
            selfDescription,
        })

        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    // Filter reports based on search query
    const filteredReports = useMemo(() => {
        if (!reports) return []
        if (!searchQuery.trim()) return reports
        const query = searchQuery.toLowerCase().trim()
        return reports.filter((r) =>
            (r.title || 'Untitled Position').toLowerCase().includes(query)
        )
    }, [reports, searchQuery])

    // Visible reports for on-scroll pagination
    const visibleReports = useMemo(() => {
        return filteredReports.slice(0, displayLimit)
    }, [filteredReports, displayLimit])

    const hasMore = displayLimit < filteredReports.length

    // Infinite scroll intersection observer
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setIsLoadingMore(true)
                    setTimeout(() => {
                        setDisplayLimit((prev) => prev + PAGE_SIZE)
                        setIsLoadingMore(false)
                    }, 250)
                }
            },
            { rootMargin: '120px', threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore])

    // Reset pagination when search query changes
    useEffect(() => {
        setDisplayLimit(PAGE_SIZE)
    }, [searchQuery])

    if (loading) {
        return <LoadingScreen text="Generating interview report..." />
    }

    const canGenerate = Boolean(
        jobDescription.trim() && (selectedFile || selfDescription.trim())
    )

    return (
        <div className="dashboard-page">
            {/* Mobile / Tablet Tab Switcher (< 1024px) */}
            <div className="studio-tab-bar">
                <button
                    type="button"
                    className={`studio-tab-btn ${activeTab === 'generator' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('generator')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span>Generator Workspace</span>
                </button>
                <button
                    type="button"
                    className={`studio-tab-btn ${activeTab === 'plans' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span>My Plans {reports && reports.length > 0 ? `(${reports.length})` : ''}</span>
                </button>
            </div>

            {/* Main Studio Two-Column Layout */}
            <div className="studio-layout">
                {/* Left Sidebar: My Recent Plans (Zero page scroll, on-scroll infinite load) */}
                <aside className={`studio-sidebar ${activeTab === 'plans' ? 'studio-sidebar--active-mobile' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-header__top">
                            <div className="sidebar-title-wrap">
                                <h3>My Recent Plans</h3>
                            </div>
                        </div>

                        {/* Search input if multiple plans */}
                        {reports && reports.length > 2 && (
                            <div className="sidebar-search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Filter plans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Scrollable Plans Container with On-Scroll Pagination */}
                    <div className="sidebar-content">
                        {!reports || reports.length === 0 ? (
                            <div className="sidebar-empty">
                                <div className="empty-icon-wrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                                <h4>No plans created yet</h4>
                                <p>Fill in the job details on the right to build your first tailored interview plan.</p>
                            </div>
                        ) : visibleReports.length === 0 ? (
                            <div className="sidebar-empty">
                                <p>No plans matching &ldquo;{searchQuery}&rdquo;</p>
                            </div>
                        ) : (
                            <div className="sidebar-cards-container">
                                {visibleReports.map((report) => (
                                    <article
                                        key={report._id}
                                        className="plan-card"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                navigate(`/interview/${report._id}`)
                                            }
                                        }}
                                    >
                                        <div className="plan-card__main">
                                            <h4 className="plan-card__title" title={report.title || 'Untitled Position'}>
                                                {report.title || 'Untitled Position'}
                                            </h4>
                                            <div className="plan-card__meta">
                                                <span
                                                    className={`match-badge ${
                                                        report.matchScore >= 80
                                                            ? 'match-badge--high'
                                                            : report.matchScore >= 60
                                                            ? 'match-badge--mid'
                                                            : 'match-badge--low'
                                                    }`}
                                                >
                                                    {report.matchScore}% Match
                                                </span>
                                                <span className="plan-card__date">
                                                    {new Date(report.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="plan-card__action">
                                            <span className="arrow-icon">&rarr;</span>
                                        </div>
                                    </article>
                                ))}

                                {/* Infinite Scroll Sentinel */}
                                {hasMore && (
                                    <div ref={sentinelRef} className="pagination-sentinel">
                                        {isLoadingMore ? (
                                            <div className="sentinel-loading">
                                                <span className="loading-dot"></span>
                                                <span className="loading-dot"></span>
                                                <span className="loading-dot"></span>
                                                <span>Loading plans...</span>
                                            </div>
                                        ) : (
                                            <span className="sentinel-hint">Scroll down to view more</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Canvas: Flat Studio Generator Workspace */}
                <main className={`studio-canvas ${activeTab === 'generator' ? 'studio-canvas--active-mobile' : ''}`}>
                    <div className="studio-canvas__inner">
                        {/* Workbench Header */}
                        <header className="workspace-header">
                            <h1 className="workspace-header__title">Interview Strategy Generator</h1>
                            <p className="workspace-header__desc">
                                Provide the target job description and your profile to build a custom preparation blueprint with questions, gaps, and study plan.
                            </p>
                        </header>

                        {/* Form Workspace Sections */}
                        <div className="workspace-sections">
                            {/* Section 1: Target Job Description */}
                            <section className="form-section">
                                <div className="form-section__header">
                                    <div className="section-title-wrap">
                                        <label htmlFor="jobDescription" className="section-title">
                                            Target Job Description
                                        </label>
                                        <span className="badge badge--required">Required</span>
                                    </div>
                                    <span className="char-counter">{jobDescription.length} / 5000</span>
                                </div>
                                <textarea
                                    id="jobDescription"
                                    className="studio-textarea studio-textarea--jd"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, large-scale system design, and performance profiling...'`}
                                    maxLength={5000}
                                />
                            </section>

                            {/* Section 2: Candidate Profile */}
                            <section className="form-section">
                                <div className="form-section__header">
                                    <div className="section-title-wrap">
                                        <span className="section-title">Candidate Profile</span>
                                        <span className="badge badge--best">Resume Recommended</span>
                                    </div>
                                </div>

                                <div className="profile-grid">
                                    {/* Sub-column 1: Upload Resume Dropzone */}
                                    <div className="profile-grid__resume">
                                        <span className="subfield-label">Upload Resume</span>
                                        {selectedFile ? (
                                            <label
                                                className="dropzone dropzone--selected"
                                                htmlFor="resume"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <div className="dropzone__selected-info">
                                                    <span className="dropzone__file-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                            <polyline points="14 2 14 8 20 8"></polyline>
                                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                                            <polyline points="10 9 9 9 8 9"></polyline>
                                                        </svg>
                                                    </span>
                                                    <div className="dropzone__file-details">
                                                        <p className="dropzone__file-name" title={selectedFile.name}>{selectedFile.name}</p>
                                                        <p className="dropzone__file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Selected</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="dropzone__remove-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            e.preventDefault()
                                                            handleRemoveFile()
                                                        }}
                                                        title="Remove resume"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="dropzone__change-hint">Click or drop another file to replace</p>
                                                <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" onChange={handleFileChange} />
                                            </label>
                                        ) : (
                                            <label
                                                className={`dropzone ${isDragging ? 'dropzone--dragging' : ''}`}
                                                htmlFor="resume"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <span className="dropzone__icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="16 16 12 12 8 16" />
                                                        <line x1="12" y1="12" x2="12" y2="21" />
                                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                                    </svg>
                                                </span>
                                                <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                                                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                                                <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" onChange={handleFileChange} />
                                            </label>
                                        )}
                                    </div>

                                    {/* Middle OR Divider */}
                                    <div className="profile-grid__divider">
                                        <span>OR</span>
                                    </div>

                                    {/* Sub-column 2: Self-Description */}
                                    <div className="profile-grid__desc">
                                        <label htmlFor="selfDescription" className="subfield-label">
                                            Quick Self-Description
                                        </label>
                                        <textarea
                                            id="selfDescription"
                                            name="selfDescription"
                                            className="studio-textarea studio-textarea--desc"
                                            value={selfDescription}
                                            onChange={(e) => setSelfDescription(e.target.value)}
                                            placeholder="Briefly describe your experience, primary tech stack, and years of experience if you don't have a resume handy..."
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="workspace-footer">
                            <div className="footer-status">
                                <span className="status-dot"></span>
                                <span>Either resume or self-description is required &bull; ~30s turnaround</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleGenerateReport}
                                disabled={!canGenerate}
                                className={`button primary-button studio-submit-btn ${!canGenerate ? 'studio-submit-btn--disabled' : ''}`}
                            >
                                <span>Generate Interview Strategy</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Home

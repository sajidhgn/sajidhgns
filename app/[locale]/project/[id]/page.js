import React, { Fragment } from "react";
import Navbar from "../../../../client/components/Navbar/Navbar";
import Footer from "../../../../client/components/footer/Footer";
import Scrollbar from "../../../../client/components/scrollbar/scrollbar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params: { locale, id } }) {
    const t = await getTranslations({ locale, namespace: 'projects_section' });
    const projects = t.raw("projects");
    const project = projects.find(p => p.id == id);

    if (!project) return {};

    return {
        title: `${project.title} - Case Study | Sajidhgn`,
        description: project.subTitle,
        openGraph: {
            title: `${project.title} - Case Study`,
            description: project.subTitle,
            images: [
                {
                    url: `/${project.pImg}`,
                    width: 800,
                    height: 600,
                    alt: project.title,
                },
            ],
        },
    };
}

const ProjectSinglePage = async ({ params: { locale, id } }) => {
    const t = await getTranslations({ locale, namespace: 'projects_section' });
    const projects = t.raw("projects");
    const project = projects.find(p => p.id == id);

    if (!project) {
        return (
            <div className="text-center py-5 mt-5">
                <h2>Project Not Found</h2>
                <Link href="/" className="theme-btn mt-3">Back to Home</Link>
            </div>
        );
    }

    const cleanWebsiteUrl = project.button?.replace('https://', '').replace('http://', '').replace('www.', '');

    return (
        <div id="scrool">
            <Fragment>
                <div className="br-app" style={{ backgroundColor: '#0f172a' }}>
                    <Navbar />

                    {/* Hero Header Section */}
                    <div className="wpo-project-hero-area pt-120 pb-120" style={{ backgroundColor: '#1e293b', paddingTop: '160px', paddingBottom: '80px', borderBottom: '1px solid #334155' }}>
                        <div className="container">
                            <div className="row align-items-center">
                                {/* Left Content */}
                                <div className="col-lg-6 col-12 text-center text-lg-start mb-5 mb-lg-0">
                                    <h1 className="display-4 fw-bold text-white mb-4">{project.title.split(' - ')[0]}</h1>
                                    <p className="lead text-light mb-4" style={{ opacity: 0.9, lineHeight: '1.8' }}>
                                        {project.subTitle}
                                    </p>

                                    <div className="technologies-hero mb-5">
                                        <h5 className="text-white mb-3 fs-6">Technologies Used:</h5>
                                        <ul className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start list-unstyled mb-0">
                                            {project.tags?.map((tag, i) => (
                                                <li key={i} className="badge px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1' }}>
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                                        <a href={project.button} target="_blank" rel="noopener noreferrer" className="theme-btn d-flex align-items-center gap-2 px-4 py-3 shadow-lg" style={{ borderRadius: '8px' }}>
                                            <i className="fa fa-external-link fs-5"></i>
                                            <span className="fw-bold">Live Demo</span>
                                        </a>
                                        {/* <a href="https://github.com/Sajidhgn" target="_blank" rel="noopener noreferrer" className="theme-btn d-flex align-items-center gap-2 px-4 py-3 shadow-lg" style={{ background: '#334155', border: 'none', color: '#fff', borderRadius: '8px' }}>
                                            <i className="fa fa-github fs-5"></i>
                                            <span className="fw-bold">View Code</span>
                                        </a> */}
                                    </div>
                                </div>

                                {/* Right Image */}
                                <div className="col-lg-6 col-12">
                                    <div className="hero-video-wrapper rounded shadow-lg p-2" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                                        <Image
                                            src={`/${project.pImg}`}
                                            alt={project.title}
                                            width={800} height={350}
                                            className="w-100 rounded"
                                            style={{ objectFit: 'cover', height: '350px', objectPosition: 'top' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="wpo-project-single-area pb-5 pt-5">
                        <div className="container pt-4">
                            <div className="row">
                                {/* Left Column: Media & Content */}
                                <div className="col-lg-8 col-12">
                                    <div className="wpo-project-single-main-img mb-5" id="video">
                                        {/* Video moved to hero banner */}

                                        {/* <div id="gallery" className="pt-2">
                                            <h3 className="mb-4 text-white">Project Gallery</h3>
                                            <ProjectGallery project={project} />
                                        </div> */}
                                    </div>

                                    <div className="wpo-project-single-content-des mt-5">
                                        <div className="seo-optimized-content mb-5" id="overview">
                                            <h2 className="mb-4 fs-3 text-white border-bottom border-secondary pb-3">My Role & Overview</h2>
                                            <h4 className="text-primary mb-3">Full Stack Engineer</h4>
                                            <p className="text-light" style={{ lineHeight: '1.9', fontSize: '1.05rem', opacity: 0.9 }}>
                                                {project.subTitle}
                                            </p>
                                        </div>

                                        <div className="features-section mb-5" id="features">
                                            <h2 className="mb-4 fs-3 text-white border-bottom border-secondary pb-3">Key Features & Highlights</h2>
                                            <div className="row">
                                                {project.features?.map((feature, i) => (
                                                    <div key={i} className="col-12 mb-4">
                                                        <div className="d-flex align-items-start p-4 rounded shadow-sm" style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #ff4a57' }}>
                                                            <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center me-4 mt-1 flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                                                                <span className="text-primary fw-bold">{i + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="fs-5 text-white mb-2">{typeof feature === 'string' ? feature : feature.title || ''}</h4>
                                                                {feature.detail && (
                                                                    <p className="text-light mb-0" style={{ lineHeight: '1.7', opacity: 0.85, fontSize: '0.95rem' }}>
                                                                        {feature.detail}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {project.challenges && (
                                            <div className="challenges-section mb-5" id="challenges">
                                                <h2 className="mb-4 fs-3 text-white border-bottom border-secondary pb-3">Challenges Faced</h2>
                                                <ul className="list-unstyled">
                                                    {project.challenges.map((challenge, i) => (
                                                        <li key={i} className="mb-3 d-flex align-items-start">
                                                            <i className="fa fa-exclamation-triangle text-warning me-3 mt-1 fs-5"></i>
                                                            <span className="text-light" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>{challenge}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {project.solutions && (
                                            <div className="solutions-section mb-5" id="solutions">
                                                <h2 className="mb-4 fs-3 text-white border-bottom border-secondary pb-3">Implemented Solutions</h2>
                                                <ul className="list-unstyled">
                                                    {project.solutions.map((solution, i) => (
                                                        <li key={i} className="mb-3 d-flex align-items-start">
                                                            <i className="fa fa-check-circle text-success me-3 mt-1 fs-5"></i>
                                                            <span className="text-light" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>{solution}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {project.results && (
                                            <div className="results-section mb-5" id="results">
                                                <h2 className="mb-4 fs-3 text-white border-bottom border-secondary pb-3">Final Results & Impact</h2>
                                                <div className="row g-4">
                                                    {project.results.map((result, i) => (
                                                        <div key={i} className="col-md-6">
                                                            <div className="p-4 rounded h-100" style={{ backgroundColor: 'rgba(255, 74, 87, 0.05)', border: '1px solid rgba(255, 74, 87, 0.2)' }}>
                                                                <i className="fa fa-trophy mb-3 fs-3" style={{ color: '#ff4a57' }}></i>
                                                                <p className="text-light mb-0" style={{ lineHeight: '1.6' }}>{result}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="wpo-project-single-item-quote mt-5 shadow-sm p-4 p-md-5" style={{ backgroundColor: '#1e293b', borderLeft: '4px solid #ff4a57', borderRadius: '12px' }}>
                                            <p className="fst-italic fs-5 text-light mb-0" style={{ lineHeight: '1.8' }}>"We turn challenges into opportunities by blending strategy, design, and technology into seamless solutions."</p>
                                            <span className="fw-bold mt-4 d-block fs-5" style={{ color: '#ff4a57' }}>- Sajidhgn</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="col-lg-4 col-12 mt-5 mt-lg-0">
                                    <div className="wpo-project-single-content-des-right sticky-top" style={{ top: '120px' }}>

                                        {/* Quick Navigation Panel */}
                                        <div className="p-4 rounded shadow-lg mb-4" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                                            <h4 className="mb-4 pb-3 border-bottom border-secondary text-white">Quick Navigation</h4>
                                            <ul className="list-unstyled mb-0 quick-nav-links">
                                                <li className="mb-3">
                                                    <a href="#overview" className="text-light text-decoration-none d-flex align-items-center gap-2 hover-text-primary">
                                                        <i className="fa fa-info-circle text-primary"></i> Overview
                                                    </a>
                                                </li>
                                                <li className="mb-3">
                                                    <a href="#features" className="text-light text-decoration-none d-flex align-items-center gap-2 hover-text-primary">
                                                        <i className="fa fa-list-alt text-primary"></i> Key Features
                                                    </a>
                                                </li>
                                                <li className="mb-3">
                                                    <a href="#challenges" className="text-light text-decoration-none d-flex align-items-center gap-2 hover-text-primary">
                                                        <i className="fa fa-exclamation-circle text-primary"></i> Challenges & Solutions
                                                    </a>
                                                </li>
                                                <li className="mb-3">
                                                    <a href="#results" className="text-light text-decoration-none d-flex align-items-center gap-2 hover-text-primary">
                                                        <i className="fa fa-line-chart text-primary"></i> Results
                                                    </a>
                                                </li>
                                                {/* <li className="mb-3">
                                                    <a href="#gallery" className="text-light text-decoration-none d-flex align-items-center gap-2 hover-text-primary">
                                                        <i className="fa fa-photo text-primary"></i> Interactive Gallery
                                                    </a>
                                                </li> */}
                                            </ul>
                                        </div>

                                        {/* Core Details Panel */}
                                        <div className="p-4 rounded shadow-lg mb-4" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                                            <ul className="list-unstyled mb-0 project-sidebar-meta">
                                                <li className="mb-4">
                                                    <h5 className="text-white mb-2 fs-6">Role</h5>
                                                    <p className="text-light mb-0 fs-6">Full Stack Engineer</p>
                                                </li>
                                                <li className="mb-4">
                                                    <h5 className="text-white mb-2 fs-6">Duration</h5>
                                                    <p className="text-light mb-0 fs-6">Aug 2023 - Present</p>
                                                </li>
                                                <li className="mb-4">
                                                    <h5 className="text-white mb-2 fs-6">Team Size</h5>
                                                    <p className="text-light mb-0 fs-6">2 Developers, 1 Designer</p>
                                                </li>
                                                <li>
                                                    <h5 className="text-white mb-3 fs-6">Technologies</h5>
                                                    <ul className="d-flex flex-wrap gap-2 list-unstyled mb-0">
                                                        {project.tags?.map((tag, i) => (
                                                            <li key={i} className="badge px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1' }}>
                                                                {tag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Action Links */}
                                        <div className="mt-4">
                                            <a href={project.button} target="_blank" rel="noopener noreferrer" className="theme-btn w-100 shadow-lg d-flex justify-content-center align-items-center gap-2" style={{ padding: '16px', borderRadius: '8px' }}>
                                                <span className="fw-bold">Launch {cleanWebsiteUrl}</span>
                                                <i className="fa fa-external-link"></i>
                                            </a>
                                            <Link href="/#projects" className="theme-btn w-100 mt-3 d-flex justify-content-center align-items-center gap-2 shadow-sm" style={{ background: 'transparent', border: '2px solid #ff4a57', color: '#ff4a57', padding: '16px', borderRadius: '8px' }}>
                                                <i className="fa fa-arrow-left"></i>
                                                <span className="fw-bold">Back to All Projects</span>
                                            </Link>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <Footer />
                    <Scrollbar />
                </div>
            </Fragment>
        </div>
    );
}

export default ProjectSinglePage;

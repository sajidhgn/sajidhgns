import React, { Fragment } from "react";
import Navbar from "../../../../client/components/Navbar/Navbar";
import Footer from "../../../../client/components/footer/Footer";
import Scrollbar from "../../../../client/components/scrollbar/scrollbar";
import prisma from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, getMessages } from "next-intl/server";

export async function generateMetadata({ params: { id, locale } }) {
    let project = await prisma.project.findUnique({ where: { id: id.length === 24 ? id : undefined } }).catch(() => null);

    if (!project) {
        const messages = await getMessages({ locale });
        project = messages.projects_section.projects.find(p => String(p.id) === String(id));
    }

    if (!project) return {};

    const title = typeof project.title === 'string' ? project.title : project.title[locale];
    const subTitle = typeof project.subTitle === 'string' ? project.subTitle : project.subTitle[locale];

    return {
        title: `${title} | Sajidhgn Portfolio`,
        description: subTitle,
    };
}

const ProjectDetailPage = async ({ params: { id, locale } }) => {
    let project = await prisma.project.findUnique({
        where: { id: id.length === 24 ? id : "000000000000000000000000" } // MongoDB ID length check
    }).catch(() => null);

    const messages = await getMessages({ locale });
    const t = await getTranslations({ locale, namespace: 'projects_section' });

    if (!project) {
        // Fallback to static projects from locale file
        const staticProject = messages.projects_section.projects.find(p => String(p.id) === String(id));
        if (staticProject) {
            project = {
                ...staticProject,
                title: { [locale]: staticProject.title },
                subTitle: { [locale]: staticProject.subTitle },
                problem: staticProject.problem ? { [locale]: staticProject.problem } : null,
                solution: staticProject.solution ? { [locale]: staticProject.solution } : null,
                challenges: staticProject.challenges ? { [locale]: staticProject.challenges } : null,
                result: staticProject.result ? { [locale]: staticProject.result } : null,
                caseStudy: staticProject.caseStudy ? { [locale]: staticProject.caseStudy } : null,
                techStack: staticProject.techStack || []
            };
        }
    }

    if (!project) {
        notFound();
    }

    const sections = [
        { id: 'problem', label: t('problem_label'), icon: 'fa-exclamation-triangle', colorClass: 'problem-card', content: project.problem?.[locale] },
        { id: 'solution', label: t('solution_label'), icon: 'fa-lightbulb', colorClass: 'solution-card', content: project.solution?.[locale] },
        { id: 'challenges', label: t('challenges_label'), icon: 'fa-rocket', colorClass: 'challenges-card', content: project.challenges?.[locale] },
        { id: 'result', label: t('result_label'), icon: 'fa-chart-line', colorClass: 'result-card', content: project.result?.[locale] },
        { id: 'caseStudy', label: t('case_study_label'), icon: 'fa-book-open', colorClass: 'case-study-card', content: project.caseStudy?.[locale] },
    ];

    return (
        <div id="scrool" className="project-detail-page-v2">
            <Fragment>
                <div className="br-app">
                    <Navbar />

                    <section className="project-detail-hero">
                        <div className="container">
                            <div className="tags-list mb-4">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="tag-item">{tag}</span>
                                ))}
                            </div>
                            <h1>{project.title[locale]}</h1>
                            <p className="sub-title">{project.subTitle[locale]}</p>
                        </div>
                    </section>

                    <div className="container">
                        <div className="project-detail-image-wrap text-center mb-5">
                            <Image
                                src={`/${project.pImg}`}
                                alt={project.title[locale]}
                                width={1100}
                                height={600}
                                className="img-fluid rounded shadow-lg"
                                priority
                            />
                        </div>

                        <div className="row mt-5 pb-5">
                            <div className="col-lg-8">
                                {sections.map((section) => section.content && (
                                    <div key={section.id} className={`project-info-card ${section.colorClass}`}>
                                        <div className="card-header-flex">
                                            <div className="icon-box">
                                                <i className={`fa ${section.icon}`}></i>
                                            </div>
                                            <h3>{section.label}</h3>
                                        </div>
                                        <p>{section.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="col-lg-4">
                                <aside className="project-sidebar-v2">
                                    <h4>{t('tech_stack_label')}</h4>
                                    <ul className="tech-badge-list">
                                        {project.techStack.map((tech, i) => (
                                            <li key={i}>{tech}</li>
                                        ))}
                                    </ul>

                                    <div className="project-meta-info mt-4">
                                        <a
                                            href={project.buttonUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-btn"
                                        >
                                            {t('view_live')} <i className="fa fa-external-link-alt ms-2"></i>
                                        </a>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>

                    <Footer />
                    <Scrollbar />
                </div>
            </Fragment>
        </div>
    );
};

export default ProjectDetailPage;

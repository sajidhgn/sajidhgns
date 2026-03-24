'use client';

import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Tabs, Tab, TextField, Button,
    Card, CardContent, Grid, IconButton, Divider, Alert, CircularProgress
} from '@mui/material';
// Font Awesome icons are used via standard <i> tags with class names as requested

const AdminPanel = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Data states
    const [hero, setHero] = useState(null);
    const [about, setAbout] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [projects, setProjects] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [heroRes, aboutRes, experiencesRes, projectsRes, testiRes] = await Promise.all([
                fetch('/api/admin/hero'),
                fetch('/api/admin/about'),
                fetch('/api/admin/experiences'),
                fetch('/api/admin/projects'),
                fetch('/api/admin/testimonials')
            ]);

            setHero(await heroRes.json());
            setAbout(await aboutRes.json());
            setExperiences(await experiencesRes.json());
            setProjects(await projectsRes.json());
            setTestimonials(await testiRes.json());
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to fetch data' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveHero = async () => {
        try {
            const res = await fetch('/api/admin/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hero),
            });
            if (res.ok) setStatus({ type: 'success', message: 'Hero updated successfully' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update hero' });
        }
    };

    const handleSaveAbout = async () => {
        try {
            const res = await fetch('/api/admin/about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(about),
            });
            if (res.ok) setStatus({ type: 'success', message: 'About updated successfully' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to update about' });
        }
    };

    const handleSaveExperience = async (exp) => {
        try {
            const res = await fetch('/api/admin/experiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exp),
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Experience saved' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save experience' });
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            const res = await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Experience deleted' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to delete experience' });
        }
    };

    const handleSaveProject = async (project) => {
        try {
            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Project saved' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save project' });
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Project deleted' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to delete project' });
        }
    };

    const handleSaveTestimonial = async (testi) => {
        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testi),
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Testimonial saved' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save testimonial' });
        }
    };

    const handleDeleteTestimonial = async (id) => {
        try {
            const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Testimonial deleted' });
                fetchData();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to delete testimonial' });
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

            {status.message && (
                <Alert severity={status.type} sx={{ mb: 2 }} onClose={() => setStatus({ ...status, message: '' })}>
                    {status.message}
                </Alert>
            )}

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4 }}>
                <Tab label="Hero" />
                <Tab label="About" />
                <Tab label="Experience" />
                <Tab label="Projects" />
                <Tab label="Testimonials" />
            </Tabs>

            {/* Hero Tab */}
            {tab === 0 && hero && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Hero Section</Typography>
                        <Grid container spacing={3}>
                            {['en', 'ar'].map(lang => (
                                <React.Fragment key={lang}>
                                    <Grid item xs={12}><Divider><strong>{lang.toUpperCase()} Content</strong></Divider></Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Greetings" value={hero.greetings[lang]} onChange={e => setHero({ ...hero, greetings: { ...hero.greetings, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Sub Title" value={hero.subTitle[lang]} onChange={e => setHero({ ...hero, subTitle: { ...hero.subTitle, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Main Title" value={hero.title[lang]} onChange={e => setHero({ ...hero, title: { ...hero.title, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={3} label="Description" value={hero.description[lang]} onChange={e => setHero({ ...hero, description: { ...hero.description, [lang]: e.target.value } })} />
                                    </Grid>
                                </React.Fragment>
                            ))}
                            <Grid item xs={12}>
                                <Button variant="contained" startIcon={<i className="fa fa-save"></i>} onClick={handleSaveHero}>Save Hero Changes</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* About Tab */}
            {tab === 1 && about && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>About Section</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Exp Duration" value={about.expDuration} onChange={e => setAbout({ ...about, expDuration: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Satisfy %" value={about.satisfyPercentage} onChange={e => setAbout({ ...about, satisfyPercentage: e.target.value })} />
                            </Grid>
                            {['en', 'ar'].map(lang => (
                                <React.Fragment key={lang}>
                                    <Grid item xs={12}><Divider><strong>{lang.toUpperCase()} Content</strong></Divider></Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Exp Detail" value={about.expDetail[lang]} onChange={e => setAbout({ ...about, expDetail: { ...about.expDetail, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Satisfy Detail" value={about.satisfyDetail[lang]} onChange={e => setAbout({ ...about, satisfyDetail: { ...about.satisfyDetail, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Title" value={about.title[lang]} onChange={e => setAbout({ ...about, title: { ...about.title, [lang]: e.target.value } })} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={4} label="Description" value={about.description[lang]} onChange={e => setAbout({ ...about, description: { ...about.description, [lang]: e.target.value } })} />
                                    </Grid>
                                </React.Fragment>
                            ))}
                            <Grid item xs={12}>
                                <Button variant="contained" startIcon={<i className="fa fa-save"></i>} onClick={handleSaveAbout}>Save About Changes</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Experience Tab */}
            {tab === 2 && (
                <Box>
                    <Button variant="outlined" startIcon={<i className="fa fa-plus"></i>} sx={{ mb: 2 }} onClick={() => setExperiences([...experiences, {
                        date: '',
                        logo: '',
                        position: { en: '', ar: '' },
                        companyName: { en: '', ar: '' },
                        workFrom: { en: '', ar: '' },
                        webLink: '',
                        buttonText: { en: 'View Site', ar: 'عرض الموقع' },
                        order: experiences.length
                    }])}>Add New Experience</Button>
                    {experiences.map((exp, idx) => (
                        <Card key={exp.id || idx} sx={{ mb: 3 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}><Typography variant="h6">{exp.companyName.en || 'New Company'}</Typography></Grid>
                                    <Grid item xs={2} textAlign="right">
                                        <IconButton color="error" onClick={() => exp.id && handleDeleteExperience(exp.id)}><i className="fa fa-trash"></i></IconButton>
                                    </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Date" value={exp.date} onChange={e => {
                                        const newExps = [...experiences];
                                        newExps[idx].date = e.target.value;
                                        setExperiences(newExps);
                                    }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Logo URL" value={exp.logo} onChange={e => {
                                        const newExps = [...experiences];
                                        newExps[idx].logo = e.target.value;
                                        setExperiences(newExps);
                                    }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Web Link" value={exp.webLink} onChange={e => {
                                        const newExps = [...experiences];
                                        newExps[idx].webLink = e.target.value;
                                        setExperiences(newExps);
                                    }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Order" value={exp.order} onChange={e => {
                                        const newExps = [...experiences];
                                        newExps[idx].order = parseInt(e.target.value);
                                        setExperiences(newExps);
                                    }} /></Grid>

                                    {['en', 'ar'].map(lang => (
                                        <Grid item xs={12} sm={6} key={lang}>
                                            <Typography variant="caption">{lang.toUpperCase()}</Typography>
                                            <TextField fullWidth label="Company Name" value={exp.companyName[lang]} sx={{ mb: 1 }} onChange={e => {
                                                const newExps = [...experiences];
                                                newExps[idx].companyName[lang] = e.target.value;
                                                setExperiences(newExps);
                                            }} />
                                            <TextField fullWidth label="Position" value={exp.position[lang]} sx={{ mb: 1 }} onChange={e => {
                                                const newExps = [...experiences];
                                                newExps[idx].position[lang] = e.target.value;
                                                setExperiences(newExps);
                                            }} />
                                            <TextField fullWidth label="Work From" value={exp.workFrom[lang]} sx={{ mb: 1 }} onChange={e => {
                                                const newExps = [...experiences];
                                                newExps[idx].workFrom[lang] = e.target.value;
                                                setExperiences(newExps);
                                            }} />
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <Button variant="contained" size="small" onClick={() => handleSaveExperience(exp)}>Save This Experience</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Projects Tab */}
            {tab === 3 && (
                <Box>
                    <Button variant="outlined" startIcon={<i className="fa fa-plus"></i>} sx={{ mb: 2 }} onClick={() => setProjects([...projects, {
                        title: { en: 'New Project', ar: '' },
                        subTitle: { en: '', ar: '' },
                        tags: [],
                        features: { en: [], ar: [] },
                        pImg: '',
                        buttonUrl: '',
                        problem: { en: '', ar: '' },
                        solution: { en: '', ar: '' },
                        challenges: { en: '', ar: '' },
                        result: { en: '', ar: '' },
                        caseStudy: { en: '', ar: '' },
                        techStack: []
                    }])}>Add New Project</Button>
                    {projects.map((p, idx) => (
                        <Card key={p.id || idx} sx={{ mb: 3 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}><Typography variant="h6">{p.title.en || 'Untitled Project'}</Typography></Grid>
                                    <Grid item xs={2} textAlign="right">
                                        <IconButton color="error" onClick={() => p.id && handleDeleteProject(p.id)}><i className="fa fa-trash"></i></IconButton>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Image URL" value={p.pImg} onChange={e => {
                                            const newProjects = [...projects];
                                            newProjects[idx].pImg = e.target.value;
                                            setProjects(newProjects);
                                        }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Button URL" value={p.buttonUrl} onChange={e => {
                                            const newProjects = [...projects];
                                            newProjects[idx].buttonUrl = e.target.value;
                                            setProjects(newProjects);
                                        }} />
                                    </Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Tags (comma separated)" value={p.tags.join(', ')} onChange={e => {
                                        const newProjects = [...projects];
                                        newProjects[idx].tags = e.target.value.split(',').map(s => s.trim());
                                        setProjects(newProjects);
                                    }} /></Grid>

                                    {['en', 'ar'].map(lang => (
                                        <Grid item xs={12} sm={6} key={lang}>
                                            <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{lang.toUpperCase()} Content</Typography>
                                            <TextField fullWidth label="Title" value={p.title[lang]} sx={{ mb: 1 }} onChange={e => {
                                                const newProjects = [...projects];
                                                newProjects[idx].title[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline label="Sub Title" sx={{ mb: 1 }} value={p.subTitle[lang]} onChange={e => {
                                                const newProjects = [...projects];
                                                newProjects[idx].subTitle[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Problem" sx={{ mb: 1 }} value={p.problem ? p.problem[lang] : ''} onChange={e => {
                                                const newProjects = [...projects];
                                                if (!newProjects[idx].problem) newProjects[idx].problem = { en: '', ar: '' };
                                                newProjects[idx].problem[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Solution" sx={{ mb: 1 }} value={p.solution ? p.solution[lang] : ''} onChange={e => {
                                                const newProjects = [...projects];
                                                if (!newProjects[idx].solution) newProjects[idx].solution = { en: '', ar: '' };
                                                newProjects[idx].solution[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Challenges" sx={{ mb: 1 }} value={p.challenges ? p.challenges[lang] : ''} onChange={e => {
                                                const newProjects = [...projects];
                                                if (!newProjects[idx].challenges) newProjects[idx].challenges = { en: '', ar: '' };
                                                newProjects[idx].challenges[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Result" sx={{ mb: 1 }} value={p.result ? p.result[lang] : ''} onChange={e => {
                                                const newProjects = [...projects];
                                                if (!newProjects[idx].result) newProjects[idx].result = { en: '', ar: '' };
                                                newProjects[idx].result[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Case Study" sx={{ mb: 1 }} value={p.caseStudy ? p.caseStudy[lang] : ''} onChange={e => {
                                                const newProjects = [...projects];
                                                if (!newProjects[idx].caseStudy) newProjects[idx].caseStudy = { en: '', ar: '' };
                                                newProjects[idx].caseStudy[lang] = e.target.value;
                                                setProjects(newProjects);
                                            }} />
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Tech Stack (comma separated)" value={p.techStack ? p.techStack.join(', ') : ''} onChange={e => {
                                            const newProjects = [...projects];
                                            newProjects[idx].techStack = e.target.value.split(',').map(s => s.trim());
                                            setProjects(newProjects);
                                        }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" size="small" onClick={() => handleSaveProject(p)}>Save This Project</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Testimonials Tab */}
            {tab === 4 && (
                <Box>
                    <Button variant="outlined" startIcon={<i className="fa fa-plus"></i>} sx={{ mb: 2 }} onClick={() => setTestimonials([...testimonials, {
                        name: 'New Person',
                        designation: { en: '', ar: '' },
                        description: { en: '', ar: '' },
                        image: ''
                    }])}>Add New Testimonial</Button>
                    {testimonials.map((t, idx) => (
                        <Card key={t.id || idx} sx={{ mb: 3 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}><Typography variant="h6">{t.name}</Typography></Grid>
                                    <Grid item xs={2} textAlign="right">
                                        <IconButton color="error" onClick={() => t.id && handleDeleteTestimonial(t.id)}><i className="fa fa-trash"></i></IconButton>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Name" value={t.name} onChange={e => {
                                            const newTestis = [...testimonials];
                                            newTestis[idx].name = e.target.value;
                                            setTestimonials(newTestis);
                                        }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Image URL" value={t.image} onChange={e => {
                                            const newTestis = [...testimonials];
                                            newTestis[idx].image = e.target.value;
                                            setTestimonials(newTestis);
                                        }} />
                                    </Grid>
                                    {['en', 'ar'].map(lang => (
                                        <Grid item xs={12} sm={6} key={lang}>
                                            <Typography variant="caption">{lang.toUpperCase()}</Typography>
                                            <TextField fullWidth label="Designation" value={t.designation[lang]} sx={{ mb: 1 }} onChange={e => {
                                                const newTestis = [...testimonials];
                                                newTestis[idx].designation[lang] = e.target.value;
                                                setTestimonials(newTestis);
                                            }} />
                                            <TextField fullWidth multiline rows={3} label="Description" value={t.description[lang]} onChange={e => {
                                                const newTestis = [...testimonials];
                                                newTestis[idx].description[lang] = e.target.value;
                                                setTestimonials(newTestis);
                                            }} />
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <Button variant="contained" size="small" onClick={() => handleSaveTestimonial(t)}>Save This Testimonial</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default AdminPanel;

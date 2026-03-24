const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function main() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    const dbName = 'sajidhgn';

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to MongoDB');

        const en = JSON.parse(fs.readFileSync('public/locales/en.json', 'utf8'));
        const ar = JSON.parse(fs.readFileSync('public/locales/ar.json', 'utf8'));

        // Helper to clear and insert
        async function seed(collectionName, data) {
            const col = db.collection(collectionName);
            await col.deleteMany({});
            if (Array.isArray(data)) {
                if (data.length > 0) await col.insertMany(data);
            } else {
                await col.insertOne(data);
            }
            console.log(`Seeded ${collectionName}`);
        }

        // Hero
        await seed('Hero', {
            greetings: { en: en.banner.greatings, ar: ar.banner.greatings },
            subTitle: { en: en.banner.subTitle, ar: ar.banner.subTitle },
            title: { en: en.banner.title, ar: ar.banner.title },
            description: { en: en.banner.description, ar: ar.banner.description },
            buttonText: { en: en.banner.button, ar: ar.banner.button },
            resumeUrl: "/sajid-frontend-resume.pdf",
            imageUrl: "/images/hero-graphic.svg",
            updatedAt: new Date()
        });

        // About
        await seed('About', {
            expDuration: en.about.exp_duration,
            expDetail: { en: en.about.exp_detail, ar: ar.about.exp_detail },
            satisfyPercentage: en.about.satisfy_percentage,
            satisfyDetail: { en: en.about.satisfy_detail, ar: ar.about.satisfy_detail },
            title: { en: en.about.title, ar: ar.about.title },
            description: { en: en.about.description, ar: ar.about.description },
            updatedAt: new Date()
        });

        // Experiences
        const experiences = en.experience_section.work_experience.map((e, i) => {
            const a = ar.experience_section.work_experience[i];
            return {
                date: e.date,
                logo: e.logo,
                position: { en: e.position, ar: a.position },
                companyName: { en: e.companyName, ar: a.companyName },
                workFrom: { en: e.workFrom, ar: a.workFrom },
                webLink: e.webLink,
                buttonText: { en: e.button, ar: a.button },
                order: i,
                updatedAt: new Date()
            };
        });
        await seed('Experience', experiences);

        // Projects
        const projects = en.projects_section.projects.map((e, i) => {
            const a = ar.projects_section.projects[i];
            return {
                pImg: e.pImg,
                title: { en: e.title, ar: a.title },
                tags: e.tags,
                subTitle: { en: e.subTitle, ar: a.subTitle },
                features: { en: e.features, ar: a.features },
                problem: e.problem ? { en: e.problem, ar: a.problem } : null,
                solution: e.solution ? { en: e.solution, ar: a.solution } : null,
                challenges: e.challenges ? { en: e.challenges, ar: a.challenges } : null,
                result: e.result ? { en: e.result, ar: a.result } : null,
                caseStudy: e.caseStudy ? { en: e.caseStudy, ar: a.caseStudy } : null,
                techStack: e.techStack || [],
                buttonUrl: e.button,
                order: i,
                updatedAt: new Date()
            };
        });
        await seed('Project', projects);

        // Testimonials
        const testimonials = en.testimonial.testimonials.map((e, i) => {
            const a = ar.testimonial.testimonials[i];
            return {
                name: e.name,
                designation: { en: e.designation, ar: a.designation },
                description: { en: e.description, ar: a.description },
                image: e.image,
                order: i,
                updatedAt: new Date()
            };
        });
        await seed('Testimonial', testimonials);

        // User
        await seed('User', {
            username: "admin",
            password: "password123",
            updatedAt: new Date()
        });

        console.log('Direct seed successful!');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();

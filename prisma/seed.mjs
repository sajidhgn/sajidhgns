import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    const enPath = path.resolve('public/locales/en.json')
    const arPath = path.resolve('public/locales/ar.json')

    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'))

    // Hero
    // await prisma.hero.deleteMany()
    await prisma.hero.create({
        data: {
            greetings: { en: en.banner.greatings, ar: ar.banner.greatings },
            subTitle: { en: en.banner.subTitle, ar: ar.banner.subTitle },
            title: { en: en.banner.title, ar: ar.banner.title },
            description: { en: en.banner.description, ar: ar.banner.description },
            buttonText: { en: en.banner.button, ar: ar.banner.button },
        }
    })

    // About
    // await prisma.about.deleteMany()
    await prisma.about.create({
        data: {
            expDuration: en.about.exp_duration,
            expDetail: { en: en.about.exp_detail, ar: ar.about.exp_detail },
            satisfyPercentage: en.about.satisfy_percentage,
            satisfyDetail: { en: en.about.satisfy_detail, ar: ar.about.satisfy_detail },
            title: { en: en.about.title, ar: ar.about.title },
            description: { en: en.about.description, ar: ar.about.description },
        }
    })

    // Experience
    // await prisma.experience.deleteMany()
    for (let i = 0; i < en.experience_section.work_experience.length; i++) {
        const e = en.experience_section.work_experience[i]
        const a = ar.experience_section.work_experience[i]
        await prisma.experience.create({
            data: {
                date: e.date,
                logo: e.logo,
                position: { en: e.position, ar: a.position },
                companyName: { en: e.companyName, ar: a.companyName },
                workFrom: { en: e.workFrom, ar: a.workFrom },
                webLink: e.webLink,
                buttonText: { en: e.button, ar: a.button },
                order: i
            }
        })
    }

    // Projects
    // await prisma.project.deleteMany()
    for (let i = 0; i < en.projects_section.projects.length; i++) {
        const e = en.projects_section.projects[i]
        const a = ar.projects_section.projects[i]
        await prisma.project.create({
            data: {
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
                order: i
            }
        })
    }

    // Testimonials
    // await prisma.testimonial.deleteMany()
    for (let i = 0; i < en.testimonial.testimonials.length; i++) {
        const e = en.testimonial.testimonials[i]
        const a = ar.testimonial.testimonials[i]
        await prisma.testimonial.create({
            data: {
                name: e.name,
                designation: { en: e.designation, ar: a.designation },
                description: { en: e.description, ar: a.description },
                image: e.image,
                order: i
            }
        })
    }

    console.log('Seed successful')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

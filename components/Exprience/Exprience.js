import React from 'react'
import Link from 'next/link'
import SectionTitle from '../SectionTitle/SectionTitle'

const Expriences = [
    {
        date: '2024 - Present',
        logo: 'images/work/1.jpeg',
        position: 'Full Stack Developer',
        companyName: 'Dubai',
        workFrom: '(Remote)',
        webLink: '/'
    },
    {
        date: '2023 - 2024',
        logo: 'images/work/2.png',
        position: 'Frontend Developer',
        companyName: 'Lahore, Punjab, Pakistan',
        workFrom: '(Remote)',
        webLink: 'https://dycoders.com/'
    },
    {
        date: '2021 - 2023',
        logo: 'images/work/3.jpeg',
        position: 'Frontend Developer',
        companyName: 'Lahore, Punjab, Pakistan',
        workFrom: '(Onsite)',
        webLink: 'https://tanbits.com/'
    },
    {
        date: '2019 - 2021',
        logo: 'images/work/4.png',
        position: 'Frontend Developer',
        companyName: 'Toronto Ontario, Canada',
        workFrom: '(Remote)',
        webLink: 'http://mdhov.com/'
    },
     {
        date: '2017 - 2019',
        logo: 'images/work/5.jpeg',
        position: 'UI/UX Developer',
       companyName: 'Lahore, Punjab, Pakistan',
        workFrom: '(Onsite)',
        webLink: 'https://www.linkedin.com/in/teambee/'
    },

]


const ExprienceSec = (props) => {
    return (
        <div className="wpo-work-area section-padding">
            <div className="container">
                <SectionTitle Title={'My Work Experience'} />
                <div className="wpo-work-wrap">
                    {Expriences.map((exprience, exp) => (
                        <div className="wpo-work-item" key={exp}>
                            <ul>
                                <li className="date">{exprience.date}</li>
                                <li className="logo"><span><img src={exprience.logo} alt="" /></span></li>
                                <li className="position">{exprience.position} <span>{exprience.companyName} <span>{exprience.workFrom}</span></span></li>
                                <li className="link">
                                    <Link href={exprience.webLink} target="_blank" rel="noopener noreferrer">
                                        Go to website
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="shape-wk">
                <svg width="1500" height="1500" viewBox="0 0 1500 1500" fill="none">
                    <g opacity="0.45" filter="url(#filter0_f_39_4214)">
                        <circle cx="750" cy="750" r="200" />
                    </g>
                    <defs>
                        <filter id="filter0_f_39_4214" x="0" y="0" width="1500" height="1500"
                            filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="275" result="effect1_foregroundBlur_39_4212" />
                        </filter>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

export default ExprienceSec;
/**
 * Owner facts — the single, locale-independent source of truth (see OWNER.md).
 * Never add a fact here that is not in OWNER.md. Localised wording lives in messages/.
 */
export const site = {
  url: "https://sajidhgn.vercel.app",
  handle: "sajidhgn",
  name: { en: "Sajid Ali", ar: "ساجد علي" },
  email: "sajidhgn@gmail.com",
  phone: "+966576452059",
  phoneDisplay: "+966 57 645 2059",
  whatsapp: "https://wa.me/966576452059",
  social: {
    linkedin: "https://www.linkedin.com/in/sajidhgn/",
    github: "https://github.com/sajidhgn",
  },
  location: { city: "Riyadh", countryCode: "SA" },
  // Years of experience are derived from this date (lib/site.js → yearsOfExperience()); never hardcode them.
  careerStart: "2017-01-01",
  availability: {
    open: true,
    immediateJoiner: true,
    iqamaTransferable: true,
    workModes: ["onsite", "hybrid", "remote"],
  },
  // NOTE: this PDF does not exist yet in public/ — it must be added before launch.
  resumePdf: "/sajid-ali-senior-ui-ux-designer-resume.pdf",
  // Owner's studio headshot (navy suit). `portrait` = the cut-out on a warm dark backdrop (About card, OG,
  // JSON-LD); `cutout` = transparent PNG for the hero ring; `headshot` = the original photo as supplied.
  portrait: { src: "/images/sajid-ali-portrait.jpg", width: 800, height: 800 },
  cutout: { src: "/images/sajid-ali-cutout.png", width: 800, height: 800 },
  headshot: { src: "/images/sajid-ali-headshot.jpg", width: 800, height: 800 },
  education: { degree: "Master of Information Technology", school: "Lahore Leads University", year: 2015 },
};

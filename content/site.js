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
  // Set by the owner so the site shows 7+ years in 2026 (the experience timeline itself still starts in 2017).
  careerStart: "2019-01-01",
  availability: {
    open: true,
    immediateJoiner: true,
    iqamaTransferable: true,
    workModes: ["onsite", "hybrid", "remote"],
  },
  // NOTE: this PDF does not exist yet in public/ — it must be added before launch.
  resumePdf: "/Sajid-Ali-AI-Full-Stack-Engineer.pdf",
  // Owner's studio headshot (navy suit). `portrait` = the cut-out on a warm dark backdrop (OG,
  // JSON-LD); `cutout` = transparent PNG for the hero ring; `headshot` = the original photo as supplied.
  portrait: { src: "/images/sajid-ali-portrait.png", width: 1254, height: 1254 },
  cutout: { src: "/images/sajid-ali-cutout1.png", width: 1254, height: 1254 },
  headshot: { src: "/images/sajid-ali-headshot.png", width: 1254, height: 1254 },
  education: { degree: "Master of Information Technology", school: "Lahore Leads University", year: 2015 },
};

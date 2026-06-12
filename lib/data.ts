/**
 * lib/data.ts — Single source of truth for all portfolio content.
 *
 * Architecture decision: ALL static content lives here as typed objects.
 * Section components import and render from this file — never hardcode
 * content inside components. This means:
 * - Updating content = editing one file, not hunting through components
 * - Content is type-safe and predictable
 * - Easy to swap placeholders for real data later
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "About",          href: "#about" },
  { label: "Skills",         href: "#skills" },
  { label: "Projects",       href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact",        href: "#contact" },
] as const

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HERO = {
  name:     "David Saputra",
  subtitle: "ML Enthusiast & Developer",
  tagline:  "Turning data, models, and backend systems into useful products.", // placeholder
  cta: {
    primary:   { label: "View Projects", href: "#projects" },
    secondary: { label: "Contact Me",    href: "#contact" },
  },
  image: "/images/foto_profil.jpg", // replace with real photo
} as const
 
// ─── About ────────────────────────────────────────────────────────────────────

export const ABOUT = {
  paragraphs: [
    "I'm David, a vocational school student focused on Machine Learning and software engineering. I enjoy building complete projects, from data processing and model development to APIs, databases, and deployment.", // placeholder
    "Most of my work revolves around turning ideas into working systems. Whether it's a machine learning pipeline or a full-stack web application, I care about building things that are structured, practical, and maintainable.", // placeholder
  ],
} as const

// ─── Skills ──────────────────────────────────────────────────────────────────

export type Skill = {
  label:       string
  proficiency: string   // e.g. "Confident", "Advanced", "Familiar"
  icon?:       string   // reserved for icon library in polish pass
}
export type SkillCategory = { category: string; skills: Skill[] }

export const SKILLS: SkillCategory[] = [
  {
    category: "Languages & ML",
    skills: [
      { label: "Python",       proficiency: "Advanced" },
      { label: "Scikit-learn", proficiency: "Confident"  },
    ],
  },
  {
    category: "Backend",
    skills: [
      { label: "FastAPI", proficiency: "Confident" },
      { label: "Supabase", proficiency: "Confident" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { label: "Git", proficiency: "Confident" },
      { label: "GitHub",    proficiency: "Confident" },
    ],
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

export type Project = {
  title:       string
  type:        string
  description: string      // placeholder text until owner fills in
  tech:        string[]
  github:      string | null
  demo:        string | null
  thumbnail:   string
}

export const PROJECTS: Project[] = [
  {
    title:       "Toxic Comment Classifier",
    type:        "Machine Learning",
    description: "A collection of small interactive applications built with Python and FastAPI to practice backend development and API design.", // placeholder
    tech:        ["Python", "Scikit-learn", "Streamlit"],
    github:      "https://github.com/ViddSaputra/toxic-comment-classifier", // placeholder
    demo:        "https://viddwny-toxic-comment-classifier.hf.space",
    thumbnail:   "/images/projects/project_ml.png",
  },
  {
    title:       "Vidd Resto",
    type:        "Web Application",
    description: "A full-stack restaurant platform built with Next.js and Tailwind CSS, featuring an intuitive menu interface, ordering flow, and clean responsive design.", // placeholder
    tech:        ["Next.js", "Tailwind CSS", "Supabase"],
    github:      "https://github.com/ViddSaputra/Vidd-Resto-Next.js", // placeholder
    demo:        "https://vidd-resto-next-js.vercel.app", // placeholder
    thumbnail:   "/images/projects/project_resto.png",
  },
]

// ─── Certifications ───────────────────────────────────────────────────────────

export type Certificate = {
  title:    string
  issuer:   string
  image:    string   // path to certificate image
}

export const CERTIFICATIONS: Certificate[] = [
  { title: "Machine Learning", issuer: "Dicoding",     image: "/images/certs/sertifikat_1.jpg" }, // placeholder
  { title: "Artificial Intelligence", issuer: "Dicoding",     image: "/images/certs/sertifikat_2.jpg" }, // placeholder
  { title: "Data Science", issuer: "Komdigi",     image: "/images/certs/sertifikat_3.jpg" }, // placeholder
  { title: "Python Developer", issuer: "Sololearn", image: "/images/certs/sertifikat_4.png" }, // placeholder
]

// ─── Contact ──────────────────────────────────────────────────────────────────

export type ContactLink = {
  label:  string
  value:  string   // display text
  href:   string
  icon:   "mail" | "phone" | "github"
}

export const CONTACT: ContactLink[] = [
  { label: "Email",    value: "davidsaputra10@gmail.com",      href: "mailto:davidsaputra10@gmail.com",          icon: "mail"   }, // placeholder
  { label: "WhatsApp", value: "+62 896-1843-5080",    href: "https://wa.me/6289618435080",      icon: "phone"  }, // placeholder
  { label: "GitHub",   value: "github.com/ViddSaputra",   href: "https://github.com/ViddSaputra",      icon: "github" }, // placeholder
]
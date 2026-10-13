export const site = {
  name: "PetroSkill Virtual Learning",
  shortName: "PVL",
  tagline: "Live professional training for the energy industry",
  email: "admin@petroskillvirtuallearning.com",
  phone: "+233 (0) 547 964 362",
  whatsapp: "+233547964362",
  website: "https://petroskillvirtuallearning.com",
  address: "Accra, Ghana · Serving professionals worldwide",
  registrationForm:
    "https://forms.office.com/r/placeholder-pvl-registration",
  waitlistForm: "https://forms.office.com/r/placeholder-pvl-waitlist",
  social: {
    linkedin: "https://www.linkedin.com/company/petroskill-virtuallearning/",
    facebook: "https://www.facebook.com/share/14dtP1cSo1W/?mibextid=wwXIfr",
    youtube: "https://youtube.com/@petroskillvirtuallearning?si=eegoWBGcSMpkJ6tw",
    whatsapp: "https://chat.whatsapp.com/KFdPh9vquYDGHqupce1fsr",
    twitter: "https://x.com/",
  },
};

/** Local brand photography in /public/images */
export const img = {
  hero: "/images/hero-ppe-orange.png",
  heroAlt: "/images/hero-ppe-yellow.png",
  heroFull: "/images/hero-ppe-full.png",
  about: "/images/about-ppe.png",
  cta: "/images/cta-thumbs-up.png",
  group: "/images/group-01.jpg",
  groupAlt: "/images/group-02.jpg",
  team: [
    "/images/team-01.jpg",
    "/images/team-02.jpg",
    "/images/team-03.jpg",
    "/images/team-04.jpg",
    "/images/team-05.jpg",
    "/images/team-06.jpg",
    "/images/team-07.jpg",
    "/images/team-08.jpg",
    "/images/team-09.jpg",
    "/images/team-10.jpg",
  ],
  gallery: [
    "/images/gallery-01.jpg",
    "/images/gallery-02.jpg",
    "/images/gallery-03.jpg",
    "/images/gallery-04.jpg",
    "/images/gallery-05.jpg",
    "/images/gallery-06.jpg",
    "/images/gallery-07.jpg",
    "/images/gallery-08.jpg",
    "/images/gallery-09.jpg",
    "/images/gallery-10.jpg",
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/internship", label: "Internship" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { value: "5,000+", label: "Participants Trained" },
  { value: "40+", label: "Countries Reached" },
  { value: "80+", label: "Industry Experts" },
  { value: "120+", label: "Courses Delivered" },
  { value: "35+", label: "Partner Organizations" },
];

export const categories = [
  {
    slug: "reservoir-engineering",
    name: "Reservoir Engineering",
    description: "Reservoir characterization, simulation, and recovery strategies.",
    icon: "droplet",
  },
  {
    slug: "production-engineering",
    name: "Production Engineering",
    description: "Well performance, artificial lift, and production optimization.",
    icon: "gauge",
  },
  {
    slug: "drilling-engineering",
    name: "Drilling Engineering",
    description: "Well design, drilling operations, and wellbore integrity.",
    icon: "drill",
  },
  {
    slug: "geoscience",
    name: "Geoscience",
    description: "Petroleum geology, petrophysics, and subsurface interpretation.",
    icon: "layers",
  },
  {
    slug: "petroleum-economics",
    name: "Petroleum Economics",
    description: "Project evaluation, fiscal regimes, and investment decisions.",
    icon: "chart",
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description: "AI applications transforming upstream and energy operations.",
    icon: "brain",
  },
  {
    slug: "data-analytics",
    name: "Data Analytics",
    description: "Data-driven decision making for oil, gas, and energy teams.",
    icon: "analytics",
  },
  {
    slug: "python-programming",
    name: "Python Programming",
    description: "Practical Python for engineers and subsurface professionals.",
    icon: "code",
  },
  {
    slug: "career-development",
    name: "Career Development",
    description: "Interview readiness, leadership, and professional growth.",
    icon: "briefcase",
  },
  {
    slug: "professional-certifications",
    name: "Professional Certifications",
    description: "Industry-aligned certification pathways and exam prep.",
    icon: "award",
  },
];

export type Course = {
  slug: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  delivery: string;
  startDate: string;
  time: string;
  instructor: string;
  fee: string;
  /** Shown after a confirmed Paystack or Accrue payment. */
  joinUrl?: string;
  audience: string;
  image: string;
  featured?: boolean;
  outcomes: string[];
  prerequisites?: string[];
  faqs: { q: string; a: string }[];
};

export const courses: Course[] = [
  {
    slug: "reservoir-simulation-fundamentals",
    title: "Reservoir Simulation Fundamentals",
    category: "reservoir-engineering",
    description:
      "Build a practical foundation in reservoir simulation—from model setup and history matching to forecasting recovery scenarios used by operating companies.",
    duration: "4 weeks",
    delivery: "Live Online",
    startDate: "15 September 2026",
    time: "18:00 – 20:00 GMT",
    instructor: "Dr. Ama Mensah",
    fee: "$249",
    audience: "Reservoir engineers, petrophysicists, and early-career subsurface professionals",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    outcomes: [
      "Set up and quality-check a basic simulation model",
      "Apply history matching workflows with confidence",
      "Interpret forecast results for development decisions",
      "Communicate simulation insights to multidisciplinary teams",
    ],
    prerequisites: ["Basic reservoir engineering knowledge"],
    faqs: [
      {
        q: "Is this a pre-recorded course?",
        a: "No. All PVL programs are live instructor-led virtual sessions with real-time interaction.",
      },
      {
        q: "Will I receive course materials?",
        a: "Yes. Participants receive slides, datasets, and reference notes after each session.",
      },
    ],
  },
  {
    slug: "production-optimization-live",
    title: "Production Optimization for Operating Assets",
    category: "production-engineering",
    description:
      "Learn how to diagnose underperforming wells, select artificial lift strategies, and drive measurable production gains across mature assets.",
    duration: "3 weeks",
    delivery: "Live Online",
    startDate: "6 October 2026",
    time: "17:00 – 19:00 GMT",
    instructor: "Eng. Kwesi Boateng",
    fee: "$199",
    audience: "Production engineers, field supervisors, and operations analysts",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    outcomes: [
      "Diagnose production bottlenecks systematically",
      "Evaluate artificial lift options for different well types",
      "Build actionable optimization plans for field teams",
    ],
    faqs: [
      {
        q: "Are sessions recorded?",
        a: "Live attendance is required. Limited recordings may be shared for catch-up at the instructor’s discretion.",
      },
    ],
  },
  {
    slug: "ai-for-upstream-operations",
    title: "AI for Upstream Oil & Gas Operations",
    category: "artificial-intelligence",
    description:
      "Explore how machine learning supports reservoir analysis, predictive maintenance, and operational decision-making in real energy environments.",
    duration: "5 weeks",
    delivery: "Live Online",
    startDate: "20 October 2026",
    time: "19:00 – 21:00 GMT",
    instructor: "Dr. Nadia Okoro",
    fee: "$299",
    audience: "Engineers, data analysts, and digital transformation leads in energy",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    outcomes: [
      "Identify high-value AI use cases in upstream workflows",
      "Evaluate data readiness for ML projects",
      "Interpret model outputs for engineering decisions",
    ],
    faqs: [
      {
        q: "Do I need a coding background?",
        a: "Basic familiarity with data tools helps, but coding is not required to benefit from the program.",
      },
    ],
  },
  {
    slug: "petroleum-economics-investment",
    title: "Petroleum Economics & Investment Analysis",
    category: "petroleum-economics",
    description:
      "Master cash-flow modeling, fiscal terms, and project screening techniques used to evaluate exploration and development opportunities.",
    duration: "4 weeks",
    delivery: "Live Online",
    startDate: "3 November 2026",
    time: "18:00 – 20:00 GMT",
    instructor: "Mr. Daniel Asante",
    fee: "$229",
    audience: "Commercial analysts, engineers moving into planning roles, and finance professionals",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    outcomes: [
      "Build project cash-flow models from first principles",
      "Compare fiscal regimes and investment scenarios",
      "Present economic recommendations to stakeholders",
    ],
    faqs: [
      {
        q: "What software is used?",
        a: "Excel-based workflows are the primary tool. Templates are provided.",
      },
    ],
  },
  {
    slug: "python-for-petroleum-engineers",
    title: "Python for Petroleum Engineers",
    category: "python-programming",
    description:
      "A hands-on introduction to Python for engineers—data handling, visualization, and automation of everyday subsurface and production tasks.",
    duration: "6 weeks",
    delivery: "Live Online",
    startDate: "12 November 2026",
    time: "19:00 – 21:00 GMT",
    instructor: "Ms. Efua Addo",
    fee: "$179",
    audience: "Engineers and geoscientists seeking practical programming skills",
    image: "/images/team-07.jpg",
    outcomes: [
      "Write clean Python scripts for engineering datasets",
      "Visualize well and production data effectively",
      "Automate repetitive analysis tasks",
    ],
    prerequisites: ["No prior coding experience required"],
    faqs: [
      {
        q: "What setup do I need?",
        a: "A laptop with internet access. Installation guidance for Python and key libraries is provided in week one.",
      },
    ],
  },
  {
    slug: "drilling-well-design",
    title: "Modern Well Design & Drilling Operations",
    category: "drilling-engineering",
    description:
      "Cover casing design, pore pressure considerations, and operational best practices that keep wells safe, efficient, and on plan.",
    duration: "3 weeks",
    delivery: "Live Online",
    startDate: "1 December 2026",
    time: "17:30 – 19:30 GMT",
    instructor: "Eng. Ibrahim Touré",
    fee: "$219",
    audience: "Drilling engineers, wellsite supervisors, and operations engineers",
    image: "/images/team-05.jpg",
    outcomes: [
      "Apply core well design principles to real scenarios",
      "Anticipate drilling risks before they escalate",
      "Coordinate effectively with rig and office teams",
    ],
    faqs: [
      {
        q: "Is field experience required?",
        a: "Helpful but not mandatory. Concepts are taught from fundamentals upward.",
      },
    ],
  },
  {
    slug: "petroleum-geoscience-field-development",
    title: "Petroleum Geoscience for Field Development",
    category: "geoscience",
    description:
      "Connect geology, petrophysics, and subsurface interpretation to the decisions that shape field development plans.",
    duration: "4 weeks",
    delivery: "Live Online",
    startDate: "8 December 2026",
    time: "18:00 – 20:00 GMT",
    instructor: "Dr. Abena Owusu",
    fee: "$239",
    audience: "Geoscientists, petrophysicists, and subsurface team members",
    image: "/images/gallery-03.jpg",
    outcomes: [
      "Interpret key subsurface datasets for development context",
      "Link geological uncertainty to well and facility decisions",
      "Present geoscience insights to multidisciplinary teams",
    ],
    prerequisites: ["Introductory geology or petroleum engineering background"],
    faqs: [
      {
        q: "Is software training included?",
        a: "Sessions focus on interpretation workflows. Instructors demonstrate tools, and practice datasets are shared after class.",
      },
    ],
  },
  {
    slug: "energy-data-analytics",
    title: "Energy Data Analytics Essentials",
    category: "data-analytics",
    description:
      "Learn how operating teams turn production, drilling, and subsurface data into decisions—without getting lost in dashboards.",
    duration: "4 weeks",
    delivery: "Live Online",
    startDate: "14 January 2027",
    time: "19:00 – 21:00 GMT",
    instructor: "Ms. Efua Addo",
    fee: "$189",
    audience: "Engineers, analysts, and operations staff building data skills",
    image: "/images/gallery-08.jpg",
    outcomes: [
      "Frame an analytics question an energy team can act on",
      "Clean and explore operational datasets with confidence",
      "Communicate findings to engineers and managers",
    ],
    faqs: [
      {
        q: "Do I need Python first?",
        a: "No. Spreadsheet workflows come first. Python is introduced only where it saves time.",
      },
    ],
  },
  {
    slug: "energy-career-accelerator",
    title: "Energy Career Accelerator",
    category: "career-development",
    description:
      "A live coaching program for interviews, professional storytelling, and the move from technical contributor to a role you can defend in the room.",
    duration: "3 weeks",
    delivery: "Live Online",
    startDate: "21 January 2027",
    time: "17:00 – 19:00 GMT",
    instructor: "Mr. Daniel Asante",
    fee: "$149",
    audience: "Graduates, early-career professionals, and career switchers in energy",
    image: "/images/team-09.jpg",
    outcomes: [
      "Tell a clear story about your technical experience",
      "Prepare for technical and behavioral interviews",
      "Build a short plan for the next role or internship",
    ],
    faqs: [
      {
        q: "Is this only for petroleum engineers?",
        a: "No. Geoscientists, analysts, and commercial professionals use the same sessions.",
      },
    ],
  },
  {
    slug: "professional-certification-pathways",
    title: "Professional Certification Pathways",
    category: "professional-certifications",
    description:
      "Map industry-aligned certifications to your role, then practice the exam habits and study structure that make a sitting realistic.",
    duration: "4 weeks",
    delivery: "Live Online",
    startDate: "4 February 2027",
    time: "18:30 – 20:30 GMT",
    instructor: "Eng. Kwesi Boateng",
    fee: "$209",
    audience: "Professionals preparing for energy and engineering certifications",
    image: "/images/team-10.jpg",
    outcomes: [
      "Choose a certification that matches your current role",
      "Build a study plan around live review sessions",
      "Practice the question styles common to professional exams",
    ],
    faqs: [
      {
        q: "Does PVL issue the professional certificate?",
        a: "PVL prepares you for the pathway. The credential itself is awarded by the external certifying body.",
      },
    ],
  },
];

export const values = [
  {
    title: "Industry Relevance",
    description:
      "Every program is shaped by practicing experts so learning maps directly to real operational challenges.",
  },
  {
    title: "Affordable Access",
    description:
      "We keep professional education within reach for individuals and organizations across emerging markets.",
  },
  {
    title: "Live Instruction",
    description:
      "Sessions are instructor-led and interactive—not passive video libraries—so questions get answered in real time.",
  },
  {
    title: "Global Reach",
    description:
      "Participants join from dozens of countries, building networks that span basins, companies, and career stages.",
  },
];

export const whyChoose = [
  {
    title: "Live, not pre-recorded",
    description:
      "Learn directly from industry practitioners in scheduled virtual classrooms with discussion and feedback.",
  },
  {
    title: "Career-focused curriculum",
    description:
      "Courses are designed around skills employers hire for—across engineering, geoscience, data, and commercial roles.",
  },
  {
    title: "Trusted partnerships",
    description:
      "We collaborate with universities, energy companies, and associations to keep content current and credible.",
  },
  {
    title: "Clear registration path",
    description:
      "Discover a program, register via Microsoft Forms, and receive payment and session details from our team.",
  },
];

export const leadership = [
  {
    name: "Daniel Darkwah Asante",
    role: "Founder & Head of Learning",
    image: "/images/gallery-09.jpg",
  },
  {
    name: "Alex Osei Yeboah",
    role: "Student Support & Finance Lead",
    image: "/images/team-06.jpg",
  },
  {
    name: "Kofi Owongo Koomson",
    role: "Student and Industry Liaison",
    image: "/images/gallery-07.jpg",
  },
];

export const partners = [
  {
    name: "Rock Flow Dynamics",
    logo: "/images/partners/rfd.png",
  },
];

export const testimonialKinds = [
  { id: "student", label: "Student Testimonials" },
  { id: "alumni", label: "Alumni Success Stories" },
  { id: "employer", label: "Employer Feedback" },
  { id: "video", label: "Video Testimonials" },
  { id: "linkedin", label: "LinkedIn Recommendations" },
] as const;

export type TestimonialKind = (typeof testimonialKinds)[number]["id"];

export const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
  kind: TestimonialKind;
  videoUrl?: string;
  linkedinUrl?: string;
}[] = [
  {
    kind: "student",
    quote:
      "PVL’s live sessions felt like a real classroom with industry mentors. I applied production optimization ideas at work within weeks.",
    name: "Fatima Diallo",
    role: "Production Engineer",
    company: "West African Independent",
  },
  {
    kind: "student",
    quote:
      "Clear instructors, relevant case studies, and a global peer group. Exactly what I needed to pivot into petroleum economics.",
    name: "James Okafor",
    role: "Commercial Analyst",
    company: "Lagos",
  },
  {
    kind: "alumni",
    quote:
      "The virtual internship gave me structured exposure to subsurface workflows and confidence speaking with hiring managers.",
    name: "Chinedu Eze",
    role: "Graduate Intern Alumni",
    company: "PVL Cohort 7",
  },
  {
    kind: "alumni",
    quote:
      "After Cohort 8 I moved from a general graduate role into a subsurface support seat. The capstone was what I walked through in the interview.",
    name: "Aisha Bello",
    role: "Subsurface Graduate",
    company: "PVL Cohort 8",
  },
  {
    kind: "employer",
    quote:
      "We sponsored seats for our junior staff. The content was practical, affordable, and far better than generic online video courses.",
    name: "Sarah Mensah",
    role: "Learning & Development Lead",
    company: "Coastal Energy Ltd",
  },
  {
    kind: "video",
    quote:
      "I joined from Accra after work. The instructor stopped for questions, and the WhatsApp group kept the cohort talking between Teams sessions.",
    name: "Kwabena Appiah",
    role: "Drilling Engineer",
    company: "Video testimonial",
    videoUrl: "https://www.youtube.com/",
  },
  {
    kind: "linkedin",
    quote:
      "I recommend PetroSkill Virtual Learning to early-career engineers who want live teaching instead of another library of recordings.",
    name: "Lena Okeke",
    role: "Reservoir Engineer",
    company: "LinkedIn recommendation",
    linkedinUrl: "https://www.linkedin.com/",
  },
];

export const news = [
  {
    slug: "virtual-internship-cohort-9-open",
    title: "Virtual Internship Cohort 9 Applications Are Open",
    category: "Internship Updates",
    date: "12 August 2026",
    excerpt:
      "Applications are now open for our flagship virtual internship, featuring weekly industry speakers and a structured project track.",
    image:
      "/images/group-02.jpg",
    content:
      "PetroSkill Virtual Learning is accepting applications for Virtual Internship Cohort 9. Participants will join live sessions, complete guided projects, and interact with guest speakers from operating companies and consulting firms. Registration closes two weeks before kickoff. Apply via Microsoft Forms on the internship page.",
  },
  {
    slug: "ai-upstream-course-announcement",
    title: "New Course: AI for Upstream Oil & Gas Operations",
    category: "Course Announcements",
    date: "28 July 2026",
    excerpt:
      "Our newest live program helps engineers and analysts identify practical AI use cases across upstream workflows.",
    image:
      "/images/hero-ppe-yellow.png",
    content:
      "Digital tools are reshaping how energy teams analyze reservoirs, maintain equipment, and prioritize interventions. This five-week live course introduces AI concepts with energy-specific examples—no hype, just structured learning you can discuss with your team.",
  },
  {
    slug: "partnership-horizon-skills",
    title: "PVL Partners with Horizon Skills Foundation on Scholarships",
    category: "Partnership Announcements",
    date: "5 July 2026",
    excerpt:
      "A new scholarship pathway will support high-potential applicants joining selected technical short courses.",
    image:
      "/images/group-01.jpg",
    content:
      "Through this partnership, eligible applicants can receive partial fee support for designated PVL programs. Details and eligibility criteria will be shared with shortlisted candidates during the registration review process.",
  },
  {
    slug: "skills-demand-upstream-teams",
    title: "What Upstream Teams Are Hiring For This Year",
    category: "Industry News",
    date: "18 June 2026",
    excerpt:
      "Reservoir, production, and data skills still sit together on the same job descriptions. Here is how PVL is lining live programs up with that mix.",
    image: "/images/hero-ppe-orange.png",
    content:
      "Operating companies continue to ask for people who can talk subsurface, production, and basic analytics in the same meeting. PVL’s live catalog follows that pattern: short technical cohorts, a digital pathway, and a virtual internship that makes participants practice the handoff between disciplines.",
  },
  {
    slug: "cohort-8-alumni-placements",
    title: "Cohort 8 Alumni: From Capstone to First Energy Role",
    category: "Student Success Stories",
    date: "2 June 2026",
    excerpt:
      "Graduates from the latest internship cohort are using their projects in interviews for subsurface, operations, and commercial support roles.",
    image: "/images/gallery-07.jpg",
    content:
      "Virtual Internship Cohort 8 closed with participant presentations attended by guest practitioners. Several alumni have since moved into graduate and junior seats, and they credit the weekly structure—live teaching, a guided project, and a career clinic—for giving them something concrete to discuss with hiring managers.",
  },
  {
    slug: "industry-speakers-night-recap",
    title: "Recap: PVL Industry Speakers Night",
    category: "Event Recaps",
    date: "24 June 2026",
    excerpt:
      "Lightning talks from reservoir, drilling, and digital energy practitioners, plus the questions the audience would not let go.",
    image: "/images/gallery-04.jpg",
    content:
      "Industry Speakers Night brought practicing engineers and digital specialists together for short talks on well planning, production surveillance, and where analytics actually helps an asset team. The recording notes and speaker themes are now reflected in upcoming workshops listed on the events page.",
  },
  {
    slug: "speaker-spotlight-ama-mensah",
    title: "Speaker Spotlight: Dr. Ama Mensah",
    category: "Speaker Spotlights",
    date: "15 May 2026",
    excerpt:
      "Our Head of Technical Programs on teaching reservoir simulation to people who have to use it on Monday morning.",
    image: "/images/team-04.jpg",
    content:
      "Dr. Ama Mensah leads PVL’s technical programs and teaches Reservoir Simulation Fundamentals. Her sessions stay close to model setup, history matching, and how to explain a forecast to a team that does not live in the simulator. She also reviews curriculum with university and industry partners before a cohort opens.",
  },
];

export const registrationSteps = [
  {
    title: "Course page",
    detail: "Review the program: duration, schedule, instructor, fee, and who it is for.",
  },
  {
    title: "Register Now",
    detail: "Use the button on the course or internship page.",
  },
  {
    title: "Microsoft Forms",
    detail: "Complete the registration form. There is no student portal or online classroom.",
  },
  {
    title: "Registration submitted",
    detail: "Your form is received by the PVL team.",
  },
  {
    title: "Confirmation email",
    detail: "We email you to confirm the submission.",
  },
  {
    title: "Admin review",
    detail: "The team reviews the registration before a seat is confirmed.",
  },
  {
    title: "Payment instructions",
    detail: "We send payment details after review.",
  },
  {
    title: "WhatsApp group",
    detail: "You receive an invitation to the cohort WhatsApp group.",
  },
  {
    title: "Microsoft Teams",
    detail: "You receive the live session meeting invitation.",
  },
];

export const whyExists = {
  title: "A training institute, not an online course library",
  body: "PetroSkill Virtual Learning is an international professional training organization. We exist to provide affordable, industry-relevant education in oil, gas, energy, and emerging technology — delivered through live instructor-led virtual sessions, not pre-recorded courses. The website is a front door to those programs. It is not a learning management system: there are no online lessons, quizzes, progress tracks, assignments, or certificates issued from the site.",
};

export const events = [
  {
    title: "Careers in Energy: Live Q&A",
    type: "Webinar",
    date: "28 August 2026",
    time: "17:00 GMT",
    status: "upcoming" as const,
    description:
      "A free webinar with hiring managers and PVL alumni on breaking into upstream and energy transition roles.",
  },
  {
    title: "Python for Engineers Workshop",
    type: "Workshop",
    date: "10 September 2026",
    time: "18:00 GMT",
    status: "upcoming" as const,
    description:
      "A hands-on intro session for engineers curious about automating everyday analysis tasks.",
  },
  {
    title: "PVL Industry Speakers Night",
    type: "Conference",
    date: "22 June 2026",
    time: "19:00 GMT",
    status: "previous" as const,
    description:
      "An evening of lightning talks from reservoir, drilling, and digital energy practitioners.",
  },
];

export const gallery = [
  {
    title: "PetroSkill professional portrait",
    category: "Team",
    image: "/images/gallery-01.jpg",
  },
  {
    title: "Instructor-ready presentation",
    category: "Training Sessions",
    image: "/images/gallery-02.jpg",
  },
  {
    title: "Field-ready professional",
    category: "Behind-the-Scenes",
    image: "/images/gallery-03.jpg",
  },
  {
    title: "Program facilitator",
    category: "Guest Speakers",
    image: "/images/gallery-04.jpg",
  },
  {
    title: "Cohort mentor",
    category: "Workshops",
    image: "/images/gallery-05.jpg",
  },
  {
    title: "Learning support team",
    category: "Team",
    image: "/images/gallery-06.jpg",
  },
  {
    title: "Graduate pathway coach",
    category: "Graduation Ceremonies",
    image: "/images/gallery-07.jpg",
  },
  {
    title: "Technical program lead",
    category: "Training Sessions",
    image: "/images/gallery-08.jpg",
  },
  {
    title: "Industry-facing trainer",
    category: "Workshops",
    image: "/images/gallery-09.jpg",
  },
  {
    title: "PVL brand ambassador",
    category: "Behind-the-Scenes",
    image: "/images/gallery-10.jpg",
  },
];

export type InternshipStatus = "open" | "closed";

export type InternshipPosting = {
  slug: string;
  title: string;
  status: InternshipStatus;
  posted: string;
  closes: string;
  starts: string;
  duration: string;
  format: string;
  fee: string;
  summary: string;
  image: string;
  /** Shown after a confirmed Paystack or Accrue payment. */
  joinUrl?: string;
  applyUrl?: string;
  overview?: string;
  objectives?: string[];
  curriculum?: { week: string; topic: string }[];
  schedule?: string;
  speakers?: string[];
  benefits?: string[];
  faqs?: { q: string; a: string }[];
};

/**
 * Internships are posted here only while an intake is relevant.
 * Set status to "closed" when applications end. If none are "open",
 * the internship page shows an empty board.
 */
export const internshipPostings: InternshipPosting[] = [
  {
    slug: "virtual-internship-cohort-9",
    title: "Virtual Internship — Cohort 9",
    status: "open",
    posted: "12 August 2026",
    closes: "26 October 2026",
    starts: "9 November 2026",
    duration: "6 weeks",
    format: "Live online",
    fee: "$149",
    joinUrl: "https://wa.me/233547964362?text=I%20paid%20for%20Virtual%20Internship%20Cohort%209",
    summary:
      "A six-week live internship for graduates and early-career professionals. Weekly sessions, a guided project, and guest speakers from operating companies.",
    image: "/images/group-02.jpg",
    overview:
      "Cohort 9 is a posted intake, not a standing program. Participants join live online sessions, complete guided projects that mirror team deliverables, and hear from practicing speakers across subsurface, operations, and commercial work.",
    objectives: [
      "Build foundational technical and professional skills for energy careers",
      "Complete guided projects that mirror real team deliverables",
      "Learn directly from practicing industry speakers",
      "Strengthen communication, teamwork, and presentation skills",
    ],
    curriculum: [
      { week: "Week 1", topic: "Industry landscape & professional foundations" },
      { week: "Week 2", topic: "Subsurface & reservoir concepts in practice" },
      { week: "Week 3", topic: "Production systems and operations awareness" },
      { week: "Week 4", topic: "Data, economics, and decision frameworks" },
      { week: "Week 5", topic: "Capstone project development" },
      { week: "Week 6", topic: "Presentations, feedback, and career clinic" },
    ],
    schedule:
      "Live sessions run 2–3 evenings per week (GMT), with guided assignments between classes.",
    speakers: [
      "Reservoir engineering practitioners",
      "Production and operations leads",
      "Petroleum economists",
      "Digital energy specialists",
    ],
    benefits: [
      "Live mentorship and peer collaboration",
      "Certificate of completion for qualifying participants",
      "Portfolio-ready project experience",
      "Access to alumni community channels",
    ],
    faqs: [
      {
        q: "Who should apply?",
        a: "Recent graduates and early-career professionals interested in oil, gas, energy, and related technical or commercial roles.",
      },
      {
        q: "How do I register?",
        a: "Tap the open internship card, pay with Paystack or Accrue, then use the join link that appears after payment is confirmed.",
      },
      {
        q: "What if this cohort fills up?",
        a: "Join the waitlist. The next internship is posted on this board when applications open — it is not listed in advance.",
      },
    ],
  },
  {
    slug: "virtual-internship-cohort-8",
    title: "Virtual Internship — Cohort 8",
    status: "closed",
    posted: "2 February 2026",
    closes: "16 February 2026",
    starts: "2 March 2026",
    duration: "6 weeks",
    format: "Live online",
    fee: "$149",
    summary:
      "Applications for this intake have closed. 61 participants completed the six-week virtual internship.",
    image: "/images/team-08.jpg",
    overview:
      "Cohort 8 ran as a posted internship and is no longer accepting applications. Participants completed live sessions and a capstone they could walk through in interviews.",
    objectives: [
      "Structured exposure to subsurface and operations workflows",
      "A capstone presented to the cohort",
      "Career clinic with feedback on how to talk about the project",
    ],
  },
];

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
  newsletterForm: "https://forms.office.com/r/placeholder-pvl-newsletter",
  social: {
    linkedin: "https://www.linkedin.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
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
  { href: "/partners", label: "Partners" },
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
    name: "Kwame Owusu",
    role: "Founder & Executive Director",
    bio: "Energy educator focused on expanding access to practical upstream and digital skills training across Africa and beyond.",
    image:
      "/images/team-08.jpg",
  },
  {
    name: "Dr. Ama Mensah",
    role: "Head of Technical Programs",
    bio: "Reservoir engineer and instructor with experience designing curricula for early-career and mid-level professionals.",
    image:
      "/images/team-04.jpg",
  },
  {
    name: "Nadia Okoro",
    role: "Director, Digital Energy Learning",
    bio: "Leads PVL’s AI, analytics, and Python pathways connecting traditional energy skills with modern tools.",
    image:
      "/images/team-07.jpg",
  },
  {
    name: "Daniel Asante",
    role: "Commercial & Partnerships Lead",
    bio: "Builds relationships with sponsors, universities, and employers supporting scholarships and cohort delivery.",
    image:
      "/images/team-06.jpg",
  },
];

export const partners = [
  {
    name: "West Africa Energy University",
    type: "University",
    description: "Academic collaboration on curriculum review and guest lectures.",
    logo: "WAEU",
  },
  {
    name: "Atlantic Upstream Partners",
    type: "Energy Company",
    description: "Industry speakers and case studies drawn from operating assets.",
    logo: "AUP",
  },
  {
    name: "SPE Student Chapters Network",
    type: "Professional Association",
    description: "Outreach and awareness support for emerging professionals.",
    logo: "SPE",
  },
  {
    name: "Orbit Data Systems",
    type: "Technology Provider",
    description: "Tool demos and analytics workshops for digital energy cohorts.",
    logo: "ODS",
  },
  {
    name: "Horizon Skills Foundation",
    type: "Sponsor",
    description: "Scholarship support for high-potential applicants.",
    logo: "HSF",
  },
  {
    name: "Global DrillTech Academy",
    type: "Training Partner",
    description: "Joint delivery of specialized drilling short courses.",
    logo: "GDA",
  },
];

export const testimonials = [
  {
    quote:
      "PVL’s live sessions felt like a real classroom with industry mentors. I applied production optimization ideas at work within weeks.",
    name: "Fatima Diallo",
    role: "Production Engineer",
    company: "West African Independent",
  },
  {
    quote:
      "The virtual internship gave me structured exposure to subsurface workflows and confidence speaking with hiring managers.",
    name: "Chinedu Eze",
    role: "Graduate Intern Alumni",
    company: "PVL Cohort 7",
  },
  {
    quote:
      "We sponsored seats for our junior staff. The content was practical, affordable, and far better than generic online video courses.",
    name: "Sarah Mensah",
    role: "Learning & Development Lead",
    company: "Coastal Energy Ltd",
  },
  {
    quote:
      "Clear instructors, relevant case studies, and a global peer group. Exactly what I needed to pivot into petroleum economics.",
    name: "James Okafor",
    role: "Commercial Analyst",
    company: "Lagos",
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
];

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

export const internship = {
  overview:
    "The PetroSkill Virtual Internship is our flagship program for graduates and early-career professionals seeking structured, industry-informed exposure to oil, gas, and energy workflows—delivered live online with mentors and guest speakers.",
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
    "Live sessions typically run 2–3 evenings per week (GMT), with guided assignments between classes.",
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
  cohorts: ["Cohort 6 — 42 participants", "Cohort 7 — 55 participants", "Cohort 8 — 61 participants"],
  pricing: "$149 per participant",
  faqs: [
    {
      q: "Who should apply?",
      a: "Recent graduates and early-career professionals interested in oil, gas, energy, and related technical or commercial roles.",
    },
    {
      q: "How do I register?",
      a: "Click Register Now to open our Microsoft Forms application. Our team reviews submissions and sends payment instructions.",
    },
    {
      q: "What if the cohort is full?",
      a: "Join the waitlist via Microsoft Forms and we will notify you when the next cohort opens.",
    },
  ],
};

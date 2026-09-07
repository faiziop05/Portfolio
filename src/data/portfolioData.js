import blogImg from "../assets/BlogUI.jpg";
import cmsGif from "../assets/CMSUI.gif";
import chatGif from "../assets/ChatUI.gif";
import ecomGif from "../assets/EComUI.gif";
import ecomPng from "../assets/ecomeimage.png";
import homeImg from "../assets/HomeImage.png";
import specifyItGif from "../assets/SpecifyItUI.gif";
import taskAppGif from "../assets/TaskAppUI.gif";
import videosAppGif from "../assets/VideosAppUI.gif";
import weatherGif from "../assets/WeatherUI.gif";

export const personalInfo = {
  name: "Faizan Hanif",
  title: "Full-Stack Software Engineer",
  roleSubtext: "Distributed Systems • React / Next.js • Node.js • PostgreSQL • Cloud",
  bio: "Full-Stack Software Engineer with 4+ years of hands-on experience architecting scalable web applications, real-time distributed backends, and responsive, accessible interfaces. Dedicated to clean architecture, low latency, robust data modeling, and seamless developer ergonomics.",
  location: "Remote / Worldwide",
  email: "faizanhanif369@gmail.com",
  github: "https://github.com/faiziop05",
  linkedin: "https://linkedin.com",
  resumeUrl: "#resume",
  avatarUrl: homeImg,
  availability: "Available for Full-time Roles & Contracts",
  metrics: [],
  coreEcosystem: [],
};

export const skillsData = [
  {
    category: "Frontend Engineering",
    icon: "code",
    color: "from-blue-500 to-cyan-400",
    description: "Creating ultra-responsive, accessible, and high-performance interactive interfaces.",
    skills: [
      { name: "React 18", level: "Expert", years: "4 yrs" },
      { name: "Next.js", level: "Advanced", years: "3 yrs" },
      { name: "TypeScript", level: "Advanced", years: "3 yrs" },
      { name: "Tailwind CSS", level: "Expert", years: "4 yrs" },
      { name: "State (Redux / Zustand)", level: "Advanced", years: "4 yrs" },
      { name: "Framer Motion", level: "Advanced", years: "3 yrs" },
      { name: "Vite / Webpack", level: "Advanced", years: "3 yrs" },
    ],
  },
  {
    category: "Backend & Microservices",
    icon: "server",
    color: "from-emerald-500 to-teal-400",
    description: "Designing resilient RESTful and real-time WebSocket APIs with strict auth and error boundaries.",
    skills: [
      { name: "Node.js", level: "Expert", years: "4 yrs" },
      { name: "Express.js", level: "Expert", years: "4 yrs" },
      { name: "WebSockets / Socket.io", level: "Advanced", years: "3 yrs" },
      { name: "RESTful API Architecture", level: "Expert", years: "4 yrs" },
      { name: "Python / FastAPI", level: "Intermediate", years: "2 yrs" },
      { name: "GraphQL", level: "Intermediate", years: "2 yrs" },
      { name: "JWT & OAuth 2.0 Auth", level: "Advanced", years: "4 yrs" },
    ],
  },
  {
    category: "Databases & Caching",
    icon: "database",
    color: "from-indigo-500 to-purple-500",
    description: "Optimizing relational models, distributed caches, and ACID data integrity.",
    skills: [
      { name: "PostgreSQL", level: "Advanced", years: "3 yrs" },
      { name: "MongoDB", level: "Expert", years: "4 yrs" },
      { name: "Redis Caching", level: "Advanced", years: "3 yrs" },
      { name: "Prisma & Mongoose ORM", level: "Advanced", years: "3 yrs" },
      { name: "Firebase Firestore", level: "Expert", years: "4 yrs" },
      { name: "Database Migrations", level: "Advanced", years: "3 yrs" },
    ],
  },
  {
    category: "DevOps, Cloud & Architecture",
    icon: "cloud",
    color: "from-amber-500 to-rose-500",
    description: "Automating containerized pipelines, cloud deployments, and observability monitoring.",
    skills: [
      { name: "Docker & Containerization", level: "Advanced", years: "3 yrs" },
      { name: "GitHub Actions CI/CD", level: "Advanced", years: "3 yrs" },
      { name: "AWS (S3, EC2, CloudFront)", level: "Intermediate", years: "2 yrs" },
      { name: "Nginx & Reverse Proxies", level: "Intermediate", years: "2 yrs" },
      { name: "Microservices & EDA", level: "Advanced", years: "3 yrs" },
      { name: "Jest & RTL Testing", level: "Advanced", years: "3 yrs" },
    ],
  },
];

export const featuredProjects = [
  {
    id: "omnistore",
    title: "OmniStore - Distributed E-Commerce & Checkout Engine",
    category: "Full Stack",
    featured: true,
    summary: "Production-ready digital commerce platform with inventory locking, Stripe payment gateway, and Redis sub-millisecond cart caching.",
    description:
      "A high-throughput e-commerce platform built to solve race conditions in flash-sales and inventory depletion. Implements pessimistic inventory locking, automated order fulfillment webhooks, and an administrative real-time analytics dashboard.",
    imageUrls: [ecomGif, ecomPng],
    tags: ["React", "Node.js", "Express", "MongoDB", "Redis", "Stripe API", "Tailwind CSS"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-11-15",
    architecture: {
      client: "React with optimistic mutations and Zustand global cart state",
      api: "Node.js/Express with rate limiting, idempotent Stripe webhooks",
      database: "MongoDB for product catalog, Redis for TTL session & inventory locks",
      highlights: ["Zero inventory oversell", "<80ms cart synchronization", "Stripe 3D Secure 2.0 integration"],
    },
    challenges: [
      {
        problem: "Concurrent checkout collisions during flash sales led to negative inventory levels.",
        solution: "Implemented distributed locking with Redis TTL keys and atomic decrement operators before executing payment intents.",
      },
      {
        problem: "Heavy product filtering queries caused database spikes on high traffic.",
        solution: "Created compound multi-key indexes and layered Redis cache for top 100 search filters.",
      },
    ],
  },
  {
    id: "pulsechat",
    title: "PulseChat - Real-Time Collaboration & Messaging Hub",
    category: "Real-Time & AI",
    featured: true,
    summary: "High-concurrency chat infrastructure featuring bi-directional WebSockets, message acknowledgments, end-to-end room encryption, and typing presence.",
    description:
      "Full-stack team communication workspace handling instant peer messaging, multi-tenant channels, online presence heartbeats, and media uploads with background thumbnail transcoding.",
    imageUrls: [chatGif],
    tags: ["React", "Socket.io", "Node.js", "Express", "MongoDB", "Cloudinary", "Framer Motion"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-09-20",
    architecture: {
      client: "React 18 with virtualized message list (handling 10k+ messages without frame drops)",
      api: "WebSocket clusters with Socket.io Redis adapter for cross-instance message routing",
      database: "MongoDB capped collections for chat history + Redis for online socket states",
      highlights: ["Sub-30ms roundtrip delivery", "Automatic reconnection with offline sync", "Live unread badges"],
    },
    challenges: [
      {
        problem: "Socket reconnections dropped messages sent during intermittent mobile connectivity.",
        solution: "Engineered client-side IndexedDB buffer with sequential sequence IDs and server-side ACK receipts.",
      },
    ],
  },
  {
    id: "nexusstream",
    title: "NexusStream - Video Streaming & Adaptive Transcoding Hub",
    category: "Full Stack",
    featured: true,
    summary: "Cloud-native video platform supporting multi-resolution HLS chunking, responsive video player, interactive timestamped comments, and CDN delivery.",
    description:
      "Enterprise video sharing portal designed for creator uploads, asynchronous FFmpeg video chunking pipelines, dynamic video playback quality adaptation, and engagement metrics tracking.",
    imageUrls: [videosAppGif],
    tags: ["React", "Node.js", "FFmpeg", "AWS S3", "Express", "Tailwind CSS", "MongoDB"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-07-10",
    architecture: {
      client: "Custom HTML5 video controller with keyboard shortcuts and buffer tracking",
      api: "Asynchronous job processing with BullMQ for transcoding 1080p, 720p, 480p HLS profiles",
      database: "MongoDB for video metadata & relations; S3 bucket storage with CloudFront CDN distribution",
      highlights: ["Adaptive bitrate playback", "Background queue pipeline", "Automated thumbnail generation"],
    },
    challenges: [
      {
        problem: "Heavy video uploads exhausted server memory during concurrent transcoding.",
        solution: "Decoupled upload directly to S3 pre-signed URLs, triggering worker instances via asynchronous queues.",
      },
    ],
  },
  {
    id: "specifyit",
    title: "SpecifyIt - Engineering Workflow & Agile Kanban OS",
    category: "Frontend Architecture",
    featured: true,
    summary: "Project management suite with drag-and-drop kanban boards, markdown specification editor, sprint analytics, and role-based access control.",
    description:
      "A fast, keyboard-first task tracking workspace built for software teams. Offers fluid drag-and-drop state transitions, optimistic UI updates with automatic rollback on network failure, and audit trail logs.",
    imageUrls: [specifyItGif, taskAppGif],
    tags: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL", "Prisma"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-05-02",
    architecture: {
      client: "Drag and drop with `@hello-pangea/dnd`, optimistic task reordering",
      api: "REST endpoints secured by RBAC middleware (Admin, Member, Viewer)",
      database: "PostgreSQL with foreign key constraints, Prisma schema migrations",
      highlights: ["Instant zero-lag drag updates", "Sprint burn-down velocity metrics", "Rich markdown editor"],
    },
    challenges: [
      {
        problem: "Complex state updates caused unnecessary re-renders across all kanban columns.",
        solution: "Normalized task state into atomic entities and implemented custom selector hooks preventing card re-renders.",
      },
    ],
  },
  {
    id: "devpulse-cms",
    title: "DevPulse - Headless CMS & Developer Publishing Hub",
    category: "Microservices & APIs",
    featured: false,
    summary: "Modern developer publishing ecosystem with syntax-highlighted markdown parsing, automated SEO metadata, and tag taxonomy filtering.",
    description:
      "A developer blog platform and CMS featuring instant live markdown preview, code block copy mechanics, reading time estimation, nested comment threads, and RSS feed generation.",
    imageUrls: [cmsGif, blogImg],
    tags: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "Tailwind CSS"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-03-12",
    architecture: {
      client: "AST markdown parser with Prism syntax highlighter and dynamic Table of Contents",
      api: "Headless content delivery API with full-text search indexing and sanitization",
      database: "MongoDB with text search indexing and nested comment tree structure",
      highlights: ["Automatic OpenGraph image generation", "SEO structured schema markup", "Dynamic sitemap"],
    },
    challenges: [
      {
        problem: "XSS vulnerability risks through user-submitted markdown and HTML tags.",
        solution: "Enforced strict DOMPurify sanitization and server-side AST verification before storing content.",
      },
    ],
  },
  {
    id: "atmosphere-weather",
    title: "Atmosphere - Geospatial Climate & Weather Analytics",
    category: "Microservices & APIs",
    featured: false,
    summary: "Real-time geospatial weather monitoring system with interactive radar overlays, 7-day forecasts, and edge-cached API resilience.",
    description:
      "High-precision global weather application providing hourly precipitation breakdown, UV index tracking, wind vector charts, and location-based automated geo-search.",
    imageUrls: [weatherGif],
    tags: ["React", "OpenWeather API", "Chart.js", "Tailwind CSS", "GeoLocation API"],
    liveUrl: "https://github.com/faiziop05",
    githubUrl: "https://github.com/faiziop05",
    date: "2024-01-18",
    architecture: {
      client: "Interactive responsive charts rendering hourly bar and area temperature trends",
      api: "Reverse geocoding with in-memory LRU caching to reduce redundant external API hits by 70%",
      database: "LocalStorage cache for user favorite locations with offline fallback",
      highlights: ["Sub-50ms instant location lookup", "Dynamic background gradient adapting to climate"],
    },
    challenges: [
      {
        problem: "External weather API rate limits exceeded during peak visitor bursts.",
        solution: "Implemented an in-memory sliding window cache with 15-minute TTL per coordinates.",
      },
    ],
  },
];

export const engineeringPhilosophy = [
  {
    title: "Performance by Default",
    icon: "bolt",
    color: "from-amber-400 to-orange-500",
    description:
      "Code is written with zero-bloat mindset. Optimizing bundle sizes, tree-shaking dependencies, implementing smart code-splitting, and prioritizing Core Web Vitals (LCP, FID, CLS).",
  },
  {
    title: "Resilient Distributed Systems",
    icon: "shield",
    color: "from-emerald-400 to-teal-500",
    description:
      "Building backends that anticipate failure: idempotent endpoints, exponential backoff retries, rate-limiting guards, and graceful degradation when upstream services stall.",
  },
  {
    title: "Data Integrity & Clean Schemas",
    icon: "database",
    color: "from-indigo-400 to-cyan-500",
    description:
      "Designing strict database models with sensible indexing, ACID compliance where needed, optimized queries, and decoupled distributed caching via Redis.",
  },
  {
    title: "DevOps & Continuous Delivery",
    icon: "terminal",
    color: "from-purple-400 to-pink-500",
    description:
      "Automating code quality through GitHub Actions, containerized Docker environments, automated testing, and zero-downtime rolling deployments.",
  },
];

export const experienceData = [
  {
    role: "Full-Stack Software Engineer",
    company: "Freelance / High-Impact Client Projects",
    period: "2023 - Present",
    type: "Contract & Consulting",
    description:
      "Engineered end-to-end web applications and microservices for international startups. Designed custom database schemas, real-time messaging subsystems, and high-converting frontend architectures. Improved client site performance metrics by 40% through server-side optimizations and image pipelines.",
    achievements: [
      "Delivered 10+ production full-stack systems with 99.9% uptime record.",
      "Integrated Stripe and PayPal checkout flows processing thousands in monthly revenue.",
      "Mentored junior developers on Git workflows, TypeScript practices, and clean code principles.",
    ],
    tech: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Tailwind CSS", "Redis"],
  },
  {
    role: "Frontend & Full-Stack Developer",
    company: "Tech Systems Solutions",
    period: "2022 - 2023",
    type: "Full-Time",
    description:
      "Collaborated with cross-functional engineering teams to build modern SaaS interfaces, internal administrative dashboards, and REST API integrations. Led the transition from legacy jQuery scripts to modern React with modular component architecture.",
    achievements: [
      "Reduced client-side bundle size by 35% using dynamic imports and code splitting.",
      "Implemented comprehensive form validation and accessibility guidelines (WCAG 2.1).",
      "Constructed reusable internal UI component library adopted across 4 major products.",
    ],
    tech: ["React", "JavaScript (ES6+)", "REST APIs", "Tailwind CSS", "MongoDB", "Jest"],
  },
  {
    role: "Software Engineering Intern",
    company: "Software Innovation Lab",
    period: "2021 - 2022",
    type: "Internship",
    description:
      "Assisted senior engineers in backend API maintenance, database schema migrations, and frontend UI feature delivery. Wrote automated unit tests and resolved user-reported bug tickets.",
    achievements: [
      "Authored 80+ unit tests with Jest, increasing test coverage from 60% to 85%.",
      "Drafted developer documentation and OpenAPI/Swagger specifications for legacy routes.",
    ],
    tech: ["JavaScript", "Node.js", "Express", "HTML5/CSS3", "Git", "Postman"],
  },
];

export const educationData = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "University Faculty of Computing & Information Technology",
    period: "2019 - 2023",
    focus: "Data Structures & Algorithms, Distributed Computing, Database Systems, Software Engineering Architecture",
  },
  {
    degree: "Full Stack & Cloud Architecture Specialization",
    school: "Industry Professional Certifications",
    period: "2023",
    focus: "Advanced React, Microservices with Node & Docker, Cloud Infrastructure & DevOps",
  },
];

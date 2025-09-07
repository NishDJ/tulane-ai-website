export const SITE_CONFIG = {
  name: "Tulane AI & Data Science Division",
  description: "Advancing medical research through artificial intelligence and data science at Tulane University School of Medicine",
  url: "https://tulane.ai",
  ogImage: "/opengraph-image",
  links: {
    twitter: "https://twitter.com/tulaneai",
    github: "https://github.com/tulane-ai",
    linkedin: "https://linkedin.com/company/tulane-ai",
  },
};

export const NAVIGATION_ITEMS = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Faculty",
    href: "/faculty",
  },
  {
    title: "Research",
    href: "/research",
  },
  {
    title: "Programs",
    href: "/programs",
    children: [
      { title: "Degree Programs", href: "/programs/degrees" },
      { title: "Certificates", href: "/programs/certificates" },
      { title: "Continuing Education", href: "/programs/continuing" },
    ],
  },
  {
    title: "News & Events",
    href: "/news",
    children: [
      { title: "News", href: "/news" },
      { title: "Events", href: "/events" },
    ],
  },
  {
    title: "Resources",
    href: "/resources",
    children: [
      { title: "Publications", href: "/resources/publications" },
      { title: "Datasets", href: "/resources/datasets" },
      { title: "Software Tools", href: "/resources/tools" },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export const CONTACT_INFO = {
  email: "info@tulane.ai",
  phone: "+1 (504) 988-5263",
  address: {
    street: "1430 Tulane Avenue",
    city: "New Orleans",
    state: "LA",
    zip: "70112",
    country: "USA",
  },
  office: "School of Medicine, Room 8033",
};

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/tulaneai",
  linkedin: "https://linkedin.com/company/tulane-ai",
  github: "https://github.com/tulane-ai",
  youtube: "https://youtube.com/@tulaneai",
};

// Data-related constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const RESEARCH_PROJECT_STATUSES = ['active', 'completed', 'planned'] as const;
export const EVENT_TYPES = ['seminar', 'conference', 'workshop', 'social'] as const;
export const ACCESS_LEVELS = ['public', 'restricted', 'private'] as const;

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

// Faculty-related constants
export const FACULTY_SORT_FIELDS = ['name', 'title', 'department'] as const;
export const RESEARCH_SORT_FIELDS = ['title', 'startDate', 'status', 'principalInvestigator'] as const;
export const NEWS_SORT_FIELDS = ['title', 'publishDate', 'author'] as const;
export const EVENT_SORT_FIELDS = ['title', 'startDate', 'eventType'] as const;

// Search and filter constants
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

// Common research areas for filtering
export const RESEARCH_AREAS = [
  'Medical AI',
  'Machine Learning',
  'Healthcare Analytics',
  'Computer Vision',
  'Clinical Decision Support',
  'Computational Biology',
  'Precision Medicine',
  'Genomics',
  'Bioinformatics',
  'Personalized Healthcare',
  'Medical Informatics',
  'Natural Language Processing',
  'Electronic Health Records',
  'Healthcare Quality',
  'Clinical Data Mining',
  'Drug Discovery',
  'Molecular Modeling',
  'Pharmacokinetics',
  'Clinical Trials',
] as const;

// Common tags for content
export const COMMON_TAGS = [
  'AI',
  'Machine Learning',
  'Healthcare',
  'Research',
  'Clinical',
  'Data Science',
  'Bioinformatics',
  'Genomics',
  'Medical Imaging',
  'NLP',
  'Deep Learning',
  'Precision Medicine',
  'Drug Discovery',
  'Clinical Trials',
  'Healthcare Analytics',
  'Medical Informatics',
] as const;

// Form validation constants
export const FORM_VALIDATION = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  BIO_MIN_LENGTH: 50,
  BIO_MAX_LENGTH: 2000,
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 5000,
} as const;

// Date formatting constants
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  YEAR_ONLY: 'yyyy',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  FACULTY: '/api/faculty',
  RESEARCH: '/api/research',
  NEWS: '/api/news',
  EVENTS: '/api/events',
  CONTACT: '/api/contact',
  NEWSLETTER: '/api/newsletter',
  SEARCH: '/api/search',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FORM_SUBMISSION: 'There was an error submitting the form. Please try again.',
  DATA_LOADING: 'Error loading data. Please refresh the page.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Your message has been sent successfully!',
  NEWSLETTER_SUBSCRIBED: 'Thank you for subscribing to our newsletter!',
  DATA_LOADED: 'Data loaded successfully.',
  SEARCH_COMPLETED: 'Search completed.',
} as const;
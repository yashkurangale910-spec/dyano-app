// Comprehensive Roadmap Data for both Frontend and Backend

export const FRONTEND_ROADMAP = [
    {
        id: 'internet',
        title: 'Internet',
        status: 'completed',
        importance: 'essential',
        topics: [
            { id: 'how-it-works', title: 'How does the internet work?', status: 'completed', importance: 'essential' },
            { id: 'what-is-http', title: 'What is HTTP?', status: 'completed', importance: 'essential' },
            { id: 'browsers', title: 'Browsers and how they work?', status: 'completed', importance: 'essential' },
            { id: 'dns', title: 'DNS and how it works?', status: 'completed', importance: 'essential' },
            { id: 'domain-name', title: 'What is a Domain Name?', status: 'completed', importance: 'essential' },
            { id: 'hosting', title: 'What is hosting?', status: 'completed', importance: 'essential' },
        ],
    },
    {
        id: 'html',
        title: 'HTML',
        status: 'completed',
        importance: 'essential',
        topics: [
            { id: 'html-basics', title: 'Learn the basics', status: 'completed', importance: 'essential' },
            { id: 'semantic-html', title: 'Writing Semantic HTML', status: 'completed', importance: 'essential' },
            { id: 'forms-validation', title: 'Forms and Validations', status: 'completed', importance: 'essential' },
            { id: 'conventions', title: 'Conventions and Best Practices', status: 'completed', importance: 'essential' },
            { id: 'seo-basics', title: 'SEO Basics', status: 'completed', importance: 'essential' },
        ],
    },
    {
        id: 'css',
        title: 'CSS',
        status: 'current',
        importance: 'essential',
        topics: [
            { id: 'css-basics', title: 'Learn the basics', status: 'completed', importance: 'essential' },
            {
                id: 'making-layouts', title: 'Making Layouts', status: 'current', importance: 'essential',
                subtopics: ['Floats', 'Positioning', 'Display', 'Box Model']
            },
            { id: 'flex-grid', title: 'Flexbox and Grid', status: 'locked', importance: 'essential' },
            { id: 'responsive-design', title: 'Responsive Design', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'javascript',
        title: 'JavaScript',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'js-basics', title: 'Syntax and Basic Construct', status: 'locked', importance: 'essential' },
            { id: 'dom-manipulation', title: 'Learn DOM Manipulation', status: 'locked', importance: 'essential' },
            { id: 'fetch-api', title: 'Learn Fetch API / Ajax', status: 'locked', importance: 'essential' },
            { id: 'es6-features', title: 'ES6+ and Modular JavaScript', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'vcs',
        title: 'Version Control Systems',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'git-usage', title: 'Basic Usage of Git', status: 'locked', importance: 'essential' },
            { id: 'vcs-hosting', title: 'Repo Hosting Services', status: 'locked', importance: 'essential', subtopics: ['GitHub', 'GitLab', 'Bitbucket'] },
        ],
    },
    {
        id: 'web-security',
        title: 'Web Security',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'https', title: 'HTTPS', status: 'locked', importance: 'essential' },
            { id: 'cors', title: 'CORS', status: 'locked', importance: 'essential' },
            { id: 'csp', title: 'Content Security Policy', status: 'locked', importance: 'essential' },
            { id: 'owasp', title: 'OWASP Security Risks', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'package-managers',
        title: 'Package Managers',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'npm', title: 'npm', status: 'locked', importance: 'essential' },
            { id: 'yarn', title: 'yarn', status: 'locked', importance: 'essential' },
            { id: 'pnpm', title: 'pnpm', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'css-preprocessors',
        title: 'CSS Preprocessors',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'sass', title: 'Sass', status: 'locked', importance: 'essential' },
            { id: 'postcss', title: 'PostCSS', status: 'locked', importance: 'essential' },
            { id: 'less', title: 'Less', status: 'locked', importance: 'recommended' },
        ],
    },
    {
        id: 'build-tools',
        title: 'Build Tools',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'linters', title: 'Linters and Formatters', status: 'locked', importance: 'essential', subtopics: ['Prettier', 'ESLint'] },
            { id: 'task-runners', title: 'Task Runners', status: 'locked', importance: 'essential', subtopics: ['npm scripts'] },
            { id: 'bundlers', title: 'Module Bundlers', status: 'locked', importance: 'essential', subtopics: ['Vite', 'Webpack', 'esbuild'] },
        ],
    },
    {
        id: 'frameworks',
        title: 'Pick a Framework',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'react', title: 'React', status: 'locked', importance: 'recommended' },
            { id: 'vue', title: 'Vue.js', status: 'locked', importance: 'optional' },
            { id: 'angular', title: 'Angular', status: 'locked', importance: 'optional' },
            { id: 'svelte', title: 'Svelte', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'modern-css',
        title: 'Modern CSS',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'styled-components', title: 'Styled Components', status: 'locked', importance: 'essential' },
            { id: 'css-modules', title: 'CSS Modules', status: 'locked', importance: 'essential' },
            { id: 'tailwind', title: 'Tailwind CSS', status: 'locked', importance: 'recommended' },
        ],
    },
    {
        id: 'web-components',
        title: 'Web Components',
        status: 'locked',
        importance: 'optional',
        topics: [
            { id: 'shadow-dom', title: 'Shadow DOM', status: 'locked', importance: 'essential' },
            { id: 'html-templates', title: 'HTML Templates', status: 'locked', importance: 'essential' },
            { id: 'custom-elements', title: 'Custom Elements', status: 'locked', importance: 'essential' },
        ]
    },
    {
        id: 'testing',
        title: 'Testing your Apps',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'testing-concepts', title: 'Learn the Difference', status: 'locked', importance: 'essential', subtopics: ['Unit', 'Integration', 'E2E'] },
            { id: 'jest', title: 'Jest', status: 'locked', importance: 'recommended' },
            { id: 'cypress', title: 'Cypress', status: 'locked', importance: 'essential' },
            { id: 'playwright', title: 'Playwright', status: 'locked', importance: 'recommended' },
        ],
    },
    {
        id: 'type-checkers',
        title: 'Type Checkers',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'typescript', title: 'TypeScript', status: 'locked', importance: 'essential' },
        ]
    },
    {
        id: 'ssr-ssg',
        title: 'SSR & SSG',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'ssr', title: 'Server Side Rendering', status: 'locked', importance: 'essential' },
            { id: 'ssg', title: 'Static Site Generation', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'graphql',
        title: 'GraphQL',
        status: 'locked',
        importance: 'optional',
        topics: [
            { id: 'apollo', title: 'Apollo', status: 'locked', importance: 'essential' },
            { id: 'relay', title: 'Relay', status: 'locked', importance: 'optional' },
        ]
    },
    {
        id: 'mobile-apps',
        title: 'Mobile Applications',
        status: 'locked',
        importance: 'optional',
        topics: [
            { id: 'react-native', title: 'React Native', status: 'locked', importance: 'recommended' },
            { id: 'flutter', title: 'Flutter', status: 'locked', importance: 'optional' },
            { id: 'ionic', title: 'Ionic', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'web-assembly',
        title: 'Web Assembly',
        status: 'locked',
        importance: 'optional',
        topics: [
            { id: 'wasm-basics', title: 'Understand WASM', status: 'locked', importance: 'essential' },
        ]
    }
];

export const BACKEND_ROADMAP = [
    {
        id: 'internet-backend',
        title: 'Internet',
        status: 'completed',
        importance: 'essential',
        topics: [
            { id: 'how-it-works', title: 'How does the internet work?', status: 'completed', importance: 'essential' },
            { id: 'what-is-http', title: 'What is HTTP?', status: 'completed', importance: 'essential' },
            { id: 'browsers', title: 'Browsers and how they work?', status: 'completed', importance: 'essential' },
            { id: 'dns', title: 'DNS and how it works?', status: 'completed', importance: 'essential' },
        ],
    },
    {
        id: 'frontend-basics',
        title: 'Frontend Basics',
        status: 'completed',
        importance: 'recommended',
        topics: [
            { id: 'html-basics', title: 'HTML', status: 'completed', importance: 'essential' },
            { id: 'css-basics', title: 'CSS', status: 'completed', importance: 'essential' },
            { id: 'js-basics', title: 'JavaScript', status: 'completed', importance: 'essential' },
        ],
    },
    {
        id: 'os-knowledge',
        title: 'OS & General Knowledge',
        status: 'current',
        importance: 'essential',
        topics: [
            { id: 'terminal-usage', title: 'Terminal Usage', status: 'completed', importance: 'essential', subtopics: ['Bash/Zsh', 'Vim/Nano', 'SSH'] },
            { id: 'os-internals', title: 'OS Internals', status: 'current', importance: 'essential', subtopics: ['Process Management', 'Threads & Concurrency', 'Memory Management', 'I/O Management'] },
            { id: 'posix-basics', title: 'POSIX Basics', status: 'locked', importance: 'recommended', subtopics: ['File Permissions', 'Signals', 'Pipes'] },
        ],
    },
    {
        id: 'languages',
        title: 'Pick a Language',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'javascript-node', title: 'JavaScript (Node.js)', status: 'locked', importance: 'recommended', subtopics: ['Event Loop', 'Package.json', 'Streams'] },
            { id: 'python', title: 'Python', status: 'locked', importance: 'recommended', subtopics: ['Pip/Poetry', 'Asyncio', 'Decorators'] },
            { id: 'go', title: 'Go', status: 'locked', importance: 'recommended', subtopics: ['Goroutines', 'Channels', 'Interfaces'] },
            { id: 'rust', title: 'Rust', status: 'locked', importance: 'optional', subtopics: ['Ownership', 'Borrowing', 'Cargo'] },
            { id: 'java', title: 'Java', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'relational-db',
        title: 'Relational Databases',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'postgresql', title: 'PostgreSQL', status: 'locked', importance: 'recommended', subtopics: ['JSONB', 'Extensions', 'WAL'] },
            { id: 'mysql', title: 'MySQL', status: 'locked', importance: 'essential', subtopics: ['Storage Engines', 'Indexing', 'Replication'] },
            { id: 'sql-basics', title: 'SQL Basics', status: 'locked', importance: 'essential', subtopics: ['Joins', 'Transactions', 'Normalization'] },
        ],
    },
    {
        id: 'nosql-db',
        title: 'NoSQL Databases',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'mongodb', title: 'MongoDB', status: 'locked', importance: 'recommended', subtopics: ['Aggregation', 'Sharding', 'BSON'] },
            { id: 'redis', title: 'Redis', status: 'locked', importance: 'essential', subtopics: ['Data Types', 'Persistence', 'Pub/Sub'] },
            { id: 'cassandra', title: 'Cassandra', status: 'locked', importance: 'optional', subtopics: ['CQL', 'Gossip Protocol'] },
        ],
    },
    {
        id: 'apis',
        title: 'APIs',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'rest', title: 'REST', status: 'locked', importance: 'essential' },
            { id: 'json-apis', title: 'JSON APIs', status: 'locked', importance: 'essential' },
            { id: 'graphql-backend', title: 'GraphQL', status: 'locked', importance: 'recommended' },
            { id: 'grpc', title: 'gRPC', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'caching',
        title: 'Caching',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'cdn', title: 'CDN', status: 'locked', importance: 'essential' },
            { id: 'server-side-caching', title: 'Server Side', status: 'locked', importance: 'essential', subtopics: ['Redis', 'Memcached'] },
            { id: 'client-side-caching', title: 'Client Side', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'web-security-backend',
        title: 'Web Security',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'ssl-tls', title: 'SSL/TLS', status: 'locked', importance: 'essential' },
            { id: 'auth-methods', title: 'Auth Methods', status: 'locked', importance: 'essential', subtopics: ['OAuth', 'JWT', 'SSO'] },
            { id: 'security-best-practices', title: 'OWASP Risks', status: 'locked', importance: 'essential' },
        ],
    },
    {
        id: 'ci-cd',
        title: 'CI/CD',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'github-actions', title: 'GitHub Actions', status: 'locked', importance: 'essential' },
            { id: 'jenkins', title: 'Jenkins', status: 'locked', importance: 'optional' },
            { id: 'circle-ci', title: 'CircleCI', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'design-patterns',
        title: 'Design & Architecture',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'solid', title: 'SOLID Principles', status: 'locked', importance: 'essential' },
            { id: 'microservices', title: 'Microservices', status: 'locked', importance: 'recommended' },
            { id: 'monolith', title: 'Monolithic Architecture', status: 'locked', importance: 'essential' },
            { id: 'serverless', title: 'Serverless', status: 'locked', importance: 'optional' },
        ],
    },
    {
        id: 'message-brokers',
        title: 'Message Brokers',
        status: 'locked',
        importance: 'recommended',
        topics: [
            { id: 'rabbitmq', title: 'RabbitMQ', status: 'locked', importance: 'recommended' },
            { id: 'kafka', title: 'Kafka', status: 'locked', importance: 'recommended' },
        ],
    },
    {
        id: 'containers',
        title: 'Containers',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'docker', title: 'Docker', status: 'locked', importance: 'essential' },
            { id: 'kubernetes', title: 'Kubernetes', status: 'locked', importance: 'recommended' },
        ],
    },
    {
        id: 'web-servers',
        title: 'Web Servers',
        status: 'locked',
        importance: 'essential',
        topics: [
            { id: 'nginx', title: 'Nginx', status: 'locked', importance: 'essential' },
            { id: 'apache', title: 'Apache', status: 'locked', importance: 'optional' },
        ]
    }
];

export const ROADMAP_MAP = {
    frontend: FRONTEND_ROADMAP,
    backend: BACKEND_ROADMAP
};

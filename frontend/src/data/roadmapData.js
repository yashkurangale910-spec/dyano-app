export const frontendRoadmapData = {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Step by step guide to becoming a modern frontend developer in 2026',
    phases: [
        { id: 'foundation', title: 'Phase 1: Basic Foundation', color: 'rgba(34, 197, 94, 0.05)', minY: 50, maxY: 180 },
        { id: 'core', title: 'Phase 2: Core Development', color: 'rgba(59, 130, 246, 0.05)', minY: 200, maxY: 480 },
        { id: 'infra', title: 'Phase 3: Infrastructure & Tools', color: 'rgba(168, 85, 247, 0.05)', minY: 500, maxY: 930 },
        { id: 'frameworks', title: 'Phase 4: Advanced Frameworks', color: 'rgba(236, 72, 153, 0.05)', minY: 950, maxY: 1530 }
    ],
    nodes: [
        {
            id: 'internet',
            title: 'Internet',
            phaseId: 'foundation',
            description: 'How does the internet work, HTTP, Domain Names, Hosting',
            level: 'beginner',
            x: 400,
            y: 100,
            children: ['html', 'javascript'],
            timeEstimate: '2 Hours',
            resources: [
                { type: 'video', label: 'How the Internet Works', url: 'https://www.youtube.com/watch?v=7_LPdttKXPc' },
                { type: 'docs', label: 'MDN: How the Web Works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works' },
                { type: 'article', label: 'DNS Explained', url: 'https://howdns.works/' }
            ],
            checklist: [
                'How does the internet work?',
                'What is HTTP/HTTPS?',
                'Domain Names and DNS',
                'Web Hosting'
            ]
        },

        // Core
        {
            id: 'html',
            title: 'HTML',
            description: 'Basics, Forms, Semantic HTML, SEO, Accessibility',
            level: 'beginner',
            x: 250,
            y: 250,
            children: ['css'],
            timeEstimate: '5 Hours',
            project: {
                title: 'Personal Profile Page',
                description: 'Build a simple semantic HTML page about yourself using only HTML tags (no CSS yet). Use lists, headers, and an image.',
                difficulty: 'Easy'
            },
            resources: [
                { type: 'docs', label: 'W3Schools HTML Tutorial', url: 'https://www.w3schools.com/html/' },
                { type: 'video', label: 'HTML Full Course', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU' }
            ],
            checklist: [
                'Semantic HTML',
                'Forms and Validations',
                'SEO Basics',
                'Accessibility (ARIA)'
            ]
        },
        {
            id: 'css',
            title: 'CSS',
            description: 'Basics, Layouts (Flexbox/Grid), Responsive, Mobile First',
            level: 'beginner',
            x: 550,
            y: 250,
            children: ['javascript'],
            timeEstimate: '15 Hours',
            project: {
                title: 'Responsive Landing Page',
                description: 'Create a landing page with a navigation bar, a hero section, and a 3-column feature grid that stacks on mobile.',
                difficulty: 'Medium'
            },
            resources: [
                { type: 'docs', label: 'CSS-Tricks: Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
                { type: 'video', label: 'CSS Grid vs Flexbox', url: 'https://www.youtube.com/watch?v=705XceWW42M' },
                { type: 'game', label: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/' }
            ],
            checklist: [
                'Box Model',
                'Flexbox Layout',
                'CSS Grid',
                'Responsive Design'
            ]
        },
        {
            id: 'javascript',
            title: 'JavaScript',
            description: 'Syntax, DOM, Fetch, ES6+, Modular JS',
            level: 'intermediate',
            x: 400,
            y: 400,
            children: ['vcs'],
            timeEstimate: '40 Hours',
            project: {
                title: 'Interactive To-Do List',
                description: 'Build a task manager where users can add, delete, and mark tasks as done. Save data to LocalStorage.',
                difficulty: 'Hard'
            },
            resources: [
                { type: 'docs', label: 'javascript.info', url: 'https://javascript.info/' },
                { type: 'video', label: 'Namaste JavaScript', url: 'https://www.youtube.com/watch?v=pN6jk0uapqY' }
            ]
        },

        // Infrastructure
        { id: 'vcs', title: 'Version Control', description: 'Git basics and GitHub usage', level: 4, x: 400, y: 550, children: ['web-security'] },
        { id: 'web-security', title: 'Web Security', description: 'CORS, HTTPS, Content Security Policy, OWASP', level: 5, x: 250, y: 700, children: ['package-managers'] },

        // Tools
        { id: 'package-managers', title: 'Package Managers', description: 'npm, yarn, pnpm', level: 6, x: 550, y: 700, children: ['build-tools'] },
        { id: 'build-tools', title: 'Build Tools', description: 'Linters, Formatters, Module Bundlers (Vite, Webpack)', level: 7, x: 400, y: 850, children: ['frameworks'] },

        // Advanced
        { id: 'frameworks', title: 'Pick a Framework', description: 'React, Vue, Angular, Svelte', level: 8, x: 400, y: 1000, children: ['css-architecture', 'testing'] },
        { id: 'css-architecture', title: 'CSS Modern', description: 'Styled Components, CSS Modules, Tailwind', level: 9, x: 250, y: 1150, children: ['typescript'] },
        { id: 'testing', title: 'Testing Apps', description: 'Jest, Vitest, Cypress, Playwright', level: 9, x: 550, y: 1150, children: ['typescript'] },
        { id: 'typescript', title: 'TypeScript', description: 'Static typing for JavaScript', level: 10, x: 400, y: 1300, children: ['nextjs'] },
        { id: 'nextjs', title: 'SSR / SSG', description: 'Next.js, Nuxt.js, Remix', level: 11, x: 400, y: 1450, children: [] }
    ]
};

export const backendRoadmapData = {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Step by step guide to becoming a modern backend developer in 2026',
    nodes: [
        { id: 'internet', title: 'Internet', description: 'HTTP/HTTPS, DNS, Browsers', level: 'beginner', x: 400, y: 100, children: ['language'] },
        { id: 'language', title: 'Pick a Language', description: 'Java, Python, Node.js, PHP, Go, Rust', level: 'beginner', x: 400, y: 250, children: ['vcs'] },
        { id: 'vcs', title: 'Version Control', description: 'Git basics, GitHub/GitLab', level: 'beginner', x: 400, y: 400, children: ['os-concepts'] },
        { id: 'os-concepts', title: 'OS Concepts', description: 'Process management, Threads, Memory', level: 'intermediate', x: 400, y: 550, children: ['relational-db', 'nosql-db'] },
        { id: 'relational-db', title: 'Relational DB', description: 'PostgreSQL, MySQL, MariaDB', level: 'beginner', x: 250, y: 700, children: ['orm'] },
        { id: 'nosql-db', title: 'NoSQL DB', description: 'MongoDB, Redis, Cassandra', level: 'intermediate', x: 550, y: 700, children: ['apis'] },
        { id: 'orm', title: 'ORMs', description: 'Prisma, TypeORM, Hibernate', level: 'intermediate', x: 250, y: 850, children: ['apis'] },
        { id: 'apis', title: 'APIs', description: 'REST, GraphQL, gRPC', level: 'intermediate', x: 400, y: 1000, children: ['caching'] },
        { id: 'caching', title: 'Caching', description: 'Redis, Memcached, CDN', level: 'intermediate', x: 400, y: 1150, children: ['security'] },
        { id: 'security', title: 'Security', description: 'Hashing, OAuth, JWT, SSL', level: 'advanced', x: 400, y: 1300, children: ['testing'] },
        { id: 'testing', title: 'Testing', description: 'Unit, Integration, E2E Testing', level: 'intermediate', x: 400, y: 1450, children: ['design-patterns'] },
        { id: 'design-patterns', title: 'Design Patterns', description: 'Monolith, Microservices, SOA', level: 'advanced', x: 400, y: 1600, children: ['search-engines'] },
        { id: 'search-engines', title: 'Search Engines', description: 'Elasticsearch, Solr', level: 'advanced', x: 250, y: 1750, children: ['ci-cd'] },
        { id: 'msg-brokers', title: 'Message Brokers', description: 'RabbitMQ, Kafka', level: 'advanced', x: 550, y: 1750, children: ['ci-cd'] },
        { id: 'ci-cd', title: 'CI/CD', description: 'GitHub Actions, Jenkins', level: 'advanced', x: 400, y: 1900, children: [] }
    ]
};

export const devopsRoadmapData = {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'Step by step guide to becoming a DevOps engineer in 2026',
    nodes: [
        { id: 'language', title: 'Programming', description: 'Python, Go, Node.js', level: 'beginner', x: 400, y: 100, children: ['os-admin'] },
        { id: 'os-admin', title: 'OS Admin', description: 'Linux, SSH, Bash', level: 'beginner', x: 400, y: 250, children: ['networking'] },
        { id: 'networking', title: 'Networking', description: 'IP, DNS, OSI Model', level: 'beginner', x: 400, y: 400, children: ['web-server'] },
        { id: 'web-server', title: 'Web Servers', description: 'Nginx, Apache, Caddy', level: 'beginner', x: 400, y: 550, children: ['containers'] },
        { id: 'containers', title: 'Containers', description: 'Docker, Podman', level: 'intermediate', x: 400, y: 700, children: ['orchestration'] },
        { id: 'orchestration', title: 'Orchestration', description: 'Kubernetes (K8s)', level: 'intermediate', x: 400, y: 850, children: ['iac'] },
        { id: 'iac', title: 'IaC', description: 'Terraform, Ansible', level: 'advanced', x: 250, y: 1000, children: ['cicd-ops'] },
        { id: 'config-management', title: 'Config Mgmt', description: 'Chef, Puppet', level: 'advanced', x: 550, y: 1000, children: ['cicd-ops'] },
        { id: 'cicd-ops', title: 'CI/CD Ops', description: 'GitLab CI, CircleCI', level: 'advanced', x: 400, y: 1150, children: ['monitoring-logging'] },
        { id: 'monitoring-logging', title: 'Monitoring', description: 'Prometheus, Grafana', level: 'advanced', x: 250, y: 1300, children: ['cloud-platforms'] },
        { id: 'logging', title: 'Logging', description: 'ELK Stack, Splunk', level: 'advanced', x: 550, y: 1300, children: ['cloud-platforms'] },
        { id: 'cloud-platforms', title: 'Cloud', description: 'AWS, GCP, Azure', level: 'intermediate', x: 400, y: 1450, children: [] }
    ]
};

// Central registry for all roadmaps
import { frontendRoadmapData, backendRoadmapData, devopsRoadmapData } from './roadmapData';

import { ai_agentsRoadmapData } from './roadmaps/role/ai-agents';
import { ai_data_scientistRoadmapData } from './roadmaps/role/ai-data-scientist';
import { ai_engineerRoadmapData } from './roadmaps/role/ai-engineer';
import { androidRoadmapData } from './roadmaps/role/android';
import { api_designRoadmapData } from './roadmaps/role/api-design';
import { backend_beginnerRoadmapData } from './roadmaps/role/backend-beginner';
import { bi_analystRoadmapData } from './roadmaps/role/bi-analyst';
import { blockchainRoadmapData } from './roadmaps/role/blockchain';
import { cyber_securityRoadmapData } from './roadmaps/role/cyber-security';
import { data_analystRoadmapData } from './roadmaps/role/data-analyst';
import { data_engineerRoadmapData } from './roadmaps/role/data-engineer';
import { developer_relationsRoadmapData } from './roadmaps/role/developer-relations';
import { devops_beginnerRoadmapData } from './roadmaps/role/devops-beginner';
import { devsecopsRoadmapData } from './roadmaps/role/devsecops';
import { engineering_managerRoadmapData } from './roadmaps/role/engineering-manager';
import { frontend_beginnerRoadmapData } from './roadmaps/role/frontend-beginner';
import { fullstackRoadmapData } from './roadmaps/role/fullstack';
import { game_developerRoadmapData } from './roadmaps/role/game-developer';
import { iosRoadmapData } from './roadmaps/role/ios';
import { machine_learningRoadmapData } from './roadmaps/role/machine-learning';
import { mlopsRoadmapData } from './roadmaps/role/mlops';
import { postgresqlRoadmapData } from './roadmaps/role/postgresql';
import { product_managerRoadmapData } from './roadmaps/role/product-manager';
import { qaRoadmapData } from './roadmaps/role/qa';
import { server_side_game_devRoadmapData } from './roadmaps/role/server-side-game-dev';
import { software_architectRoadmapData } from './roadmaps/role/software-architect';
import { technical_writerRoadmapData } from './roadmaps/role/technical-writer';
import { ux_designRoadmapData } from './roadmaps/role/ux-design';
import { ai_red_teamingRoadmapData } from './roadmaps/skill/ai-red-teaming';
import { angularRoadmapData } from './roadmaps/skill/angular';
import { aspnet_coreRoadmapData } from './roadmaps/skill/aspnet-core';
import { awsRoadmapData } from './roadmaps/skill/aws';
import { cloudflareRoadmapData } from './roadmaps/skill/cloudflare';
import { code_reviewRoadmapData } from './roadmaps/skill/code-review';
import { computer_scienceRoadmapData } from './roadmaps/skill/computer-science';
import { cppRoadmapData } from './roadmaps/skill/cpp';
import { cssRoadmapData } from './roadmaps/skill/css';
import { data_structures_algorithmsRoadmapData } from './roadmaps/skill/data-structures-algorithms';
import { design_architectureRoadmapData } from './roadmaps/skill/design-architecture';
import { design_systemRoadmapData } from './roadmaps/skill/design-system';
import { djangoRoadmapData } from './roadmaps/skill/django';
import { dockerRoadmapData } from './roadmaps/skill/docker';
import { elasticsearchRoadmapData } from './roadmaps/skill/elasticsearch';
import { flutterRoadmapData } from './roadmaps/skill/flutter';
import { git_githubRoadmapData } from './roadmaps/skill/git-github';
import { goRoadmapData } from './roadmaps/skill/go';
import { graphqlRoadmapData } from './roadmaps/skill/graphql';
import { htmlRoadmapData } from './roadmaps/skill/html';
import { javaRoadmapData } from './roadmaps/skill/java';
import { javascriptRoadmapData } from './roadmaps/skill/javascript';
import { kotlinRoadmapData } from './roadmaps/skill/kotlin';
import { kubernetesRoadmapData } from './roadmaps/skill/kubernetes';
import { laravelRoadmapData } from './roadmaps/skill/laravel';
import { linuxRoadmapData } from './roadmaps/skill/linux';
import { mongodbRoadmapData } from './roadmaps/skill/mongodb';
import { nextjsRoadmapData } from './roadmaps/skill/nextjs';
import { nodejsRoadmapData } from './roadmaps/skill/nodejs';
import { phpRoadmapData } from './roadmaps/skill/php';
import { prompt_engineeringRoadmapData } from './roadmaps/skill/prompt-engineering';
import { pythonRoadmapData } from './roadmaps/skill/python';
import { react_nativeRoadmapData } from './roadmaps/skill/react-native';
import { reactRoadmapData } from './roadmaps/skill/react';
import { redisRoadmapData } from './roadmaps/skill/redis';
import { rubyRoadmapData } from './roadmaps/skill/ruby';
import { rustRoadmapData } from './roadmaps/skill/rust';
import { shell_bashRoadmapData } from './roadmaps/skill/shell-bash';
import { spring_bootRoadmapData } from './roadmaps/skill/spring-boot';
import { sqlRoadmapData } from './roadmaps/skill/sql';
import { swift_swiftuiRoadmapData } from './roadmaps/skill/swift-swiftui';
import { system_designRoadmapData } from './roadmaps/skill/system-design';
import { terraformRoadmapData } from './roadmaps/skill/terraform';
import { typescriptRoadmapData } from './roadmaps/skill/typescript';
import { vueRoadmapData } from './roadmaps/skill/vue';
import { wordpressRoadmapData } from './roadmaps/skill/wordpress';

export const roadmapRegistry = {
    'frontend': { data: frontendRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'backend': { data: backendRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'devops': { data: devopsRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ai-agents': { data: ai_agentsRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ai-data-scientist': { data: ai_data_scientistRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ai-engineer': { data: ai_engineerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'android': { data: androidRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'api-design': { data: api_designRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'backend-beginner': { data: backend_beginnerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'bi-analyst': { data: bi_analystRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'blockchain': { data: blockchainRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'cyber-security': { data: cyber_securityRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'data-analyst': { data: data_analystRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'data-engineer': { data: data_engineerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'developer-relations': { data: developer_relationsRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'devops-beginner': { data: devops_beginnerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'devsecops': { data: devsecopsRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'engineering-manager': { data: engineering_managerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'frontend-beginner': { data: frontend_beginnerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'fullstack': { data: fullstackRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'game-developer': { data: game_developerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ios': { data: iosRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'machine-learning': { data: machine_learningRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'mlops': { data: mlopsRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'postgresql': { data: postgresqlRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'product-manager': { data: product_managerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'qa': { data: qaRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'server-side-game-dev': { data: server_side_game_devRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'software-architect': { data: software_architectRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'technical-writer': { data: technical_writerRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ux-design': { data: ux_designRoadmapData, type: 'role', category: 'Role based', isNew: false },
    'ai-red-teaming': { data: ai_red_teamingRoadmapData, type: 'skill', category: 'Skill based', isNew: true },
    'angular': { data: angularRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'aspnet-core': { data: aspnet_coreRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'aws': { data: awsRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'cloudflare': { data: cloudflareRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'code-review': { data: code_reviewRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'computer-science': { data: computer_scienceRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'cpp': { data: cppRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'css': { data: cssRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'data-structures-algorithms': { data: data_structures_algorithmsRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'design-architecture': { data: design_architectureRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'design-system': { data: design_systemRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'django': { data: djangoRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'docker': { data: dockerRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'elasticsearch': { data: elasticsearchRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'flutter': { data: flutterRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'git-github': { data: git_githubRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'go': { data: goRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'graphql': { data: graphqlRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'html': { data: htmlRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'java': { data: javaRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'javascript': { data: javascriptRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'kotlin': { data: kotlinRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'kubernetes': { data: kubernetesRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'laravel': { data: laravelRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'linux': { data: linuxRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'mongodb': { data: mongodbRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'nextjs': { data: nextjsRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'nodejs': { data: nodejsRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'php': { data: phpRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'prompt-engineering': { data: prompt_engineeringRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'python': { data: pythonRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'react-native': { data: react_nativeRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'react': { data: reactRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'redis': { data: redisRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'ruby': { data: rubyRoadmapData, type: 'skill', category: 'Skill based', isNew: true },
    'rust': { data: rustRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'shell-bash': { data: shell_bashRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'spring-boot': { data: spring_bootRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'sql': { data: sqlRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'swift-swiftui': { data: swift_swiftuiRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'system-design': { data: system_designRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'terraform': { data: terraformRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'typescript': { data: typescriptRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
    'vue': { data: vueRoadmapData, type: 'skill', category: 'Frameworks', isNew: false },
    'wordpress': { data: wordpressRoadmapData, type: 'skill', category: 'Skill based', isNew: false },
};


/**
 * Get roadmap by ID
 */
export const getRoadmapById = (id) => {
    const entry = roadmapRegistry[id];
    if (!entry) return null;

    if (!entry.data) {
        return {
            id,
            title: formatRoadmapTitle(id),
            description: `Coming soon: ${formatRoadmapTitle(id)} roadmap`,
            type: entry.type,
            nodes: []
        };
    }

    return entry.data;
};

/**
 * Get all roadmaps by category
 */
export const getRoadmapsByCategory = (category) => {
    return Object.entries(roadmapRegistry)
        .filter(([_, meta]) => meta.category === category)
        .map(([id, meta]) => ({
            id,
            title: meta.data?.title || formatRoadmapTitle(id),
            category: meta.category,
            type: meta.type,
            isNew: meta.isNew
        }));
};

/**
 * Helper to format roadmap ID to title
 */
const formatRoadmapTitle = (id) => {
    return id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Map display name to registry ID
 */
export const getIdFromDisplayName = (displayName) => {
    // Basic slugify logic
    const slug = displayName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

    if (roadmapRegistry[slug]) {
        return slug;
    }

    const mappings = {
        'frontend': 'frontend-beginner',
        'backend': 'backend-beginner',
        'devops': 'devops-beginner',
        'full-stack': 'fullstack',
        'ai-and-data-scientist': 'ai-data-scientist',
        'client-side-game-dev': 'game-developer',
        'server-side-game-dev': 'server-side-game-dev',
        'git-and-github': 'git-github',
        'data-structures': 'data-structures-algorithms',
        'design-and-architecture': 'design-architecture',
        'devrel-engineer': 'developer-relations',
        'c-p-p': 'cpp',
        'shell---bash': 'shell-bash',
        'shell-bash': 'shell-bash',
        'swift---swift-ui': 'swift-swiftui',
        'swift-and-swift-ui': 'swift-swiftui'
    };

    return mappings[slug] || slug;
};

export default roadmapRegistry;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            "nav.dashboard": "Dashboard",
            "nav.quiz": "Quiz",
            "nav.flashcards": "Flashcards",
            "nav.roadmap": "Roadmap",
            "nav.pdf": "PDF Lab",
            "nav.progress": "Progress",
            "nav.profile": "Profile",
            "nav.logout": "Logout",

            // Auth
            "auth.login": "Login",
            "auth.register": "Register",
            "auth.email": "Email",
            "auth.password": "Password",
            "auth.name": "Name",
            "auth.confirmPassword": "Confirm Password",
            "auth.forgotPassword": "Forgot Password?",
            "auth.noAccount": "Don't have an account?",
            "auth.haveAccount": "Already have an account?",
            "auth.signIn": "Sign In",
            "auth.signUp": "Sign Up",

            // Dashboard
            "dashboard.welcome": "Welcome back",
            "dashboard.streak": "Day Streak",
            "dashboard.quizzes": "Quizzes",
            "dashboard.flashcards": "Flashcards",
            "dashboard.roadmaps": "Roadmaps",
            "dashboard.studyTime": "Study Time",
            "dashboard.achievements": "Achievements",

            // Quiz
            "quiz.generate": "Generate Quiz",
            "quiz.topic": "Topic",
            "quiz.difficulty": "Difficulty",
            "quiz.easy": "Easy",
            "quiz.medium": "Medium",
            "quiz.hard": "Hard",
            "quiz.questions": "Questions",
            "quiz.score": "Score",
            "quiz.submit": "Submit",
            "quiz.next": "Next",
            "quiz.previous": "Previous",

            // Flashcards
            "flashcards.create": "Create Flashcards",
            "flashcards.front": "Front",
            "flashcards.back": "Back",
            "flashcards.flip": "Flip Card",
            "flashcards.easy": "Easy",
            "flashcards.good": "Good",
            "flashcards.hard": "Hard",
            "flashcards.again": "Again",

            // Progress
            "progress.title": "Your Learning Journey",
            "progress.streak": "Day Streak",
            "progress.total": "Total",
            "progress.completed": "Completed",
            "progress.avgScore": "Average Score",
            "progress.studyTime": "Study Time",

            // Common
            "common.loading": "Loading...",
            "common.save": "Save",
            "common.cancel": "Cancel",
            "common.delete": "Delete",
            "common.edit": "Edit",
            "common.create": "Create",
            "common.search": "Search",
            "common.filter": "Filter",
            "common.all": "All",
            "common.settings": "Settings",
            "common.language": "Language",

            // Messages
            "msg.success": "Success!",
            "msg.error": "Error occurred",
            "msg.saved": "Saved successfully",
            "msg.deleted": "Deleted successfully",
            "msg.loginSuccess": "Login successful",
            "msg.registerSuccess": "Registration successful",
            "msg.fillFields": "Please fill in all fields",
            "msg.validEmail": "Please enter a valid email address",
            "msg.passwordLength": "Password must be at least 6 characters",
            "msg.passwordMatch": "Passwords do not match",
        }
    },
    es: {
        translation: {
            "nav.dashboard": "Panel",
            "nav.quiz": "Cuestionario",
            "nav.flashcards": "Tarjetas",
            "nav.roadmap": "Hoja de ruta",
            "nav.pdf": "Laboratorio PDF",
            "nav.progress": "Progreso",
            "nav.profile": "Perfil",
            "nav.logout": "Cerrar sesión",

            "auth.login": "Iniciar sesión",
            "auth.register": "Registrarse",
            "auth.email": "Correo electrónico",
            "auth.password": "Contraseña",
            "auth.name": "Nombre",
            "auth.signIn": "Iniciar sesión",
            "auth.signUp": "Registrarse",

            "dashboard.welcome": "Bienvenido de nuevo",
            "dashboard.streak": "Días de racha",
            "dashboard.quizzes": "Cuestionarios",
            "dashboard.flashcards": "Tarjetas",
            "dashboard.studyTime": "Tiempo de estudio",

            "quiz.generate": "Generar cuestionario",
            "quiz.topic": "Tema",
            "quiz.difficulty": "Dificultad",
            "quiz.easy": "Fácil",
            "quiz.medium": "Medio",
            "quiz.hard": "Difícil",

            "common.loading": "Cargando...",
            "common.save": "Guardar",
            "common.cancel": "Cancelar",
            "common.language": "Idioma",
        }
    },
    fr: {
        translation: {
            "nav.dashboard": "Tableau de bord",
            "nav.quiz": "Quiz",
            "nav.flashcards": "Cartes mémoire",
            "nav.roadmap": "Feuille de route",
            "nav.progress": "Progrès",
            "nav.logout": "Déconnexion",

            "auth.login": "Connexion",
            "auth.register": "S'inscrire",
            "auth.email": "E-mail",
            "auth.password": "Mot de passe",
            "auth.name": "Nom",

            "dashboard.welcome": "Bon retour",
            "dashboard.streak": "Jours de série",
            "dashboard.studyTime": "Temps d'étude",

            "common.loading": "Chargement...",
            "common.language": "Langue",
        }
    },
    de: {
        translation: {
            "nav.dashboard": "Dashboard",
            "nav.quiz": "Quiz",
            "nav.flashcards": "Karteikarten",
            "nav.progress": "Fortschritt",
            "nav.logout": "Abmelden",

            "auth.login": "Anmelden",
            "auth.register": "Registrieren",
            "auth.email": "E-Mail",
            "auth.password": "Passwort",

            "dashboard.welcome": "Willkommen zurück",
            "dashboard.studyTime": "Lernzeit",

            "common.loading": "Laden...",
            "common.language": "Sprache",
        }
    },
    hi: {
        translation: {
            "nav.dashboard": "डैशबोर्ड",
            "nav.quiz": "प्रश्नोत्तरी",
            "nav.flashcards": "फ्लैशकार्ड",
            "nav.progress": "प्रगति",
            "nav.logout": "लॉग आउट",

            "auth.login": "लॉगिन",
            "auth.register": "रजिस्टर करें",
            "auth.email": "ईमेल",
            "auth.password": "पासवर्ड",
            "auth.name": "नाम",

            "dashboard.welcome": "वापसी पर स्वागत है",
            "dashboard.studyTime": "अध्ययन समय",

            "common.loading": "लोड हो रहा है...",
            "common.save": "सहेजें",
            "common.language": "भाषा",
        }
    },
    zh: {
        translation: {
            "nav.dashboard": "仪表板",
            "nav.quiz": "测验",
            "nav.flashcards": "闪卡",
            "nav.progress": "进度",
            "nav.logout": "登出",

            "auth.login": "登录",
            "auth.register": "注册",
            "auth.email": "电子邮件",
            "auth.password": "密码",

            "dashboard.welcome": "欢迎回来",
            "dashboard.studyTime": "学习时间",

            "common.loading": "加载中...",
            "common.language": "语言",
        }
    },
    ja: {
        translation: {
            "nav.dashboard": "ダッシュボード",
            "nav.quiz": "クイズ",
            "nav.flashcards": "フラッシュカード",
            "nav.progress": "進捗",
            "nav.logout": "ログアウト",

            "auth.login": "ログイン",
            "auth.register": "登録",
            "auth.email": "メール",
            "auth.password": "パスワード",

            "dashboard.welcome": "おかえりなさい",
            "dashboard.studyTime": "学習時間",

            "common.loading": "読み込み中...",
            "common.language": "言語",
        }
    },
    ar: {
        translation: {
            "nav.dashboard": "لوحة التحكم",
            "nav.quiz": "اختبار",
            "nav.flashcards": "البطاقات التعليمية",
            "nav.progress": "التقدم",
            "nav.logout": "تسجيل الخروج",

            "auth.login": "تسجيل الدخول",
            "auth.register": "التسجيل",
            "auth.email": "البريد الإلكتروني",
            "auth.password": "كلمة المرور",

            "dashboard.welcome": "مرحبا بعودتك",
            "dashboard.studyTime": "وقت الدراسة",

            "common.loading": "جار التحميل...",
            "common.language": "اللغة",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;

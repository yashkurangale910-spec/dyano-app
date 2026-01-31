import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    common: { "title": "Spark.E Neural Tutor", "welcome": "Greetings! I am Spark.E, your universal learning node.", "placeholder": "Ask Spark.E anything about your course...", "send": "Send", "listen": "Start Voice", "stop_listen": "Stop", "mute": "Mute", "unmute": "Unmute" },
                    nav: { "dashboard": "Dashboard", "quiz": "Quiz Lab", "flashcards": "Flashcards", "pdf": "PDF Lab", "chatbot": "Spark.E Tutor", "progress": "Progress", "roadmap": "Roadmap" },
                    dashboard: { "title": "Mission Control", "welcome": "Welcome back, {{name}}. Accessing neural stream...", "stats": { "uptime": "System Uptime", "index": "Neural Index", "modules": "Modules Synced", "efficiency": "Retention" }, "tools": { "quiz": "Quiz Lab", "flashcards": "Flashcard Space", "pdf": "PDF Deep Analysis", "chatbot": "Spark.E AI Node" } },
                    tutor: {
                        "tabs": { "chat": "Chat", "essay": "Grade", "solver": "Solve", "status": "Status" },
                        "mastery": "Mastery Index",
                        "processing": "Neural Processing...",
                        "source": "Source",
                        "scan_active": "Spectral Scan Active",
                        "image_ready": "Image ready for analysis",
                        "new_analysis": "New Analysis",
                        "cognitive_perf": "Cognitive Performance",
                        "grade": "Grade",
                        "compliance": "Neural Compliance Score",
                        "merits": "Structural Merits",
                        "errors": "Error Clusters",
                        "conclusion": "Final Conclusion",
                        "essay": { "title": "Academic Essay Scan", "subtitle": "Rubric-based neural evaluation", "placeholder": "Paste your essay here...", "button": "Initiate Neural Grading" },
                        "solver": { "title": "Quantum Logic Engine", "subtitle": "Step-by-step neural derivation", "placeholder": "Example: Solve for x...", "button": "Initiate Derivation" },
                        "config": { "title": "Neural Config", "personality": "Personality", "depth": "Response Depth", "framework_label": "Framework Specialization", "framework_hint": "Tailors neural responses to specific ecosystems" }
                    },
                    roadmap: {
                        header: { nav: "Neural Navigation", title_part1: "Knowledge", title_part2: "Cartography" },
                        tabs: { browse: "Browse Paths", architect: "AI Architect" },
                        filter: { role: "Role based", skill: "Skill based", framework: "Frameworks" },
                        search_placeholder: "Search pathways (e.g. React, DevOps)...",
                        card: { new: "New" },
                        viewer: { close: "Close Map", progress: "{{count}} Modules Mastered", hint: "Click nodes to track progress" },
                        generator: { title: "Manifest Custom Knowledge", subtitle: "Let our Neural Engine architect a custom path...", placeholder: "E.g. Quantum Computing, Rust...", history: "Your Manifestations", quick_pick: "Quick Pick" }
                    }
                }
            },
            es: {
                translation: {
                    common: { "title": "Spark.E Tutor Neural", "welcome": "¡Saludos! Soy Spark.E, tu nodo de aprendizaje universal.", "placeholder": "Pregunta a Spark.E...", "send": "Enviar", "listen": "Voz", "stop_listen": "Parar", "mute": "Silenciar", "unmute": "Activar voz" },
                    nav: { "dashboard": "Panel", "quiz": "Lab de Quiz", "flashcards": "Fichas", "pdf": "PDF Lab", "chatbot": "Spark.E Tutor", "progress": "Progreso", "roadmap": "Mapa" },
                    dashboard: { "title": "Control de Misión", "welcome": "Bienvenido, {{name}}. Accediendo flujo neural...", "stats": { "uptime": "Uptime del Sistema", "index": "Índice Neural", "modules": "Módulos", "efficiency": "Retención" } },
                    tutor: {
                        "tabs": { "chat": "Chat", "essay": "Calificar", "solver": "Resolver", "status": "Estado" },
                        "mastery": "Índice de Maestría",
                        "processing": "Procesamiento Neural...",
                        "source": "Fuente",
                        "scan_active": "Escaneo Espectral Activo",
                        "image_ready": "Imagen lista para análisis",
                        "new_analysis": "Nuevos Análisis",
                        "cognitive_perf": "Rendimiento Cognitivo",
                        "grade": "Calificación",
                        "compliance": "Puntaje de Cumplimiento Neural",
                        "merits": "Méritos Estructurales",
                        "errors": "Clústeres de Errores",
                        "conclusion": "Conclusión Final",
                        "essay": { "title": "Escaneo de Ensayo Académico", "subtitle": "Evaluación neural basada en rúbricas", "placeholder": "Pega tu ensayo aquí...", "button": "Iniciar Calificación Neural" },
                        "solver": { "title": "Motor de Lógica Cuántica", "subtitle": "Derivación neural paso a paso", "placeholder": "Ejemplo: Resolver para x...", "button": "Iniciar Derivation" },
                        "config": { "title": "Configuración Neural", "personality": "Personalidad", "depth": "Profundidad de Respuesta", "framework_label": "Especialización en Frameworks", "framework_hint": "Adapta las respuestas neuronales a ecosistemas específicos" }
                    },
                    roadmap: {
                        header: { nav: "Navegación Neural", title_part1: "Cartografía del", title_part2: "Conocimiento" },
                        tabs: { browse: "Explorar Rutas", architect: "Arquitecto IA" },
                        filter: { role: "Basado en Roles", skill: "Basado en Habilidades", framework: "Frameworks" },
                        search_placeholder: "Buscar rutas (ej. React, DevOps)...",
                        card: { new: "Nuevo" },
                        viewer: { close: "Cerrar Mapa", progress: "{{count}} Módulos Dominados", hint: "Haz clic en los nodos para rastrear el progreso" },
                        generator: { title: "Manifiesta Conocimiento Personalizado", subtitle: "Deja que nuestro Motor Neural diseñe una ruta a medida...", placeholder: "Ej. Computación Cuántica, Rust...", history: "Tus Manifestaciones", quick_pick: "Selección Rápida" }
                    }
                }
            },
            fr: {
                translation: {
                    common: { "title": "Tuteur Neural Spark.E", "welcome": "Salutations! Je suis Spark.E, votre nœud d'apprentissage universel.", "placeholder": "Demandez à Spark.E...", "send": "Envoyer", "listen": "Voix", "stop_listen": "Arrêter", "mute": "Muet", "unmute": "Réactiver" },
                    nav: { "dashboard": "Tableau de Bord", "quiz": "Labo Quiz", "flashcards": "Cartes", "pdf": "PDF Lab", "chatbot": "Spark.E Tuteur", "progress": "Progrès", "roadmap": "Parcours" },
                    dashboard: { "title": "Contrôle de Mission", "welcome": "Bienvenue, {{name}}. Accès au flux neural...", "stats": { "uptime": "Uptime Système", "index": "Indice Neural", "modules": "Modules", "efficiency": "Rétention" } },
                    tutor: {
                        "tabs": { "chat": "Chat", "essay": "Noter", "solver": "Résoudre", "status": "Statut" },
                        "mastery": "Indice de Maîtrise",
                        "processing": "Traitement Neural...",
                        "source": "Source",
                        "scan_active": "Scan Spectral Actif",
                        "image_ready": "Image prête pour l'analyse",
                        "new_analysis": "Nouvelle Analyse",
                        "cognitive_perf": "Performance Cognitive",
                        "grade": "Note",
                        "compliance": "Score de Conformité Neurale",
                        "merits": "Mérites Structurels",
                        "errors": "Clusters d'Erreurs",
                        "conclusion": "Conclusion Finale",
                        "essay": { "title": "Analyse d'Essai Académique", "subtitle": "Évaluation neurale basée sur une grille", "placeholder": "Collez votre essai ici...", "button": "Lancer l'Évaluation" },
                        "solver": { "title": "Moteur Logique Quantique", "subtitle": "Dérivation neurale étape par étape", "placeholder": "Exemple: Résoudre pour x...", "button": "Lancer la Dérivation" },
                        "config": { "title": "Configuration Neurale", "personality": "Personnalité", "depth": "Profondeur de Réponse", "framework_label": "Spécialisation Framework", "framework_hint": "Adapte les réponses neurales aux écosystèmes spécifiques" }
                    },
                    roadmap: {
                        header: { nav: "Navigation Neurale", title_part1: "Cartographie du", title_part2: "Savoir" },
                        tabs: { browse: "Parcourir les Chemins", architect: "Architecte IA" },
                        filter: { role: "Basé sur les rôles", skill: "Basé sur les compétences", framework: "Frameworks" },
                        search_placeholder: "Rechercher des parcours (ex: React, DevOps)...",
                        card: { new: "Nouveau" },
                        viewer: { close: "Fermer la Carte", progress: "{{count}} Modules Maîtrisés", hint: "Cliquez sur les nœuds pour suivre la progression" },
                        generator: { title: "Manifestez le Savoir Personnalisé", subtitle: "Laissez notre moteur neural concevoir un parcours sur mesure...", placeholder: "Ex: Physique Quantique, Rust...", history: "Vos Manifestations", quick_pick: "Sélection Rapide" }
                    }
                }
            },
            de: {
                translation: {
                    common: { "title": "Spark.E Neuraler Tutor", "welcome": "Grüße! Ich bin Spark.E, dein universaler Lernknoten.", "placeholder": "Frag Spark.E etwas...", "send": "Senden", "listen": "Sprache", "stop_listen": "Stopp", "mute": "Stumm", "unmute": "Laut" },
                    nav: { "dashboard": "Dashboard", "quiz": "Quiz Labor", "flashcards": "Karteikarten", "pdf": "PDF Labor", "chatbot": "Spark.E Tutor", "progress": "Fortschritt", "roadmap": "Roadmap" },
                    dashboard: { "title": "Missionskontrolle", "welcome": "Willkommen zurück, {{name}}. Neuraler Stream wird geladen...", "stats": { "uptime": "Systemlaufzeit", "index": "Neuraler Index", "modules": "Module", "efficiency": "Retention" } },
                    tutor: {
                        "tabs": { "chat": "Chat", "essay": "Benoten", "solver": "Lösen", "status": "Status" },
                        "mastery": "Beherrschungsindex",
                        "processing": "Neurale Verarbeitung...",
                        "source": "Quelle",
                        "scan_active": "Spektralscan aktiv",
                        "image_ready": "Bild bereit zur Analyse",
                        "new_analysis": "Neue Analyse",
                        "cognitive_perf": "Kognitive Leistung",
                        "grade": "Note",
                        "compliance": "Neuraler Compliance-Score",
                        "merits": "Strukturelle Vorzüge",
                        "errors": "Fehlercluster",
                        "conclusion": "Fazit",
                        "essay": { "title": "Akademischer Essay-Scan", "subtitle": "Bewertung auf Rubrik-Basis", "placeholder": "Fügen Sie Ihren Aufsatz hier ein...", "button": "Bewertung starten" },
                        "solver": { "title": "Quantenlogik-Engine", "subtitle": "Schritt-für-Schritt-Ableitung", "placeholder": "Beispiel: Löse nach x auf...", "button": "Berechnung starten" },
                        "config": { "title": "Neurale Konfiguration", "personality": "Persönlichkeit", "depth": "Antworttiefe", "framework_label": "Framework-Spezialisierung", "framework_hint": "Passt neurale Antworten an spezifische Ökosysteme an" }
                    },
                    roadmap: {
                        header: { nav: "Neurale Navigation", title_part1: "Wissens-", title_part2: "Kartographie" },
                        tabs: { browse: "Pfade durchsuchen", architect: "KI-Architekt" },
                        filter: { role: "Rollenbasiert", skill: "Fähigkeitsbasiert", framework: "Frameworks" },
                        search_placeholder: "Pfad suchen (z.B. React, DevOps)...",
                        card: { new: "Neu" },
                        viewer: { close: "Karte schließen", progress: "{{count}} Module gemeistert", hint: "Knoten anklicken, um Fortschritt zu verfolgen" },
                        generator: { title: "Eigener Wissenspfad manifestieren", subtitle: "Lass unsere Neurale Engine deinen individuellen Pfad planen...", placeholder: "Z.B. Quantencomputer, Rust...", history: "Deine Manifestationen", quick_pick: "Schnellauswahl" }
                    }
                }
            },
            pt: {
                translation: {
                    common: { "title": "Tutor Neural Spark.E", "welcome": "Saudações! Eu sou o Spark.E, seu nó de aprendizado universal.", "placeholder": "Pergunte ao Spark.E...", "send": "Enviar", "listen": "Voz", "stop_listen": "Parar", "mute": "Mudo", "unmute": "Som" },
                    nav: { "dashboard": "Painel", "quiz": "Lab de Quiz", "flashcards": "Flashcards", "pdf": "PDF Lab", "chatbot": "Spark.E Tutor", "progress": "Progresso", "roadmap": "Roteiro" },
                    dashboard: { "title": "Controle de Missão", "welcome": "Bem-vindo de volta, {{name}}. Acedendo fluxo neural...", "stats": { "uptime": "Uptime do Sistema", "index": "Índice Neural", "modules": "Módulos", "efficiency": "Retenção" } },
                    tutor: {
                        "tabs": { "chat": "Chat", "essay": "Avaliar", "solver": "Resolver", "status": "Status" },
                        "mastery": "Índice de Maestria",
                        "processing": "Processamento Neural...",
                        "source": "Fonte",
                        "scan_active": "Digitalização Espetral Ativa",
                        "image_ready": "Imagem pronta para análise",
                        "new_analysis": "Nova Análise",
                        "cognitive_perf": "Desempenho Cognitivo",
                        "grade": "Nota",
                        "compliance": "Pontuação de Conformidade Neural",
                        "merits": "Méritos Estruturais",
                        "errors": "Clusters de erros",
                        "conclusion": "Conclusão Final",
                        "essay": { "title": "Análise de Redação Acadêmica", "subtitle": "Avaliação neural baseada em rubricas", "placeholder": "Cole sua redação aqui...", "button": "Iniciar Avaliação" },
                        "solver": { "title": "Motor de Lógica Cuântica", "subtitle": "Derivação neural passo a passo", "placeholder": "Exemplo: Resolver para x...", "button": "Iniciar Derivação" },
                        "config": { "title": "Configuração Neural", "personality": "Personalidade", "depth": "Profundidade da Resposta", "framework_label": "Especialização em Framework", "framework_hint": "Adapta respostas neurais a ecossistemas específicos" }
                    },
                    roadmap: {
                        header: { nav: "Navegação Neural", title_part1: "Cartografia do", title_part2: "Conhecimento" },
                        tabs: { browse: "Explorar Caminhos", architect: "Arquiteto IA" },
                        filter: { role: "Baseado em Funções", skill: "Baseado em Habilidades", framework: "Frameworks" },
                        search_placeholder: "Pesquisar caminhos (ex: React, DevOps)...",
                        card: { new: "Novo" },
                        viewer: { close: "Fechar Mapa", progress: "{{count}} Módulos Dominados", hint: "Clique nos nós para acompanhar o progresso" },
                        generator: { title: "Manifestar Conhecimento Personalizado", subtitle: "Deixe nosso Motor Neural projetar um caminho sob medida...", placeholder: "Ex: Computação Quântica, Rust...", history: "Suas Manifestações", quick_pick: "Escolha Rápida" }
                    }
                }
            },
            hi: {
                translation: {
                    common: { "title": "Spark.E न्यूरल ट्यूटर", "welcome": "नमस्ते! मैं Spark.E हूँ, आपका यूनिवर्सल लर्निंग नोड।", "placeholder": "Spark.E से पूछें...", "send": "भेजें", "listen": "आवाज़", "stop_listen": "रुकें", "mute": "मौन", "unmute": "चालू करें" },
                    nav: { "dashboard": "डैशबोर्ड", "quiz": "क्विज़ लैब", "flashcards": "फ्लैशकार्ड", "pdf": "PDF लैब", "chatbot": "Spark.E ट्यूटर", "progress": "प्रगति", "roadmap": "रोडमार्क" },
                    dashboard: { "title": "मिशन कंट्रोल", "welcome": "स्वागत है, {{name}}। न्यूरल स्ट्रीम एक्सेस हो रहा है...", "stats": { "uptime": "सिस्टम अपटाइम", "index": "न्यूरल इंडेक्स", "modules": "मॉड्यूल", "efficiency": "रिटेंशन" } },
                    tutor: {
                        "tabs": { "chat": "चैट", "essay": "ग्रेड", "solver": "हल करें", "status": "स्थिति" },
                        "mastery": "मास्टरी इंडेक्स",
                        "processing": "न्यूरल प्रोसेसिंग...",
                        "source": "स्रोत",
                        "scan_active": "स्पेक्ट्रल स्कैन सक्रिय",
                        "image_ready": "छवि विश्लेषण के लिए तैयार",
                        "new_analysis": "नया विश्लेषण",
                        "cognitive_perf": "संज्ञानात्मक प्रदर्शन",
                        "grade": "ग्रेड",
                        "compliance": "न्यूरल अनुपालन स्कोर",
                        "merits": "संरचनात्मक गुण",
                        "errors": "त्रुटि समूह",
                        "conclusion": "अंतिम निष्कर्ष",
                        "essay": { "title": "अकादमिक निबंध स्कैन", "subtitle": "रुब्रिक-आधारित न्यूरल मूल्यांकन", "placeholder": "यहाँ अपना निबंध पेस्ट करें...", "button": "ग्रेडिंग शुरू करें" },
                        "solver": { "title": "क्वांटम लॉजिक इंजन", "subtitle": "चरण-दर-चरण न्यूरल व्युत्पत्ति", "placeholder": "उदाहरण: x के लिए हल करें...", "button": "हल शुरू करें" },
                        "config": { "title": "न्यूरल कॉन्फ़िग", "personality": "व्यक्तित्व", "depth": "उत्तर की गहराई", "framework_label": "फ्रेमवर्क विशेषज्ञता", "framework_hint": "विशिष्ट पारिस्थितिक तंत्र के लिए तंत्रिका प्रतिक्रियाओं को तैयार करता है" }
                    },
                    roadmap: {
                        header: { nav: "न्यूरल नेविगेशन", title_part1: "ज्ञान की", title_part2: "मानचित्रण" },
                        tabs: { browse: "रास्ते खोजें", architect: "AI आर्किटेक्ट" },
                        filter: { role: "भूमिका आधारित", skill: "कौशल आधारित", framework: "फ्रेमवर्क" },
                        search_placeholder: "रास्ते खोजें (जैसे React, DevOps)...",
                        card: { new: "नया" },
                        viewer: { close: "मैप बंद करें", progress: "{{count}} मॉड्यूल में महारत हासिल", hint: "प्रगति ट्रैक करने के लिए नोड्स पर क्लिक करें" },
                        generator: { title: "कस्टम ज्ञान प्रकट करें", subtitle: "हमारे न्यूरल इंजन को एक कस्टम रास्ता बनाने दें...", placeholder: "जैसे क्वांटम कंप्यूटिंग, रस्ट...", history: "आपकी अभिव्यक्तियाँ", quick_pick: "त्वरित चयन" }
                    }
                }
            },
            mr: {
                translation: {
                    common: { "title": "Spark.E न्यूरल ट्यूटर", "welcome": "नमस्कार! मी Spark.E आहे, तुमचा युनिव्हर्सल लर्निंग नोड.", "placeholder": "Spark.E ला विचारा...", "send": "पाठवा", "listen": "व्हॉइस", "stop_listen": "थांबा", "mute": "म्यूट", "unmute": "अनम्यूट" },
                    nav: { "dashboard": "डॅशबोर्ड", "quiz": "क्विझ लॅब", "flashcards": "फ्लॅशकार्ड्स", "pdf": "PDF लॅब", "chatbot": "Spark.E ट्यूटर", "progress": "प्रगती", "roadmap": "रोडमार्क" },
                    dashboard: { "title": "मिशन कंट्रोल", "welcome": "स्वागत आहे, {{name}}. न्यूरल स्ट्रीम ऍक्सेस करत आहे...", "stats": { "uptime": "सिस्टम अपटाइम", "index": "न्यूरल इंडेक्स", "modules": "मॉड्यूल्स", "efficiency": "रिटेंशन" } },
                    tutor: {
                        "tabs": { "chat": "चॅट", "essay": "गुणदान", "solver": "सोडवा", "status": "स्थिती" },
                        "mastery": "प्राविण्य निर्देशांक",
                        "processing": "न्यूरल प्रोसेसिंग...",
                        "source": "स्रोत",
                        "scan_active": "स्पेक्ट्रल स्कॅन सक्रिय",
                        "image_ready": "प्रतिमा विश्लेषणासाठी तयार",
                        "new_analysis": "नवीन विश्लेषण",
                        "cognitive_perf": "संज्ञानात्मक कार्यक्षमता",
                        "grade": "ग्रेड",
                        "compliance": "न्यूरल अनुपालन स्कोअर",
                        "merits": "रचनात्मक गुण",
                        "errors": "त्रुटि गट",
                        "conclusion": "अंतिम निष्कर्ष",
                        "essay": { "title": "शैक्षणिक निबंध स्कॅन", "subtitle": "न्यूरल मूल्यांकन", "placeholder": "तुमचा निबंध येथे पेस्ट करा...", "button": "गुणदान सुरू करा" },
                        "solver": { "title": "क्वांटम लॉजिक इंजिन", "subtitle": "टप्प्याटप्प्याने माहिती", "placeholder": "उदाहरण: x ची किंमत काढा...", "button": "सुरुवात करा" },
                        "config": { "title": "न्यूरल कॉन्फ़िग", "personality": "व्यक्तिमत्व", "depth": "उत्तराची खोली", "framework_label": "फ्रेमवर्क स्पेशलायझेशन", "framework_hint": "विशिष्ट इकोसिस्टमसाठी प्रतिसाद तयार करतो" }
                    },
                    roadmap: {
                        header: { nav: "न्यूरल नेव्हिगेशन", title_part1: "ज्ञानाचे", title_part2: "नकाशेकाम" },
                        tabs: { browse: "मार्ग ब्राउझ करा", architect: "AI आर्किटेक्ट" },
                        filter: { role: "भूमिका आधारित", skill: "कौशल्य आधारित", framework: "फ्रेमवर्क्स" },
                        search_placeholder: "मार्ग शोधा (उदा. React, DevOps)...",
                        card: { new: "नवीन" },
                        viewer: { close: "नकाशा बंद करा", progress: "{{count}} मॉड्यूल्स पूर्ण", hint: "प्रगतीचा मागोवा घेण्यासाठी नोड्सवर क्लिक करा" },
                        generator: { title: "सानुकूल ज्ञान प्रकट करा", subtitle: "आमच्या न्यूरल इंजिनला सानुकूल मार्ग तयार करू द्या...", placeholder: "उदा. क्वांटम कॉम्प्युटिंग, रस्ट...", history: "तुमची निर्मिती", quick_pick: "त्वरित निवड" }
                    }
                }
            },
            ja: {
                translation: {
                    common: { "title": "Spark.E ニューラルチューター", "welcome": "こんにちは！私はSpark.E、あなたのユニバーサル学習ノードです。", "placeholder": "Spark.Eに質問...", "send": "送信", "listen": "音声", "stop_listen": "停止", "mute": "消音", "unmute": "音量オン" },
                    nav: { "dashboard": "ダッシュボード", "quiz": "クイズラボ", "flashcards": "単語帳", "pdf": "PDFラボ", "chatbot": "Spark.Eチューター", "progress": "進捗", "roadmap": "ロードマップ" },
                    dashboard: { "title": "ミッションコントロール", "welcome": "おかえりなさい、{{name}}。ニューラルストリームに接続中...", "stats": { "uptime": "システム稼働時間", "index": "ニューラル指数", "modules": "モジュール", "efficiency": "定着率" } },
                    tutor: {
                        "tabs": { "chat": "チャット", "essay": "採点", "solver": "解決", "status": "状態" },
                        "mastery": "習熟度指数",
                        "processing": "ニューラル処理中...",
                        "source": "ソース",
                        "scan_active": "スペクトルスキャン有効",
                        "image_ready": "画像の解析準備完了",
                        "new_analysis": "新規解析",
                        "cognitive_perf": "認知パフォーマンス",
                        "grade": "採点",
                        "compliance": "ニューラルコンプライアンススコア",
                        "merits": "構造的長所",
                        "errors": "エラークラスター",
                        "conclusion": "最終結論",
                        "essay": { "title": "アカデミック論文スキャン", "subtitle": "評価基準に基づくニューラル評価", "placeholder": "論文をここに貼り付けてください...", "button": "採点を開始" },
                        "solver": { "title": "量子ロジックエンジン", "subtitle": "ステップバイステップの論理導出", "placeholder": "例: xを求める...", "button": "導出を開始" },
                        "config": { "title": "ニューラル設定", "personality": "パーソナリティ", "depth": "回答の深さ", "framework_label": "フレームワーク専門化", "framework_hint": "特定の構成案に合わせてニューラル応答を調整します" }
                    },
                    roadmap: {
                        header: { nav: "ニューラルナビゲーション", title_part1: "知識の", title_part2: "地図作成" },
                        tabs: { browse: "パスを閲覧", architect: "AIアーキテクト" },
                        filter: { role: "ロールベース", skill: "スキルベース", framework: "フレームワーク" },
                        search_placeholder: "パスを検索 (例: React, DevOps)...",
                        card: { new: "新規" },
                        viewer: { close: "マップを閉じる", progress: "{{count}} モジュール習得済み", hint: "ノードをクリックして進捗を確認" },
                        generator: { title: "カスタム知識を具現化", subtitle: "ニューラルエンジンにカスタムパスを設計させましょう...", placeholder: "例: 量子コンピューティング, Rust...", history: "あなたの具現化", quick_pick: "クイックピック" }
                    }
                }
            },
            ru: {
                translation: {
                    common: { "title": "Нейронный тьютор Spark.E", "welcome": "Приветствую! Я Spark.E, ваш универсальный узел обучения.", "placeholder": "Спросите Spark.E...", "send": "Отправить", "listen": "Голос", "stop_listen": "Стоп", "mute": "Тихо", "unmute": "Звук" },
                    nav: { "dashboard": "Панель", "quiz": "Квиз-лаб", "flashcards": "Карточки", "pdf": "PDF-лаб", "chatbot": "Тьютор Spark.E", "progress": "Прогресс", "roadmap": "План" },
                    dashboard: { "title": "Центр управления", "welcome": "С возвращением, {{name}}. Подключение к нейросетям...", "stats": { "uptime": "Аптайм системы", "index": "Нейроиндекс", "modules": "Модули", "efficiency": "Удержание" } },
                    tutor: {
                        "tabs": { "chat": "Чат", "essay": "Оценка", "solver": "Решение", "status": "Статус" },
                        "mastery": "Индекс мастерства",
                        "processing": "Нейронная обработка...",
                        "source": "Источник",
                        "scan_active": "Спектральное сканирование активно",
                        "image_ready": "Изображение готово к анализу",
                        "new_analysis": "Новый анализ",
                        "cognitive_perf": "Когнитивная производительность",
                        "grade": "Оценка",
                        "compliance": "Нейроиндекс соответствия",
                        "merits": "Структурные достоинства",
                        "errors": "Кластеры ошибок",
                        "conclusion": "Финальный вывод",
                        "essay": { "title": "Анализ академического эссе", "subtitle": "Нейронная оценка по критериям", "placeholder": "Вставьте ваше эссе здесь...", "button": "Начать оценивание" },
                        "solver": { "title": "Квантовый логический движок", "subtitle": "Пошаговый нейронный вывод", "placeholder": "Пример: Решить уравнение...", "button": "Начать решение" },
                        "config": { "title": "Нейронная конфигурация", "personality": "Личность", "depth": "Глубина ответа", "framework_label": "Специализация на фреймворке", "framework_hint": "Адаптирует ответы под конкретные экосистемы" }
                    },
                    roadmap: {
                        header: { nav: "Нейронная навигация", title_part1: "Картография", title_part2: "Знаний" },
                        tabs: { browse: "Обзор путей", architect: "AI Архитектор" },
                        filter: { role: "По ролям", skill: "По навыкам", framework: "Фреймворки" },
                        search_placeholder: "Поиск путей (напр., React, DevOps)...",
                        card: { new: "Новый" },
                        viewer: { close: "Закрыть карту", progress: "Освоено модулей: {{count}}", hint: "Нажимайте на узлы, чтобы отслеживать прогресс" },
                        generator: { title: "Создайте свой путь знаний", subtitle: "Позвольте нашему нейронному движку спроектировать ваш путь...", placeholder: "Напр., квантовые вычисления, Rust...", history: "Ваши творения", quick_pick: "Быстрый выбор" }
                    }
                }
            },
            zh: {
                translation: {
                    common: { "title": "Spark.E 神经导师", "welcome": "你好！我是 Spark.E，你的通用学习节点。", "placeholder": "向 Spark.E 提问...", "send": "发送", "listen": "语音", "stop_listen": "停止", "mute": "静音", "unmute": "开启声音" },
                    nav: { "dashboard": "控制面板", "quiz": "测验实验室", "flashcards": "闪卡", "pdf": "PDF 实验室", "chatbot": "Spark.E 导师", "progress": "进度", "roadmap": "路线图" },
                    dashboard: { "title": "任务控制中心", "welcome": "欢迎回来，{{name}}。正在访问神经流...", "stats": { "uptime": "系统运行时间", "index": "神经指数", "modules": "同步模块", "efficiency": "记忆效率" } },
                    tutor: {
                        "tabs": { "chat": "对话", "essay": "评分", "solver": "求解", "status": "状态" },
                        "mastery": "掌握指数",
                        "processing": "神经处理中...",
                        "source": "来源",
                        "scan_active": "光谱扫描已激活",
                        "image_ready": "图像已准备好进行分析",
                        "new_analysis": "新的分析",
                        "cognitive_perf": "认知表现",
                        "grade": "评分",
                        "compliance": "神经合规评分",
                        "merits": "结构优点",
                        "errors": "错误簇",
                        "conclusion": "最终结论",
                        "essay": { "title": "学术论文扫描", "subtitle": "基于量表的神经评估", "placeholder": "在此粘贴您的文章...", "button": "开始神经评分" },
                        "solver": { "title": "量子逻辑引擎", "subtitle": "步进式神经推导", "placeholder": "例如：求解 x...", "button": "开始推导" },
                        "config": { "title": "神经配置", "personality": "人格特征", "depth": "响应深度", "framework_label": "框架专业化", "framework_hint": "针对特定生态系统定制神经响应" }
                    },
                    roadmap: {
                        header: { nav: "神经导航", title_part1: "知识", title_part2: "图谱设计" },
                        tabs: { browse: "浏览路径", architect: "AI 架构师" },
                        filter: { role: "基于角色", skill: "基于技能", framework: "框架" },
                        search_placeholder: "搜索路径 (例如：React, DevOps)...",
                        card: { new: "新" },
                        viewer: { close: "关闭地图", progress: "已掌握 {{count}} 个模块", hint: "点击节点以跟踪进度" },
                        generator: { title: "开启定制知识路径", subtitle: "让我们的神经引擎为你架构定制路径...", placeholder: "例如：量子计算, Rust...", history: "你的生成记录", quick_pick: "快速选择" }
                    }
                }
            },
            it: { translation: { common: { "title": "Spark.E Tutor Neurale" }, nav: { "chatbot": "Spark.E Tutor" }, tutor: { "processing": "Elaborazione Neurale..." } } },
            ko: { translation: { common: { "title": "Spark.E 뉴럴 튜터" }, nav: { "chatbot": "Spark.E 튜터" }, tutor: { "processing": "신경망 처리 중..." } } },
            ar: { translation: { common: { "title": "Spark.E معلم عصبي" }, nav: { "chatbot": "Spark.E معلم" }, tutor: { "processing": "معالجة عصبية..." } } },
            ta: { translation: { common: { "title": "Spark.E நியூரல் டியூட்டர்" }, nav: { "chatbot": "Spark.E டியூட்டர்" }, tutor: { "processing": "நரம்பியல் செயலாக்கம்..." } } },
            te: { translation: { common: { "title": "Spark.E న్యూరల్ ట్యూటర్" }, nav: { "chatbot": "Spark.E ట్యూटर" }, tutor: { "processing": "నరాల ప్రాసెసింగ్..." } } },
            bn: { translation: { common: { "title": "Spark.E নিউরাল টিউটর" }, nav: { "chatbot": "Spark.E টিউটর" }, tutor: { "processing": "নিউরন প্রসেসিং..." } } }
        }
    });

export default i18n;

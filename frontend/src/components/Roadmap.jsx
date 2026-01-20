import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Roadmap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [completedSteps, setCompletedSteps] = useState(new Set());

    const roadmapData = location.state?.roadmap || {
        topic: "React Developer Path",
        milestones: [
            { id: 1, title: "Javascript Fundamentals", description: "Master ES6+ features, closures, and async patterns.", estimatedTime: "2 Weeks" },
            { id: 2, title: "React Basics", description: "Components, JSX, and Props/State management.", estimatedTime: "1 Week" },
            { id: 3, title: "Hooks & Effect", description: "Deep dive into useEffect, useContext, and custom hooks.", estimatedTime: "1 Week" }
        ]
    };

    // Load initial completed steps from localStorage
    useEffect(() => {
        const savedRoadmaps = JSON.parse(localStorage.getItem('dyano_roadmaps') || '[]');
        const currentRM = savedRoadmaps.find(rm => rm.topic === roadmapData.topic);
        if (currentRM && currentRM.completedSteps) {
            setCompletedSteps(new Set(currentRM.completedSteps));
        }

        // Save the roadmap itself if it doesn't exist
        if (!currentRM && location.state?.roadmap) {
            const updatedRoadmaps = [{ topic: roadmapData.topic, data: roadmapData, completedSteps: [] }, ...savedRoadmaps].slice(0, 10);
            localStorage.setItem('dyano_roadmaps', JSON.stringify(updatedRoadmaps));
        }
    }, [roadmapData.topic]);

    // Save progress whenever it changes
    useEffect(() => {
        const savedRoadmaps = JSON.parse(localStorage.getItem('dyano_roadmaps') || '[]');
        const updatedRoadmaps = savedRoadmaps.map(rm => {
            if (rm.topic === roadmapData.topic) {
                return { ...rm, completedSteps: Array.from(completedSteps) };
            }
            return rm;
        });
        localStorage.setItem('dyano_roadmaps', JSON.stringify(updatedRoadmaps));
    }, [completedSteps, roadmapData.topic]);

    const toggleStep = (id) => {
        const newSet = new Set(completedSteps);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setCompletedSteps(newSet);
    };

    const focusOnTopic = (topic) => {
        navigate('/learn', { state: { initialTopic: topic } });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <Link to="/learn" className="text-blue-600 hover:text-blue-800 font-bold mb-4 inline-block">
                        ← Back to Explorer
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Learning Path: <span className="text-blue-600">{roadmapData.topic}</span>
                    </h1>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(completedSteps.size / roadmapData.milestones.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-500">
                            {Math.round((completedSteps.size / roadmapData.milestones.length) * 100)}% Complete
                        </span>
                    </div>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full hidden md:block"></div>

                    <div className="space-y-8">
                        {roadmapData.milestones.map((step, index) => (
                            <div key={step.id} className="relative flex flex-col md:flex-row gap-8 items-start">
                                {/* Step Indicator */}
                                <div
                                    onClick={() => toggleStep(step.id)}
                                    className={`z-10 w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${completedSteps.has(step.id)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                >
                                    {completedSteps.has(step.id) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-xl font-black">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 bg-white p-8 rounded-3xl border-2 transition-all duration-300 shadow-sm ${completedSteps.has(step.id) ? 'border-blue-100 opacity-60' : 'border-gray-50 hover:border-blue-200 hover:shadow-xl'
                                    }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                                        <span className="bg-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                            {step.estimatedTime}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => focusOnTopic(step.title)}
                                            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Explain Topic
                                        </button>
                                        <button
                                            onClick={() => toggleStep(step.id)}
                                            className="px-6 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold text-sm hover:border-gray-900 hover:text-gray-900 transition-all"
                                        >
                                            {completedSteps.has(step.id) ? 'Mark Incomplete' : 'Mark as Done'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 bg-blue-600 rounded-3xl p-10 text-white text-center shadow-2xl">
                    <h2 className="text-2xl font-black mb-2">Keep up the great work!</h2>
                    <p className="opacity-80 mb-8 font-medium">The secret of getting ahead is getting started.</p>
                    <Link to="/learn" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                        Study Another Goal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;

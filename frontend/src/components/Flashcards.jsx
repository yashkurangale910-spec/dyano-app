import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Flashcards = () => {
    const location = useLocation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const defaultCards = [
        { front: "Photosynthesis", back: "The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water." },
        { front: "Mitochondria", back: "An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur." },
        { front: "Inertia", back: "A property of matter by which it continues in its existing state of rest or uniform motion in a straight line, unless that state is changed by an external force." }
    ];

    const cards = location.state?.flashcards || defaultCards;
    const topic = location.state?.topic || "Study Deck";

    // Persist deck to library
    useEffect(() => {
        if (location.state?.flashcards) {
            const savedDecks = JSON.parse(localStorage.getItem('dyano_flashcards') || '[]');
            const deckExists = savedDecks.some(deck => deck.topic === topic);

            if (!deckExists) {
                const newDeck = { topic: topic, cards: cards, createdAt: new Date().toISOString() };
                const updatedDecks = [newDeck, ...savedDecks].slice(0, 10);
                localStorage.setItem('dyano_flashcards', JSON.stringify(updatedDecks));

                // Update stats
                const stats = JSON.parse(localStorage.getItem('dyano_stats') || '{"quizzesCompleted":0,"flashcardsCreated":0,"roadmapsStarted":0,"streak":1}');
                stats.flashcardsCreated += 1;
                localStorage.setItem('dyano_stats', JSON.stringify(stats));
            }
        }
    }, [cards, topic]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
            <div className="max-w-4xl w-full text-center mb-12">
                <Link to="/learn" className="text-blue-600 hover:text-blue-800 font-bold mb-4 inline-block">
                    ← Back to Learn
                </Link>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Flashcards: {topic}</h1>
                <p className="text-gray-500 font-medium">Card {currentIndex + 1} of {cards.length}</p>
            </div>

            <div className="relative w-full max-w-lg aspect-[4/3] group perspective-1000">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full h-full duration-500 preserve-3d cursor-pointer shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-gray-100">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Question / Term</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                            {cards[currentIndex].front}
                        </h2>
                        <div className="mt-8 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-blue-700 shadow-inner">
                        <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Answer / Definition</span>
                        <p className="text-xl md:text-2xl font-medium text-white text-center leading-relaxed">
                            {cards[currentIndex].back}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center gap-8">
                <button
                    onClick={handlePrev}
                    className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow text-gray-600 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex gap-2">
                    {cards.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow text-gray-600 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}} />
        </div>
    );
};

export default Flashcards;

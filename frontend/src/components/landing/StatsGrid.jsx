export default function StatsGrid({ stats }) {
    return (
        <div className="py-40 bg-white/[0.02] border-t border-b border-white/5">
            <div className="container-cosmic">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat) => (
                        <div key={stat.id} className="text-left group">
                            <div className="text-7xl md:text-8xl font-display font-light text-white mb-2 tracking-tighter group-hover:text-cosmic-cyan transition-colors duration-700">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-[1px] bg-cosmic-pink"></div>
                                <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

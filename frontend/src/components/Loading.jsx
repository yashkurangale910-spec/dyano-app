const Loading = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const spinnerSize = sizes[size] || sizes.md;

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${spinnerSize} relative`}>
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            {text && (
                <p className="text-gray-600 font-medium animate-pulse">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                <LoadingSpinner />
            </div>
        );
    }

    return <LoadingSpinner />;
};

export default Loading;

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-10 font-mono overflow-auto">
                    <h1 className="text-3xl text-red-500 mb-4">Something went wrong.</h1>
                    <h2 className="text-xl text-gray-300 mb-2">{this.state.error && this.state.error.toString()}</h2>
                    <details className="whitespace-pre-wrap text-sm text-gray-500">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        className="mt-6 px-4 py-2 bg-white text-black rounded"
                        onClick={() => window.location.reload()}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

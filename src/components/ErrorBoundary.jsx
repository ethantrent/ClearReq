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
    this.setState({ error, errorInfo });
    // Optionally log error to an external service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-16 p-8 bg-red-50 border border-red-200 rounded-xl text-red-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
          <p className="mb-4">An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="whitespace-pre-wrap text-xs bg-red-100 p-2 rounded">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 
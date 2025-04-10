import React from "react";
import icons from "../../assets/icons/ToastIcons";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#2916BA]">
          <div className="bg-white shadow-xl p-8 text-center">
              {icons.alert}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong.
            </h2>
            <p className="text-gray-600 mb-4">
            We've encountered an unexpected issue . Please try again later.
            </p>
            {this.state.error && (
              <details className="text-left mt-4 border border-gray-300  p-4 bg-gray-50 overflow-auto max-h-48">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo &&
                    `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

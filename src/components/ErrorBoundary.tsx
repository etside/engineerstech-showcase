import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="container-tight py-20 text-center">
          <h2 className="display-3 mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gradient text-sm"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
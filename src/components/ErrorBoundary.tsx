import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-32 items-center justify-center rounded-3xl border border-red-900/50 bg-red-950/20 p-6">
            <div className="text-center">
              <p className="text-sm font-semibold text-red-400">Bir hata oluştu</p>
              <p className="mt-1 text-xs text-slate-500">{this.state.message}</p>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="mt-4 rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700"
              >
                Tekrar dene
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

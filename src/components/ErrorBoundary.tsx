import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // 5초 후 자동으로 상태 리셋 시도
    setTimeout(() => {
      this.setState({ hasError: false, error: undefined });
    }, 5000);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-6 max-w-sm">
            <div className="text-red-500 text-xl mb-4">⚠️ 오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4 text-sm">
              잠시 후 자동으로 복구를 시도합니다.<br/>
              문제가 계속되면 새로고침해 주세요.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
              >
                다시 시도
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
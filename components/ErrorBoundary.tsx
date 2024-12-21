import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlueScreen404 from "./BlueScreen404";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: any[];
  customClassName?: string;
  showErrorDetails?: boolean;
  theme?: "light" | "dark";
  reportError?: (error: Error, errorInfo: ErrorInfo) => Promise<void>;
  maxRetries?: number;
  customLogger?: (error: Error, errorInfo: ErrorInfo) => void;
  language?: "en" | "zh";
  getSuggestion?: (error: Error) => string;
  useBlueScreen?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isReporting: boolean;
  retryCount: number;
  errorTime?: Date;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isReporting: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorTime: new Date() };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    if (this.props.customLogger) {
      this.props.customLogger(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError) {
      if (
        this.props.resetKeys &&
        JSON.stringify(prevProps.resetKeys) !==
          JSON.stringify(this.props.resetKeys)
      ) {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined,
          retryCount: 0,
        });
      }
    }
  }

  handleReportError = async () => {
    if (this.props.reportError && this.state.error && this.state.errorInfo) {
      this.setState({ isReporting: true });
      try {
        await this.props.reportError(this.state.error, this.state.errorInfo);
        alert(this.getTranslation("errorReported"));
      } catch (e) {
        alert(this.getTranslation("reportErrorFailed"));
      } finally {
        this.setState({ isReporting: false });
      }
    }
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    if (this.state.retryCount < maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      alert(this.getTranslation("maxRetriesReached"));
    }
  };

  handleClose = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
    });
  };

  getTranslation = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        errorOccurred: "Oops, an error occurred!",
        errorDetails: "View error details",
        retry: "Retry",
        reportError: "Report Error",
        errorReported: "Error reported successfully, thank you!",
        reportErrorFailed:
          "There was a problem reporting the error. Please try again later.",
        maxRetriesReached:
          "Maximum retry attempts reached. Please refresh the page.",
        errorTime: "Error occurred at:",
        close: "Close",
      },
      zh: {
        errorOccurred: "哎呀，出错了！",
        errorDetails: "查看错误详情",
        retry: "重试",
        reportError: "报告错误",
        errorReported: "错误已成功报告，谢谢！",
        reportErrorFailed: "报告错误时出现问题，请稍后再试。",
        maxRetriesReached: "已达到最大重试次数。请刷新页面。",
        errorTime: "错误发生时间：",
        close: "关闭",
      },
    };
    return translations[this.props.language || "en"][key] || key;
  };

  render(): ReactNode {
    const { children, useBlueScreen = true } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      if (useBlueScreen) {
        return (
          <BlueScreen404
            error={error}
            errorInfo={errorInfo}
            isErrorBoundary={true}
          />
        );
      }

      const { theme = "dark" } = this.props;
      const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
      const textColor = theme === "light" ? "text-gray-800" : "text-gray-200";

      const errorModal = (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            className={`error-boundary w-full max-w-md p-6 rounded-lg shadow-lg ${bgColor} ${textColor} ${
              this.props.customClassName || ""
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-4">
              {this.getTranslation("errorOccurred")}
            </h1>
            <p className="mb-4 text-lg">{this.state.error?.message}</p>
            {this.state.errorTime && (
              <p className="mb-4 text-sm">
                {this.getTranslation("errorTime")}{" "}
                {this.state.errorTime.toLocaleString()}
              </p>
            )}
            {this.props.showErrorDetails && (
              <details className="mt-4 mb-4">
                <summary className="cursor-pointer text-blue-500 hover:text-blue-600">
                  {this.getTranslation("errorDetails")}
                </summary>
                <pre
                  className={`mt-2 p-4 rounded overflow-x-auto ${
                    theme === "light" ? "bg-gray-100" : "bg-gray-700"
                  }`}
                >
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            {this.props.getSuggestion && this.state.error && (
              <p className="mb-4 text-lg font-semibold">
                {this.props.getSuggestion(this.state.error)}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <motion.button
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
              >
                {this.getTranslation("retry")} ({this.state.retryCount}/
                {this.props.maxRetries || 3})
              </motion.button>
              {this.props.reportError && (
                <motion.button
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                    this.state.isReporting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReportError}
                  disabled={this.state.isReporting}
                >
                  {this.state.isReporting
                    ? "..."
                    : this.getTranslation("reportError")}
                </motion.button>
              )}
              <motion.button
                className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleClose}
              >
                {this.getTranslation("close")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );

      return (
        <>
          {children}
          <AnimatePresence>{this.props.fallback || errorModal}</AnimatePresence>
        </>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

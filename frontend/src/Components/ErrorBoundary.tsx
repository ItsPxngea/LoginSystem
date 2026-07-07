import { Component } from "react";
import type { ErrorInfo } from "react";
import type { Props, State } from "../types/Errors.ts"



export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    }


    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                    <div className="error-card">
                        <div className="error-icon">⚠</div>
                        <h1 className="error-title">Something went wrong</h1>
                        <p className="error-message">An unexpected error has occurred. We are actively looking into it</p>

                        {import.meta.env.DEV && this.state.error && (
                            <pre className="error-details"> {this.state.error.message} </pre>
                        )}

                        <button className="error-btn" onClick={this.handleReset}>Go to home</button>
                    </div>
                </div>
            )
        }
        return this.props.children;
    }

}


"use client";
import * as React from "react";
import Loader from "./Loader";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-section container">
          <p>{this.props.fallback || "Something went wrong"}</p>
        </div>
      );
    }

    return (
      <React.Suspense fallback={<Loader />}>
        {this.props.children}
      </React.Suspense>
    );
  }
}

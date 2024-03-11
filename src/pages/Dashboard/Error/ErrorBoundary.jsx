import React, { useState } from "react";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  // Handle errors using useEffect
  React.useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    // Listen for uncaught errors
    window.addEventListener("error", handleError);

    // Clean up event listener
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Render a fallback UI if an error occurs
  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  // Otherwise, render the child components
  return children;
}

export default ErrorBoundary;

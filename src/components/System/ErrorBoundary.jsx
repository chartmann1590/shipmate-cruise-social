import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="app-error-state"><span className="eyebrow">ShipMate needs a reset</span><h1>That page hit rough water.</h1><p>Reload the app to reconnect your sailing data. Your saved profile and messages are safe in Firebase.</p><button onClick={() => window.location.reload()}>Reload ShipMate</button></div>;
  }
}

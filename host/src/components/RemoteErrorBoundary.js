import React from 'react';

export function RemoteUnavailable({ name }) {
  return <div className="loading">{name} temporarily unavailable</div>;
}

class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <RemoteUnavailable name={this.props.name} />;
    }

    return this.props.children;
  }
}

export default RemoteErrorBoundary;

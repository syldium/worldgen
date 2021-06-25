import React, { Component } from 'react';

interface NodeErrorBoundaryProps {
  name: string;
  children?: React.ReactNode;
}

export class NodeErrorBoundary extends Component<
  NodeErrorBoundaryProps,
  boolean
> {
  constructor(props: NodeErrorBoundaryProps) {
    super(props);
    this.state = false;
  }

  componentDidCatch(): void {
    this.setState(() => true);
  }

  render(): React.ReactNode {
    if (this.state) {
      return (
        <p>
          Error while rendering the <code>{this.props.name}</code> field! Check
          the browser console for more details.
        </p>
      );
    }
    return this.props.children;
  }
}

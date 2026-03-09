"use client";
import React from "react";
import { World } from "./ui/globe";
import { contactGlobeConfig, contactSampleArcs } from "./data/contactGlobeData";

class GlobeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 rounded-2xl border border-primary/20 bg-card/30" />
      );
    }

    return this.props.children;
  }
}

const ContactGlobe = () => {
  return (
    <GlobeErrorBoundary>
      <World globeConfig={contactGlobeConfig} data={contactSampleArcs} />
    </GlobeErrorBoundary>
  );
};

export default ContactGlobe;

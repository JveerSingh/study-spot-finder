import { useRef } from "react";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={scrollToDashboard} />
      <div ref={dashboardRef}>
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;

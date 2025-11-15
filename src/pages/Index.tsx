import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-primary-foreground tracking-tight" style={{ width: "100%", display: "flex", justifyContent: "center" }}>CampusFlow</h1>
          <Button
            variant="outline"
            onClick={handleSignOut}
            size="sm"
            className="border-primary-foreground/20 bg-background/90 text-foreground hover:bg-background hover:border-primary-foreground/30"
          >
            Sign Out
          </Button>
        </div>
      </header>
      <Dashboard />
    </div>
  );
};

export default Index;

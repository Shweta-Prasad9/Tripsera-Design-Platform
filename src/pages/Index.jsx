import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Palette, Zap, Download, Users, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-travel.jpg";
import editorMockup from "@/assets/editor-mockup.jpg";

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tripsera
            </h1>
          </div>

          <div className="flex gap-3">
            {user ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/gallery">My Gallery</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Link to="/auth?signup=true">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Create Stunning Travel Marketing Designs{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">in Minutes</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Empower your travel agency with ready-to-edit templates and an intuitive design editor.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-strong">
                  <Link to="/gallery">Start Designing</Link>
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToFeatures}>Learn More</Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src={editorMockup} alt="Tripsera Editor Interface" className="rounded-lg shadow-2xl border border-border/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Shine</h3>
            <p className="text-muted-foreground text-lg">Powerful features designed for travel agencies</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: "Pre-Designed Templates", desc: "Access hundreds of professionally crafted templates for every travel occasion", color: "primary" },
              { icon: Zap, title: "Drag & Drop Editor", desc: "Intuitive canvas editor lets you customize every element effortlessly", color: "secondary" },
              { icon: Download, title: "Export Anywhere", desc: "Download in PNG, JPG, or PDF format, ready for print or digital use", color: "primary" },
              { icon: Users, title: "Brand Consistency", desc: "Upload your logo and maintain consistent branding across all designs", color: "secondary" },
              { icon: Shield, title: "Cloud Storage", desc: "All your designs saved securely and accessible from anywhere", color: "primary" },
              { icon: Plane, title: "Travel-Focused", desc: "Templates specifically designed for travel agencies and tour operators", color: "secondary" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <Card key={title} className="border-border/50 bg-card hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${color}`} />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{title}</h4>
                  <p className="text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center text-white">
          
          <h3 className="text-3xl lg:text-5xl font-bold mb-6">
            Connect With Tripsera
          </h3>
      
          <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
            Have questions, feedback, or ideas? We’d love to hear from you.
          </p>
      
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Email Us</h4>
              <p className="text-white/90 text-sm">
                support@tripsera.com
              </p>
            </div>
      
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Follow Us</h4>
              <p className="text-white/90 text-sm">
                Instagram · Twitter · LinkedIn
              </p>
            </div>
      
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Help Center</h4>
              <p className="text-white/90 text-sm">
                FAQs & Documentation
              </p>
            </div>
      
          </div>
      
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="shadow-lg hover:scale-105 transition-transform"
          >
            <Link to="/auth">Get in Touch</Link>
          </Button>
      
        </div>
      </section>
      
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30 text-center text-muted-foreground">
        © 2026 Tripsera
      </footer>
    </div>
  );
};

export default Index;

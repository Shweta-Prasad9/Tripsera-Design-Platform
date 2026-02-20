import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plane, Search, LogOut, User, Layers, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAllTemplates } from "@/lib/templates";
import templateBeach from "@/assets/template-beach.jpg";
import templateMountain from "@/assets/template-mountain.jpg";
import templateCity from "@/assets/template-city.jpg";

const thumbnailMap = { "1": templateBeach, "2": templateMountain, "3": templateCity, "4": templateBeach, "5": templateMountain, "6": templateCity };

const TemplateCard = ({ template, onClick }) => {
  const thumbnail = thumbnailMap[template.id];
  return (
    <Card className="group cursor-pointer overflow-hidden border-border hover:border-primary/50 hover:shadow-[var(--shadow-strong)] transition-all duration-300" onClick={onClick}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col items-center gap-3">
            <Button className="bg-gradient-to-r from-primary to-secondary shadow-lg"><Sparkles className="w-4 h-4 mr-2" />Use Template</Button>
            <p className="text-primary-foreground text-sm font-medium">Click to customize</p>
          </div>
        </div>
        <Badge variant="secondary" className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground shadow-sm"><Layers className="w-3 h-3 mr-1" />{template.elementCount} elements</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-0.5">{template.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
        <Badge variant="outline" className="text-xs">{template.category}</Badge>
      </div>
    </Card>
  );
};

const Gallery = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const templates = getAllTemplates();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/auth"); else setUser(session.user); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { if (!session?.user) navigate("/auth"); else setUser(session.user); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => { await supabase.auth.signOut(); toast.success("Signed out successfully"); navigate("/"); };
  const handleTemplateClick = (templateId) => navigate(`/editor?template=${templateId}`);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><Plane className="w-8 h-8 text-primary" /><h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tripsera</h1></Link>
          <div className="flex gap-3 items-center">
            <Button asChild variant="outline"><Link to="/my-designs">My Designs</Link></Button>
            <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8"><h2 className="text-4xl font-bold mb-2">Template Gallery</h2><p className="text-muted-foreground text-lg">Pick a template and make it yours — every element is fully editable</p></div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}><TabsList>{categories.map((category) => (<TabsTrigger key={category} value={category} className="capitalize">{category === "all" ? "All" : category}</TabsTrigger>))}</TabsList></Tabs>
        </div>
        <Card className="group cursor-pointer overflow-hidden border-2 border-dashed border-primary/40 hover:border-primary hover:shadow-[var(--shadow-strong)] transition-all duration-300 mb-8" onClick={() => navigate("/editor")}>
          <div className="flex items-center gap-6 p-8">
            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Plus className="w-10 h-10 text-primary-foreground" /></div>
            <div className="flex-1"><h3 className="text-2xl font-bold mb-1">Start with Blank Canvas</h3><p className="text-muted-foreground">Create from scratch with complete creative freedom — 1080×1080 canvas</p></div>
          </div>
        </Card>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredTemplates.map((template) => (<TemplateCard key={template.id} template={template} onClick={() => handleTemplateClick(template.id)} />))}</div>
        {filteredTemplates.length === 0 && (<div className="text-center py-16"><p className="text-muted-foreground text-lg">No templates found matching your search</p></div>)}
      </div>
    </div>
  );
};

export default Gallery;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Plus, Trash2, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MyDesigns = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/auth"); else { setUser(session.user); loadDesigns(session.user.id); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { if (!session?.user) navigate("/auth"); else { setUser(session.user); loadDesigns(session.user.id); } });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDesigns = async (userId) => {
    try {
      const { data, error } = await supabase.from("designs").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      setDesigns(data || []);
    } catch (error) { toast.error("Failed to load designs"); } finally { setLoading(false); }
  };

  const handleDelete = async (designId) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    try {
      const { error } = await supabase.from("designs").delete().eq("id", designId);
      if (error) throw error;
      setDesigns(designs.filter((d) => d.id !== designId));
      toast.success("Design deleted");
    } catch (error) { toast.error("Failed to delete design"); }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); toast.success("Signed out successfully"); navigate("/"); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><Plane className="w-8 h-8 text-primary" /><h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tripsera</h1></Link>
          <div className="flex gap-3 items-center">
            <Button asChild variant="outline"><Link to="/gallery">Templates</Link></Button>
            <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div><h2 className="text-4xl font-bold mb-2">My Designs</h2><p className="text-muted-foreground text-lg">All your saved designs in one place</p></div>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary"><Link to="/gallery"><Plus className="w-4 h-4 mr-2" />New Design</Link></Button>
        </div>
        {loading ? (<div className="text-center py-16"><p className="text-muted-foreground">Loading designs...</p></div>) : designs.length === 0 ? (
          <div className="text-center py-16"><p className="text-muted-foreground text-lg mb-4">No designs yet</p><Button asChild><Link to="/gallery">Create Your First Design</Link></Button></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card key={design.id} className="group overflow-hidden border-border hover:shadow-card transition-all duration-300">
                <div className="aspect-square bg-muted flex items-center justify-center"><p className="text-muted-foreground">Design Preview</p></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1"><h3 className="font-semibold text-lg mb-1">{design.name}</h3><p className="text-sm text-muted-foreground">{new Date(design.created_at).toLocaleDateString()}</p></div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(design.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDesigns;

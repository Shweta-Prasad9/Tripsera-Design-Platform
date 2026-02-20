import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  agencyName: z.string().trim().min(2, { message: "Agency name must be at least 2 characters" }).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ email: "", password: "", agencyName: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); navigate("/gallery"); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); navigate("/gallery"); }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = authSchema.parse(signInData);
      const { error } = await supabase.auth.signInWithPassword({ email: validated.email, password: validated.password });
      if (error) throw error;
      toast.success("Welcome back!");
    } catch (error) {
      if (error instanceof z.ZodError) { toast.error(error.errors[0].message); }
      else { toast.error(error.message || "Failed to sign in"); }
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = authSchema.parse(signUpData);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: validated.email, password: validated.password,
        options: { emailRedirectTo: redirectUrl, data: { agency_name: validated.agencyName || "My Agency" } },
      });
      if (error) throw error;
      toast.success("Account created! Redirecting...");
    } catch (error) {
      if (error instanceof z.ZodError) { toast.error(error.errors[0].message); }
      else { toast.error(error.message || "Failed to sign up"); }
    } finally { setLoading(false); }
  };

  const defaultTab = searchParams.get("signup") === "true" ? "signup" : "signin";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Plane className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tripsera</h1>
          </Link>
          <p className="text-muted-foreground">Design platform for travel agencies</p>
        </div>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <form onSubmit={handleSignIn}>
                <CardHeader><CardTitle>Welcome Back</CardTitle><CardDescription>Sign in to access your designs</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="signin-email">Email</Label><Input id="signin-email" type="email" placeholder="your@email.com" value={signInData.email} onChange={(e) => setSignInData({ ...signInData, email: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="signin-password">Password</Label><Input id="signin-password" type="password" placeholder="••••••••" value={signInData.password} onChange={(e) => setSignInData({ ...signInData, password: e.target.value })} required /></div>
                </CardContent>
                <CardFooter><Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Button></CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <form onSubmit={handleSignUp}>
                <CardHeader><CardTitle>Create Account</CardTitle><CardDescription>Get started with Tripsera today</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="signup-agency">Agency Name</Label><Input id="signup-agency" type="text" placeholder="Your Travel Agency" value={signUpData.agencyName} onChange={(e) => setSignUpData({ ...signUpData, agencyName: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="signup-email">Email</Label><Input id="signup-email" type="email" placeholder="your@email.com" value={signUpData.email} onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="signup-password">Password</Label><Input id="signup-password" type="password" placeholder="••••••••" value={signUpData.password} onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} required /></div>
                </CardContent>
                <CardFooter><Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</Button></CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="text-center mt-6"><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to Home</Link></div>
      </div>
    </div>
  );
};

export default Auth;

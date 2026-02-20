import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Canvas as FabricCanvas } from "fabric";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { DesignCanvas } from "@/components/editor/DesignCanvas";
import { RightSidebar } from "@/components/editor/RightSidebar";
import { Toolbar } from "@/components/editor/Toolbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { getTemplateById } from "@/lib/templates";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const [user, setUser] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [designName, setDesignName] = useState("Untitled Design");
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [templateData, setTemplateData] = useState(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(!!templateId);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (!session?.user) navigate("/auth"); else setUser(session.user); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { if (!session?.user) navigate("/auth"); else setUser(session.user); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (templateId) {
      setIsLoadingTemplate(true);
      const template = getTemplateById(templateId);
      if (template) { setTemplateData(template.canvasData); setDesignName(template.name); toast.success(`Template "${template.name}" loaded — all elements are editable!`); }
      else { toast.error("Template not found"); setTemplateData(null); }
    } else { setTemplateData(null); setDesignName("Untitled Design"); }
  }, [templateId]);

  useEffect(() => {
    if (canvas && (templateData || !templateId)) {
      const t = setTimeout(() => setIsLoadingTemplate(false), 400);
      return () => clearTimeout(t);
    }
  }, [canvas, templateData, templateId]);

  useEffect(() => {
    if (!canvas) return;
    const handleSelection = () => { const active = canvas.getActiveObject(); setSelectedObject(active || null); };
    const saveHistory = () => {
      const json = canvas.toJSON();
      const history = canvas._historyUndo || [];
      history.push(json);
      if (history.length > 20) history.shift();
      canvas._historyUndo = history;
      canvas._historyRedo = [];
    };
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedObject(null));
    canvas.on("object:modified", saveHistory);
    canvas.on("object:added", saveHistory);
    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
      canvas.off("object:modified", saveHistory);
      canvas.off("object:added", saveHistory);
    };
  }, [canvas]);

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {isLoadingTemplate && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 animate-fade-in"><Loader2 className="w-8 h-8 text-primary animate-spin" /><p className="text-muted-foreground font-medium">Loading template…</p></div>
        </div>
      )}
      <Toolbar canvas={canvas} designName={designName} setDesignName={setDesignName} user={user} showGrid={showGrid} setShowGrid={setShowGrid} zoom={zoom} setZoom={setZoom} />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}><LeftSidebar canvas={canvas} /></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={40}><DesignCanvas setCanvas={setCanvas} canvas={canvas} showGrid={showGrid} zoom={zoom} templateData={templateData} /></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}><RightSidebar canvas={canvas} selectedObject={selectedObject} /></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;

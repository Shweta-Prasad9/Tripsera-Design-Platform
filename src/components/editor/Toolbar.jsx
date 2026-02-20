import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Save, Download, ArrowLeft, Undo, Redo, ZoomIn, ZoomOut, Grid3x3, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Toolbar = ({ canvas, designName, setDesignName, user, showGrid, setShowGrid, zoom, setZoom }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleUndo = () => {
    if (!canvas) return;
    const history = canvas._historyUndo || [];
    if (history.length > 0) {
      const currentState = canvas.toJSON();
      const historyRedo = canvas._historyRedo || [];
      historyRedo.push(currentState);
      canvas._historyRedo = historyRedo;
      const previousState = history.pop();
      canvas._historyUndo = history;
      canvas.loadFromJSON(previousState, () => { canvas.renderAll(); toast.success("Undo successful"); });
    } else { toast.info("Nothing to undo"); }
  };

  const handleRedo = () => {
    if (!canvas) return;
    const history = canvas._historyRedo || [];
    if (history.length > 0) {
      const currentState = canvas.toJSON();
      const historyUndo = canvas._historyUndo || [];
      historyUndo.push(currentState);
      canvas._historyUndo = historyUndo;
      const nextState = history.pop();
      canvas._historyRedo = history;
      canvas.loadFromJSON(nextState, () => { canvas.renderAll(); toast.success("Redo successful"); });
    } else { toast.info("Nothing to redo"); }
  };

  const handleSave = async () => {
    if (!canvas || !user) return;
    try {
      const canvasData = canvas.toJSON();
      const thumbnail = canvas.toDataURL({ format: "png", quality: 0.5, multiplier: 1 });
      const { error } = await supabase.from("designs").insert({ user_id: user.id, name: designName, canvas_data: canvasData, thumbnail_url: thumbnail, width: 1080, height: 1080 });
      if (error) throw error;
      toast.success("Design saved successfully!");
    } catch (error) { toast.error(error.message || "Failed to save design"); }
  };

  const handleExport = (format) => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: format === "pdf" ? "png" : format, quality: 1, multiplier: 2 });
    const link = document.createElement("a");
    link.download = `${designName}.${format}`;
    link.href = dataURL;
    link.click();
    toast.success(`Design exported as ${format.toUpperCase()}!`);
  };

  const handleZoomIn = () => { if (!canvas) return; const newZoom = Math.min(zoom + 0.1, 3); setZoom(newZoom); canvas.setZoom(newZoom); canvas.renderAll(); };
  const handleZoomOut = () => { if (!canvas) return; const newZoom = Math.max(zoom - 0.1, 0.1); setZoom(newZoom); canvas.setZoom(newZoom); canvas.renderAll(); };
  const handleResetZoom = () => { if (!canvas) return; setZoom(1); canvas.setZoom(1); canvas.renderAll(); };

  return (
    <>
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon"><Link to="/gallery"><ArrowLeft className="w-5 h-5" /></Link></Button>
            <Link to="/" className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tripsera</h1>
            </Link>
            <Input value={designName} onChange={(e) => setDesignName(e.target.value)} className="max-w-xs" placeholder="Design name" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} title="Undo"><Undo className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} title="Redo"><Redo className="w-4 h-4" /></Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out"><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleResetZoom} title="Reset Zoom">{Math.round(zoom * 100)}%</Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In"><ZoomIn className="w-4 h-4" /></Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant={showGrid ? "secondary" : "ghost"} size="icon" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid"><Grid3x3 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setShowPreview(true)} title="Preview"><Eye className="w-4 h-4" /></Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="outline" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
            <Button onClick={() => handleExport("png")} className="bg-gradient-to-r from-primary to-secondary"><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        </div>
      </nav>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Preview - {designName}</DialogTitle></DialogHeader>
          <div className="flex justify-center bg-muted/20 p-8 rounded-lg">
            {canvas && <img src={canvas.toDataURL({ format: "png", quality: 1, multiplier: 1 })} alt="Design preview" className="max-w-full max-h-[70vh] rounded-lg shadow-strong" />}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button onClick={() => handleExport("png")}><Download className="w-4 h-4 mr-2" />Export PNG</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

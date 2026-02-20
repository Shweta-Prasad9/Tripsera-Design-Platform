import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";

export const LayerPanel = ({ canvas }) => {
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!canvas) return;
    const updateLayers = () => {
      const allObjects = canvas.getObjects();
      setObjects([...allObjects]);
      const active = canvas.getActiveObject();
      setSelectedId(active?.__corner ? null : active?.toString() || null);
    };
    updateLayers();
    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    canvas.on("selection:created", updateLayers);
    canvas.on("selection:updated", updateLayers);
    canvas.on("selection:cleared", updateLayers);
    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
      canvas.off("selection:created", updateLayers);
      canvas.off("selection:updated", updateLayers);
      canvas.off("selection:cleared", updateLayers);
    };
  }, [canvas]);

  const getLayerName = (obj) => {
    if (obj.type === "i-text") return `Text: ${obj.text?.substring(0, 20) || "Empty"}`;
    if (obj.type === "image") return "Image";
    if (obj.type === "rect") return "Rectangle";
    if (obj.type === "circle") return "Circle";
    if (obj.type === "triangle") return "Triangle";
    return obj.type || "Object";
  };

  const selectLayer = (obj) => { if (!canvas) return; canvas.setActiveObject(obj); canvas.renderAll(); setSelectedId(obj.toString()); };
  const toggleVisibility = (obj) => { if (!canvas) return; obj.set("visible", !obj.visible); canvas.renderAll(); setObjects([...canvas.getObjects()]); };
  const toggleLock = (obj) => { if (!canvas) return; obj.set("selectable", !obj.selectable); obj.set("evented", !obj.evented); canvas.renderAll(); setObjects([...canvas.getObjects()]); };
  const duplicateLayer = (obj) => { if (!canvas) return; obj.clone((cloned) => { cloned.set({ left: (obj.left || 0) + 10, top: (obj.top || 0) + 10 }); canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll(); toast.success("Layer duplicated"); }); };
  const deleteLayer = (obj) => { if (!canvas) return; canvas.remove(obj); canvas.renderAll(); toast.success("Layer deleted"); };
  const moveUp = (obj) => { if (!canvas) return; const objs = canvas.getObjects(); const index = objs.indexOf(obj); if (index < objs.length - 1) { canvas.remove(obj); canvas.insertAt(index + 1, obj); canvas.renderAll(); setObjects([...canvas.getObjects()]); } };
  const moveDown = (obj) => { if (!canvas) return; const objs = canvas.getObjects(); const index = objs.indexOf(obj); if (index > 0) { canvas.remove(obj); canvas.insertAt(index - 1, obj); canvas.renderAll(); setObjects([...canvas.getObjects()]); } };

  return (
    <div className="space-y-2">
      {objects.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p className="text-sm">No layers yet</p>
          <p className="text-xs mt-1">Add elements to see them here</p>
        </div>
      )}
      {objects.slice().reverse().map((obj, index) => (
        <div key={obj.toString() + index} className={`group border rounded-lg p-3 transition-all ${selectedId === obj.toString() ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => selectLayer(obj)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium flex-1 truncate">{getLayerName(obj)}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }}>
              {obj.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); toggleLock(obj); }}>
              {obj.selectable !== false ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </Button>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveUp(obj); }}><MoveUp className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveDown(obj); }}><MoveDown className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); duplicateLayer(obj); }}><Copy className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteLayer(obj); }}><Trash2 className="w-3 h-3" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

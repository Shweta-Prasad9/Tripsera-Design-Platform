import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Square, Circle, Type, Image, Trash2 } from "lucide-react";
import { Canvas as FabricCanvas, Rect, Circle as FabricCircle, IText } from "fabric";

export const EditorToolbar = ({ canvas, activeColor, setActiveColor }) => {
  const addRectangle = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100, top: 100, fill: activeColor, width: 200, height: 150,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new FabricCircle({
      left: 100, top: 100, fill: activeColor, radius: 75,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new IText("Your Text Here", {
      left: 100, top: 100, fill: activeColor, fontSize: 32, fontFamily: "Arial",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    <div className="w-64 border-r border-border bg-card p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Tools</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={addRectangle}>
            <Square className="w-4 h-4 mr-2" /> Rectangle
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={addCircle}>
            <Circle className="w-4 h-4 mr-2" /> Circle
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={addText}>
            <Type className="w-4 h-4 mr-2" /> Text
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <Label htmlFor="color-picker" className="mb-2 block">Color</Label>
        <div className="flex gap-2">
          <Input id="color-picker" type="color" value={activeColor} onChange={(e) => setActiveColor(e.target.value)} className="h-10 cursor-pointer" />
          <Input type="text" value={activeColor} onChange={(e) => setActiveColor(e.target.value)} className="flex-1" placeholder="#000000" />
        </div>
      </div>
      <Separator />
      <div>
        <Button variant="destructive" className="w-full" onClick={deleteSelected}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
        </Button>
      </div>
    </div>
  );
};

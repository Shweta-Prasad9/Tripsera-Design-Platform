import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const ImageProperties = ({ canvas, selectedObject }) => {
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  useEffect(() => {
    if (!selectedObject) return;
    setOpacity((selectedObject.opacity || 1) * 100);
  }, [selectedObject]);

  const updateProperty = (property, value) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const rotate = () => {
    if (!selectedObject) return;
    updateProperty("angle", (selectedObject.angle || 0) + 90);
  };

  const flipHorizontal = () => {
    if (!selectedObject) return;
    updateProperty("flipX", !selectedObject.flipX);
  };

  const flipVertical = () => {
    if (!selectedObject) return;
    updateProperty("flipY", !selectedObject.flipY);
  };

  const applyFilter = () => {
    if (!canvas || !selectedObject) return;
    const filters = [];
    if (brightness !== 0) {
      filters.push(new window.fabric.Image.filters.Brightness({ brightness: brightness / 100 }));
    }
    if (contrast !== 0) {
      filters.push(new window.fabric.Image.filters.Contrast({ contrast: contrast / 100 }));
    }
    selectedObject.filters = filters;
    selectedObject.applyFilters();
    canvas.renderAll();
  };

  useEffect(() => { applyFilter(); }, [brightness, contrast]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Transform</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={rotate} title="Rotate 90°"><RotateCw className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={flipHorizontal} title="Flip Horizontal"><FlipHorizontal className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={flipVertical} title="Flip Vertical"><FlipVertical className="w-4 h-4" /></Button>
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Opacity: {opacity}%</Label>
        <Slider value={[opacity]} onValueChange={([value]) => { setOpacity(value); updateProperty("opacity", value / 100); }} min={0} max={100} step={1} />
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Brightness: {brightness > 0 ? "+" : ""}{brightness}</Label>
        <Slider value={[brightness]} onValueChange={([value]) => setBrightness(value)} min={-100} max={100} step={1} />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Contrast: {contrast > 0 ? "+" : ""}{contrast}</Label>
        <Slider value={[contrast]} onValueChange={([value]) => setContrast(value)} min={-100} max={100} step={1} />
      </div>
      <div className="pt-2">
        <p className="text-xs text-muted-foreground">Adjust brightness and contrast to enhance your image</p>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export const ShapeProperties = ({ canvas, selectedObject }) => {
  const [fillColor, setFillColor] = useState("#1CA4D8");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (!selectedObject) return;
    setFillColor(selectedObject.fill || "#1CA4D8");
    setStrokeColor(selectedObject.stroke || "#000000");
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setOpacity((selectedObject.opacity || 1) * 100);
  }, [selectedObject]);

  const updateProperty = (property, value) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set(property, value);
    canvas.renderAll();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Fill Color</Label>
        <div className="flex gap-2">
          <Input type="color" value={fillColor} onChange={(e) => { setFillColor(e.target.value); updateProperty("fill", e.target.value); }} className="w-20 h-10 cursor-pointer" />
          <Input type="text" value={fillColor} onChange={(e) => { setFillColor(e.target.value); updateProperty("fill", e.target.value); }} className="flex-1" />
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Stroke Color</Label>
        <div className="flex gap-2">
          <Input type="color" value={strokeColor} onChange={(e) => { setStrokeColor(e.target.value); updateProperty("stroke", e.target.value); }} className="w-20 h-10 cursor-pointer" />
          <Input type="text" value={strokeColor} onChange={(e) => { setStrokeColor(e.target.value); updateProperty("stroke", e.target.value); }} className="flex-1" />
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Stroke Width: {strokeWidth}px</Label>
        <Slider value={[strokeWidth]} onValueChange={([value]) => { setStrokeWidth(value); updateProperty("strokeWidth", value); }} min={0} max={20} step={1} />
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Opacity: {opacity}%</Label>
        <Slider value={[opacity]} onValueChange={([value]) => { setOpacity(value); updateProperty("opacity", value / 100); }} min={0} max={100} step={1} />
      </div>
    </div>
  );
};

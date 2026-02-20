import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const TextProperties = ({ canvas, selectedObject }) => {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);

  useEffect(() => {
    if (!selectedObject) return;
    setFontFamily(selectedObject.fontFamily || "Inter");
    setFontSize(selectedObject.fontSize || 32);
    setColor(selectedObject.fill || "#000000");
    setOpacity((selectedObject.opacity || 1) * 100);
    setLetterSpacing(selectedObject.charSpacing || 0);
  }, [selectedObject]);

  const updateProperty = (property, value) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const toggleBold = () => { updateProperty("fontWeight", selectedObject.fontWeight === "bold" ? "normal" : "bold"); };
  const toggleItalic = () => { updateProperty("fontStyle", selectedObject.fontStyle === "italic" ? "normal" : "italic"); };
  const toggleUnderline = () => { updateProperty("underline", !selectedObject.underline); };
  const setAlignment = (align) => { updateProperty("textAlign", align); };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Font Family</Label>
        <Select value={fontFamily} onValueChange={(value) => { setFontFamily(value); updateProperty("fontFamily", value); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Font Size</Label>
        <div className="flex gap-2">
          <Slider value={[fontSize]} onValueChange={([value]) => { setFontSize(value); updateProperty("fontSize", value); }} min={8} max={200} step={1} className="flex-1" />
          <Input type="number" value={fontSize} onChange={(e) => { const value = parseInt(e.target.value) || 32; setFontSize(value); updateProperty("fontSize", value); }} className="w-20" />
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Text Style</Label>
        <div className="flex gap-2">
          <Button variant={selectedObject?.fontWeight === "bold" ? "default" : "outline"} size="icon" onClick={toggleBold}><Bold className="w-4 h-4" /></Button>
          <Button variant={selectedObject?.fontStyle === "italic" ? "default" : "outline"} size="icon" onClick={toggleItalic}><Italic className="w-4 h-4" /></Button>
          <Button variant={selectedObject?.underline ? "default" : "outline"} size="icon" onClick={toggleUnderline}><Underline className="w-4 h-4" /></Button>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Alignment</Label>
        <div className="flex gap-2">
          <Button variant={selectedObject?.textAlign === "left" ? "default" : "outline"} size="icon" onClick={() => setAlignment("left")}><AlignLeft className="w-4 h-4" /></Button>
          <Button variant={selectedObject?.textAlign === "center" ? "default" : "outline"} size="icon" onClick={() => setAlignment("center")}><AlignCenter className="w-4 h-4" /></Button>
          <Button variant={selectedObject?.textAlign === "right" ? "default" : "outline"} size="icon" onClick={() => setAlignment("right")}><AlignRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">Color</Label>
        <div className="flex gap-2">
          <Input type="color" value={color} onChange={(e) => { setColor(e.target.value); updateProperty("fill", e.target.value); }} className="w-20 h-10 cursor-pointer" />
          <Input type="text" value={color} onChange={(e) => { setColor(e.target.value); updateProperty("fill", e.target.value); }} className="flex-1" />
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Opacity: {opacity}%</Label>
        <Slider value={[opacity]} onValueChange={([value]) => { setOpacity(value); updateProperty("opacity", value / 100); }} min={0} max={100} step={1} />
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Letter Spacing: {letterSpacing}</Label>
        <Slider value={[letterSpacing]} onValueChange={([value]) => { setLetterSpacing(value); updateProperty("charSpacing", value); }} min={-200} max={800} step={10} />
      </div>
    </div>
  );
};

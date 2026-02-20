import { useState } from "react";
import { Rect, Circle, Triangle, IText, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Type, Square, Circle as CircleIcon, Triangle as TriangleIcon, Star, Image as ImageIcon, Upload, Plane, Palmtree, Mountain, Camera, Map, Compass, Ship, Tent } from "lucide-react";
import { toast } from "sonner";

export const LeftSidebar = ({ canvas }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const addText = () => {
    if (!canvas) return;
    const text = new IText("Add your text", { left: 100, top: 100, fontSize: 32, fill: "#000000", fontFamily: "Inter" });
    canvas.add(text); canvas.setActiveObject(text); canvas.renderAll();
  };

  const addShape = (type) => {
    if (!canvas) return;
    let shape;
    switch (type) {
      case "rectangle": shape = new Rect({ left: 100, top: 100, fill: "#1CA4D8", width: 150, height: 100 }); break;
      case "circle": shape = new Circle({ left: 100, top: 100, fill: "#F97316", radius: 50 }); break;
      case "triangle": shape = new Triangle({ left: 100, top: 100, fill: "#10B981", width: 100, height: 100 }); break;
    }
    canvas.add(shape); canvas.setActiveObject(shape); canvas.renderAll();
  };

  const addIcon = (iconType) => {
    if (!canvas) return;
    const icon = new IText(iconType, { left: 100, top: 100, fontSize: 48, fill: "#1CA4D8" });
    canvas.add(icon); canvas.setActiveObject(icon); canvas.renderAll();
    toast.success(`${iconType} icon added`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result;
      FabricImage.fromURL(imgUrl).then((img) => {
        img.scaleToWidth(200); img.set({ left: 100, top: 100 });
        canvas.add(img); canvas.setActiveObject(img); canvas.renderAll();
        toast.success("Image uploaded successfully!");
      });
    };
    reader.readAsDataURL(file);
  };

  const travelIcons = [
    { name: "Plane", icon: Plane }, { name: "Palm Tree", icon: Palmtree },
    { name: "Mountain", icon: Mountain }, { name: "Camera", icon: Camera },
    { name: "Map", icon: Map }, { name: "Compass", icon: Compass },
    { name: "Ship", icon: Ship }, { name: "Tent", icon: Tent },
  ];

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Elements</h2>
        <Input placeholder="Search elements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
      </div>
      <Tabs defaultValue="text" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="shapes">Shapes</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="text" className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={addText}><Type className="w-4 h-4 mr-2" />Add Heading</Button>
            <Button variant="outline" className="w-full justify-start" onClick={addText}><Type className="w-4 h-4 mr-2" />Add Subheading</Button>
            <Button variant="outline" className="w-full justify-start" onClick={addText}><Type className="w-4 h-4 mr-2" />Add Body Text</Button>
          </TabsContent>
          <TabsContent value="shapes" className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => addShape("rectangle")}><Square className="w-8 h-8" />Rectangle</Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => addShape("circle")}><CircleIcon className="w-8 h-8" />Circle</Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => addShape("triangle")}><TriangleIcon className="w-8 h-8" />Triangle</Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => toast.info("More shapes coming soon!")}><Star className="w-8 h-8" />Star</Button>
            </div>
          </TabsContent>
          <TabsContent value="icons" className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {travelIcons.map(({ name, icon: Icon }) => (
                <Button key={name} variant="outline" className="h-24 flex flex-col gap-2" onClick={() => addIcon(name)}><Icon className="w-8 h-8" />{name}</Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="images" className="p-4 space-y-3">
            <label htmlFor="image-upload">
              <Button variant="outline" className="w-full" asChild><div className="cursor-pointer"><Upload className="w-4 h-4 mr-2" />Upload Image</div></Button>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Sample Travel Images</p>
              <div className="grid grid-cols-2 gap-2">
                {["template-beach.jpg", "template-mountain.jpg", "template-city.jpg"].map((img) => (
                  <div key={img} className="aspect-square rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => { if (!canvas) return; FabricImage.fromURL(`/src/assets/${img}`).then((image) => { image.scaleToWidth(300); image.set({ left: 100, top: 100 }); canvas.add(image); canvas.renderAll(); }); }}>
                    <img src={`/src/assets/${img}`} alt={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

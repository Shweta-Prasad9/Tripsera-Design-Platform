import { ScrollArea } from "@/components/ui/scroll-area";
import { TextProperties } from "./TextProperties";
import { ImageProperties } from "./ImageProperties";
import { ShapeProperties } from "./ShapeProperties";
import { LayerPanel } from "./LayerPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RightSidebar = ({ canvas, selectedObject }) => {
  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="properties" className="p-4 space-y-4 mt-0">
            {!selectedObject && (<div className="text-center text-muted-foreground py-8"><p>Select an element to edit its properties</p></div>)}
            {selectedObject?.type === "i-text" && <TextProperties canvas={canvas} selectedObject={selectedObject} />}
            {selectedObject?.type === "image" && <ImageProperties canvas={canvas} selectedObject={selectedObject} />}
            {(selectedObject?.type === "rect" || selectedObject?.type === "circle" || selectedObject?.type === "triangle") && <ShapeProperties canvas={canvas} selectedObject={selectedObject} />}
          </TabsContent>
          <TabsContent value="layers" className="p-4 mt-0"><LayerPanel canvas={canvas} /></TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

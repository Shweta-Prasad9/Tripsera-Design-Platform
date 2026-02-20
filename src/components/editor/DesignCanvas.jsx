import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

export const DesignCanvas = ({ setCanvas, canvas, showGrid, zoom, templateData }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const fabricCanvas = new FabricCanvas(canvasRef.current, { width: 1080, height: 1080, backgroundColor: "#ffffff" });
    fabricCanvas.on("object:moving", (e) => {
      if (!showGrid) return;
      const obj = e.target;
      if (!obj) return;
      const gridSize = 20;
      obj.set({ left: Math.round((obj.left || 0) / gridSize) * gridSize, top: Math.round((obj.top || 0) / gridSize) * gridSize });
    });
    setCanvas(fabricCanvas);
    return () => { fabricCanvas.dispose(); setCanvas(null); };
  }, [setCanvas]);

  useEffect(() => {
    if (!canvas || !templateData) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.loadFromJSON(templateData, () => { canvas.renderAll(); });
  }, [canvas, templateData]);

  useEffect(() => {
    if (!canvas) return;
    const drawGrid = () => {
      const ctx = canvas.getContext();
      if (!ctx) return;
      const canvasWidth = canvas.width || 1080;
      const canvasHeight = canvas.height || 1080;
      const gridSize = 20;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      if (showGrid) {
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvasWidth; i += gridSize) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasHeight); ctx.stroke(); }
        for (let i = 0; i <= canvasHeight; i += gridSize) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasWidth, i); ctx.stroke(); }
      }
      canvas.renderAll();
    };
    drawGrid();
  }, [canvas, showGrid]);

  return (
    <div ref={containerRef} className="h-full flex items-center justify-center bg-muted/20 p-8 overflow-auto">
      <div className="bg-white rounded-lg shadow-strong" style={{ transform: `scale(${zoom})` }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

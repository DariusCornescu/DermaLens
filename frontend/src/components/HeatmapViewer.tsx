"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface HeatmapViewerProps {
  originalImage: string;
  gradcamImage: string;
  heatmapOnly: string;
}

export function HeatmapViewer({
  originalImage,
  gradcamImage,
  heatmapOnly,
}: HeatmapViewerProps) {
  const [opacity, setOpacity] = useState([75]);
  const [activeTab, setActiveTab] = useState("overlay");

  const getImageSrc = (base64: string) => {
    if (base64.startsWith("data:")) {
      return base64;
    }
    return `data:image/png;base64,${base64}`;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="overlay">Grad-CAM</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="original" className="mt-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={getImageSrc(originalImage)}
              alt="Original dermoscopic image"
              className="w-full h-full object-contain"
            />
          </div>
        </TabsContent>

        <TabsContent value="overlay" className="mt-4">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              {/* Original image as base */}
              <img
                src={getImageSrc(originalImage)}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* Heatmap overlay with opacity */}
              <img
                src={getImageSrc(heatmapOnly)}
                alt="Grad-CAM heatmap"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ opacity: opacity[0] / 100 }}
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Heatmap Opacity</span>
                <span className="font-mono">{opacity[0]}%</span>
              </div>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={getImageSrc(heatmapOnly)}
              alt="Grad-CAM heatmap only"
              className="w-full h-full object-contain"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2 text-sm">Heatmap Legend</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-500 to-yellow-500" />
            <span className="text-xs text-muted-foreground">
              High Influence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-xs text-muted-foreground">Low Influence</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The heatmap shows which regions the AI focused on. This does NOT
          indicate disease location.
        </p>
      </div>

      {/* Comparison View */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3 text-sm">Side-by-Side Comparison</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <div className="aspect-square bg-muted rounded overflow-hidden">
              <img
                src={getImageSrc(originalImage)}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Original
            </p>
          </div>
          <div className="space-y-1">
            <div className="aspect-square bg-muted rounded overflow-hidden">
              <img
                src={getImageSrc(gradcamImage)}
                alt="Overlay"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">Overlay</p>
          </div>
          <div className="space-y-1">
            <div className="aspect-square bg-muted rounded overflow-hidden">
              <img
                src={getImageSrc(heatmapOnly)}
                alt="Heatmap"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">Heatmap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

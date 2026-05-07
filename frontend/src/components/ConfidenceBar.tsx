"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatConfidence } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface ConfidenceBarProps {
  confidence: number;
  confidenceLevel: "very-high" | "high" | "moderate" | "low";
}

export function ConfidenceBar({
  confidence,
  confidenceLevel,
}: ConfidenceBarProps) {
  const percentage = confidence * 100;

  const levelConfig = {
    "very-high": {
      label: "Very High",
      color: "text-green-400",
      bgColor: "bg-green-500",
      icon: CheckCircle,
      description:
        "The model is very confident about this classification. Strong pattern match detected.",
    },
    high: {
      label: "High",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      icon: CheckCircle,
      description:
        "The model shows high confidence. Clear indicators present in the image.",
    },
    moderate: {
      label: "Moderate",
      color: "text-amber-400",
      bgColor: "bg-amber-500",
      icon: AlertCircle,
      description:
        "Some ambiguity detected. The image may have features matching multiple classes.",
    },
    low: {
      label: "Low",
      color: "text-red-400",
      bgColor: "bg-red-500",
      icon: AlertTriangle,
      description:
        "The model is uncertain. This could be due to image quality or unusual presentation.",
    },
  };

  const config = levelConfig[confidenceLevel];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Main Confidence Display */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Model Confidence</span>
        <span className={cn("font-mono text-lg font-bold", config.color)}>
          {formatConfidence(confidence)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full transition-all", config.bgColor)}
            style={{ width: `${percentage}%` }}
          />
          {/* Threshold markers */}
          <div className="absolute inset-0 flex">
            <div
              className="border-r border-dashed border-muted-foreground/30"
              style={{ width: "50%" }}
            />
            <div
              className="border-r border-dashed border-muted-foreground/30"
              style={{ width: "30%" }}
            />
            <div
              className="border-r border-dashed border-muted-foreground/30"
              style={{ width: "10%" }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>80%</span>
          <span>90%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Confidence Level Card */}
      <div
        className={cn(
          "p-4 rounded-lg border",
          confidenceLevel === "low" && "border-red-500/30 bg-red-500/10",
          confidenceLevel === "moderate" && "border-amber-500/30 bg-amber-500/10",
          confidenceLevel === "high" && "border-blue-500/30 bg-blue-500/10",
          confidenceLevel === "very-high" && "border-green-500/30 bg-green-500/10"
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.color)} />
          <div>
            <p className={cn("font-medium", config.color)}>
              {config.label} Confidence
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Zones Explanation */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Confidence Zones
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>90-100%: Very High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>80-89%: High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>50-79%: Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>&lt;50%: Low</span>
          </div>
        </div>
      </div>

      {/* Calibration Note */}
      <p className="text-xs text-muted-foreground">
        <strong>Note:</strong> Confidence scores indicate the model&apos;s
        certainty, not the probability of the condition being present. Always
        verify with clinical examination.
      </p>
    </div>
  );
}

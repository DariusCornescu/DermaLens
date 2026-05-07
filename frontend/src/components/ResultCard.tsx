"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatConfidence } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { ClassPrediction } from "@/lib/api";

interface ResultCardProps {
  prediction: ClassPrediction;
  isPrimary?: boolean;
}

export function ResultCard({ prediction, isPrimary = false }: ResultCardProps) {
  return (
    <Card
      className={cn(
        isPrimary && prediction.is_malignant && "border-destructive",
        isPrimary && !prediction.is_malignant && "border-green-400"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{isPrimary ? "Primary Classification" : "Classification"}</span>
          {prediction.is_malignant ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Class Name */}
          <div>
            <h3
              className={cn(
                "text-2xl font-bold",
                prediction.is_malignant ? "text-destructive" : "text-green-400"
              )}
            >
              {prediction.class_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Class ID: {prediction.class_id.toUpperCase()}
            </p>
          </div>

          {/* Confidence */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Confidence</span>
            <span className="font-mono text-xl font-bold">
              {formatConfidence(prediction.confidence)}
            </span>
          </div>

          {/* Risk Badge */}
          <div
            className={cn(
              "p-3 rounded-lg text-center",
              prediction.is_malignant
                ? "bg-destructive/10 text-destructive"
                : "bg-green-500/10 text-green-400"
            )}
          >
            {prediction.is_malignant ? (
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Potentially Malignant</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Likely Benign</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">
            {getClassDescription(prediction.class_id)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getClassDescription(classId: string): string {
  const descriptions: Record<string, string> = {
    mel: "Melanoma is a type of skin cancer that develops from melanocytes. Early detection is critical for successful treatment.",
    nv: "Melanocytic nevus (mole) is a benign proliferation of melanocytes. Most moles are harmless but should be monitored for changes.",
    bcc: "Basal cell carcinoma is the most common type of skin cancer. It rarely spreads but can cause local tissue damage if untreated.",
    akiec:
      "Actinic keratosis is a precancerous skin condition caused by sun damage. It can potentially develop into squamous cell carcinoma.",
    bkl: "Benign keratosis includes seborrheic keratoses and other non-cancerous growths. These are typically harmless.",
    df: "Dermatofibroma is a common benign skin growth. It typically appears as a firm, raised bump and is usually harmless.",
    vasc: "Vascular lesions include angiomas and other blood vessel-related skin conditions. Most are benign.",
  };

  return (
    descriptions[classId.toLowerCase()] ||
    "Classification details not available."
  );
}

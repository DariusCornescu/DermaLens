"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PredictionResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeatmapViewer } from "@/components/HeatmapViewer";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { ResultCard } from "@/components/ResultCard";
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  RefreshCw,
  Clock,
  Brain,
} from "lucide-react";
import { formatConfidence, getConfidenceLevel } from "@/lib/utils";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const stored = sessionStorage.getItem(`result_${id}`);

    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        console.error("Failed to parse stored result");
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Results Not Found</AlertTitle>
          <AlertDescription>
            The analysis results could not be found. Please try analyzing a new
            image.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/analyze">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const confidenceInfo = getConfidenceLevel(result.predicted_class.confidence);

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              ID: {result.id} | Model: {result.model_name}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button variant="outline" asChild>
              <Link href="/analyze">
                <RefreshCw className="mr-2 h-4 w-4" />
                New Analysis
              </Link>
            </Button>
          </div>
        </div>

        {/* Risk Warning */}
        {result.is_high_risk && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>High-Risk Classification</AlertTitle>
            <AlertDescription>
              {result.risk_message ||
                "This classification indicates a potentially malignant lesion. Professional dermatological examination is strongly recommended."}
            </AlertDescription>
          </Alert>
        )}

        {/* Uncertainty Warning */}
        {result.is_uncertain && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Uncertain Prediction</AlertTitle>
            <AlertDescription>
              The model shows {confidenceInfo.level} confidence (
              {formatConfidence(result.predicted_class.confidence)}). This could
              be due to image quality, unusual presentation, or features
              matching multiple classes. Professional examination is advised.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapViewer
                  originalImage={result.original_image}
                  gradcamImage={result.gradcam_image}
                  heatmapOnly={result.heatmap_only}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4 sm:space-y-6">
            {/* Primary Prediction */}
            <ResultCard prediction={result.predicted_class} isPrimary />

            {/* Confidence Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Confidence Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfidenceBar
                  confidence={result.predicted_class.confidence}
                  confidenceLevel={result.confidence_level}
                />
              </CardContent>
            </Card>

            {/* Other Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Other Possibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {result.top_predictions.slice(1).map((pred) => (
                    <div
                      key={pred.class_id}
                      className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">{pred.class_name}</p>
                        {pred.is_malignant && (
                          <span className="text-xs text-destructive">
                            Potentially Malignant
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs sm:text-sm">
                        {formatConfidence(pred.confidence)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Inference: {result.inference_time_ms.toFixed(0)}ms
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    {result.model_name}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Understanding Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Understanding This Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-medium mb-2 text-sm sm:text-base">What the Heatmap Shows</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>
                    • <span className="text-red-500">Red/Yellow</span> areas =
                    High influence on prediction
                  </li>
                  <li>
                    • <span className="text-blue-500">Blue/Purple</span> areas =
                    Low influence
                  </li>
                  <li>
                    • The model focused on these regions to make its decision
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  <strong>Important:</strong> This does NOT mean highlighted
                  areas are &quot;cancerous&quot; - it shows where the AI
                  looked, not what it found.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm sm:text-base">Limitations</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• AI cannot see patient history or symptoms</li>
                  <li>• Image quality affects accuracy</li>
                  <li>• This is not a clinical diagnosis</li>
                  <li>• Always consult a dermatologist</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription>
            This is an AI research tool, not a medical diagnosis. The results
            shown are for educational and research purposes only. Always consult
            a qualified dermatologist for any skin concerns. Do not make medical
            decisions based solely on this analysis.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImageUploader } from "@/components/ImageUploader";
import { analyzeImage, PredictionResponse } from "@/lib/api";
import { AlertTriangle, Info } from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const mutation = useMutation({
    mutationFn: analyzeImage,
    onSuccess: (data) => {
      setResult(data);
      // Store result in sessionStorage for the results page
      sessionStorage.setItem(`result_${data.id}`, JSON.stringify(data));
      // Navigate to results page
      router.push(`/results/${data.id}`);
    },
  });

  const handleImageSelect = (file: File) => {
    mutation.mutate(file);
  };

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Analyze Image</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Upload a dermoscopic image to receive AI-powered classification with
            visual explanations.
          </p>
        </div>

        {/* Research Disclaimer */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Research Tool</AlertTitle>
          <AlertDescription>
            This analysis is for educational and research purposes only. Results
            should not be used for clinical diagnosis. Always consult a
            qualified dermatologist.
          </AlertDescription>
        </Alert>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Dermoscopic Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onImageSelect={handleImageSelect}
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Error Display */}
        {mutation.isError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              {mutation.error instanceof Error
                ? mutation.error.message
                : "An error occurred during analysis. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Info Card */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">What happens next?</h3>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>
                    1. Your image is processed by our deep learning model
                  </li>
                  <li>
                    2. The model classifies the lesion into one of 7 categories
                  </li>
                  <li>
                    3. Grad-CAM generates a visual explanation of the
                    prediction
                  </li>
                  <li>
                    4. You receive results with confidence scores and risk
                    assessment
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                  <strong>Privacy:</strong> Images are processed in real-time
                  and are not stored on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export interface ClassPrediction {
  class_id: string;
  class_name: string;
  confidence: number;
  is_malignant: boolean;
}

export interface PredictionResponse {
  id: string;
  timestamp: string;
  predicted_class: ClassPrediction;
  top_predictions: ClassPrediction[];
  confidence_level: "very-high" | "high" | "moderate" | "low";
  is_uncertain: boolean;
  is_high_risk: boolean;
  risk_message: string | null;
  gradcam_image: string;
  original_image: string;
  heatmap_only: string;
  model_name: string;
  inference_time_ms: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  version: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function analyzeImage(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

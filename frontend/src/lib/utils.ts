import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

export function getConfidenceLevel(confidence: number): {
  level: "very-high" | "high" | "moderate" | "low";
  label: string;
  color: string;
} {
  if (confidence >= 0.9) {
    return { level: "very-high", label: "Very High", color: "text-success" };
  } else if (confidence >= 0.8) {
    return { level: "high", label: "High", color: "text-primary" };
  } else if (confidence >= 0.5) {
    return { level: "moderate", label: "Moderate", color: "text-warning" };
  } else {
    return { level: "low", label: "Low", color: "text-danger" };
  }
}

export function getClassDisplayName(classId: string): string {
  const classNames: Record<string, string> = {
    mel: "Melanoma",
    nv: "Melanocytic Nevus",
    bcc: "Basal Cell Carcinoma",
    akiec: "Actinic Keratosis",
    bkl: "Benign Keratosis",
    df: "Dermatofibroma",
    vasc: "Vascular Lesion",
  };
  return classNames[classId.toLowerCase()] || classId;
}

export function isMalignant(classId: string): boolean {
  const malignantClasses = ["mel", "bcc", "akiec"];
  return malignantClasses.includes(classId.toLowerCase());
}

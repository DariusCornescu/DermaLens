"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export function ImageUploader({
  onImageSelect,
  isLoading = false,
  disabled = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File is too large. Maximum size is 10MB.");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload a JPEG or PNG image.");
        } else {
          setError("Invalid file. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || isLoading,
  });

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            (disabled || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop image here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported: JPEG, PNG (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border rounded-lg overflow-hidden bg-muted/30">
            <div className="aspect-square max-w-md mx-auto p-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {preview && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
            className="flex-1"
          >
            Clear
          </Button>
        )}
        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading || disabled}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Analyzing...
            </>
          ) : (
            <>
              Analyze Image
              <Upload className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Image Guidelines */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="font-medium mb-2">Image Guidelines</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use dermoscopic images for best results</li>
          <li>• Ensure good lighting and focus</li>
          <li>• Center the lesion in frame</li>
          <li>• Minimum recommended resolution: 600x450px</li>
        </ul>
      </div>
    </div>
  );
}

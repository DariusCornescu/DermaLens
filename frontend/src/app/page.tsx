import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Upload,
  Brain,
  Eye,
  Shield,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              AI-Powered Skin Lesion Analysis
              <span className="text-primary block mt-2">
                with Explainable Results
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a dermoscopic image and receive AI-powered classification
              with visual explanations showing exactly what the model sees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/analyze">
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          {/* Research Disclaimer */}
          <Alert className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Research Tool Only</AlertTitle>
            <AlertDescription>
              This tool is for educational and research purposes only. It is not
              a medical device and should not be used for clinical diagnosis.
              Always consult a qualified dermatologist.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-muted/30">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">What You Get</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            DermaLens provides comprehensive analysis with transparency at every
            step
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Classification</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Get predictions across 7 skin lesion categories including
                  melanoma, basal cell carcinoma, and benign conditions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Visual Explanation</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  See Grad-CAM heatmaps showing exactly which regions of the
                  image influenced the AI&apos;s decision.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Confidence Analysis</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Understand model certainty with calibrated confidence scores
                  and uncertainty warnings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Three simple steps to get AI-powered analysis with explanations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
              1
            </div>
            <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-semibold">Upload Image</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Drag and drop or select a dermoscopic image. We support JPEG and
              PNG formats.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
              2
            </div>
            <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-semibold">AI Analysis</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Our deep learning model analyzes the image and generates
              predictions with explainability.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
              3
            </div>
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-semibold">Review Results</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              View classification, confidence scores, and visual explanations
              showing the AI&apos;s reasoning.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button size="lg" asChild>
            <Link href="/analyze">
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Supported Classes Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-muted/30">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Supported Classifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Trained on the HAM10000 dataset with 7 diagnostic categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {[
            { name: "Melanoma", risk: true },
            { name: "Basal Cell Carcinoma", risk: true },
            { name: "Actinic Keratosis", risk: true },
            { name: "Melanocytic Nevus", risk: false },
            { name: "Benign Keratosis", risk: false },
            { name: "Dermatofibroma", risk: false },
            { name: "Vascular Lesion", risk: false },
          ].map((item) => (
            <div
              key={item.name}
              className={`p-3 sm:p-4 rounded-lg border ${
                item.risk
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              <p className="font-medium text-xs sm:text-sm">{item.name}</p>
              {item.risk && (
                <span className="text-xs text-destructive">
                  Potentially Malignant
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

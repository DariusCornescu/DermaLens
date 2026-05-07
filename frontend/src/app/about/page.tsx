import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Brain,
  Database,
  Eye,
  Shield,
  Code,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">About DermaLens</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            AI-Powered Skin Lesion Analysis with Explainable Results
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base">
              DermaLens is a research platform that uses deep learning to
              analyze dermoscopic images of skin lesions. Unlike traditional
              &quot;black box&quot; AI systems, DermaLens provides visual
              explanations of its predictions using Grad-CAM (Gradient-weighted
              Class Activation Mapping).
            </p>
            <p className="text-sm sm:text-base">
              This transparency allows users to understand which regions of an
              image influenced the AI&apos;s decision, enabling more informed
              interpretation of results.
            </p>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card id="methodology">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Model Architecture</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                DermaLens uses an EfficientNet-B0 convolutional neural network,
                a state-of-the-art architecture known for its balance of
                accuracy and computational efficiency. The model has been
                adapted for 7-class skin lesion classification.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Training Data</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                The model is trained on the HAM10000 dataset, which contains
                10,015 dermoscopic images of pigmented skin lesions. This
                dataset includes 7 diagnostic categories and represents a
                diverse range of skin lesion presentations.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Explainability (Grad-CAM)</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Grad-CAM generates visual explanations by computing the gradient
                of the predicted class score with respect to the feature maps of
                the last convolutional layer. This produces a heatmap
                highlighting regions that were most important for the
                prediction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Dataset: HAM10000
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              The HAM10000 (&quot;Human Against Machine with 10000 training
              images&quot;) dataset is a large collection of multi-source
              dermatoscopic images of common pigmented skin lesions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">Diagnostic Categories</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• Melanoma (MEL)</li>
                  <li>• Melanocytic Nevus (NV)</li>
                  <li>• Basal Cell Carcinoma (BCC)</li>
                  <li>• Actinic Keratosis (AKIEC)</li>
                  <li>• Benign Keratosis (BKL)</li>
                  <li>• Dermatofibroma (DF)</li>
                  <li>• Vascular Lesion (VASC)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">Dataset Statistics</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• Total Images: 10,015</li>
                  <li>• Image Resolution: Various (standardized to 224x224)</li>
                  <li>• Acquisition: Dermoscopy</li>
                  <li>• Ground Truth: Histopathology, follow-up, consensus</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Reference: Tschandl, P., Rosendahl, C. & Kittler, H. The HAM10000
              dataset, a large collection of multi-source dermatoscopic images
              of common pigmented skin lesions. Sci Data 5, 180161 (2018).
            </p>
          </CardContent>
        </Card>

        {/* Explainability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Understanding Grad-CAM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              Grad-CAM (Gradient-weighted Class Activation Mapping) is a
              technique for producing visual explanations for decisions from
              CNN-based models. It uses the gradients flowing into the final
              convolutional layer to produce a coarse localization map
              highlighting important regions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 text-sm sm:text-base">What the Heatmap Shows</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>
                    • <span className="text-red-500 font-medium">Red/Yellow</span>
                    : High importance for prediction
                  </li>
                  <li>
                    • <span className="text-blue-500 font-medium">Blue/Purple</span>
                    : Low importance
                  </li>
                  <li>• Indicates where the model &quot;looked&quot;</li>
                </ul>
              </div>
              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 text-sm sm:text-base">What It Does NOT Show</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• Location of disease/abnormality</li>
                  <li>• Certainty of diagnosis</li>
                  <li>• Clinical significance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card id="limitations">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This tool has significant limitations and should never be used
                as a substitute for professional medical evaluation.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 sm:space-y-3">
              <div>
                <h4 className="font-medium text-sm sm:text-base">Technical Limitations</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 mt-1">
                  <li>
                    • Model accuracy is limited by training data diversity
                  </li>
                  <li>• Performance varies with image quality and lighting</li>
                  <li>
                    • May not generalize well to all skin tones or rare
                    conditions
                  </li>
                  <li>
                    • Confidence scores may not be well-calibrated for all cases
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm sm:text-base">Clinical Limitations</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Cannot consider patient history or symptoms</li>
                  <li>• Cannot perform physical examination</li>
                  <li>• Cannot account for lesion evolution over time</li>
                  <li>• Not validated for clinical decision-making</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm sm:text-base">Data Limitations</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 mt-1">
                  <li>
                    • Training data may not represent all populations equally
                  </li>
                  <li>• Dataset biases may affect predictions</li>
                  <li>• Rare conditions may be underrepresented</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-3">
              <li>
                <strong>HAM10000 Dataset:</strong> Tschandl, P., Rosendahl, C. &
                Kittler, H. The HAM10000 dataset, a large collection of
                multi-source dermatoscopic images of common pigmented skin
                lesions. Sci Data 5, 180161 (2018).
              </li>
              <li>
                <strong>Grad-CAM:</strong> Selvaraju, R.R., et al. Grad-CAM:
                Visual Explanations from Deep Networks via Gradient-based
                Localization. ICCV 2017.
              </li>
              <li>
                <strong>EfficientNet:</strong> Tan, M. & Le, Q.V. EfficientNet:
                Rethinking Model Scaling for Convolutional Neural Networks. ICML
                2019.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Final Disclaimer */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Research Tool Only</AlertTitle>
          <AlertDescription>
            DermaLens is provided for educational and research purposes only. It
            is not a medical device, has not been validated for clinical use,
            and should not be used to make medical decisions. Always consult a
            qualified healthcare professional for medical advice.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

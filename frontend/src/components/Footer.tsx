import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-2 max-w-2xl">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Research Tool Only:</strong> DermaLens is for educational
              and research purposes. It is not a medical device and should not
              be used for clinical diagnosis. Always consult a qualified
              dermatologist for medical advice.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex gap-4 text-sm">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/about#methodology"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/about#limitations"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Limitations
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DermaLens. MIT License.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

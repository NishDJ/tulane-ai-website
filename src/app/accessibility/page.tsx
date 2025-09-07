import type { Metadata } from "next";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement | Tulane AI & Data Science Division",
  description: "Learn about our commitment to accessibility and how we ensure our website is usable by everyone.",
};

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-tulane-green mb-8">
          Accessibility Statement
        </h1>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <p className="text-lg mb-0">
            The Tulane AI & Data Science Division is committed to ensuring digital accessibility 
            for people with disabilities. We are continually improving the user experience for 
            everyone and applying the relevant accessibility standards.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Our Commitment
          </h2>
          <p>
            We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA 
            standards. These guidelines explain how to make web content more accessible for people 
            with disabilities and user-friendly for everyone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Accessibility Features
          </h2>
          <p>Our website includes the following accessibility features:</p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Keyboard Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Full keyboard navigation support</li>
                <li>• Skip links to main content</li>
                <li>• Logical tab order throughout the site</li>
                <li>• Visible focus indicators</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Screen Reader Support</h3>
              <ul className="space-y-2 text-sm">
                <li>• Semantic HTML structure</li>
                <li>• ARIA labels and descriptions</li>
                <li>• Alternative text for images</li>
                <li>• Live regions for dynamic content</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Visual Accessibility</h3>
              <ul className="space-y-2 text-sm">
                <li>• High contrast mode support</li>
                <li>• Dark and light theme options</li>
                <li>• Scalable text up to 200%</li>
                <li>• Color contrast compliance</li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">Motion & Animation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Respects reduced motion preferences</li>
                <li>• Optional animation controls</li>
                <li>• No auto-playing media</li>
                <li>• Pause controls for moving content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Keyboard Shortcuts
          </h2>
          <p>The following keyboard shortcuts are available throughout the site:</p>
          
          <div className="bg-card rounded-lg p-6 border mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <ul className="space-y-1 text-sm">
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> - Move to next element</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Tab</kbd> - Move to previous element</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Activate links and buttons</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> - Activate buttons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Menus & Dropdowns</h4>
                <ul className="space-y-1 text-sm">
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Arrow Keys</kbd> - Navigate menu items</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd> - Close menus</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Home</kbd> - First menu item</li>
                  <li><kbd className="px-2 py-1 bg-muted rounded text-xs">End</kbd> - Last menu item</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Assistive Technology Compatibility
          </h2>
          <p>Our website has been tested with the following assistive technologies:</p>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-card rounded-lg p-4 border text-center">
              <h4 className="font-semibold mb-2">Screen Readers</h4>
              <ul className="text-sm space-y-1">
                <li>NVDA</li>
                <li>JAWS</li>
                <li>VoiceOver</li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-4 border text-center">
              <h4 className="font-semibold mb-2">Voice Control</h4>
              <ul className="text-sm space-y-1">
                <li>Dragon NaturallySpeaking</li>
                <li>Voice Control (macOS)</li>
                <li>Voice Access (Android)</li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-4 border text-center">
              <h4 className="font-semibold mb-2">Switch Navigation</h4>
              <ul className="text-sm space-y-1">
                <li>Switch Control (iOS)</li>
                <li>Switch Access (Android)</li>
                <li>External switches</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Known Issues
          </h2>
          <p>
            We are aware of some accessibility issues and are working to address them:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Some third-party embedded content may not be fully accessible</li>
            <li>Complex data visualizations are being enhanced with alternative text descriptions</li>
            <li>PDF documents are being updated to meet accessibility standards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Feedback and Contact
          </h2>
          <p>
            We welcome your feedback on the accessibility of our website. If you encounter 
            any accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          
          <div className="bg-card rounded-lg p-6 border mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Accessibility Coordinator</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href="mailto:accessibility@tulane.edu" 
                      className="text-tulane-green hover:underline focus-visible:ring-enhanced"
                    >
                      accessibility@tulane.edu
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href="tel:+15049885263" 
                      className="text-tulane-green hover:underline focus-visible:ring-enhanced"
                    >
                      (504) 988-5263
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Response Time</h4>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to accessibility feedback within 2 business days. 
                  For urgent accessibility issues, please call our main number.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Additional Resources
          </h2>
          <p>For more information about web accessibility, visit these resources:</p>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <a 
                href="https://www.w3.org/WAI/WCAG21/quickref/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-tulane-green hover:underline focus-visible:ring-enhanced"
              >
                WCAG 2.1 Quick Reference
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <a 
                href="https://www.ada.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-tulane-green hover:underline focus-visible:ring-enhanced"
              >
                Americans with Disabilities Act (ADA)
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <a 
                href="https://webaim.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-tulane-green hover:underline focus-visible:ring-enhanced"
              >
                WebAIM - Web Accessibility In Mind
              </a>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-tulane-green mb-4">
            Continuous Improvement
          </h2>
          <p className="mb-4">
            Accessibility is an ongoing effort. We regularly review and update our website 
            to ensure it remains accessible to all users. This statement was last updated 
            on {new Date().toLocaleDateString()}.
          </p>
          <Button asChild className="focus-visible:ring-enhanced">
            <Link href="/contact">Contact Us About Accessibility</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
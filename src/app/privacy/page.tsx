import { Metadata } from 'next';
import { Shield, Eye, Cookie, Database, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tulane AI & Data Science Division',
  description: 'Learn how we collect, use, and protect your personal information at Tulane University AI & Data Science Division.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-tulane-green" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-tulane-green mr-2" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The Tulane University AI & Data Science Division ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fill out contact forms or request information</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Register for events or programs</li>
                  <li>Apply for academic programs</li>
                  <li>Interact with our website features</li>
                </ul>

                <p>This information may include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Academic and professional background</li>
                  <li>Research interests and preferences</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
                <p>When you visit our website, we may automatically collect certain information, including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                  <li>Device information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Cookie className="h-6 w-6 text-tulane-green mr-2" />
                Cookies and Tracking Technologies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience and analyze website usage.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Types of Cookies We Use</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Essential for website functionality, including security, authentication, and basic navigation. 
                    These cannot be disabled.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Preference Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Remember your settings and preferences to provide a personalized experience.
                  </p>
                </div>

                <p>
                  You can manage your cookie preferences through our cookie consent banner or by adjusting your browser settings.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 text-tulane-green mr-2" />
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the information we collect for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Responding to your inquiries and providing requested information</li>
                  <li>Processing applications and registrations</li>
                  <li>Sending newsletters and updates (with your consent)</li>
                  <li>Improving our website and services</li>
                  <li>Conducting research and analytics</li>
                  <li>Ensuring website security and preventing fraud</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-700">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">University Partners</h3>
                <p>
                  We may share information with other Tulane University departments and affiliated organizations 
                  for academic and administrative purposes.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Service Providers</h3>
                <p>
                  We may share information with trusted third-party service providers who assist us in operating 
                  our website, conducting business, or serving our users.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Legal Requirements</h3>
                <p>
                  We may disclose information when required by law or to protect our rights, property, or safety, 
                  or that of our users or others.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-700">
                <p>You have certain rights regarding your personal information:</p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Access and Correction</h3>
                <p>You may request access to or correction of your personal information by contacting us.</p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Opt-Out</h3>
                <p>You may opt out of receiving marketing communications by following the unsubscribe instructions in our emails.</p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Cookie Management</h3>
                <p>You can manage your cookie preferences through our cookie consent banner or browser settings.</p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Data Deletion</h3>
                <p>You may request deletion of your personal information, subject to certain legal and operational requirements.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our website is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected personal 
                  information from a child under 13, we will take steps to delete such information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
                  review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-6 w-6 text-tulane-green mr-2" />
                Contact Us
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Tulane AI & Data Science Division</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span>ai@tulane.edu</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>(504) 988-5263</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-4 w-4 text-gray-500 mr-2 mt-0.5">📍</div>
                      <div>
                        1430 Tulane Avenue<br />
                        New Orleans, LA 70112<br />
                        United States
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  For general university privacy inquiries, you may also contact the Tulane University Privacy Office.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Metadata } from 'next';
import { Scale, FileText, AlertTriangle, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | Tulane AI & Data Science Division',
  description: 'Terms and conditions for using the Tulane University AI & Data Science Division website.',
  robots: 'index, follow',
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Scale className="h-12 w-12 text-tulane-green" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Terms of Use
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing and using the Tulane University AI & Data Science Division website ("Website"), 
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  These Terms of Use ("Terms") govern your use of our Website operated by the Tulane University 
                  School of Medicine AI & Data Science Division ("we," "our," or "us").
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 text-tulane-green mr-2" />
                Use License
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Permission is granted to temporarily download one copy of the materials on the Website for 
                  personal, non-commercial transitory viewing only. This is the grant of a license, not a 
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the Website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be 
                  terminated by us at any time. Upon terminating your viewing of these materials or upon the 
                  termination of this license, you must destroy any downloaded materials in your possession 
                  whether in electronic or printed format.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree to use the Website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Prohibited Activities</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Use the Website in any way that violates applicable federal, state, local, or international law</li>
                  <li>Transmit or procure the sending of any advertising or promotional material without our prior written consent</li>
                  <li>Impersonate or attempt to impersonate the University, a University employee, another user, or any other person or entity</li>
                  <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website</li>
                  <li>Use any robot, spider, or other automatic device to access the Website for any purpose without our express written permission</li>
                  <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
                  <li>Attempt to gain unauthorized access to any portion of the Website or any other systems or networks connected to the Website</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Content</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our Website may allow you to post, link, store, share and otherwise make available certain information, 
                  text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post 
                  to the Website, including its legality, reliability, and appropriateness.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Content Standards</h3>
                <p>By posting Content to the Website, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your use of the Content does not infringe, violate or misappropriate the rights of any third party</li>
                  <li>The Content is accurate and not misleading</li>
                  <li>The Content does not contain obscene, offensive, or otherwise inappropriate material</li>
                  <li>The Content does not contain any personal information of third parties without their consent</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Content Ownership</h3>
                <p>
                  You retain ownership of any intellectual property rights that you hold in the Content. However, 
                  by posting Content, you grant us a non-exclusive, royalty-free, worldwide license to use, 
                  display, and distribute your Content in connection with the Website.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Website, 
                  to understand our practices.
                </p>
                <p>
                  <a href="/privacy" className="text-tulane-green hover:underline">
                    View our Privacy Policy
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-tulane-green mr-2" />
                Disclaimer
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The information on this Website is provided on an "as is" basis. To the fullest extent permitted by law, 
                  Tulane University excludes all representations, warranties, conditions and terms whether express or implied, 
                  statutory or otherwise.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Academic Information</h3>
                <p>
                  While we strive to provide accurate and up-to-date information about our programs, research, and faculty, 
                  this information is subject to change. Always verify important details directly with the appropriate 
                  university departments.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">External Links</h3>
                <p>
                  Our Website may contain links to external websites that are not provided or maintained by us. 
                  We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitations of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  In no event shall Tulane University, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                  loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Website.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You agree to defend, indemnify, and hold harmless Tulane University and its licensee and licensors, 
                  and their employees, contractors, agents, officers and directors, from and against any and all claims, 
                  damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, 
                  including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Website will cease immediately.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  These Terms shall be interpreted and governed by the laws of the State of Louisiana, without regard to its 
                  conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered 
                  a waiver of those rights.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use 
                  our Website after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-tulane-green mr-2" />
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about these Terms of Use, please contact us:</p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Tulane AI & Data Science Division</h3>
                  <div className="space-y-2">
                    <div>Email: ai@tulane.edu</div>
                    <div>Phone: (504) 988-5263</div>
                    <div>
                      Address:<br />
                      1430 Tulane Avenue<br />
                      New Orleans, LA 70112<br />
                      United States
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
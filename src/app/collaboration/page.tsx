import { CollaborationOpportunities, ContactForm } from '@/components/contact';

export default function CollaborationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-tulane-green sm:text-5xl">
              Collaboration Opportunities
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Join us in advancing AI and data science in healthcare. We offer various collaboration 
              opportunities for researchers, industry partners, students, and academic institutions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Collaboration Opportunities */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <CollaborationOpportunities />
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Interested in Collaborating?
            </h2>
            <p className="text-gray-600 mb-6">
              Send us a message to discuss potential collaboration opportunities. 
              We're always excited to explore new partnerships and research directions.
            </p>
            <ContactForm />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Collaborate with Us?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-tulane-green rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Cutting-edge Research</h4>
                  <p className="text-sm text-gray-600">
                    Access to the latest AI and machine learning research in healthcare applications.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-tulane-green rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Clinical Expertise</h4>
                  <p className="text-sm text-gray-600">
                    Direct collaboration with medical professionals and access to clinical insights.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-tulane-green rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Diverse Expertise</h4>
                  <p className="text-sm text-gray-600">
                    Interdisciplinary team with backgrounds in computer science, medicine, and engineering.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-tulane-green rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Real-world Impact</h4>
                  <p className="text-sm text-gray-600">
                    Focus on translating research into practical solutions that improve patient care.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-tulane-green rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Publication Opportunities</h4>
                  <p className="text-sm text-gray-600">
                    Joint publications in top-tier conferences and journals.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-tulane-green/5 rounded-lg border border-tulane-green/20">
              <h4 className="font-medium text-tulane-green mb-2">Quick Response</h4>
              <p className="text-sm text-gray-600">
                We typically respond to collaboration inquiries within 48 hours and can schedule 
                initial discussions within a week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import type { Metadata } from 'next';
import { ContactForm, ContactInfo, InteractiveMap, CollaborationOpportunities } from '@/components/contact';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "Contact Us",
  description: "Get in touch with our team for collaborations, inquiries, or to learn more about our AI and data science research. We're here to help and excited to connect with you.",
  url: "/contact",
  type: "website",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-tulane-green sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Get in touch with our team for collaborations, inquiries, or to learn more about our 
              AI and data science research. We're here to help and excited to connect with you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ContactInfo />
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <InteractiveMap />
        </div>

        {/* Collaboration Opportunities */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <CollaborationOpportunities />
        </div>
      </div>
    </div>
  );
}
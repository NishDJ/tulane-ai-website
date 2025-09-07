'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

interface ContactMethod {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  description?: string;
}

interface OfficeLocation {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  directions?: string;
}

interface ContactInfoProps {
  contactMethods?: ContactMethod[];
  officeLocations?: OfficeLocation[];
  className?: string;
}

const defaultContactMethods: ContactMethod[] = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: 'Email',
    value: 'ai-datascience@tulane.edu',
    href: 'mailto:ai-datascience@tulane.edu',
    description: 'General inquiries and collaboration requests',
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: 'Phone',
    value: '(504) 988-5263',
    href: 'tel:+15049885263',
    description: 'Office hours: Monday-Friday, 9:00 AM - 5:00 PM',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: 'Address',
    value: '1440 Canal Street, Suite 2001, New Orleans, LA 70112',
    href: 'https://maps.google.com/?q=1440+Canal+Street+Suite+2001+New+Orleans+LA+70112',
    description: 'Tulane University School of Medicine',
  },
];

const defaultOfficeLocations: OfficeLocation[] = [
  {
    name: 'Main Office',
    address: '1440 Canal Street, Suite 2001\nNew Orleans, LA 70112',
    phone: '(504) 988-5263',
    email: 'ai-datascience@tulane.edu',
    hours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    directions: 'https://maps.google.com/?q=1440+Canal+Street+Suite+2001+New+Orleans+LA+70112',
  },
  {
    name: 'Research Lab',
    address: '1430 Tulane Avenue\nNew Orleans, LA 70112',
    phone: '(504) 988-5264',
    hours: 'Monday-Friday: 8:00 AM - 6:00 PM',
    directions: 'https://maps.google.com/?q=1430+Tulane+Avenue+New+Orleans+LA+70112',
  },
];

export function ContactInfo({ 
  contactMethods = defaultContactMethods, 
  officeLocations = defaultOfficeLocations,
  className = '' 
}: ContactInfoProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Contact Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 text-tulane-green mt-0.5">
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{method.label}</p>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-sm text-tulane-green hover:text-tulane-green/80 transition-colors inline-flex items-center gap-1"
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {method.value}
                    {method.href.startsWith('http') && <ExternalLink className="h-3 w-3" />}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">{method.value}</p>
                )}
                {method.description && (
                  <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Office Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Locations</h3>
        <div className="space-y-4">
          {officeLocations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <h4 className="font-medium text-gray-900 mb-2">{location.name}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 whitespace-pre-line">{location.address}</p>
                    {location.directions && (
                      <a
                        href={location.directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tulane-green hover:text-tulane-green/80 transition-colors inline-flex items-center gap-1 mt-1"
                      >
                        Get Directions
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {location.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${location.phone.replace(/[^\d+]/g, '')}`}
                      className="text-tulane-green hover:text-tulane-green/80 transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                )}

                {location.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${location.email}`}
                      className="text-tulane-green hover:text-tulane-green/80 transition-colors"
                    >
                      {location.email}
                    </a>
                  </div>
                )}

                {location.hours && (
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{location.hours}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-4 rounded-lg bg-tulane-green/5 border border-tulane-green/20"
      >
        <h4 className="font-medium text-tulane-green mb-2">Response Time</h4>
        <p className="text-sm text-gray-600">
          We typically respond to inquiries within 24-48 hours during business days. 
          For urgent matters, please call our main office directly.
        </p>
      </motion.div>
    </div>
  );
}
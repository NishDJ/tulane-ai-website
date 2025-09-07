'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  phone?: string;
  email?: string;
}

interface InteractiveMapProps {
  locations?: MapLocation[];
  className?: string;
}

const defaultLocations: MapLocation[] = [
  {
    id: 'main-office',
    name: 'Main Office',
    address: '1440 Canal Street, Suite 2001, New Orleans, LA 70112',
    coordinates: { lat: 29.9511, lng: -90.0715 },
    description: 'Administrative offices and meeting rooms',
    phone: '(504) 988-5263',
    email: 'ai-datascience@tulane.edu',
  },
  {
    id: 'research-lab',
    name: 'Research Lab',
    address: '1430 Tulane Avenue, New Orleans, LA 70112',
    coordinates: { lat: 29.9501, lng: -90.0725 },
    description: 'Research facilities and computational resources',
    phone: '(504) 988-5264',
  },
];

export function InteractiveMap({ locations = defaultLocations, className = '' }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(locations[0]);

  const getGoogleMapsUrl = (location: MapLocation) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  };

  const getDirectionsUrl = (location: MapLocation) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Us</h3>
        
        {/* Location Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLocation?.id === location.id
                  ? 'bg-tulane-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          {/* Embedded Google Map */}
          <div className="aspect-video w-full">
            {selectedLocation && (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(selectedLocation.address)}&zoom=16`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing ${selectedLocation.name}`}
              />
            )}
          </div>

          {/* Fallback for when Google Maps API key is not available */}
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && selectedLocation && (
            <div className="aspect-video w-full flex items-center justify-center bg-gray-200">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedLocation.address}</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => window.open(getGoogleMapsUrl(selectedLocation), '_blank')}
                    className="w-full bg-tulane-green hover:bg-tulane-green/90"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                  <Button
                    onClick={() => window.open(getDirectionsUrl(selectedLocation), '_blank')}
                    variant="outline"
                    className="w-full"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        {selectedLocation && (
          <motion.div
            key={selectedLocation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 mb-1">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
                {selectedLocation.description && (
                  <p className="text-sm text-gray-500 mb-3">{selectedLocation.description}</p>
                )}
                
                <div className="space-y-1 text-sm">
                  {selectedLocation.phone && (
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>{' '}
                      <a
                        href={`tel:${selectedLocation.phone.replace(/[^\d+]/g, '')}`}
                        className="text-tulane-green hover:text-tulane-green/80 transition-colors"
                      >
                        {selectedLocation.phone}
                      </a>
                    </p>
                  )}
                  {selectedLocation.email && (
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{' '}
                      <a
                        href={`mailto:${selectedLocation.email}`}
                        className="text-tulane-green hover:text-tulane-green/80 transition-colors"
                      >
                        {selectedLocation.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => window.open(getDirectionsUrl(selectedLocation), '_blank')}
                  className="bg-tulane-green hover:bg-tulane-green/90"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Directions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(getGoogleMapsUrl(selectedLocation), '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Map
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h4 className="font-medium text-blue-900 mb-2">Visiting Information</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Visitor parking is available in the Canal Street garage</p>
            <p>• Please check in at the main reception desk upon arrival</p>
            <p>• For after-hours access, please contact us in advance</p>
            <p>• The building is accessible via public transportation (streetcar and bus)</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
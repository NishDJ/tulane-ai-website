'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FacultyImage } from '@/components/ui/optimized-image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';
import { type FacultyMember } from '@/types';

interface FacultyCardProps {
  faculty: FacultyMember;
  index?: number;
}

export function FacultyCard({ faculty, index = 0 }: FacultyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'website':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl touch-manipulation"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div variants={imageVariants} className="h-full w-full">
          <FacultyImage
            src={faculty.profileImage}
            alt={`${faculty.name} profile photo`}
            fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Hover Overlay */}
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{faculty.email}</span>
            </div>
            {faculty.phone && (
              <div className="mt-1 flex items-center gap-2 text-white">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{faculty.phone}</span>
              </div>
            )}
            {faculty.office && (
              <div className="mt-1 flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{faculty.office}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-tulane-green transition-colors duration-200">
            {faculty.name}
          </h3>
          <p className="text-sm font-medium text-tulane-blue">{faculty.title}</p>
          <p className="text-sm text-gray-600">{faculty.department}</p>
        </div>

        {/* Research Areas */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {faculty.researchAreas.slice(0, 3).map((area, idx) => (
              <span
                key={idx}
                className="inline-block rounded-full bg-tulane-green/10 px-2 py-1 text-xs font-medium text-tulane-green"
              >
                {area}
              </span>
            ))}
            {faculty.researchAreas.length > 3 && (
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                +{faculty.researchAreas.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Bio Preview */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {faculty.bio}
        </p>

        {/* Social Links */}
        {faculty.socialLinks && (
          <div className="mb-4 flex gap-2">
            {Object.entries(faculty.socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors duration-200 hover:bg-tulane-green hover:text-white touch-manipulation"
                aria-label={`${faculty.name}'s ${platform} profile`}
              >
                {getSocialIcon(platform)}
              </a>
            ))}
          </div>
        )}

        {/* View Profile Button */}
        <Link
          href={`/faculty/${faculty.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-tulane-green px-4 py-3 sm:py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-tulane-green/90 focus:outline-none focus:ring-2 focus:ring-tulane-green focus:ring-offset-2 min-h-[44px] touch-manipulation"
        >
          View Full Profile
        </Link>
      </div>
    </motion.div>
  );
}
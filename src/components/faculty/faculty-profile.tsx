'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter,
  GraduationCap,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';
import { type FacultyMember } from '@/types';

interface FacultyProfileProps {
  faculty: FacultyMember;
}

export function FacultyProfile({ faculty }: FacultyProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'publications'>('overview');
  const [imageLoaded, setImageLoaded] = useState(false);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'website':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'publications', label: 'Publications', icon: BookOpen },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg"
      >
        <div className="relative bg-gradient-to-r from-tulane-green to-tulane-blue p-8 text-white">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
            {/* Profile Image */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/20">
              <Image
                src={faculty.profileImage}
                alt={`${faculty.name} profile photo`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                sizes="128px"
              />
              {!imageLoaded && (
                <div className="flex h-full w-full items-center justify-center bg-white/20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold lg:text-4xl">{faculty.name}</h1>
              <p className="mt-2 text-xl font-medium text-white/90">{faculty.title}</p>
              <p className="text-lg text-white/80">{faculty.department}</p>

              {/* Contact Info */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${faculty.email}`} className="hover:underline">
                    {faculty.email}
                  </a>
                </div>
                {faculty.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${faculty.phone}`} className="hover:underline">
                      {faculty.phone}
                    </a>
                  </div>
                )}
                {faculty.office && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{faculty.office}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {faculty.socialLinks && (
                <div className="mt-4 flex gap-3">
                  {Object.entries(faculty.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-200 hover:bg-white/30"
                      aria-label={`${faculty.name}'s ${platform} profile`}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <nav className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-tulane-green shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-white p-8 shadow-lg"
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Bio */}
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Biography</h2>
              <p className="text-gray-700 leading-relaxed">{faculty.bio}</p>
            </div>

            {/* Research Areas */}
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Research Areas</h2>
              <div className="flex flex-wrap gap-2">
                {faculty.researchAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-tulane-green/10 px-4 py-2 text-sm font-medium text-tulane-green"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Education</h2>
            <div className="space-y-6">
              {faculty.education.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex gap-4 rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-tulane-green/10">
                    <GraduationCap className="h-6 w-6 text-tulane-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-tulane-blue font-medium">{edu.institution}</p>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{edu.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'publications' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Publications ({faculty.publications.length})
            </h2>
            <div className="space-y-6">
              {faculty.publications.map((pub, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {pub.authors.join(', ')}
                  </p>
                  <p className="text-tulane-blue font-medium mb-2">{pub.journal}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{pub.year}</span>
                    </div>
                    <div className="flex gap-2">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-tulane-green hover:underline"
                        >
                          DOI
                        </a>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-tulane-green hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
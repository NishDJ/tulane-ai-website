'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  FileText,
  HelpCircle
} from 'lucide-react';
import type { ApplicationInfo, ApplicationStep, ApplicationRequirement, FAQ } from '@/types';
import { cn } from '@/lib/utils';

interface ApplicationInfoProps {
  applicationInfo: ApplicationInfo;
  className?: string;
}

interface StepItemProps {
  step: ApplicationStep;
  isCompleted?: boolean;
  isActive?: boolean;
}

function StepItem({ step, isCompleted = false, isActive = false }: StepItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isCompleted 
            ? 'bg-green-100 text-green-800 border-2 border-green-200'
            : isActive
            ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
            : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
        )}>
          {isCompleted ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            step.step
          )}
        </div>
      </div>
      
      <div className="flex-1 pb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {step.title}
        </h3>
        <p className="text-gray-600 mb-2">
          {step.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {step.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{step.estimatedTime}</span>
            </div>
          )}
          
          {step.url && (
            <a
              href={step.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Start Step
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface RequirementItemProps {
  requirement: ApplicationRequirement;
}

function RequirementItem({ requirement }: RequirementItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {requirement.title}
              </h3>
              {requirement.required && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full border border-red-200">
                  Required
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {requirement.description}
            </p>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Required Documents</h4>
              <div className="space-y-2">
                {requirement.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQItemProps {
  faq: FAQ;
}

function FAQItem({ faq }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900">
              {faq.question}
            </h3>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ApplicationInfo({ applicationInfo, className }: ApplicationInfoProps) {
  const [activeTab, setActiveTab] = useState<'process' | 'requirements' | 'deadlines' | 'faq'>('process');

  const tabs = [
    { id: 'process' as const, label: 'Application Process', count: applicationInfo.process.length },
    { id: 'requirements' as const, label: 'Requirements', count: applicationInfo.requirements.length },
    { id: 'deadlines' as const, label: 'Deadlines', count: applicationInfo.deadlines.length },
    { id: 'faq' as const, label: 'FAQ', count: applicationInfo.faq.length },
  ];

  const formatDeadlineDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDeadlineStatus = (date: Date) => {
    const now = new Date();
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { status: 'passed', color: 'text-red-600', label: 'Passed' };
    if (daysUntil <= 7) return { status: 'urgent', color: 'text-orange-600', label: `${daysUntil} days left` };
    if (daysUntil <= 30) return { status: 'soon', color: 'text-yellow-600', label: `${daysUntil} days left` };
    return { status: 'upcoming', color: 'text-green-600', label: `${daysUntil} days left` };
  };

  return (
    <div className={className}>
      {/* Contact Information */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="h-4 w-4 text-blue-600" />
            <a href={`mailto:${applicationInfo.contactInfo.email}`} className="hover:text-blue-600 transition-colors">
              {applicationInfo.contactInfo.email}
            </a>
          </div>
          
          {applicationInfo.contactInfo.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4 text-blue-600" />
              <a href={`tel:${applicationInfo.contactInfo.phone}`} className="hover:text-blue-600 transition-colors">
                {applicationInfo.contactInfo.phone}
              </a>
            </div>
          )}
          
          {applicationInfo.contactInfo.office && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{applicationInfo.contactInfo.office}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'process' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Application Process</h2>
              <div className="space-y-0">
                {applicationInfo.process.map((step, index) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    isCompleted={false}
                    isActive={index === 0}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Application Requirements</h2>
              <div className="space-y-4">
                {applicationInfo.requirements.map((requirement) => (
                  <RequirementItem key={requirement.id} requirement={requirement} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deadlines' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Deadlines</h2>
              <div className="space-y-4">
                {applicationInfo.deadlines.map((deadline) => {
                  const status = getDeadlineStatus(deadline.date);
                  return (
                    <div key={deadline.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                              {deadline.type.replace('-', ' ')} Deadline
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-2">{deadline.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDeadlineDate(deadline.date)}
                          </p>
                        </div>
                        <div className={cn('text-sm font-medium', status.color)}>
                          {status.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {applicationInfo.faq.map((faq) => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, Lightbulb, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollaborationOpportunity {
  id: string;
  title: string;
  type: 'research' | 'industry' | 'academic' | 'student';
  description: string;
  requirements?: string[];
  benefits?: string[];
  applicationDeadline?: Date;
  contactEmail?: string;
  applicationUrl?: string;
  location?: string;
  duration?: string;
  featured?: boolean;
}

interface CollaborationOpportunitiesProps {
  opportunities?: CollaborationOpportunity[];
  className?: string;
}

const defaultOpportunities: CollaborationOpportunity[] = [
  {
    id: 'postdoc-ai-healthcare',
    title: 'Postdoctoral Research Fellow - AI in Healthcare',
    type: 'research',
    description: 'Join our team to develop cutting-edge AI solutions for medical diagnosis and treatment optimization. Work with clinical data and collaborate with physicians to translate research into practice.',
    requirements: [
      'PhD in Computer Science, Biomedical Engineering, or related field',
      'Experience with machine learning and deep learning frameworks',
      'Strong programming skills in Python and R',
      'Background in healthcare applications preferred',
    ],
    benefits: [
      'Competitive salary and benefits',
      'Access to clinical datasets and computing resources',
      'Mentorship from leading researchers',
      'Opportunities for publication and conference presentations',
    ],
    applicationDeadline: new Date('2024-06-30'),
    contactEmail: 'postdoc-hiring@tulane.edu',
    location: 'New Orleans, LA',
    duration: '2-3 years',
    featured: true,
  },
  {
    id: 'industry-partnership',
    title: 'Industry Research Partnerships',
    type: 'industry',
    description: 'Partner with us to develop AI solutions for real-world healthcare challenges. We offer collaborative research opportunities, technology transfer, and access to our expertise.',
    requirements: [
      'Healthcare or technology company',
      'Commitment to collaborative research',
      'Shared intellectual property agreements',
      'Funding for research activities',
    ],
    benefits: [
      'Access to cutting-edge research and expertise',
      'Priority licensing for developed technologies',
      'Joint publication opportunities',
      'Student internship programs',
    ],
    contactEmail: 'partnerships@tulane.edu',
    featured: true,
  },
  {
    id: 'visiting-scholar',
    title: 'Visiting Scholar Program',
    type: 'academic',
    description: 'Spend a semester or year collaborating with our faculty on AI and data science research. Perfect for sabbatical visits or extended research collaborations.',
    requirements: [
      'Faculty position at accredited institution',
      'Relevant research background in AI/ML or healthcare',
      'Proposal for collaborative research project',
      'Funding for visit (partial support may be available)',
    ],
    benefits: [
      'Access to research facilities and resources',
      'Collaboration with interdisciplinary team',
      'Seminar and workshop opportunities',
      'New Orleans cultural experience',
    ],
    contactEmail: 'visiting-scholars@tulane.edu',
    location: 'New Orleans, LA',
    duration: '3-12 months',
  },
  {
    id: 'graduate-research',
    title: 'Graduate Research Assistantships',
    type: 'student',
    description: 'PhD and Master\'s students can join our research projects in AI for healthcare, working closely with faculty and contributing to cutting-edge research.',
    requirements: [
      'Enrolled in relevant graduate program',
      'Strong academic record (GPA > 3.5)',
      'Programming experience in Python/R',
      'Interest in healthcare applications of AI',
    ],
    benefits: [
      'Research assistantship stipend',
      'Tuition support',
      'Conference travel funding',
      'Thesis/dissertation support',
    ],
    contactEmail: 'graduate-admissions@tulane.edu',
    applicationUrl: 'https://tulane.edu/graduate-admissions',
    location: 'New Orleans, LA',
    duration: '2-5 years',
  },
  {
    id: 'summer-internship',
    title: 'Summer Research Internships',
    type: 'student',
    description: 'Undergraduate and graduate students can participate in 10-week summer research programs, working on AI projects with mentorship from faculty and graduate students.',
    requirements: [
      'Undergraduate or graduate student',
      'Background in computer science, engineering, or related field',
      'Basic programming skills',
      'Strong motivation for research',
    ],
    benefits: [
      'Research stipend',
      'Housing assistance',
      'Professional development workshops',
      'Networking opportunities',
    ],
    applicationDeadline: new Date('2024-03-15'),
    contactEmail: 'summer-research@tulane.edu',
    location: 'New Orleans, LA',
    duration: '10 weeks (June-August)',
  },
];

const typeIcons = {
  research: <Lightbulb className="h-5 w-5" />,
  industry: <Briefcase className="h-5 w-5" />,
  academic: <GraduationCap className="h-5 w-5" />,
  student: <Users className="h-5 w-5" />,
};

const typeColors = {
  research: 'bg-purple-100 text-purple-800 border-purple-200',
  industry: 'bg-blue-100 text-blue-800 border-blue-200',
  academic: 'bg-green-100 text-green-800 border-green-200',
  student: 'bg-orange-100 text-orange-800 border-orange-200',
};

export function CollaborationOpportunities({ 
  opportunities = defaultOpportunities, 
  className = '' 
}: CollaborationOpportunitiesProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isDeadlineApproaching = (deadline: Date) => {
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const featuredOpportunities = opportunities.filter(opp => opp.featured);
  const regularOpportunities = opportunities.filter(opp => !opp.featured);

  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration Opportunities</h3>
        <p className="text-gray-600 mb-6">
          Join us in advancing AI and data science in healthcare through various collaboration opportunities.
        </p>

        {/* Featured Opportunities */}
        {featuredOpportunities.length > 0 && (
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Featured Opportunities</h4>
            <div className="space-y-4">
              {featuredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-gradient-to-r from-tulane-green/5 to-tulane-blue/5 rounded-lg border border-tulane-green/20 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${typeColors[opportunity.type]}`}>
                        {typeIcons[opportunity.type]}
                      </div>
                      <div>
                        <h5 className="text-lg font-medium text-gray-900">{opportunity.title}</h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          {opportunity.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{opportunity.location}</span>
                            </span>
                          )}
                          {opportunity.duration && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{opportunity.duration}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {opportunity.applicationDeadline && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDeadlineApproaching(opportunity.applicationDeadline)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        Deadline: {formatDate(opportunity.applicationDeadline)}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{opportunity.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {opportunity.requirements && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Requirements</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {opportunity.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-tulane-green mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {opportunity.benefits && (
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Benefits</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {opportunity.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-tulane-green mt-1">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {opportunity.applicationUrl && (
                      <Button
                        onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                        className="bg-tulane-green hover:bg-tulane-green/90"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                    {opportunity.contactEmail && (
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `mailto:${opportunity.contactEmail}?subject=Inquiry about ${opportunity.title}`}
                      >
                        Contact Us
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Opportunities */}
        {regularOpportunities.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">All Opportunities</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {regularOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (featuredOpportunities.length * 0.1) + (index * 0.1) }}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-md ${typeColors[opportunity.type]}`}>
                        {typeIcons[opportunity.type]}
                      </div>
                      <h5 className="font-medium text-gray-900">{opportunity.title}</h5>
                    </div>
                    {opportunity.applicationDeadline && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isDeadlineApproaching(opportunity.applicationDeadline)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formatDate(opportunity.applicationDeadline)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{opportunity.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {opportunity.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{opportunity.location}</span>
                      </span>
                    )}
                    {opportunity.duration && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{opportunity.duration}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {opportunity.applicationUrl && (
                      <Button
                        size="sm"
                        onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                        className="bg-tulane-green hover:bg-tulane-green/90 text-xs"
                      >
                        Apply
                      </Button>
                    )}
                    {opportunity.contactEmail && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `mailto:${opportunity.contactEmail}?subject=Inquiry about ${opportunity.title}`}
                        className="text-xs"
                      >
                        Contact
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 p-6 bg-tulane-green/5 rounded-lg border border-tulane-green/20 text-center"
        >
          <h4 className="text-lg font-medium text-tulane-green mb-2">Don't See What You're Looking For?</h4>
          <p className="text-gray-600 mb-4">
            We're always interested in new collaborations and partnerships. 
            Reach out to discuss custom opportunities that align with your interests and our research goals.
          </p>
          <Button
            onClick={() => window.location.href = 'mailto:ai-datascience@tulane.edu?subject=Custom Collaboration Inquiry'}
            className="bg-tulane-green hover:bg-tulane-green/90"
          >
            Contact Us for Custom Opportunities
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
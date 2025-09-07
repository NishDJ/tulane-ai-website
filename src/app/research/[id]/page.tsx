import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Tag, 
  ExternalLink, 
  FileText, 
  Database,
  DollarSign,
  User,
  Download,
  Eye,
  Lock,
  Globe
} from 'lucide-react';
import { getResearchProjectById } from '@/lib/data-loader';
import { generateMetadata as generateSEOMetadata, generateResearchProjectStructuredData } from '@/lib/metadata';

interface ResearchProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ResearchProjectPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await getResearchProjectById(id);
    
    if (!response.success || !response.data) {
      return generateSEOMetadata({
        title: "Research Project Not Found",
        description: "The requested research project could not be found.",
      });
    }

    const project = response.data;

    return generateSEOMetadata({
      title: project.title,
      description: project.description,
      url: `/research/${project.id}`,
      type: "article",
      image: project.images[0],
      tags: project.tags,
    });
  } catch {
    return generateSEOMetadata({
      title: "Research Project",
      description: "Research project at Tulane AI & Data Science Division.",
    });
  }
}

export default async function ResearchProjectPage({ params }: ResearchProjectPageProps) {
  const { id } = await params;
  const response = await getResearchProjectById(id);
  
  if (!response.success || !response.data) {
    notFound();
  }

  const project = response.data;

  const researchStructuredData = generateResearchProjectStructuredData({
    title: project.title,
    description: project.description,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString(),
    principalInvestigator: project.principalInvestigator,
    status: project.status,
    tags: project.tags,
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'restricted':
        return <Eye className="h-4 w-4 text-orange-600" />;
      case 'private':
        return <Lock className="h-4 w-4 text-red-600" />;
      default:
        return <Globe className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'private':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(researchStructuredData),
        }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        {project.images.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        )}
        
        <div className="relative container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-orange-100 text-orange-800 border-orange-200'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              {project.featured && (
                <span className="inline-flex items-center rounded-full bg-tulane-green px-3 py-1 text-sm font-medium text-white">
                  Featured Project
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span><strong>PI:</strong> {project.principalInvestigator}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(project.startDate)}</span>
                {project.endDate && (
                  <>
                    <span>-</span>
                    <span>{formatDate(project.endDate)}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{project.collaborators.length + 1} team members</span>
              </div>
            </div>

            <p className="text-lg text-white/90 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-tulane-green/5 rounded-lg border border-tulane-green/20">
                  <User className="h-5 w-5 text-tulane-green" />
                  <div>
                    <p className="font-semibold text-gray-900">{project.principalInvestigator}</p>
                    <p className="text-sm text-gray-600">Principal Investigator</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{collaborator}</p>
                        <p className="text-xs text-gray-500">Collaborator</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Publications */}
            {project.publications && project.publications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Publications</h2>
                <div className="space-y-4">
                  {project.publications.map((publication, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">{publication.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {publication.authors.join(', ')} ({publication.year})
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <em>{publication.journal}</em>
                      </p>
                      {(publication.doi || publication.url) && (
                        <div className="flex gap-3">
                          {publication.doi && (
                            <a
                              href={`https://doi.org/${publication.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              DOI
                            </a>
                          )}
                          {publication.url && (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Publication
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Datasets */}
            {project.datasets && project.datasets.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Datasets</h2>
                <div className="space-y-4">
                  {project.datasets.map((dataset, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getAccessLevelColor(dataset.accessLevel)}`}>
                          {getAccessLevelIcon(dataset.accessLevel)}
                          {dataset.accessLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{dataset.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span><strong>Size:</strong> {dataset.size}</span>
                        <span><strong>Format:</strong> {dataset.format}</span>
                      </div>
                      {dataset.downloadUrl && dataset.accessLevel === 'public' && (
                        <a
                          href={dataset.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-tulane-green hover:text-tulane-green/80 transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          Download Dataset
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-orange-100 text-orange-800 border-orange-200'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Duration</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(project.startDate)}
                    {project.endDate && (
                      <>
                        <br />
                        <span className="text-gray-500">to</span> {formatDate(project.endDate)}
                      </>
                    )}
                  </p>
                </div>

                {project.fundingSource && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Funding</p>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-900">{project.fundingSource}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Research Areas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full bg-tulane-green/10 px-3 py-1 text-sm font-medium text-tulane-green"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Team Size</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {project.collaborators.length + 1}
                  </span>
                </div>
                
                {project.publications && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Publications</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {project.publications.length}
                    </span>
                  </div>
                )}
                
                {project.datasets && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Datasets</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {project.datasets.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
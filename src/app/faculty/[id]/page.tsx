import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FacultyProfile } from '@/components/faculty';
import { loadFacultyData } from '@/lib/data-loader';
import { generateMetadata as generateSEOMetadata, generatePersonStructuredData } from '@/lib/metadata';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const facultyData = await loadFacultyData();
    const faculty = facultyData.find(f => f.id === params.id);
    
    if (!faculty) {
      return generateSEOMetadata({
        title: "Faculty Member Not Found",
        description: "The requested faculty member could not be found.",
      });
    }

    return generateSEOMetadata({
      title: faculty.name,
      description: `${faculty.name}, ${faculty.title} at Tulane AI & Data Science Division. Research areas: ${faculty.researchAreas.join(', ')}.`,
      url: `/faculty/${faculty.id}`,
      type: "profile",
      image: faculty.profileImage,
    });
  } catch {
    return generateSEOMetadata({
      title: "Faculty Member",
      description: "Faculty member profile at Tulane AI & Data Science Division.",
    });
  }
}

export default async function FacultyProfilePage({ params }: Props) {
  try {
    const facultyData = await loadFacultyData();
    const faculty = facultyData.find(f => f.id === params.id);

    if (!faculty) {
      return notFound();
    }

    const personStructuredData = generatePersonStructuredData({
      name: faculty.name,
      title: faculty.title,
      email: faculty.email,
      bio: faculty.bio,
      image: faculty.profileImage,
      researchAreas: faculty.researchAreas,
      publications: faculty.publications,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <FacultyProfile faculty={faculty} />
        </div>
      </>
    );
  } catch {
    return notFound();
  }
}
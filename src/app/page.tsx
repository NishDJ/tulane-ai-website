import type { Metadata } from 'next';
import { Hero } from '@/components/sections';
import { generateMetadata } from '@/lib/metadata';

// Force dynamic rendering to avoid SSG issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description: "Leading innovation in medical AI and data science at Tulane University School of Medicine. Discover our research, faculty, and programs advancing healthcare through artificial intelligence.",
  url: "/",
  type: "website",
});

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Content section for scroll target */}
      <section id="content" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-tulane-green sm:text-4xl mb-6">
              Leading Innovation in Medical AI
            </h2>
            <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Our division combines cutting-edge artificial intelligence with medical expertise 
              to advance patient care, accelerate research discoveries, and train the next 
              generation of medical AI professionals.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

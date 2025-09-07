'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useParallax } from '@/hooks/useParallax';
import { 
  Particles, 
  Typewriter, 
  ScrollIndicator, 
  AnimatedButton, 
  VideoBackground,
  ParallaxBackground
} from '@/components/animations';

const Hero = () => {
  const controls = useAnimation();
  const { elementRef: heroRef, isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Parallax effects for different elements
  const { ref: backgroundRef, transform: backgroundY } = useParallax({ speed: 0.3 });
  const { ref: contentRef, transform: contentY } = useParallax({ speed: 0.1 });
  const { ref: particlesRef, transform: particlesY } = useParallax({ speed: 0.5 });

  const dynamicTexts = [
    "Advancing Medical Research",
    "Transforming Healthcare with AI",
    "Pioneering Data Science Solutions",
    "Innovating Patient Care"
  ];



  // Scroll animations
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);





  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };



  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-tulane-blue via-tulane-green to-tulane-blue touch-manipulation"
    >
      {/* Parallax Background */}
      <ParallaxBackground
        imageSrc="/images/hero-fallback.svg"
        speed={0.3}
        className="absolute inset-0 z-0"
        overlay={true}
      />

      {/* Animated Background Particles with Parallax */}
      <motion.div
        ref={particlesRef}
        style={{ y: particlesY }}
        className="absolute inset-0 z-5"
      >
        <Particles count={50} />
      </motion.div>

      {/* Video Background with Parallax */}
      <motion.div
        ref={backgroundRef}
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <VideoBackground
          videoSources={[
            { src: "/videos/hero-background.mp4", type: "video/mp4" },
            { src: "/videos/hero-background.webm", type: "video/webm" }
          ]}
          fallbackImage="/images/hero-fallback.svg"
          className="w-full h-full opacity-20"
          showControls={true}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10" />

      {/* Hero Content with Subtle Parallax */}
      <motion.div
        ref={contentRef}
        style={{ y: contentY }}
        className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="block">Tulane.ai</span>
            <Typewriter 
              texts={dynamicTexts}
              className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-4 text-blue-200"
              speed={2500}
              delay={300}
            />
          </h1>
        </motion.div>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
          variants={itemVariants}
        >
          Empowering the future of medicine through cutting-edge artificial intelligence 
          and data science research at Tulane University School of Medicine.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto"
          variants={itemVariants}
        >
          <AnimatedButton
            size="touch"
            glowEffect
            asChild
            className="w-full sm:w-auto bg-tulane-green hover:bg-tulane-green/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/research">Explore Our Research</Link>
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            size="touch"
            asChild
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-tulane-blue px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg backdrop-blur-sm transition-all duration-300"
          >
            <Link href="/faculty">Meet Our Faculty</Link>
          </AnimatedButton>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 sm:p-6 border border-white/20">
            <motion.div
              className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              50+
            </motion.div>
            <div className="text-sm sm:text-base text-blue-200">Research Projects</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 sm:p-6 border border-white/20">
            <motion.div
              className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              25+
            </motion.div>
            <div className="text-sm sm:text-base text-blue-200">Faculty Members</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 sm:p-6 border border-white/20 sm:col-span-1 col-span-1">
            <motion.div
              className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              100+
            </motion.div>
            <div className="text-sm sm:text-base text-blue-200">Publications</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <ScrollIndicator targetId="content" />
      </div>
    </section>
  );
};

export default Hero;
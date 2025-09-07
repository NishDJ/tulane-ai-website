'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ParallaxSection,
  ParallaxBackground,
  LoadingSpinner,
  FacultySkeleton,
  PageTransition,
  StaggeredContainer,
  StaggeredItem,
  SlideInSection,
  HoverCard,
  InteractiveButton,
  AnimatedInput,
  PulseIcon,
  FloatingActionButton,
  FormStateAlert,
  SubmissionState,
  ProgressBar,
  ValidationIcon
} from '@/components/animations';
import { LoadingDemo } from '@/components/animations/loading-demo';
import { Heart, Star, Zap, ArrowUp } from 'lucide-react';

export default function AnimationsDemoClient() {
  const [inputValue, setInputValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    setSubmissionState('submitting');
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTimeout(() => {
      setSubmissionState('success');
      setTimeout(() => setSubmissionState('idle'), 3000);
    }, 1000);
  };

  return (
    <PageTransition variant="fade" className="min-h-screen">
      <div className="bg-gray-50">
        {/* Hero Section with Parallax */}
        <section className="relative h-screen overflow-hidden">
          <ParallaxBackground
            imageSrc="/images/hero-fallback.jpg"
            speed={0.5}
            className="absolute inset-0"
          />
          <div className="relative z-10 flex items-center justify-center h-full text-white">
            <ParallaxSection speed={0.2} className="text-center">
              <motion.h1 
                className="text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Advanced Animations
              </motion.h1>
              <motion.p 
                className="text-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Micro-interactions and smooth transitions
              </motion.p>
            </ParallaxSection>
          </div>
        </section>

        {/* Loading Animations Section */}
        <SlideInSection className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggeredContainer>
              <StaggeredItem>
                <h2 className="text-3xl font-bold text-center mb-12">Loading Animations</h2>
              </StaggeredItem>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <StaggeredItem>
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold">Loading Spinners</h3>
                    <div className="flex items-center space-x-6">
                      <LoadingSpinner size="sm" variant="spinner" />
                      <LoadingSpinner size="md" variant="dots" />
                      <LoadingSpinner size="lg" variant="pulse" />
                      <LoadingSpinner size="xl" variant="bars" />
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold">Skeleton Screens</h3>
                    <div className="space-y-4">
                      <FacultySkeleton />
                    </div>
                  </div>
                </StaggeredItem>
              </div>

              <StaggeredItem>
                <div className="mt-12">
                  <LoadingDemo type="faculty" count={3} duration={3000} />
                </div>
              </StaggeredItem>
            </StaggeredContainer>
          </div>
        </SlideInSection>

        {/* Micro-interactions Section */}
        <SlideInSection className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggeredContainer>
              <StaggeredItem>
                <h2 className="text-3xl font-bold text-center mb-12">Micro-interactions</h2>
              </StaggeredItem>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StaggeredItem>
                  <HoverCard className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Hover Card</h3>
                    <p className="text-gray-600">Hover over this card to see the effect</p>
                  </HoverCard>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Interactive Buttons</h3>
                    <div className="space-y-3">
                      <InteractiveButton variant="primary" size="md">
                        Primary Button
                      </InteractiveButton>
                      <InteractiveButton variant="secondary" size="md">
                        Secondary Button
                      </InteractiveButton>
                      <InteractiveButton variant="ghost" size="md">
                        Ghost Button
                      </InteractiveButton>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="p-6 bg-white rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Pulse Icons</h3>
                    <div className="flex space-x-4">
                      <PulseIcon intensity="light">
                        <Heart className="w-8 h-8 text-red-500" />
                      </PulseIcon>
                      <PulseIcon intensity="medium">
                        <Star className="w-8 h-8 text-yellow-500" />
                      </PulseIcon>
                      <PulseIcon intensity="strong">
                        <Zap className="w-8 h-8 text-blue-500" />
                      </PulseIcon>
                    </div>
                  </div>
                </StaggeredItem>
              </div>
            </StaggeredContainer>
          </div>
        </SlideInSection>

        {/* Form Animations Section */}
        <SlideInSection className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggeredContainer>
              <StaggeredItem>
                <h2 className="text-3xl font-bold text-center mb-12">Form Animations</h2>
              </StaggeredItem>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <StaggeredItem>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Animated Inputs</h3>
                    <AnimatedInput
                      label="Email Address"
                      type="email"
                      value={inputValue}
                      onChange={setInputValue}
                      placeholder="Enter your email"
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <ValidationIcon isValid={inputValue.includes('@')} />
                      <span className="text-sm text-gray-600">
                        Validation icon changes based on input
                      </span>
                    </div>
                  </div>
                </StaggeredItem>

                <StaggeredItem>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Form States</h3>
                    <div className="space-y-4">
                      <InteractiveButton
                        onClick={() => setShowAlert(!showAlert)}
                        variant="primary"
                      >
                        Toggle Alert
                      </InteractiveButton>
                      
                      <FormStateAlert
                        type="success"
                        message="This is a success message!"
                        visible={showAlert}
                        onClose={() => setShowAlert(false)}
                      />

                      <InteractiveButton
                        onClick={handleSubmit}
                        variant="secondary"
                        disabled={submissionState === 'submitting'}
                      >
                        Test Submission
                      </InteractiveButton>

                      <SubmissionState
                        state={submissionState}
                        successMessage="Form submitted successfully!"
                        errorMessage="Submission failed. Please try again."
                      />

                      {submissionState === 'submitting' && (
                        <ProgressBar
                          progress={progress}
                          showPercentage
                          animated
                        />
                      )}
                    </div>
                  </div>
                </StaggeredItem>
              </div>
            </StaggeredContainer>
          </div>
        </SlideInSection>

        {/* Page Transitions Section */}
        <SlideInSection className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggeredContainer>
              <StaggeredItem>
                <h2 className="text-3xl font-bold text-center mb-12">Page Transitions</h2>
              </StaggeredItem>

              <StaggeredItem>
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-8">
                    This entire page uses smooth page transitions and staggered animations
                    to create a cohesive, engaging user experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SlideInSection direction="left" className="p-6 bg-white rounded-lg">
                      <h3 className="font-semibold mb-2">Slide from Left</h3>
                      <p className="text-gray-600">Content slides in from the left</p>
                    </SlideInSection>
                    
                    <SlideInSection direction="up" className="p-6 bg-white rounded-lg">
                      <h3 className="font-semibold mb-2">Slide from Bottom</h3>
                      <p className="text-gray-600">Content slides in from below</p>
                    </SlideInSection>
                    
                    <SlideInSection direction="right" className="p-6 bg-white rounded-lg">
                      <h3 className="font-semibold mb-2">Slide from Right</h3>
                      <p className="text-gray-600">Content slides in from the right</p>
                    </SlideInSection>
                  </div>
                </div>
              </StaggeredItem>
            </StaggeredContainer>
          </div>
        </SlideInSection>

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="w-6 h-6" />
        </FloatingActionButton>
      </div>
    </PageTransition>
  );
}
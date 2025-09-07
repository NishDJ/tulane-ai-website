import { Metadata } from 'next';
import AnimationsDemoClient from './animations-demo-client';

export const metadata: Metadata = {
  title: 'Animations Demo | Tulane.ai',
  description: 'Demonstration of advanced animations and micro-interactions',
};

export default function AnimationsDemoPage() {
  return <AnimationsDemoClient />;
}
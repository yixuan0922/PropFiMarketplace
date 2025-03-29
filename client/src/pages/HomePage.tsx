import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PropertyListingSection from '@/components/home/PropertyListingSection';
import InvestorSection from '@/components/home/InvestorSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <PropertyListingSection />
      <InvestorSection />
      <TestimonialsSection />
      <CallToActionSection />
    </>
  );
};

export default HomePage;

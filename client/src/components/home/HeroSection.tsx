import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LoanCalculator } from '@/components/ui/loan-calculator';

const HeroSection = () => {
  return (
    <div className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Home Ownership Made Affordable</h1>
            <p className="text-lg mb-6">
              PropFi is a digital marketplace for fractional property ownership. Buy your dream home with just 55% ownership or invest in property tokens for passive income.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="secondary" size="lg" className="bg-white text-black hover:bg-neutral-100" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-black hover:bg-primary-600" asChild>
                <Link href="/invest">Start Investing</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <LoanCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const CallToActionSection = () => {
  return (
    <div className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to transform how you buy or invest in real estate?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Create your PropFi account today and start your journey.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row sm:space-x-4">
            <Button variant="secondary" size="lg" className="bg-white text-primary-700 hover:bg-neutral-100" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="mt-4 sm:mt-0 border-white text-white hover:bg-primary-600"
              asChild
            >
              <Link href="/demo">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;

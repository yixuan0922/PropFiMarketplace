import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Home, TrendingUp, RefreshCw } from 'lucide-react';
import { howItWorksSteps } from '@/lib/mockData';

const HowItWorksSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">How PropFi Works</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            A new way to buy, sell, and invest in real estate with lower barriers to entry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step) => {
            // Determine icon based on step.icon
            let StepIcon;
            switch (step.icon) {
              case 'home':
                StepIcon = Home;
                break;
              case 'chart-line':
                StepIcon = TrendingUp;
                break;
              case 'exchange-alt':
                StepIcon = RefreshCw;
                break;
              default:
                StepIcon = Home;
            }
            
            return (
              <Card key={step.id} className="border border-neutral-200 bg-white hover:shadow-md transition">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center items-center w-12 h-12 bg-primary-50 rounded-full mx-auto mb-4">
                    <StepIcon className="text-primary" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary-50" asChild>
            <Link href="/how-it-works">
              Learn More About PropFi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;

import React from 'react';
import PropertyGrid from '@/components/marketplace/PropertyGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const MarketplacePage: React.FC = () => {
  return (
    <>
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">PropFi Marketplace</h1>
              <p className="text-lg text-primary-100">
                Browse our selection of properties available for fractional ownership. 
                Purchase as little as 55% to become a homeowner or invest in property tokens.
              </p>
            </div>
            <div>
              <Button variant="secondary" className="bg-white text-black hover:bg-neutral-100" asChild>
                <Link href="/invest">
                  View Investment Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-neutral-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary">55%</h3>
                  <p className="text-neutral-600 text-sm">Minimum to occupy</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">10%</h3>
                  <p className="text-neutral-600 text-sm">Minimum to invest</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">45%</h3>
                  <p className="text-neutral-600 text-sm">Average savings</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">3+</h3>
                  <p className="text-neutral-600 text-sm">Cities available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <PropertyGrid />
    </>
  );
};

export default MarketplacePage;

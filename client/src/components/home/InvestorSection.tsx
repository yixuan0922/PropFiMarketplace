import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { InvestmentCalculator } from '@/components/ui/investment-calculator';
import { investmentStats } from '@/lib/mockData';

const InvestorSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Invest in Real Estate Tokens</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Diversify your portfolio with fractional property investments starting from just ${investmentStats.minimumInvestment}.
          </p>
        </div>
        
        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-neutral-50 border border-neutral-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary">{investmentStats.averageAnnualReturn}%</h3>
              <p className="text-neutral-700 mt-2">Average Annual Return</p>
            </CardContent>
          </Card>
          
          <Card className="bg-neutral-50 border border-neutral-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary">${investmentStats.minimumInvestment}</h3>
              <p className="text-neutral-700 mt-2">Minimum Investment</p>
            </CardContent>
          </Card>
          
          <Card className="bg-neutral-50 border border-neutral-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-4xl font-bold text-primary">{investmentStats.citiesAvailable}+</h3>
              <p className="text-neutral-700 mt-2">Cities Available</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Investment Calculator */}
        <div className="max-w-3xl mx-auto">
          <InvestmentCalculator />
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary-50" asChild>
            <Link href="/invest">
              Browse Investment Opportunities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestorSection;

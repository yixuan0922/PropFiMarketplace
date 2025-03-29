import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { InvestmentCalculator } from '@/components/ui/investment-calculator';
import { ArrowRight, Wallet, Building, LineChart, Lock } from 'lucide-react';
import PropertyGrid from '@/components/marketplace/PropertyGrid';
import TokenMarketplace from '@/components/marketplace/TokenMarketplace';
import { investmentStats } from '@/lib/mockData';

const InvestPage: React.FC = () => {
  return (
    <>
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Invest in Real Estate Tokens</h1>
              <p className="text-lg text-primary-100">
                Diversify your portfolio with fractional property investments.
                Start with as little as ${investmentStats.minimumInvestment} and enjoy the benefits of real estate ownership without the hassle.
              </p>
            </div>
            <div>
              <Button variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100" asChild>
                <Link href="/marketplace">
                  View All Properties
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{investmentStats.averageAnnualReturn}%</h3>
                  <p className="text-neutral-600 text-sm">Average Annual Return</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">${investmentStats.minimumInvestment}</h3>
                  <p className="text-neutral-600 text-sm">Minimum Investment</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">{investmentStats.citiesAvailable}+</h3>
                  <p className="text-neutral-600 text-sm">Cities Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Wallet className="w-10 h-10 text-primary p-2 bg-primary-50 rounded-full" />
              </div>
              <CardTitle>Low Entry Point</CardTitle>
              <CardDescription>
                Start with as little as $500
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                PropFi makes real estate investing accessible with low minimum investments, allowing you to get started with just $500 and gradually expand your portfolio.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Building className="w-10 h-10 text-primary p-2 bg-primary-50 rounded-full" />
              </div>
              <CardTitle>Diversification</CardTitle>
              <CardDescription>
                Spread investments across multiple properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Instead of tying up your capital in a single property, diversify by owning tokens in multiple properties across different cities and property types.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2">
                <LineChart className="w-10 h-10 text-primary p-2 bg-primary-50 rounded-full" />
              </div>
              <CardTitle>Liquidity</CardTitle>
              <CardDescription>
                Sell your tokens anytime in our marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Unlike traditional real estate, PropFi tokens can be bought and sold on our marketplace, providing liquidity when you need it without selling an entire property.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-12">
          <InvestmentCalculator />
        </div>
        
        <Tabs defaultValue="new-properties" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="new-properties">New Investment Properties</TabsTrigger>
            <TabsTrigger value="token-marketplace">Token Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-properties">
            <PropertyGrid title="Available Investment Properties" />
          </TabsContent>
          
          <TabsContent value="token-marketplace">
            <TokenMarketplace />
          </TabsContent>
        </Tabs>
        
        <Card className="mt-12 bg-primary-50 border-primary-100">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Your Security is Our Priority</h3>
              <p className="text-neutral-600 max-w-md">
                All property tokens are securely recorded on our platform, with strong legal frameworks to protect your investment. Our team performs detailed due diligence on every property.
              </p>
            </div>
            <Button size="lg" className="min-w-[200px]" asChild>
              <Link href="/signup">Start Investing Today</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvestPage;

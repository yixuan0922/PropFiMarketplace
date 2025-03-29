import React from 'react';
import { PropertyDetails as PropertyDetailsComponent } from '@/components/ui/property-details';
import { InvestmentCalculator } from '@/components/ui/investment-calculator';
import { LoanCalculator } from '@/components/ui/loan-calculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface PropertyDetailsProps {
  propertyId: string;
}

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  // Fetch property details from API
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
  });
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-neutral-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-10 bg-neutral-200 rounded mb-4 w-2/3"></div>
              <div className="h-6 bg-neutral-200 rounded mb-6 w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="h-60 bg-neutral-200 rounded mb-6"></div>
              <div className="h-40 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Property Not Found</h2>
        <p className="text-neutral-600 mb-6">Sorry, we couldn't find the property you're looking for.</p>
        <Link href="/marketplace" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/marketplace" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>
      
      <PropertyDetailsComponent property={property} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="mortgage-calculator">
        <Tabs defaultValue="homebuyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="homebuyer">For Homebuyers</TabsTrigger>
            <TabsTrigger value="investor">For Investors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="homebuyer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoanCalculator defaultValue={property.price} defaultPercentage={55} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Benefits of PropFi for Homebuyers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Lower Down Payment</h3>
                      <p className="text-neutral-600 text-sm">Purchase with a smaller upfront investment compared to traditional home buying.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Reduced Monthly Payments</h3>
                      <p className="text-neutral-600 text-sm">Pay mortgage only on your owned portion, making homeownership more affordable.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Flexible Ownership</h3>
                      <p className="text-neutral-600 text-sm">Increase your ownership over time at your own pace as your finances allow.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Financial Safety Net</h3>
                      <p className="text-neutral-600 text-sm">If needed, sell portions of your ownership instead of the entire property.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="investor">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentCalculator defaultInvestment={property.price * 0.1} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Benefits of PropFi for Investors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Low Entry Point</h3>
                      <p className="text-neutral-600 text-sm">Invest in real estate with as little as ${property.price * (property.minimumInvestment / 100)} for this property.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Property Appreciation</h3>
                      <p className="text-neutral-600 text-sm">Benefit from real estate market growth without the hassles of full ownership.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Portfolio Diversification</h3>
                      <p className="text-neutral-600 text-sm">Spread your investment across multiple properties and locations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Liquidity</h3>
                      <p className="text-neutral-600 text-sm">Trade your property tokens on the PropFi marketplace whenever you need.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PropertyDetails;

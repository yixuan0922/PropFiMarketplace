import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Home, LineChart, Repeat, PercentSquare, Landmark, DollarSign } from 'lucide-react';
import { LoanCalculator } from '@/components/ui/loan-calculator';
import { howItWorksSteps, testimonials } from '@/lib/mockData';

const HowItWorksPage: React.FC = () => {
  return (
    <>
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How PropFi Works</h1>
            <p className="text-lg text-primary-100 mb-6">
              PropFi is a revolutionary platform that makes real estate more accessible 
              through fractional ownership, benefiting both homebuyers and investors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="secondary" size="lg" className="bg-white text-primary-700 hover:bg-neutral-100" asChild>
                <Link href="/marketplace">Browse Properties</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-primary-600" asChild>
                <Link href="/invest">Start Investing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">The PropFi Process</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            A new way to buy, sell, and invest in real estate with lower barriers to entry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {howItWorksSteps.map((step) => {
            // Determine icon based on step.icon
            let StepIcon;
            switch (step.icon) {
              case 'home':
                StepIcon = Home;
                break;
              case 'chart-line':
                StepIcon = LineChart;
                break;
              case 'exchange-alt':
                StepIcon = Repeat;
                break;
              default:
                StepIcon = Home;
            }
            
            return (
              <Card key={step.id} className="border border-neutral-200 bg-white hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex justify-center items-center w-12 h-12 bg-primary-50 rounded-full mr-4">
                      <StepIcon className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                      <p className="text-neutral-600">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Tabs defaultValue="homebuyers" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="homebuyers">For Homebuyers</TabsTrigger>
            <TabsTrigger value="investors">For Investors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="homebuyers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">How PropFi Helps Homebuyers</h2>
                <p className="text-neutral-600 mb-4">
                  PropFi addresses the root causes of housing affordability by reducing initial down payments 
                  and monthly repayments. With PropFi, you can:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <PercentSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Buy with Just 55% Ownership</h3>
                      <p className="text-neutral-600 text-sm">
                        Purchase a home with only 55% of the property's value, dramatically reducing your upfront costs and mortgage.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <Landmark className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Lower Mortgage Payments</h3>
                      <p className="text-neutral-600 text-sm">
                        Since your loan amount is significantly reduced, your monthly mortgage payments are much more affordable.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Full Residency Rights</h3>
                      <p className="text-neutral-600 text-sm">
                        With 55% or more ownership, you gain full residency rights without paying any rent on the investor portion.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Flexible Ownership</h3>
                      <p className="text-neutral-600 text-sm">
                        Increase your ownership stake over time, or sell portions if you need financial flexibility.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button asChild>
                  <Link href="/marketplace">
                    Browse Available Homes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Homeownership Calculator</h3>
                  <LoanCalculator />
                </div>
              </div>
            </div>
            
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Alex's Story: From Renting to Owning</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <p className="text-neutral-700 mb-6">
                    Despite his desire to purchase his first home, 28-year-old engineer Alex lacked the funds necessary 
                    for a down payment on a $600,000 condo. Through PropFi, he was able to purchase a 55% stake 
                    for $330,000, which he could afford with his savings and a smaller mortgage.
                  </p>
                  
                  <p className="text-neutral-700 mb-6">
                    When Alex lost his job a few years later and couldn't keep up with mortgage payments, 
                    PropFi facilitated a partial sale of his shares to investors, dropping his ownership to 45%. 
                    Although he temporarily lost full residency rights and had to pay some rent, 
                    this arrangement helped him avoid foreclosure.
                  </p>
                  
                  <p className="text-neutral-700">
                    After finding a new job and stabilizing his finances, Alex repurchased shares to increase his 
                    ownership back to 55%, reclaiming his full residency rights. Over time, he continued to buy 
                    more tokens, working toward full ownership of his home.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">How PropFi Benefits Investors</h2>
                <p className="text-neutral-600 mb-4">
                  PropFi allows investors to participate in real estate appreciation without the traditional risks 
                  and costs associated with full property ownership:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <PercentSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Fractional Investment</h3>
                      <p className="text-neutral-600 text-sm">
                        Invest in a portion of a property with as little as $500, allowing for portfolio diversification.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Property Appreciation</h3>
                      <p className="text-neutral-600 text-sm">
                        Benefit from real estate market appreciation without the hassles of property management.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Rental Income Option</h3>
                      <p className="text-neutral-600 text-sm">
                        When investing in properties where occupiers own less than 55%, receive rental income from that portion.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-50 rounded-full p-2 mr-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-neutral-900">Liquidity</h3>
                      <p className="text-neutral-600 text-sm">
                        Trade your property tokens in the PropFi Marketplace anytime you want, providing liquidity.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button asChild>
                  <Link href="/invest">
                    View Investment Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Investment Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-neutral-50 p-4 rounded-md text-center">
                        <h3 className="text-2xl font-bold text-primary">8.2%</h3>
                        <p className="text-neutral-600 text-sm">Average Annual Return</p>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-md text-center">
                        <h3 className="text-2xl font-bold text-primary">$500</h3>
                        <p className="text-neutral-600 text-sm">Minimum Investment</p>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-md text-center">
                        <h3 className="text-2xl font-bold text-primary">30+</h3>
                        <p className="text-neutral-600 text-sm">Cities Available</p>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-md text-center">
                        <h3 className="text-2xl font-bold text-primary">24/7</h3>
                        <p className="text-neutral-600 text-sm">Token Marketplace</p>
                      </div>
                    </div>
                    
                    <p className="text-neutral-700">
                      PropFi provides a seamless investment experience with no property management hassles, 
                      transparent fees, and a secure platform for trading property tokens.
                    </p>
                  </CardContent>
                </Card>
                
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Sarah's Investor Story</h3>
                  <blockquote className="text-neutral-700 italic">
                    "I had investment money sitting in low-yield savings accounts. Through PropFi, I've invested in property tokens 
                    across five different cities, creating a diversified real estate portfolio without the hassle of being a landlord. 
                    The returns have been impressive, and I can sell tokens anytime I need liquidity."
                  </blockquote>
                  <div className="mt-4 flex items-center text-green-500">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span className="font-medium">9.1% average annual return</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild>
              <Link href="/marketplace">Browse Properties</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/invest">Start Investing</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OwnershipDisplay } from '@/components/ui/ownership-display';
import { Property } from '@/lib/types';
import { Heart, Home, MapPin, DollarSign, Landmark, Calendar, Share2 } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const {
    title,
    address,
    city,
    state,
    zipCode,
    price,
    pricePerSqft,
    bedrooms,
    bathrooms,
    squareFeet,
    description,
    propertyType,
    imageUrl,
    availableTokens,
    minimumInvestment,
    status,
    createdAt
  } = property;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Property images and basic info */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden mb-6">
            <img 
              src={imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'} 
              alt={title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Badge variant="secondary" className="bg-white text-primary">
                {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
              </Badge>
              <Badge variant="secondary" className="bg-white text-primary">
                {status === 'active' ? 'Available' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{formatCurrency(price)}</p>
                <p className="text-sm text-neutral-500">{formatCurrency(pricePerSqft)}/sqft</p>
              </div>
            </div>
            
            <p className="text-neutral-600 flex items-center mb-4">
              <MapPin className="h-4 w-4 mr-1 text-neutral-400" />
              {address}, {city}, {state} {zipCode}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-50 p-3 rounded-md text-center">
                <p className="text-sm text-neutral-500">Bedrooms</p>
                <p className="text-xl font-semibold">{bedrooms}</p>
              </div>
              <div className="bg-neutral-50 p-3 rounded-md text-center">
                <p className="text-sm text-neutral-500">Bathrooms</p>
                <p className="text-xl font-semibold">{bathrooms}</p>
              </div>
              <div className="bg-neutral-50 p-3 rounded-md text-center">
                <p className="text-sm text-neutral-500">Square Feet</p>
                <p className="text-xl font-semibold">{squareFeet.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white p-4 rounded-md border">
              <p className="text-neutral-700">{description || 'No description available.'}</p>
              <div className="mt-4 flex items-center text-sm text-neutral-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Listed on {formattedDate}</span>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="bg-white p-4 rounded-md border">
              <h3 className="font-semibold mb-2">Property Features</h3>
              <ul className="list-disc pl-5 text-neutral-700 space-y-1">
                <li>Property Type: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}</li>
                <li>Year Built: 2020</li>
                <li>Cooling: Central</li>
                <li>Heating: Forced air</li>
                <li>Parking: 2-car garage</li>
                <li>Lot Size: 0.15 acres</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="neighborhood" className="bg-white p-4 rounded-md border">
              <h3 className="font-semibold mb-2">Local Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Transportation</h4>
                  <ul className="list-disc pl-5 text-neutral-700 text-sm space-y-1">
                    <li>Public transit nearby</li>
                    <li>Easy highway access</li>
                    <li>Bike-friendly area</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Schools</h4>
                  <ul className="list-disc pl-5 text-neutral-700 text-sm space-y-1">
                    <li>Roosevelt Elementary (0.5 mi)</li>
                    <li>Lincoln Middle School (1.2 mi)</li>
                    <li>Washington High School (1.8 mi)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column: Ownership and investment info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ownership Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <OwnershipDisplay
                ownerPercentage={100 - availableTokens}
                availablePercentage={availableTokens}
                price={price}
                minimumInvestment={minimumInvestment}
              />
              
              <div className="mt-6 space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Buy as Homeowner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Begin Your Homeownership Journey</DialogTitle>
                      <DialogDescription>
                        To purchase this property as a homeowner, we'll need to verify your information and pre-approve you for financing. Our team will be in touch shortly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <p className="text-neutral-700">
                        With PropFi, you can buy this property with as little as 55% ownership. The monthly payment would be approximately {formatCurrency(price * 0.55 * 0.004)} instead of {formatCurrency(price * 0.004)} for traditional ownership.
                      </p>
                      <Button className="w-full" onClick={() => {
                        // Close the dialog when clicked
                        document.querySelector('[data-state="open"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true, cancelable: true })
                        );
                        // Display a confirmation message
                        alert("Consultation scheduled! Our team will contact you shortly.");
                      }}>
                        Schedule a Consultation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Invest in This Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invest in Real Estate Tokens</DialogTitle>
                      <DialogDescription>
                        Invest in this property with as little as {formatCurrency(price * (minimumInvestment / 100))} ({minimumInvestment}% ownership).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <p className="text-neutral-700">
                        This property has an expected annual appreciation of 5-7% based on the local market. Token holders benefit from property appreciation and can sell their tokens on the PropFi marketplace.
                      </p>
                      <Button className="w-full" onClick={() => {
                        // Close the dialog when clicked
                        document.querySelector('[data-state="open"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true, cancelable: true })
                        );
                        // Display a confirmation message
                        alert("Investment process initiated! You'll be redirected to complete your purchase.");
                      }}>
                        Proceed to Investment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Property Price</span>
                <span className="font-medium">{formatCurrency(price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Price per sq. ft</span>
                <span className="font-medium">{formatCurrency(pricePerSqft)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Minimum investment</span>
                <span className="font-medium">{formatCurrency(price * (minimumInvestment / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Est. monthly payment (55% ownership)</span>
                <span className="font-medium">{formatCurrency(price * 0.55 * 0.004)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Est. traditional monthly payment</span>
                <span className="font-medium">{formatCurrency(price * 0.004)}</span>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href="#mortgage-calculator">
                    <Landmark className="h-4 w-4 mr-2" />
                    View Payment Calculator
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

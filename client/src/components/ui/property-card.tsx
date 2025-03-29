import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { Property } from '@/lib/types';
import { OwnershipDisplay } from '@/components/ui/ownership-display';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    city,
    state,
    price,
    pricePerSqft,
    bedrooms,
    bathrooms,
    squareFeet,
    imageUrl,
    availableTokens,
    minimumInvestment,
    status
  } = property;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const isNew = status === 'active' && Date.now() - new Date(property.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isHot = availableTokens < 40;

  return (
    <Card className="overflow-hidden hover:shadow-md transition border border-neutral-200 h-full">
      <div className="relative">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
          alt={title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-0 right-0 mt-2 mr-2 bg-neutral-900 bg-opacity-75 rounded-md px-2 py-1">
          <span className="text-white text-sm font-medium">{availableTokens}% Available</span>
        </div>
        
        {isNew && (
          <div className="absolute bottom-0 left-0 mb-2 ml-2">
            <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
          </div>
        )}
        
        {isHot && !isNew && (
          <div className="absolute bottom-0 left-0 mb-2 ml-2">
            <Badge variant="destructive">Hot</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{city}, {state}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-neutral-900">{formatCurrency(price)}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(pricePerSqft)}/sqft</p>
          </div>
        </div>
        
        <div className="mt-3 border-t border-neutral-200 pt-3">
          <div className="flex justify-between text-sm text-neutral-700">
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>{bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{squareFeet} sqft</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <OwnershipDisplay 
            ownerPercentage={100 - availableTokens} 
            availablePercentage={availableTokens}
            price={price}
            minimumInvestment={minimumInvestment}
          />
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button asChild className="flex-1">
            <Link href={`/property/${id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-md">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

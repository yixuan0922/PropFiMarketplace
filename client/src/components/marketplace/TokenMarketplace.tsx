import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'wouter';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { TokenTransaction, Property } from '@/lib/types';

interface TokenListing {
  id: number;
  propertyId: number;
  sellerId: number;
  percentage: number;
  pricePerToken: number;
  totalPrice: number;
  listedDate: string;
  property?: Property;
}

const TokenMarketplace: React.FC = () => {
  const [propertyFilter, setPropertyFilter] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  
  // Fetch token transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<TokenTransaction[]>({
    queryKey: ['/api/token-transactions'],
  });
  
  // Fetch properties
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Create token listings from transactions
  const tokenListings: TokenListing[] = transactions
    .filter(t => t.status === 'pending' && t.sellerId && !t.buyerId)
    .map(t => {
      const property = properties.find(p => p.id === t.propertyId);
      return {
        id: t.id,
        propertyId: t.propertyId,
        sellerId: t.sellerId!,
        percentage: Number(t.percentage),
        pricePerToken: Number(t.amount) / Number(t.percentage),
        totalPrice: Number(t.amount),
        listedDate: t.createdAt,
        property
      };
    });
  
  // Apply filters
  const filteredListings = tokenListings.filter(listing => {
    // Filter by property
    if (propertyFilter && listing.propertyId.toString() !== propertyFilter) {
      return false;
    }
    
    // Filter by price range
    if (priceRange) {
      const [minStr, maxStr] = priceRange.split('-');
      const min = parseInt(minStr);
      const max = maxStr === '+' ? Infinity : parseInt(maxStr);
      
      if (listing.totalPrice < min || listing.totalPrice > max) {
        return false;
      }
    }
    
    return true;
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const isLoading = isLoadingTransactions || isLoadingProperties;
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Token Marketplace</h2>
          <p className="text-neutral-600">Buy and sell property tokens with other investors</p>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              placeholder="Search properties..."
              className="w-48 pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
          </div>
          
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="500-5000">$500 - $5,000</SelectItem>
              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
              <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
              <SelectItem value="50000+">$50,000+</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6 h-24 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 bg-neutral-100">
                    <img 
                      src={listing.property?.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'} 
                      alt={listing.property?.title || 'Property'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {listing.property?.title || `Property #${listing.propertyId}`}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-2">
                          {listing.property ? `${listing.property.city}, ${listing.property.state}` : 'Location unavailable'}
                        </p>
                      </div>
                      <Badge>{listing.percentage.toFixed(2)}% Ownership</Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Total Price</p>
                        <p className="text-xl font-semibold text-neutral-900">{formatCurrency(listing.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Price per Percentage</p>
                        <p className="text-xl font-semibold text-neutral-900">{formatCurrency(listing.pricePerToken)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Listed Date</p>
                        <p className="text-neutral-900">{new Date(listing.listedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="text-sm text-neutral-500">
                        {listing.property ? (
                          <>
                            {listing.property.bedrooms} beds • {listing.property.bathrooms} baths • {listing.property.squareFeet.toLocaleString()} sqft
                          </>
                        ) : (
                          'Property details unavailable'
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Buy Tokens</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Purchase Property Tokens</DialogTitle>
                              <DialogDescription>
                                You are about to purchase {listing.percentage.toFixed(2)}% ownership in {listing.property?.title || `Property #${listing.propertyId}`}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="percentage">Ownership Percentage</Label>
                                  <Input id="percentage" value={listing.percentage.toFixed(2)} readOnly />
                                </div>
                                <div>
                                  <Label htmlFor="amount">Total Price</Label>
                                  <Input id="amount" value={formatCurrency(listing.totalPrice)} readOnly />
                                </div>
                              </div>
                              <p className="text-sm text-neutral-600">
                                By purchasing these tokens, you will own a share of this property and benefit from any appreciation in its value.
                              </p>
                              <Button className="w-full">Confirm Purchase</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" asChild>
                          <Link href={`/property/${listing.propertyId}`}>
                            View Property
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No token listings available</h3>
            <p className="text-neutral-600 mb-6">
              There are currently no property tokens listed for sale. Check back later or explore available properties.
            </p>
            <Button asChild>
              <Link href="/marketplace">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TokenMarketplace;

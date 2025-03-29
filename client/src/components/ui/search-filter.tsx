import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PropertyFilter } from '@/lib/types';

interface SearchFilterProps {
  onFilterChange: (filters: PropertyFilter) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onFilterChange({
      location,
      priceRange,
      propertyType
    });
  };
  
  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
            <Input
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or zip code"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="price-range" className="block text-sm font-medium text-neutral-700 mb-1">Price Range</label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price-range">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="100000-300000">$100k - $300k</SelectItem>
                <SelectItem value="300000-500000">$300k - $500k</SelectItem>
                <SelectItem value="500000-750000">$500k - $750k</SelectItem>
                <SelectItem value="750000-1000000">$750k - $1M</SelectItem>
                <SelectItem value="1000000+">$1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/5">
            <label htmlFor="property-type" className="block text-sm font-medium text-neutral-700 mb-1">Property Type</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="multi-family">Multi-family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

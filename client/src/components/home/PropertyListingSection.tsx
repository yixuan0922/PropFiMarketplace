import React, { useState } from 'react';
import { Link } from 'wouter';
import { PropertyCard } from '@/components/ui/property-card';
import { Button } from '@/components/ui/button';
import { SearchFilter } from '@/components/ui/search-filter';
import { ArrowRight, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Property, PropertyFilter } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

const PropertyListingSection = () => {
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch properties from the API
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  const handleFilterChange = (filters: PropertyFilter) => {
    // In a real implementation, this would update the query parameters
    console.log('Filters changed:', filters);
  };
  
  // Sort properties based on the selected option
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  return (
    <div className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Featured Properties</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <SearchFilter onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200 h-[450px] animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-12 bg-neutral-200 rounded"></div>
                  <div className="h-8 bg-neutral-200 rounded"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button className="inline-flex items-center" asChild>
            <Link href="/marketplace">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingSection;

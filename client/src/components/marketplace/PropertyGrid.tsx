import React, { useState } from 'react';
import { PropertyCard } from '@/components/ui/property-card';
import { SearchFilter } from '@/components/ui/search-filter';
import { Pagination } from '@/components/ui/pagination';
import { Property, PropertyFilter } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

interface PropertyGridProps {
  title?: string;
}

const PropertyGrid = ({ title = "Available Properties" }: PropertyGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<PropertyFilter>({});
  
  // In a real application, we would send these filters to the API
  const handleFilterChange = (filters: PropertyFilter) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Fetch properties from the API
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Apply filters (client-side for this demo)
  const filteredProperties = properties.filter(property => {
    // Filter by location
    if (currentFilters.location && 
        !`${property.city} ${property.state} ${property.zipCode}`.toLowerCase().includes(currentFilters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (currentFilters.priceRange && currentFilters.priceRange !== 'any') {
      const [minStr, maxStr] = currentFilters.priceRange.split('-');
      const min = parseInt(minStr);
      const max = maxStr === '+' ? Infinity : parseInt(maxStr);
      
      if (property.price < min || property.price > max) {
        return false;
      }
    }
    
    // Filter by property type
    if (currentFilters.propertyType && 
        currentFilters.propertyType !== 'all' && 
        property.propertyType !== currentFilters.propertyType) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const propertiesPerPage = 9;
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">{title}</h1>
      
      <SearchFilter onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : paginatedProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-neutral-900">No properties found</h3>
          <p className="mt-2 text-neutral-600">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;

import React from 'react';
import PropertyDetails from '@/components/marketplace/PropertyDetails';
import { useRoute } from 'wouter';

const PropertyDetailsPage: React.FC = () => {
  // Extract property ID from URL
  const [, params] = useRoute('/property/:id');
  const propertyId = params?.id || '';
  
  return <PropertyDetails propertyId={propertyId} />;
};

export default PropertyDetailsPage;

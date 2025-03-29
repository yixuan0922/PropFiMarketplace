import React from 'react';
import { Progress } from '@/components/ui/progress';

interface OwnershipDisplayProps {
  ownerPercentage: number;
  availablePercentage: number;
  price: number;
  minimumInvestment: number;
}

export function OwnershipDisplay({
  ownerPercentage,
  availablePercentage,
  price,
  minimumInvestment
}: OwnershipDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const ownerAmount = (price * ownerPercentage) / 100;
  const investorAmount = (price * availablePercentage) / 100;
  const minimumAmount = (price * minimumInvestment) / 100;
  
  return (
    <div>
      <div className="mb-1 flex justify-between items-center">
        <span className="text-xs font-medium text-neutral-700">Ownership Distribution</span>
        <span className="text-xs text-neutral-500">Min. {minimumInvestment}% ({formatCurrency(minimumAmount)})</span>
      </div>
      <Progress value={ownerPercentage} className="h-2.5" />
      <div className="flex justify-between text-xs mt-1">
        <div className="text-primary">{ownerPercentage}% Owner ({formatCurrency(ownerAmount)})</div>
        <div className="text-orange-500">{availablePercentage}% Investors</div>
      </div>
    </div>
  );
}

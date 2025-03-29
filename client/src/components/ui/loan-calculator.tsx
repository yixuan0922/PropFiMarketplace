import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateMortgage } from '@/lib/mockData';

interface LoanCalculatorProps {
  defaultValue?: number;
  defaultPercentage?: number;
}

export function LoanCalculator({
  defaultValue = 600000,
  defaultPercentage = 55
}: LoanCalculatorProps) {
  const [propertyValue, setPropertyValue] = useState(defaultValue);
  const [ownershipPercentage, setOwnershipPercentage] = useState(defaultPercentage);
  const [calculationResults, setCalculationResults] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    downPayment: 0,
    traditionalMonthlyPayment: 0,
    savingsPercentage: 0
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  useEffect(() => {
    const results = calculateMortgage(propertyValue, ownershipPercentage);
    setCalculationResults(results);
  }, [propertyValue, ownershipPercentage]);
  
  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setPropertyValue(value);
    }
  };
  
  const userInvestment = (propertyValue * ownershipPercentage) / 100;
  const investorPortion = propertyValue - userInvestment;
  
  return (
    <Card className="rounded-lg overflow-hidden shadow-xl bg-white">
      <CardHeader className="bg-neutral-50 pb-2">
        <CardTitle className="text-primary font-semibold text-lg">Ownership Calculator</CardTitle>
        <p className="text-xs text-neutral-500">Estimated values</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Label htmlFor="price">Property Value</Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-500 sm:text-sm">$</span>
            </div>
            <Input
              type="text"
              name="price"
              id="price"
              className="pl-7 pr-12"
              placeholder="0.00"
              value={propertyValue.toLocaleString()}
              onChange={handlePropertyValueChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="ownership">Your Ownership %</Label>
          <Slider
            defaultValue={[ownershipPercentage]}
            max={100}
            min={10}
            step={1}
            className="mt-2"
            onValueChange={(values) => setOwnershipPercentage(values[0])}
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>10%</span>
            <span className="text-primary font-medium">{ownershipPercentage}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-neutral-500">Your investment</p>
            <p className="text-xl font-semibold text-neutral-800">{formatCurrency(userInvestment)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Investor portion</p>
            <p className="text-xl font-semibold text-neutral-800">{formatCurrency(investorPortion)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded p-3 border border-neutral-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Monthly mortgage</span>
            <span className="text-sm font-semibold text-green-500">
              -{calculationResults.savingsPercentage.toFixed(0)}% lower
            </span>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-neutral-500">Traditional</p>
              <p className="text-base font-semibold text-neutral-600 line-through">
                {formatCurrency(calculationResults.traditionalMonthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">With PropFi</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(calculationResults.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button className="w-full">Get Pre-approved</Button>
        </div>
      </CardContent>
    </Card>
  );
}

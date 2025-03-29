import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { calculateInvestment } from '@/lib/mockData';

interface InvestmentCalculatorProps {
  defaultInvestment?: number;
  defaultYears?: number;
  defaultReturn?: number;
}

export function InvestmentCalculator({
  defaultInvestment = 10000,
  defaultYears = 5,
  defaultReturn = 8.2
}: InvestmentCalculatorProps) {
  const [investment, setInvestment] = useState(defaultInvestment);
  const [years, setYears] = useState(defaultYears);
  const [annualReturn, setAnnualReturn] = useState(defaultReturn);
  const [results, setResults] = useState({
    initialInvestment: defaultInvestment,
    projectedValue: 0,
    totalReturn: 0,
    returnPercentage: 0,
    years: defaultYears
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  useEffect(() => {
    const calculateResults = () => {
      const calculatedResults = calculateInvestment(investment, years, annualReturn);
      setResults(calculatedResults);
    };
    
    calculateResults();
  }, [investment, years, annualReturn]);
  
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setInvestment(value);
    }
  };
  
  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAnnualReturn(value);
    }
  };
  
  return (
    <Card className="bg-neutral-50 rounded-lg border border-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-900">Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <Label htmlFor="investment">Investment Amount</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="investment"
                  name="investment"
                  value={investment.toLocaleString()}
                  onChange={handleInvestmentChange}
                  className="pl-7"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="period">Investment Period</Label>
              <Select value={years.toString()} onValueChange={value => setYears(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Year</SelectItem>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="15">15 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="return">Expected Annual Return</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  id="return"
                  name="return"
                  value={annualReturn}
                  onChange={handleReturnChange}
                  className="pr-9"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <h4 className="text-lg font-medium text-neutral-900 mb-4">Projected Returns</h4>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Initial Investment</span>
                <span className="text-sm font-medium text-neutral-900">{formatCurrency(results.initialInvestment)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-600">Projected Value ({results.years} Years)</span>
                <span className="text-sm font-medium text-primary">{formatCurrency(results.projectedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Total Return</span>
                <span className="text-sm font-medium text-green-500">+{results.returnPercentage.toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="mt-6 bg-neutral-50 p-3 rounded-md border border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">{formatCurrency(results.initialInvestment)}</span>
                <span className="text-xs text-neutral-500">{formatCurrency(results.projectedValue)}</span>
              </div>
              <Progress 
                value={Math.min(results.returnPercentage, 100)} 
                className="my-2 bg-neutral-200"
              />
              <div className="text-xs text-neutral-500 flex justify-between">
                <span>Today</span>
                <span>{results.years} Years</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button className="w-full">Start Investing</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

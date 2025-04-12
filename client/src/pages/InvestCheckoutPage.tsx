import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, DollarSign, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

const InvestCheckoutPage: React.FC = () => {
  const [, params] = useRoute<{ propertyId: string }>('/invest/checkout/:propertyId');
  const propertyId = params?.propertyId ? parseInt(params.propertyId) : 0;
  
  // Get amount from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const initialAmount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : 0;
  
  const [investmentAmount, setInvestmentAmount] = useState(initialAmount);
  const [ownershipPercentage, setOwnershipPercentage] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch property data
  const { data: property, isLoading: isPropertyLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: async () => {
      if (!propertyId) return null;
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    },
    enabled: !!propertyId,
  });
  
  // Calculate ownership percentage based on investment amount
  useEffect(() => {
    if (property && property.price) {
      const percentage = (investmentAmount / property.price) * 100;
      setOwnershipPercentage(parseFloat(percentage.toFixed(2)));
    }
  }, [investmentAmount, property]);
  
  // Prepare investment mutation
  const investMutation = useMutation({
    mutationFn: async () => {
      if (!user || !property) throw new Error('User or property not found');
      
      const investment = {
        userId: user.id,
        propertyId: property.id,
        percentage: ownershipPercentage,
        amount: investmentAmount,
        investmentDate: new Date().toISOString(),
        isOccupier: false,
      };
      
      const res = await apiRequest('POST', '/api/investments', investment);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/investments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      
      toast({
        title: 'Investment Successful!',
        description: `You now own ${ownershipPercentage}% of this property.`,
        variant: 'default',
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Investment Failed',
        description: error.message || 'There was an error processing your investment',
        variant: 'destructive',
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    investMutation.mutate();
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (isPropertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Property Not Found</CardTitle>
            <CardDescription>The property you are looking for could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/properties/${propertyId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Property
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Investment</CardTitle>
          <CardDescription>
            You're investing in {property.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="amount">Investment Amount</Label>
                  <span className="text-sm text-gray-500">
                    Min: {formatCurrency(property.price * (property.minimumInvestment / 100))}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    min={property.price * (property.minimumInvestment / 100)}
                    max={property.price * (property.availableTokens / 100)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ownership">Ownership Percentage</Label>
                <Slider
                  defaultValue={[ownershipPercentage]}
                  max={property.availableTokens}
                  min={property.minimumInvestment}
                  step={0.1}
                  value={[ownershipPercentage]}
                  onValueChange={(values) => {
                    setOwnershipPercentage(values[0]);
                    setInvestmentAmount(property.price * (values[0] / 100));
                  }}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{property.minimumInvestment}%</span>
                  <span className="text-primary font-medium">{ownershipPercentage}%</span>
                  <span>{property.availableTokens}%</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Price</span>
                  <span>{formatCurrency(property.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Investment</span>
                  <span>{formatCurrency(investmentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ownership Percentage</span>
                  <span>{ownershipPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Tokens</span>
                  <span>{property.availableTokens}%</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total Investment</span>
                  <span>{formatCurrency(investmentAmount)}</span>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={investMutation.isPending}
              >
                {investMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete Investment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestCheckoutPage;
import React, { useState } from 'react';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { ArrowRight, Loader2, Building, DollarSign, FileText, BarChart3, Vote, ExternalLink, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Investment, Property, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DashboardPage: React.FC = () => {
  // Get user from auth context
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-neutral-600">
              Please sign in to view your dashboard and manage your properties.
            </p>
            <div className="flex space-x-4">
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">
            Welcome, {user.firstName || user.username}
          </h1>
          <p className="text-primary-100">
            Manage your properties, investments, and account details
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <UserDashboard userId={user.id} />
          </TabsContent>
          
          <TabsContent value="properties">
            <MyPropertiesTab userId={user.id} />
          </TabsContent>
          
          <TabsContent value="investments">
            <MyInvestmentsTab userId={user.id} />
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                    Your property token purchases, sales, and transfers will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Username</h3>
                      <p className="text-neutral-900">{user.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Email</h3>
                      <p className="text-neutral-900">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">First Name</h3>
                      <p className="text-neutral-900">{user.firstName || '—'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Last Name</h3>
                      <p className="text-neutral-900">{user.lastName || '—'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

// MyPropertiesTab Component
interface TabProps {
  userId: number;
}

const MyPropertiesTab: React.FC<TabProps> = ({ userId }) => {
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: number; title: string; percentage: number } | null>(null);
  
  // Fetch user investments to find properties owned by the user
  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: [`/api/users/${userId}/investments`],
  });
  
  // Get property details for owned properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter and map investments to corresponding properties
  const ownedProperties = investments
    .map(investment => {
      const property = properties.find(p => p.id === investment.propertyId);
      return property ? {
        ...property,
        ownershipPercentage: investment.percentage,
        investmentAmount: investment.amount,
        investmentDate: investment.investmentDate,
        isOccupier: investment.isOccupier,
      } : null;
    })
    .filter(Boolean) as (Property & { 
      ownershipPercentage: number;
      investmentAmount: number;
      investmentDate: string;
      isOccupier: boolean;
    })[];
    
  const handleSellClick = (property: Property, percentage: number) => {
    setSelectedProperty({
      id: property.id,
      title: property.title,
      percentage
    });
    setSellDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (ownedProperties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              You don't own any properties yet
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Start your homeownership journey with PropFi. You can own a home with as little as 55% ownership.
            </p>
            <Button asChild>
              <Link href="/marketplace">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Properties</CardTitle>
          <CardDescription>
            Manage your property tokens and ownership details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {ownedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden border-0 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="relative h-48 md:h-full bg-neutral-100">
                    {property.imageUrl ? (
                      <img 
                        src={property.imageUrl} 
                        alt={property.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="h-16 w-16 text-neutral-300" />
                      </div>
                    )}
                    <Badge 
                      className="absolute top-3 left-3"
                      variant={property.isOccupier ? "default" : "secondary"}
                    >
                      {property.isOccupier ? 'You Live Here' : 'Investment'}
                    </Badge>
                  </div>
                  
                  <div className="p-5 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{property.title}</h3>
                        <p className="text-neutral-600 text-sm">
                          {property.address}, {property.city}, {property.state} {property.zipCode}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {property.propertyType}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {property.bedrooms} bed | {property.bathrooms} bath
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {property.squareFeet.toLocaleString()} sqft
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-primary" />
                            Ownership Details
                          </h4>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <span className="text-neutral-500">Your Ownership</span>
                              <div className="font-medium">{property.ownershipPercentage}%</div>
                            </div>
                            <div>
                              <span className="text-neutral-500">Investment</span>
                              <div className="font-medium">${property.investmentAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-neutral-500">Current Value</span>
                              <div className="font-medium">${Math.round(property.investmentAmount * 1.08).toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-neutral-500">Since</span>
                              <div className="font-medium">
                                {new Date(property.investmentDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-5">
                      <div className="flex flex-wrap gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="secondary" className="gap-1">
                                <FileText className="h-4 w-4" />
                                Documents
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              View property documents and legal information
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="secondary" className="gap-1">
                                <BarChart3 className="h-4 w-4" />
                                Performance
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              View detailed property performance metrics
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="secondary" className="gap-1">
                                <Vote className="h-4 w-4" />
                                Vote
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Vote on property improvement decisions
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="secondary" className="gap-1">
                                <ExternalLink className="h-4 w-4" />
                                Details
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              View full property details
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="default"
                                className="gap-1 ml-auto"
                                onClick={() => handleSellClick(property, property.ownershipPercentage)}
                              >
                                <Share2 className="h-4 w-4" />
                                Sell Tokens
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              List your tokens for sale on the marketplace
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sell Property Tokens</DialogTitle>
            <DialogDescription>
              List your tokens for sale on the PropFi marketplace
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h4 className="font-medium">Property</h4>
                <p>{selectedProperty.title}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium">Your Ownership</h4>
                <p>{selectedProperty.percentage}% ({selectedProperty.percentage} tokens)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="tokenAmount">
                    Amount to Sell (%)
                  </label>
                  <input 
                    type="number"
                    id="tokenAmount"
                    className="w-full p-2 border rounded"
                    min="0.1"
                    max={selectedProperty.percentage}
                    step="0.1"
                    defaultValue={selectedProperty.percentage}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="pricePerToken">
                    Price Per Token ($)
                  </label>
                  <input 
                    type="number"
                    id="pricePerToken"
                    className="w-full p-2 border rounded"
                    min="1"
                    step="1"
                    defaultValue="100"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
            <Button>List for Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// MyInvestmentsTab Component
const MyInvestmentsTab: React.FC<TabProps> = ({ userId }) => {
  // Fetch user investments
  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: [`/api/users/${userId}/investments`],
  });
  
  // Get property details for investments
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Map investments to corresponding properties
  const investmentDetails = investments
    .filter(investment => !investment.isOccupier) // Only show non-occupier investments
    .map(investment => {
      const property = properties.find(p => p.id === investment.propertyId);
      return property ? {
        ...investment,
        property,
        currentValue: Math.round(investment.amount * 1.08),
        return: Math.round(investment.amount * 0.08),
        returnPercentage: 8
      } : null;
    })
    .filter(Boolean);
    
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (investmentDetails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              You don't have any investments yet
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Start investing in property tokens with as little as $500. Diversify your portfolio with real estate.
            </p>
            <Button asChild>
              <Link href="/invest">
                Explore Investment Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
          <CardDescription>
            Track your property investment portfolio performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Ownership</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Return</TableHead>
                <TableHead>Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentDetails.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-neutral-100 rounded flex items-center justify-center">
                        <Building className="h-4 w-4 text-neutral-500" />
                      </div>
                      <div>
                        <div className="font-medium line-clamp-1">{investment.property.title}</div>
                        <div className="text-xs text-neutral-500 line-clamp-1">
                          {investment.property.city}, {investment.property.state}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{investment.percentage}%</TableCell>
                  <TableCell>${investment.amount.toLocaleString()}</TableCell>
                  <TableCell>${investment.currentValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="text-emerald-600 flex items-center">
                      +${investment.return.toLocaleString()} ({investment.returnPercentage}%)
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(investment.investmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart3 className="h-4 w-4" />
                        <span className="sr-only">View Performance</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Sell Tokens</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

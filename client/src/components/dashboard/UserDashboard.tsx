import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { ArrowRight, Eye, Home, DollarSign, ArrowUpRight, History, Users, Building, PlusCircle, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Investment, Property, TokenTransaction, User } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface UserDashboardProps {
  userId: number;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  // Get current user from auth context
  const { user: currentUser } = useAuth();
  const userRole = currentUser?.role || 'investor';

  // Fetch user investments
  const { data: investments = [], isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: [`/api/users/${userId}/investments`],
  });
  
  // Fetch token transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<TokenTransaction[]>({
    queryKey: [`/api/token-transactions?userId=${userId}`],
  });
  
  // Fetch all properties (for developer dashboard)
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: userRole === 'developer' || userRole === 'admin',
  });
  
  // Fetch all users (for admin dashboard)
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: userRole === 'admin',
  });
  
  // Calculate investment statistics
  const totalInvested = investments.reduce((sum, investment) => sum + Number(investment.amount), 0);
  const propertiesOwned = new Set(investments.map(investment => investment.propertyId)).size;
  const portfolioValue = totalInvested * 1.08; // Simplified calculation for example
  const portfolioGrowth = ((portfolioValue - totalInvested) / totalInvested) * 100;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Different dashboard stats based on role
  const renderStatCards = () => {
    // Common stats for all users
    const commonStats = [
      <Card key="transactions">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-50 rounded-full">
              <History className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-neutral-500">Transactions</h3>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </CardContent>
      </Card>
    ];
    
    // Role-specific stats
    if (userRole === 'admin') {
      return [
        <Card key="users">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/admin/users">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>,
        <Card key="properties">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-50 rounded-full">
                <Building className="h-5 w-5 text-purple-500" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/admin/properties">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Properties</h3>
            <p className="text-2xl font-bold">{properties.length}</p>
          </CardContent>
        </Card>,
        <Card key="admin">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-green-50 rounded-full">
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Admin Status</h3>
            <p className="text-2xl font-bold">Active</p>
          </CardContent>
        </Card>,
        ...commonStats
      ];
    } else if (userRole === 'developer') {
      return [
        <Card key="properties">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-50 rounded-full">
                <Building className="h-5 w-5 text-purple-500" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/properties">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">My Properties</h3>
            <p className="text-2xl font-bold">{properties.filter(p => p.status === 'active').length}</p>
          </CardContent>
        </Card>,
        <Card key="new-property">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-50 rounded-full">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/add-property">
                  <Eye className="mr-1 h-3 w-3" />
                  Add
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Add Property</h3>
            <p className="text-lg">List a new property</p>
          </CardContent>
        </Card>,
        <Card key="property-investments">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-green-50 rounded-full">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Total Investors</h3>
            <p className="text-2xl font-bold">{investments.length}</p>
          </CardContent>
        </Card>,
        ...commonStats
      ];
    } else {
      // For investor role
      return [
        <Card key="invested">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-50 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/invest">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Total Invested</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalInvested || 0)}</p>
          </CardContent>
        </Card>,
        <Card key="portfolio">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-green-50 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Portfolio Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolioValue || 0)}</p>
            <p className="text-sm text-green-500">+{portfolioGrowth.toFixed(2)}%</p>
          </CardContent>
        </Card>,
        <Card key="properties">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-50 rounded-full">
                <Home className="h-5 w-5 text-purple-500" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link to="/marketplace">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Properties</h3>
            <p className="text-2xl font-bold">{propertiesOwned}</p>
          </CardContent>
        </Card>,
        ...commonStats
      ];
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {renderStatCards()}
      </div>
      
      {/* Render appropriate main content based on user role */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>User accounts and roles</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{user.username}</div>
                          <div className="text-sm text-neutral-500">{user.firstName} {user.lastName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'developer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">
                            {new Date(user.createdAt || '').toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/admin/users/${user.id}`} className="text-primary hover:text-primary-600 mr-3">
                            View
                          </Link>
                          <Link to={`/admin/users/${user.id}/edit`} className="text-orange-600 hover:text-orange-800">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length > 5 && (
                <div className="px-6 py-4 text-right">
                  <Link to="/admin/users" className="text-primary hover:text-primary-600 text-sm font-medium">
                    View all {users.length} users
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>All Properties</CardTitle>
              <CardDescription>Property listings and details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.slice(0, 5).map((property) => (
                      <tr key={property.id} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{property.title}</div>
                          <div className="text-sm text-neutral-500">{property.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{formatCurrency(Number(property.price))}</div>
                          <div className="text-sm text-neutral-500">{formatCurrency(Number(property.pricePerSqft || 0))}/sqft</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{property.propertyType}</div>
                          <div className="text-sm text-neutral-500">{property.bedrooms}bd, {property.bathrooms}ba</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            property.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : property.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/property/${property.id}`} className="text-primary hover:text-primary-600 mr-3">
                            View
                          </Link>
                          <Link to={`/admin/properties/${property.id}/edit`} className="text-orange-600 hover:text-orange-800">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {properties.length > 5 && (
                <div className="px-6 py-4 text-right">
                  <Link to="/admin/properties" className="text-primary hover:text-primary-600 text-sm font-medium">
                    View all {properties.length} properties
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {userRole === 'developer' && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>My Properties</CardTitle>
                <CardDescription>Properties you've developed</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link to="/add-property">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Property
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {properties.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ownership Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">{property.title}</div>
                            <div className="text-sm text-neutral-500">{property.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{formatCurrency(Number(property.price))}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">
                              {100 - Number(property.availableTokens)}%
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${100 - Number(property.availableTokens)}%` }}></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/property/${property.id}`} className="text-primary hover:text-primary-600 mr-3">
                              View
                            </Link>
                            <Link to={`/properties/${property.id}/edit`} className="text-orange-600 hover:text-orange-800">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No properties listed yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/add-property">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Property
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Investor Activity</CardTitle>
              <CardDescription>Recent investments in your properties</CardDescription>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Investor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ownership %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.slice(0, 5).map((investment) => (
                        <tr key={investment.id} className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">
                              {properties.find(p => p.id === investment.propertyId)?.title || `Property #${investment.propertyId}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">Investor #{investment.userId}</div>
                            <div className="text-sm text-neutral-500">{investment.isOccupier ? 'Resident' : 'Investor'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{formatCurrency(Number(investment.amount))}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{Number(investment.percentage).toFixed(2)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {new Date(investment.investmentDate).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No investments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Investor dashboard */}
      {userRole === 'investor' && (
        investments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
                <CardDescription>Overview of your property investments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Investment Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Ownership %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment) => (
                        <tr key={investment.id} className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">Property #{investment.propertyId}</div>
                            <div className="text-sm text-neutral-500">{investment.isOccupier ? 'Resident' : 'Investor'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{formatCurrency(Number(investment.amount))}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">{Number(investment.percentage).toFixed(2)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {new Date(investment.investmentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/property/${investment.propertyId}`} className="text-primary hover:text-primary-600">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your token purchases and sales</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Percentage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-neutral-900">
                                {userId === transaction.sellerId ? 'Sold' : 'Purchased'} tokens
                              </div>
                              <div className="text-sm text-neutral-500">Property #{transaction.propertyId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-neutral-900">{formatCurrency(Number(transaction.amount))}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-neutral-900">{Number(transaction.percentage).toFixed(2)}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-neutral-500">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-600">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                  <Home className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Start Your Real Estate Journey</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                PropFi makes it easy to invest in real estate or buy your dream home with as little as 55% ownership.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild>
                  <Link to="/marketplace">
                    Browse Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/invest">
                    View Investment Options
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default UserDashboard;

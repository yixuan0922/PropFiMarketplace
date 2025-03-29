import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { ArrowRight, Eye, Home, DollarSign, ArrowUpRight, History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Investment, Property, TokenTransaction } from '@/lib/types';

interface UserDashboardProps {
  userId: number;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  // Fetch user investments
  const { data: investments = [], isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: [`/api/users/${userId}/investments`],
  });
  
  // Fetch token transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<TokenTransaction[]>({
    queryKey: [`/api/token-transactions?userId=${userId}`],
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
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-50 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/invest">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Total Invested</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalInvested || 0)}</p>
          </CardContent>
        </Card>
        
        <Card>
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
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-50 rounded-full">
                <Home className="h-5 w-5 text-purple-500" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                <Link href="/marketplace">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">Properties</h3>
            <p className="text-2xl font-bold">{propertiesOwned}</p>
          </CardContent>
        </Card>
        
        <Card>
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
      </div>
      
      {investments.length > 0 ? (
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
                          <Link href={`/property/${investment.propertyId}`} className="text-primary hover:text-primary-600">
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
                <Link href="/marketplace">
                  Browse Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/invest">
                  View Investment Options
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;

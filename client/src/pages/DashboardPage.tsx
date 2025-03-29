import React from 'react';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/lib/types';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Mock user ID - in a real app this would come from auth context
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: [`/api/users/${userId}`],
    onError: () => {
      return null;
    }
  });
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded"></div>
        </div>
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
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Create Account</Link>
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
          </TabsContent>
          
          <TabsContent value="investments">
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

export default DashboardPage;

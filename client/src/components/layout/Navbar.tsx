import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, MenuIcon, User, Settings, LogOut, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        isActive 
          ? 'border-primary text-primary' 
          : 'border-transparent text-muted-foreground hover:border-neutral-300 hover:text-neutral-800'
      }`}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logoutMutation } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <svg
                  className="h-8 w-auto text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                  <path d="M5 8a10 10 0 0 1 14 0" />
                </svg>
                <span className="ml-2 text-xl font-semibold text-primary">PropFi</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/marketplace">Marketplace</NavLink>
              <NavLink href="/invest">Invest</NavLink>
              <NavLink href="/buy">Buy a Home</NavLink>
              <NavLink href="/how-it-works">How It Works</NavLink>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                  <Wallet className="w-4 h-4 text-primary mr-1.5" />
                  <span className="font-medium text-sm">
                    ${parseFloat(user?.walletBalance || '0').toLocaleString('en-US')}
                  </span>
                </div>

                <Button variant="ghost" size="icon" className="mr-2">
                  <BellIcon className="w-5 h-5 text-neutral-400 hover:text-neutral-500" />
                  <span className="sr-only">Notifications</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 bg-primary cursor-pointer">
                      <AvatarFallback>
                        {user?.firstName && user?.lastName
                          ? `${user.firstName[0]}${user.lastName[0]}`
                          : user?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user?.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <div className="flex items-center mt-2">
                          <Wallet className="w-3.5 h-3.5 text-primary mr-1.5" />
                          <span className="text-xs font-medium">
                            ${parseFloat(user?.walletBalance || '0').toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard?tab=account" className="flex cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logoutMutation.mutate()} 
                      disabled={logoutMutation.isPending}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button asChild className="ml-4">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-6 mt-6">
                  {isLoggedIn && (
                    <div className="flex items-center pb-4 border-b border-border mb-2">
                      <Avatar className="h-12 w-12 bg-primary mr-3">
                        <AvatarFallback>
                          {user?.firstName && user?.lastName
                            ? `${user.firstName[0]}${user.lastName[0]}`
                            : user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user?.username}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {user?.email}
                        </p>
                        <div className="flex items-center mt-2 bg-primary/10 rounded-full px-2.5 py-0.5 w-fit">
                          <Wallet className="w-3 h-3 text-primary mr-1" />
                          <span className="font-medium text-xs">
                            ${parseFloat(user?.walletBalance || '0').toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <SheetClose asChild>
                    <Link href="/marketplace" className="text-lg font-medium">
                      Marketplace
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/invest" className="text-lg font-medium">
                      Invest
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/buy" className="text-lg font-medium">
                      Buy a Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/how-it-works" className="text-lg font-medium">
                      How It Works
                    </Link>
                  </SheetClose>
                  
                  {isLoggedIn && (
                    <>
                      <div className="h-px bg-border my-2"></div>
                      <SheetClose asChild>
                        <Link href="/dashboard" className="flex items-center text-lg font-medium">
                          <User className="mr-2 h-5 w-5" />
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/dashboard?tab=account" className="flex items-center text-lg font-medium">
                          <Settings className="mr-2 h-5 w-5" />
                          Settings
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2 text-red-500"
                          onClick={() => logoutMutation.mutate()} 
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                  
                  {!isLoggedIn && (
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/auth">Sign In</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

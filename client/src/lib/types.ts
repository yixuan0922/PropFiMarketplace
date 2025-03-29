export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  pricePerSqft: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description?: string;
  propertyType: 'condo' | 'house' | 'townhouse' | 'multi-family';
  imageUrl?: string;
  availableTokens: number;
  minimumInvestment: number;
  status: 'active' | 'pending' | 'sold';
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  profileImage?: string;
  isInvestor: boolean;
  isHomebuyer: boolean;
  createdAt: string;
}

export interface Investment {
  id: number;
  userId: number;
  propertyId: number;
  percentage: number;
  amount: number;
  investmentDate: string;
  isOccupier: boolean;
}

export interface TokenTransaction {
  id: number;
  propertyId: number;
  sellerId?: number;
  buyerId?: number;
  percentage: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface PropertyFilter {
  location?: string;
  priceRange?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface MortgageCalculation {
  loanAmount: number;
  monthlyPayment: number;
  downPayment: number;
  traditionalMonthlyPayment: number;
  savingsPercentage: number;
}

export interface InvestmentCalculation {
  initialInvestment: number;
  projectedValue: number;
  totalReturn: number;
  returnPercentage: number;
  years: number;
}

import { Property, Investment, TokenTransaction } from './types';

// Sample properties
export const sampleProperties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Condo",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    price: 600000,
    pricePerSqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: "Beautiful modern condo in the heart of downtown San Francisco.",
    propertyType: "condo",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    availableTokens: 45,
    minimumInvestment: 10,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Suburban Family Home",
    address: "456 Oak Ave",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    price: 450000,
    pricePerSqft: 225,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    description: "Spacious family home in a quiet suburban neighborhood.",
    propertyType: "house",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    availableTokens: 40,
    minimumInvestment: 10,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Luxury Beachfront Villa",
    address: "789 Ocean Blvd",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    price: 1200000,
    pricePerSqft: 800,
    bedrooms: 3,
    bathrooms: 3.5,
    squareFeet: 1500,
    description: "Stunning beachfront villa with panoramic ocean views.",
    propertyType: "house",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    availableTokens: 35,
    minimumInvestment: 10,
    status: "active",
    createdAt: new Date().toISOString()
  }
];

// Helpers to calculate mortgage and investment returns
export function calculateMortgage(propertyPrice: number, ownershipPercentage: number, interestRate = 4.5, loanTerm = 30) {
  const loanAmount = propertyPrice * (ownershipPercentage / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  
  const traditionalLoanAmount = propertyPrice;
  const traditionalMonthlyPayment = (traditionalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const downPayment = 0.20 * loanAmount; // Assuming 20% down payment
  
  const savingsPercentage = ((traditionalMonthlyPayment - monthlyPayment) / traditionalMonthlyPayment) * 100;
  
  return {
    loanAmount,
    monthlyPayment,
    downPayment,
    traditionalMonthlyPayment,
    savingsPercentage
  };
}

export function calculateInvestment(amount: number, years: number, annualReturn = 8.2) {
  const projectedValue = amount * Math.pow(1 + annualReturn / 100, years);
  const totalReturn = projectedValue - amount;
  const returnPercentage = (totalReturn / amount) * 100;
  
  return {
    initialInvestment: amount,
    projectedValue,
    totalReturn,
    returnPercentage,
    years
  };
}

// Sample investment statistics
export const investmentStats = {
  averageAnnualReturn: 8.2,
  minimumInvestment: 500,
  citiesAvailable: 30
};

// Sample testimonials
export const testimonials = [
  {
    id: 1,
    name: "Alex",
    age: 28,
    profession: "Software Engineer",
    testimonial: "Despite having a good job, I couldn't save enough for a down payment on a $600,000 condo. With PropFi, I purchased 55% ownership for $330,000, which was achievable with my savings and a smaller mortgage. When I temporarily lost my job, I sold some shares to investors but was able to buy them back later when my finances stabilized.",
    achievement: "Now owns 70% of his home"
  },
  {
    id: 2,
    name: "Sarah",
    age: 35,
    profession: "Marketing Director",
    testimonial: "I had investment money sitting in low-yield savings accounts. Through PropFi, I've invested in property tokens across five different cities, creating a diversified real estate portfolio without the hassle of being a landlord. The returns have been impressive, and I can sell tokens anytime I need liquidity.",
    achievement: "9.1% average annual return"
  }
];

// Sample how it works steps
export const howItWorksSteps = [
  {
    id: 1,
    title: "Purchase 55% or More",
    description: "Buy at least 55% of a property to gain full residency rights without paying rent.",
    icon: "home"
  },
  {
    id: 2,
    title: "Investors Own the Rest",
    description: "The remaining percentage is available to investors seeking property appreciation.",
    icon: "chart-line"
  },
  {
    id: 3,
    title: "Buy or Sell Anytime",
    description: "Increase your ownership over time or sell tokens on the PropFi marketplace.",
    icon: "exchange-alt"
  }
];

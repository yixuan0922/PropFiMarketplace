import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import MarketplacePage from "@/pages/MarketplacePage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import DashboardPage from "@/pages/DashboardPage";
import InvestPage from "@/pages/InvestPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import AddPropertyPage from "@/pages/AddPropertyPage";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/property/:id" component={PropertyDetailsPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/invest" component={InvestPage} />
      <ProtectedRoute path="/buy" component={MarketplacePage} />
      <ProtectedRoute path="/add-property" component={AddPropertyPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;

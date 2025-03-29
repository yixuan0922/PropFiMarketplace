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
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/marketplace" component={MarketplacePage} />
          <Route path="/property/:id" component={PropertyDetailsPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/invest" component={InvestPage} />
          <Route path="/how-it-works" component={HowItWorksPage} />
          <Route path="/buy" component={MarketplacePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;

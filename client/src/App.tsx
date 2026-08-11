import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import PortalShell from "./components/PortalShell";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Address from "./pages/Address";
import Orders from "./pages/Orders";
import Tracking from "./pages/Tracking";
import AddItems from "./pages/AddItems";
import Checkout from "./pages/Checkout";
import Wallet from "./pages/Wallet";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentSuccess from "./pages/PaymentSuccess";
import Referrals from "./pages/Referrals";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import WhatsAppWidget from "./components/WhatsAppWidget";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Switch>
        <Route path={"/"} component={Landing} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/portal"}>
          <PortalShell><Dashboard /></PortalShell>
        </Route>
        <Route path={"/add"}>
          <PortalShell><AddItems /></PortalShell>
        </Route>
        <Route path={"/checkout"}>
          <PortalShell><Checkout /></PortalShell>
        </Route>
        <Route path={"/orders"}>
          <PortalShell><Orders /></PortalShell>
        </Route>
        <Route path={"/tracking"}>
          <PortalShell><Tracking /></PortalShell>
        </Route>
        <Route path={"/address"}>
          <PortalShell><Address /></PortalShell>
        </Route>
        <Route path={"/wallet"}>
          <PortalShell><Wallet /></PortalShell>
        </Route>
        <Route path={"/payments"}>
          <PortalShell><PaymentHistory /></PortalShell>
        </Route>
        <Route path={"/success"}>
          <PortalShell><PaymentSuccess /></PortalShell>
        </Route>
        <Route path={"/referrals"}>
          <PortalShell><Referrals /></PortalShell>
        </Route>
        <Route path={"/settings"}>
          <PortalShell><Settings /></PortalShell>
        </Route>
        <Route path={"/privacy"}>
          <PortalShell><PrivacyPolicy /></PortalShell>
        </Route>
        <Route path={"/terms"}>
          <PortalShell><TermsOfService /></PortalShell>
        </Route>
        <Route path={"/returns"}>
          <PortalShell><ReturnsPolicy /></PortalShell>
        </Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <WhatsAppWidget />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

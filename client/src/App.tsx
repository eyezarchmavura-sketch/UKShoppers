import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Landing from "./pages/Landing";
import WhatsAppWidget from "./components/WhatsAppWidget";

const PortalShell = lazy(() => import("./components/PortalShell"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Address = lazy(() => import("./pages/Address"));
const Orders = lazy(() => import("./pages/Orders"));
const Tracking = lazy(() => import("./pages/Tracking"));
const AddItems = lazy(() => import("./pages/AddItems"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wallet = lazy(() => import("./pages/Wallet"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SeasonalOffersAdmin = lazy(() => import("./pages/SeasonalOffersAdmin"));
const ExternalStaffInvites = lazy(() => import("./pages/ExternalStaffInvites"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ReturnsPolicy = lazy(() => import("./pages/ReturnsPolicy"));
const StoreDirectory = lazy(() => import("./pages/StoreDirectory"));

function RouteLoading() {
  return (
    <main className="min-h-screen bg-[#F2F4F7] dark:bg-[#111418] grid place-items-center px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A67C00]">UK Shoppers Africa</p>
        <p className="mt-3 text-sm text-muted-foreground" role="status">Preparing your secure workspace…</p>
      </div>
    </main>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Suspense fallback={<RouteLoading />}>
        <Switch>
          <Route path={"/"} component={Landing} />
          <Route path={"/admin"}><AdminDashboard /></Route>
          <Route path={"/admin/offers"}><SeasonalOffersAdmin /></Route>
          <Route path={"/admin/invitations"}><ExternalStaffInvites /></Route>
          <Route path={"/stores"}><StoreDirectory /></Route>
          <Route path={"/portal"}><PortalShell><Dashboard /></PortalShell></Route>
          <Route path={"/add"}><PortalShell><AddItems /></PortalShell></Route>
          <Route path={"/checkout"}><PortalShell><Checkout /></PortalShell></Route>
          <Route path={"/orders"}><PortalShell><Orders /></PortalShell></Route>
          <Route path={"/tracking"}><PortalShell><Tracking /></PortalShell></Route>
          <Route path={"/address"}><PortalShell><Address /></PortalShell></Route>
          <Route path={"/wallet"}><PortalShell><Wallet /></PortalShell></Route>
          <Route path={"/payments"}><PortalShell><PaymentHistory /></PortalShell></Route>
          <Route path={"/success"}><PortalShell><PaymentSuccess /></PortalShell></Route>
          <Route path={"/referrals"}><PortalShell><Referrals /></PortalShell></Route>
          <Route path={"/settings"}><PortalShell><Settings /></PortalShell></Route>
          <Route path={"/privacy"}><PrivacyPolicy /></Route>
          <Route path={"/terms"}><TermsOfService /></Route>
          <Route path={"/returns"}><ReturnsPolicy /></Route>
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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

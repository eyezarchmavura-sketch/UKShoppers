import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PortalShell from "./components/PortalShell";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Address from "./pages/Address";
import Orders from "./pages/Orders";
import Tracking from "./pages/Tracking";
import AddItems from "./pages/AddItems";
import Checkout from "./pages/Checkout";
import Wallet from "./pages/Wallet";
import Referrals from "./pages/Referrals";
import Settings from "./pages/Settings";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
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
      <Route path={"/referrals"}>
        <PortalShell><Referrals /></PortalShell>
      </Route>
      <Route path={"/settings"}>
        <PortalShell><Settings /></PortalShell>
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy } from "react";
import AppLayout from "./components/layout/AppLayout";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CropDetection = lazy(() => import("./pages/CropDetection"));
const DiagnosisHistory = lazy(() => import("./pages/DiagnosisHistory"));
const PesticideShop = lazy(() => import("./pages/PesticideShop"));
const SeedVerification = lazy(() => import("./pages/SeedVerification"));
const WeatherInsights = lazy(() => import("./pages/WeatherInsights"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Settings = lazy(() => import("./pages/Settings"));

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
const pageTransition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex-1"
    >
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </motion.div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading AgriShield AI…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Root route with providers
const rootRoute = createRootRoute({
  component: function Root() {
    return (
      <LanguageProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </LanguageProvider>
    );
  },
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: function LoginPage() {
    const { isAuthenticated, isInitializing } = useInternetIdentity();
    if (isInitializing) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    if (isAuthenticated) return <Navigate to="/" />;
    return <Login />;
  },
});

// Protected app layout route
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: function AppRoot() {
    return (
      <AuthGuard>
        <AppLayout>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </AppLayout>
      </AuthGuard>
    );
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: () => (
    <AnimatedPage>
      <Dashboard />
    </AnimatedPage>
  ),
});

const detectRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/detect",
  component: () => (
    <AnimatedPage>
      <CropDetection />
    </AnimatedPage>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/history",
  component: () => (
    <AnimatedPage>
      <DiagnosisHistory />
    </AnimatedPage>
  ),
});

const shopRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/shop",
  component: () => (
    <AnimatedPage>
      <PesticideShop />
    </AnimatedPage>
  ),
});

const seedsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/seeds",
  component: () => (
    <AnimatedPage>
      <SeedVerification />
    </AnimatedPage>
  ),
});

const weatherRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/weather",
  component: () => (
    <AnimatedPage>
      <WeatherInsights />
    </AnimatedPage>
  ),
});

const ordersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/orders",
  component: () => (
    <AnimatedPage>
      <MyOrders />
    </AnimatedPage>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/settings",
  component: () => (
    <AnimatedPage>
      <Settings />
    </AnimatedPage>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    detectRoute,
    historyRoute,
    shopRoute,
    seedsRoute,
    weatherRoute,
    ordersRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

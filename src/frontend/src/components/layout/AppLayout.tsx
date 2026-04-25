import BottomNav from "./BottomNav";
import MobileHeader from "./MobileHeader";
import OfflineBanner from "./OfflineBanner";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      data-ocid="app-layout.panel"
    >
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Offline warning */}
        <OfflineBanner />

        {/* Mobile header */}
        <MobileHeader />

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0"
          data-ocid="app-layout.main"
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
